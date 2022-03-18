import { AxiosError, AxiosResponse } from 'axios';
import { merge } from 'lodash';
import { call, CallEffect, put, PutEffect } from 'redux-saga/effects';
import { AppMessage, AppLoading, MessageType } from '../app.types';
import { fireMessage } from '../message/message.action';
import { setLoading } from './../loading/loading.action';
import { HttpError } from './http-error';

interface RegisterErrorOptions {
    allowMerge: boolean;
}


const ErrorCodeToMsgMap = new Map<string, string>();

const DEFAULT_ERROR_MAPPING = {
    400: 'Unexpected input to do request',
    401: 'You are required to be authenticate first',
    403: 'You are not allowed to access this resource. Please contact your admin',
    404: 'Resource not found',
    422: 'Seem like data is not valid. Look like our dev need to work more about this',
    500: 'Server is handling something wrong. Please try again later',

    UNEXPECTED_ERROR_CODE: 'Unexpected error happened'
};

export function registerErrors(errorCodeToMsgMap: Record<string, string>, options: RegisterErrorOptions = {allowMerge: true}): void {
    let newMap: Record<string, string> | undefined = undefined;
    if (options.allowMerge) {
        newMap = merge(DEFAULT_ERROR_MAPPING, errorCodeToMsgMap);
    } else {
        newMap = errorCodeToMsgMap;
    }

    Object.keys(newMap)
        .forEach((code: string) => {
            ErrorCodeToMsgMap.set(code, (newMap as Record<string, string>)[code]);
        });
}

export function createRequest<Response, Request>(request: Promise<AxiosResponse<Response, Request>>): RequestProcessor<Response> {
    let data: Response;
    let errorMsg: string;

    async function doRequest() {
        let response: AxiosResponse<Response, Request>;
        try {
            response = await request;
            data = response.data;
        } catch (error) {
            errorMsg = _getErrorMessage(error as AxiosError);
        }
    }

    function getData() {
        if (errorMsg) {
            throw new HttpError(errorMsg);
        }
        return data;
    }

    function* getDataSafe() {
        if (errorMsg) {
            yield put(fireMessage({ message: errorMsg, type: MessageType.ERROR }));
        }
        return data;
    }

    function getErrorMessage() {
        return errorMsg;
    }

    function _getErrorMessage(error: AxiosError): string {
        if (error.response) {
            // if (ErrorCodeToMsgMap.has(`${error.response.status}`)) {
            //     return ErrorCodeToMsgMap.get(`${error.response.status}`) as string;
            // }
            if ([500, 422, 400].includes(error.response.status)) {
                return ErrorCodeToMsgMap.get(`${error.response.status}`) as string;
            } else {
                return error.response.data.message;
            }
        }

        return DEFAULT_ERROR_MAPPING.UNEXPECTED_ERROR_CODE;
    }

    function* start() {
        yield put(setLoading({ isLoading: true }));
    }

    function* finish() {
        yield put(setLoading({ isLoading: false }));
    }

    function* handle () {
        yield call(start);
        yield call(doRequest);
        yield call(finish);
        return <Response> (yield call(getDataSafe));
    }

    return {
        start,
        finish,
        doRequest,
        handle,
        getData,
        getDataSafe,
        getErrorMessage,
        hasError: () => !!errorMsg,
        isSuccess: () => !errorMsg
    };
}

export interface RequestProcessor<Response> {
    start(): Generator<PutEffect<{
        payload: AppLoading;
        type: string;
    }>, void, unknown>;
    finish(): Generator<PutEffect<{
        payload: AppLoading;
        type: string;
    }>, void, unknown>;
    doRequest(): Promise<void>;
    handle(): Generator<CallEffect<Response> | CallEffect<void>, Response, Response>;
    getData(): Response;
    getDataSafe(): Generator<PutEffect<{
        payload: Pick<AppMessage, 'message'>;
        type: string;
    }>, Response, unknown>;
    getErrorMessage(): string;
    hasError(): boolean;
    isSuccess(): boolean;
}
