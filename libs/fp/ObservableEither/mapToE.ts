import { Either } from 'fp-ts/lib/Either'
import { OperatorFunction } from 'rxjs'
import { mapE } from './mapE'

export function mapToE<L, A, B>(value: B): OperatorFunction<Either<L, A>, Either<L, B>> {
  return mapE(() => value)
}
