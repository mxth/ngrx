import { Predicate, Refinement } from 'fp-ts/lib/function'
import {
  Option,
  fromNullable as fromNullableO,
  fromPredicate as fromPredicateO,
} from 'fp-ts/lib/Option'
import { Observable, OperatorFunction, of } from 'rxjs'
import { flatMap, map } from 'rxjs/operators'

export function fromNullable<T>(): OperatorFunction<
  T | null | undefined,
  Option<T>
> {
  return map(fromNullableO)
}

export function fromPredicate<A>(
  predicate: Predicate<A>,
): OperatorFunction<A, Option<A>> {
  return map(fromPredicateO(predicate))
}

export function mapO<A, B>(
  f: (a: A) => B,
): OperatorFunction<Option<A>, Option<B>> {
  return map((a: Option<A>) => a.map(f))
}

export function mapNullable<A, B>(
  f: (a: A) => B | null | undefined,
): OperatorFunction<Option<A>, Option<B>> {
  return map(a => a.mapNullable(f))
}

export function getOrElse<T>(b: T): OperatorFunction<Option<T>, T> {
  return map((a: Option<T>) => a.getOrElse(b))
}

export function flatGetOrElse<T>(
  b: Observable<T>,
): OperatorFunction<Option<T>, T> {
  return flatMap((a: Option<T>) => a.fold(b, _a => of(_a)))
}

export function fold<A, B>(
  b: B,
  onSome: (a: A) => B,
): OperatorFunction<Option<A>, B> {
  return map((a: Option<A>) => a.fold(b, onSome))
}

export function flatFold<A, B>(
  b: Observable<B>,
  onSome: (a: A) => Observable<B>,
): OperatorFunction<Option<A>, B> {
  return flatMap((a: Option<A>) => a.fold(b, onSome))
}

export function foldL<A, B>(
  onNone: () => B,
  onSome: (a: A) => B,
): OperatorFunction<Option<A>, B> {
  return map(a => a.foldL(onNone, onSome))
}

export function toNullable<A>(): OperatorFunction<Option<A>, A | null> {
  return map(a => a.toNullable())
}

export function filter<A, B extends A>(
  p: Refinement<A, B>,
): OperatorFunction<Option<A>, Option<B>>
export function filter<A>(
  p: Predicate<A>,
): OperatorFunction<Option<A>, Option<A>> {
  return map(a => a.filter(p))
}
