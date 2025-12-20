import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as PanActions from './pan.actions';
import { PanService } from '../../services/pan.service';

@Injectable()
export class PanEffects {
  private actions$ = inject(Actions);
  private panService = inject(PanService);

  submitPanRequest$ = createEffect(() => 
    this.actions$.pipe(
      ofType(PanActions.submitPanRequest),
      mergeMap(({ request }) =>
        this.panService.submitPanRequest(request).pipe(
          map(response => PanActions.submitPanRequestSuccess({ response })),
          catchError(error => of(PanActions.submitPanRequestFailure({ error })))
        )
      )
    )
  );

  constructor() {}
}
