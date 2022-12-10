import { Action } from "shared/ReactTypes"

export interface Dispatcher {
  useState: <T>(initialState: (() => T) | T) => [T, Dispatch<T>]
}

export type Dispatch<State> = (action: Action<State>) => void

const currentDispatcher: { current: Dispatcher | null } = {
  current: null
}
export const resloveDispatcher = (): Dispatcher => {
  const dispatcher = currentDispatcher.current;
  if (dispatcher === null) {
    throw new Error('hook must be called in the scope of a function component');
  }
  return dispatcher
}
export default currentDispatcher
