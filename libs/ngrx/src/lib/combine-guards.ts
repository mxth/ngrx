import { Observable, of } from 'rxjs'
import { flatMap } from 'rxjs/operators'

export function combineGuards(
  ...guards: Observable<boolean>[]
): Observable<boolean> {
  const chain = (i: number): Observable<boolean> => {
    const guard: Observable<boolean> | undefined = guards[i]
    return guard
      ? guard.pipe(flatMap(isValid => (isValid ? chain(i + 1) : of(false))))
      : of(true)
  }

  return chain(0)
}
