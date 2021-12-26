import { AxiosError, AxiosResponse } from 'axios';
import { merge } from 'lodash';
import { call, put } from 'redux-saga/effects';
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
    500: 'Internal server error',

    UNEXPECTED_ERROR_CODE: 'Unexpected error happened'
};

export function registerErrors(errorCodeToMsgMap: Record<string, string>, options: RegisterErrorOptions = {allowMerge: true}): void {
    let newMap: Record<string, string> | undefined = undefined;
    if (options.allowMerge) {
        newMap = merge(DEFAULT_ERROR_MAPPING, errorCodeToMsgMap);
    }

    Object.keys(newMap ? newMap : errorCodeToMsgMap)
        .forEach((code: string) => {
            ErrorCodeToMsgMap.set(code, errorCodeToMsgMap[code]);
        });
} 

export function createRequest<DataResponse, DataRequest>(request: Promise<AxiosResponse<DataResponse, DataRequest>>) {
    let data: DataResponse;
    let errorMsg: string;

    async function doRequest() {
        let response: AxiosResponse<DataResponse, DataRequest>;
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

    function getErrorMessage() {
        return errorMsg;
    }

    function _getErrorMessage(error: AxiosError): string {
        if (ErrorCodeToMsgMap.has(error.code as string)) {
            return ErrorCodeToMsgMap.get(error.code as string) as string;
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
        yield start();
        yield call(doRequest);
        yield finish();
        return getData();
    }

    return {
        start,
        finish,
        doRequest,
        handle,
        getData,
        getErrorMessage
    };
}