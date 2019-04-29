import { Either } from 'fp-ts/lib/Either'
import { OperatorFunction } from 'rxjs'
import { map } from 'rxjs/operators'

export function mapE<L, A, B>(
  f: (a: A) => B,
): OperatorFunction<Either<L, A>, Either<L, B>> {
  return map((a: Either<L, A>) => a.map(f))
}
