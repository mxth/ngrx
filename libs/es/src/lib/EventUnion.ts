interface EventMapObject {
  [type: string]: new (...args: any[]) => any
}

export type EventUnion<T extends EventMapObject> = InstanceType<T[keyof T]>

export type ActionUnion<T extends EventMapObject> = EventUnion<T>
