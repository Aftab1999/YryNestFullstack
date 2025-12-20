import { createReducer, on } from '@ngrx/store';
import * as PanActions from './pan.actions';

export interface PanState {
  loading: boolean;
  error: any;
  success: boolean;
  request: any;
}

export const initialState: PanState = {
  loading: false,
  error: null,
  success: false,
  request: null
};

export const panReducer = createReducer(
  initialState,
  on(PanActions.submitPanRequest, state => ({
    ...state,
    loading: true,
    error: null,
    success: false
  })),
  on(PanActions.submitPanRequestSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    success: true,
    request: response
  })),
  on(PanActions.submitPanRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
