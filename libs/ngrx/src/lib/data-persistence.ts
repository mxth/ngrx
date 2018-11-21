import { Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { DataPersistence as NxDataPersistence } from '@nrwl/nx'
import {
  FetchOpts,
  OptimisticUpdateOpts,
} from '@nrwl/nx/src/data-persistence'
import { Observable } from 'rxjs'
import { Action, ActionClass, ActionType } from './action'

@ActionType('[@mxth/ngrx] UnhandledException')
export class UnhandledException extends Action {
  constructor(public payload: any) {
    super()
  }
}

export interface PessimisticUpdateOpts<T, A> {
  run(a: A, state?: T): Observable<Action> | Action | void
  onError?(a: A, e: any): Observable<any> | any
}

@Injectable({
  providedIn: 'root'
})
export class DataPersistence<S> {
  store: Store<S>
  actions: Actions

  constructor(private s: NxDataPersistence<S>) {
    this.store = s.store
    this.actions = s.actions
  }

  fetch<A extends Action>(
    action: ActionClass<A>,
    opts: FetchOpts<S, A>,
  ): Observable<any> {
    return this.s.fetch(action.prototype.type, {
      onError: (a, error) => new UnhandledException({
        action: a,
        error
      }),
      ...opts,
    })
  }

  optimisticUpdate<A extends Action>(
    action: ActionClass<A>,
    opts: OptimisticUpdateOpts<S, A>,
  ): Observable<any> {
    return this.s.optimisticUpdate(action.prototype.type, opts)
  }

  pessimisticUpdate<A extends Action>(
    action: ActionClass<A>,
    opts: PessimisticUpdateOpts<S, A>,
  ): Observable<any> {
    return this.s.pessimisticUpdate(action.prototype.type, {
      onError: (a, error) => new UnhandledException({
        action: a,
        error
      }),
      ...opts,
    })
  }
}
