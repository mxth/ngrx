import { Either, left, right } from 'fp-ts/lib/Either'
import { Observable, OperatorFunction, of } from 'rxjs'
import { flatMap, map } from 'rxjs/operators'

export function flatMapLeft<L, M, A>(
  f: (l: L) => Observable<M>,
): OperatorFunction<Either<L, A>, Either<M, A>> {
  return flatMap(a => a.fold(
    l => f(l).pipe(map(m => left<M, A>(m))),
    r => of(right<M, A>(r))
  ))
}
