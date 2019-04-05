import {
  Either,
  fromPredicate as fromPredicateE,
  left,
  right,
} from 'fp-ts/lib/Either'
import { Predicate } from 'fp-ts/lib/function'
import { Observable, OperatorFunction, of } from 'rxjs'
import { flatMap, map } from 'rxjs/operators'

export function fromPredicate<L, A>(
  predicate: Predicate<A>,
  onFalse: (a: A) => L,
): OperatorFunction<A, Either<L, A>> {
  return map(fromPredicateE(predicate, onFalse))
}

export function mapE<L, A, B>(
  f: (a: A) => B,
): OperatorFunction<Either<L, A>, Either<L, B>> {
  return map((a: Either<L, A>) => a.map(f))
}

export function flatMapE<L, A, B>(
  f: (a: A) => Observable<B>,
): OperatorFunction<Either<L, A>, Either<L, B>> {
  return flatMap(
    (a: Either<L, A>): Observable<Either<L, B>> =>
      a.fold(l => of(left(l)), r => f(r).pipe(map(b => right(b)))),
  )
}

export function orElse<L, M, A>(
  fy: (l: L) => Either<M, A>,
): OperatorFunction<Either<L, A>, Either<M, A>> {
  return map(v => v.orElse(fy))
}

export function fold<L, A, B>(
  onLeft: (l: L) => B,
  onRight: (a: A) => B,
): OperatorFunction<Either<L, A>, B> {
  return map((a: Either<L, A>) => a.fold(onLeft, onRight))
}

export function getOrElse<L, A>(a: A): OperatorFunction<Either<L, A>, A> {
  return map(v => v.getOrElse(a))
}

export function getOrElseL<L, A>(
  f: (l: L) => A,
): OperatorFunction<Either<L, A>, A> {
  return map(v => v.getOrElseL(f))
}

export function mapLeft<L, M, A>(
  f: (l: L) => M,
): OperatorFunction<Either<L, A>, Either<M, A>> {
  return map(v => v.mapLeft(f))
}
