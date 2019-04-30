import { Either } from 'fp-ts/lib/Either'
import { OperatorFunction } from 'rxjs'
import { map } from 'rxjs/operators'

export function swap<L, A>(): OperatorFunction<Either<L, A>, Either<A, L>> {
  return map(e => e.swap())
}
