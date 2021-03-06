import {
  Either,
  fromOption as fromOptionE,
  fromPredicate as fromPredicateE,
  left,
  right,
} from 'fp-ts/lib/Either'
import { Predicate } from 'fp-ts/lib/function'
import { Option } from 'fp-ts/lib/Option'
import { Observable, OperatorFunction, of } from 'rxjs'
import { catchError, flatMap, map } from 'rxjs/operators'
import { ObservableInput } from 'rxjs/src/internal/types'

export type ObservableEither<L, A> = Observable<Either<L, A>>

export function catchErrorE<L, A>(onError: (err: any) => Observable<L>): OperatorFunction<Either<L, A>, Either<L, A>> {
  return (source: Observable<Either<L, A>>) =>
    source.pipe(
      catchError(err => onError(err).pipe(map(e => left<L, A>(e))))
    )
}

export function fromError<L, A>(onError: (err: any) => Observable<L>): OperatorFunction<A, Either<L, A>> {
  return (source: Observable<A>) =>
    source.pipe(
      map(value => right<L, A>(value)),
      catchErrorE<L, A>(onError),
    )
}

export function fromPredicate<L, A>(
  predicate: Predicate<A>,
  onFalse: (a: A) => L,
): OperatorFunction<A, Either<L, A>> {
  return map(fromPredicateE(predicate, onFalse))
}

export function fromOption<L, A>(defaultValue: L): OperatorFunction<Option<A>, Either<L, A>> {
  return map(fromOptionE(defaultValue))
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
