import { AppLoading, AppState } from '../app.types';

export const selectLoading = (state: AppState): AppLoading => state.loading;