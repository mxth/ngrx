import { Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { EMPTY, Observable, defer, merge, of, throwError } from 'rxjs'
import { filter, first, flatMap, tap } from 'rxjs/operators'
import { Action, ActionClass, RequestAction, ResponseAction, isAction } from './action'

@Injectable({
  providedIn: 'root'
})
export class FpStore<S> {

  constructor(private store: Store<S>, private action$: Actions) { }

  dispatch<T extends Action>(action: T): Observable<T> {
    return of(action).pipe(
      tap(a => this.store.dispatch(a))
    )
  }

  dispatchRequest<T extends RequestAction, K>(action: T, Success: ActionClass<ResponseAction<K>>, Error?: ActionClass<ResponseAction<any>>): Observable<K> {
    const isResponseAction = (requestId: number) => (a: any) => (<ResponseAction<any>>a).responseId === requestId

    return of(action).pipe(
      flatMap(a => merge(
        this.action$.pipe(
          filter(isResponseAction(a.requestId)),
          flatMap(_a => {
            if (isAction(_a, Success)) {
              return of(_a.payload)
            }
            if (Error && isAction(_a, Error)) {
              return throwError(_a.payload)
            }
            return throwError(`[dispatchRequest] unrecognized action ${_a.toString()}`)
          })
        ),
        defer(() => {
          this.store.dispatch(a)
          return EMPTY
        }))
      ),
      first(),
    )
  }
}
