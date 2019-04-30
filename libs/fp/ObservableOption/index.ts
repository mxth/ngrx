import { Option } from 'fp-ts/lib/Option'
import { Observable } from 'rxjs'

export * from './ObservableOption'

export type ObservableOption<A> = Observable<Option<A>>
