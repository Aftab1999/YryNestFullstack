import { createAction, props } from '@ngrx/store';
import { PanRequest } from '../../services/pan.service';

export const submitPanRequest = createAction(
  '[PAN] Submit Request',
  props<{ request: PanRequest }>()
);

export const submitPanRequestSuccess = createAction(
  '[PAN] Submit Request Success',
  props<{ response: any }>()
);

export const submitPanRequestFailure = createAction(
  '[PAN] Submit Request Failure',
  props<{ error: any }>()
);
