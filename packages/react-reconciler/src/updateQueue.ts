import { Dispatch } from "react/src/currentDispatcher";
import type { Action } from "shared/ReactTypes";

export interface Update<State> {
  action: Action<State>
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null
  },
  dispatch: Dispatch<State> | null
}

/**
 * 
 * @param action type: State | ((prevState: State) => State)
 * @returns 
 * @description 创建更新
 * @example
 * const update = createUpdate(1)
 * console.log(update) // { action: 1 }
 * @see
 * @since 0.0.1
 * @version 0.0.1
 */

export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action
  }
}

export const createUpdateQueue = <State>() => {
  return {
    shared: {
      pending: null
    },
    dispatch: null
  } as UpdateQueue<State>
}

/**
  * @param updateQueue 更新队列
  * @param update 更新
  * @returns void
  * @description 将更新添加到更新队列中
  * @example
  * const updateQueue = createUpdateQueue()
  * const update = createUpdate(1)
  * enqueueUpdate(updateQueue, update)
  * console.log(updateQueue.shared.pending) // { action: 1 }
  * @see 
  * @since 0.0.1
  * @version 0.0.1
  * */

export const enqueueUpdate = <State>(
  updateQueue: UpdateQueue<State>,
  update: Update<State>
) => {
  updateQueue.shared.pending = update
}
export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null
): { memoizeState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizeState: baseState
  }
  if (pendingUpdate !== null) {
    const action = pendingUpdate.action
    if (action instanceof Function) {
      // action function
      result.memoizeState = action(baseState)
    } else {
      // action 基本数据类型
      result.memoizeState = action
    }
  }
  return result
}
