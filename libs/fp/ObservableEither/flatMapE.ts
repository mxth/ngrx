import { Either, left, right } from 'fp-ts/lib/Either'
import { Observable, OperatorFunction, of } from 'rxjs'
import { flatMap, map } from 'rxjs/operators'

export function semiFlatMapE<L, A, B>(
  f: (a: A) => Observable<B>,
): OperatorFunction<Either<L, A>, Either<L, B>> {
  return flatMap(
    (a: Either<L, A>): Observable<Either<L, B>> =>
      a.fold(l => of(left(l)), r => f(r).pipe(map(b => right(b)))),
  )
}

export function subFlatMapE<L, A, B>(
  f: (a: A) => Either<L, B>,
): OperatorFunction<Either<L, A>, Either<L, B>> {
  return map(a => a.chain(f))
}

export function flatMapE<L, A, B>(
  f: (a: A) => Observable<Either<L, B>>,
): OperatorFunction<Either<L, A>, Either<L, B>> {
  return flatMap(a => a.fold(
    l => of(left<L, B>(l)),
    r => f(r)
  ))
}
