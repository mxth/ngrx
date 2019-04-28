import {
  Either,
  fromOption as fromOptionE,
  fromPredicate as fromPredicateE,
  left,
  right,
} from 'fp-ts/lib/Either'
import { Predicate } from 'fp-ts/lib/function'
import { Option } from 'fp-ts/lib/Option'
import { Observable, OperatorFunction, isObservable, of } from 'rxjs'
import { catchError, flatMap, map } from 'rxjs/operators'

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

export function mapE<L, A, B>(
  f: (a: A) => B,
): OperatorFunction<Either<L, A>, Either<L, B>> {
  return map((a: Either<L, A>) => a.map(f))
}

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

export function orElse<L, M, A>(
  fy: (l: L) => Either<M, A>,
): OperatorFunction<Either<L, A>, Either<M, A>> {
  return map(v => v.orElse(fy))
}

export function flatOrElse<L, M, A>(
  fy: (l: L) => Observable<Either<M, A>>,
): OperatorFunction<Either<L, A>, Either<M, A>> {
  return flatMap(v => v.fold(
    fy,
    r => of(right(r))
  ))
}

export function fromOptionOrElse<L, A>(defaultValue: Either<L, A> | Observable<Either<L, A>>): OperatorFunction<Option<A>, Either<L, A>> {
  return (source: Observable<Option<A>>) =>
    source.pipe(
      fromOption(null),
      isObservable(defaultValue) ? flatOrElse(() => defaultValue) : orElse(() => defaultValue)
    )
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
