import { AnyAction } from 'redux';
import produce from 'immer';

const intitalState = {};

export function globalReducer(state = intitalState, action: AnyAction) {
	return produce(state, draft => {
		switch(action.type) {
		case 'ACTION': 
			break;
		}
		return draft;
	});
}