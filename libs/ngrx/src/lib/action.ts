export abstract class Action {
  type!: string

  constructor() {
    this.type = this.type
  }
}

export abstract class RequestAction extends Action {
  static requestId = 0

  requestId = RequestAction.requestId++
}

export abstract class ResponseAction<P> extends Action {
  responseId: number
  constructor(public payload: P, requestAction: RequestAction) {
    super()
    this.responseId = requestAction.requestId
  }
}

export interface ActionClass<T extends Action> {
  prototype: T

  new (...args: any[]): T
}

export function ActionType(type: string) {
  return function<T extends Action>(actionClass: ActionClass<T>) {
    actionClass.prototype.type = type
  }
}

export function isAction<T extends Action, P = any>(
  action: Action,
  actionClass: ActionClass<T>,
): action is T {
  return action.type === actionClass.prototype.type
}
