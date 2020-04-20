import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  bufferCount,
  catchError,
  exhaustMap,
  filter,
  map,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { WindowRef } from '../../../window/window-ref';
import { SiteConnector } from '../../connectors/site.connector';
import { SiteContextActions } from '../actions/index';
import { getActiveLanguage } from '../selectors/languages.selectors';
import { StateWithSiteContext } from '../state';

@Injectable()
export class LanguagesEffects {
  @Effect()
  loadLanguages$: Observable<
    | SiteContextActions.LoadLanguagesSuccess
    | SiteContextActions.LoadLanguagesFail
  > = this.actions$.pipe(
    ofType(SiteContextActions.LOAD_LANGUAGES),
    exhaustMap(() => {
      return this.siteConnector.getLanguages().pipe(
        map(
          languages => new SiteContextActions.LoadLanguagesSuccess(languages)
        ),
        catchError(error =>
          of(
            new SiteContextActions.LoadLanguagesFail(
              makeErrorSerializable(error)
            )
          )
        )
      );
    })
  );

  @Effect()
  activateLanguage$: Observable<
    SiteContextActions.LanguageChange
  > = this.actions$.pipe(
    ofType(SiteContextActions.SET_ACTIVE_LANGUAGE),
    tap((action: SiteContextActions.SetActiveLanguage) => {
      if (this.winRef.sessionStorage) {
        this.winRef.sessionStorage.setItem('language', action.payload);
      }
    }),
    withLatestFrom(
      this.state.select(getActiveLanguage).pipe(
        bufferCount(2, 1),

        // avoid dispatching `change` action when we're just setting the initial value:
        filter(([previous]) => !!previous),
        // avoid dispatching `change` action when values are the same
        filter(([previous, current]) => previous !== current)
      )
    ),
    map(
      ([_, [previous, current]]) =>
        new SiteContextActions.LanguageChange({ previous, current })
    )
  );

  constructor(
    private actions$: Actions,
    private siteConnector: SiteConnector,
    private winRef: WindowRef,
    private state: Store<StateWithSiteContext>
  ) {}
}
