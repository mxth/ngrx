import { Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { EMPTY, Observable, defer, merge, of } from 'rxjs'
import { filter, first, flatMap, tap } from 'rxjs/operators'
import { Action, RequestAction, ResponseAction } from './action'

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

  dispatchRequest<T extends RequestAction, P>(action: T): Observable<ResponseAction<any>> {
    const isResponseAction = (requestId: number) => (a: any) => (<ResponseAction<any>>a).responseId === requestId

    return of(action).pipe(
      flatMap(a => merge(
        this.action$.pipe(
          filter(isResponseAction(a.requestId)),
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
