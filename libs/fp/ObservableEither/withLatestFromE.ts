import { Either } from 'fp-ts/lib/Either'
import { ObservableInput, ObservedValueOf, OperatorFunction, of } from 'rxjs'
import { withLatestFrom } from 'rxjs/operators'
import { semiFlatMapE } from './flatMapE'

export function withLatestFromE<L, A, O2 extends ObservableInput<any>>(source2: O2): OperatorFunction<Either<L, A>, Either<L, [A, ObservedValueOf<O2>]>>
export function withLatestFromE<L, A, R>(...args: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): OperatorFunction<Either<L, A>, Either<L, R>> {
  return semiFlatMapE(a => of(a).pipe(
    withLatestFrom(...args)
  ))
}
