import { Action } from 'redux';
import { ActionPattern, all, take, takeLatest } from 'redux-saga/effects';

interface SagaRegister {
    pattern: string | ActionPattern<Action<any>>,
    consumer: (action: Action<any>) => any;
    effect: any;
}

export class SagaFactory {
    private sagaRegisters: SagaRegister[] = [];

    public take(sagaRegister: Omit<SagaRegister, 'effect'>) {
        this.sagaRegisters.push({ 
            ...sagaRegister,
            effect: take
        });
        return this;
    }

    public takeLatest(sagaRegister: Omit<SagaRegister, 'effect'>) {
        this.sagaRegisters.push({ 
            ...sagaRegister,
            effect: takeLatest
        });
        return this;
    }

    public* collect() {
        const registers = [...this.sagaRegisters];
        yield all(registers.map(sagaRegister => {
            return takeLatest(sagaRegister.pattern, sagaRegister.consumer);
        })); 
    }
}


