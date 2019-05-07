import { Either } from 'fp-ts/lib/Either'
import { OperatorFunction, of, throwError } from 'rxjs'
import { flatMap } from 'rxjs/operators'

export function toThrowable<L, A>(): OperatorFunction<Either<L, A>, A> {
  return flatMap(e => e.fold(
    l => throwError(l),
    r => of(r)
  ))
}
