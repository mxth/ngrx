import { Observable } from 'rxjs'
import { Event } from './Event'

export abstract class ActionService {
  abstract dispatch<T extends Event>(action: T): Observable<T>
}
