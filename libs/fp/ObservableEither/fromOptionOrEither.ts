import { Either } from 'fp-ts/lib/Either'
import { Option } from 'fp-ts/lib/Option'
import { Observable, OperatorFunction, isObservable } from 'rxjs'
import { ObservableEither, flatOrElse, fromOption, orElse } from './ObservableEither'

export function fromOptionOrEither<L, A>(defaultValue: Either<L, A> | ObservableEither<L, A>): OperatorFunction<Option<A>, Either<L, A>> {
  return (source: Observable<Option<A>>) =>
    source.pipe(
      fromOption(null),
      isObservable(defaultValue) ? flatOrElse(() => defaultValue) : orElse(() => defaultValue)
    )
}
