import { Either, right } from 'fp-ts/lib/Either'
import { OperatorFunction, of, Observable } from 'rxjs'
import { flatMap, map } from 'rxjs/operators'
import { ObservableEither } from './ObservableEither'

export function orElse<L, M, A>(
  fy: (l: L) => Either<M, A>,
): OperatorFunction<Either<L, A>, Either<M, A>> {
  return map(v => v.orElse(fy))
}

export function flatOrElse<L, M, A>(
  fy: (l: L) => ObservableEither<M, A> | Observable<never>,
): OperatorFunction<Either<L, A>, Either<M, A>> {
  return flatMap(v => v.fold(
    fy,
    r => of(right(r))
  ))
}
