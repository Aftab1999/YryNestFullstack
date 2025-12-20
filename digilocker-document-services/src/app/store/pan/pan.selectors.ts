import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PanState } from './pan.reducer';

export const selectPanState = createFeatureSelector<PanState>('pan');

export const selectPanLoading = createSelector(
  selectPanState,
  (state: PanState) => state.loading
);

export const selectPanError = createSelector(
  selectPanState,
  (state: PanState) => state.error
);

export const selectPanSuccess = createSelector(
  selectPanState,
  (state: PanState) => state.success
);

export const selectPanRequest = createSelector(
  selectPanState,
  (state: PanState) => state.request
);
