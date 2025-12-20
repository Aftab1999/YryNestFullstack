import { ActionReducerMap } from '@ngrx/store';
import * as fromPan from './pan/pan.reducer';

export interface AppState {
  pan: fromPan.PanState;
}

export const reducers: ActionReducerMap<AppState> = {
  pan: fromPan.panReducer,
};

export const selectPanState = (state: AppState) => state.pan;
