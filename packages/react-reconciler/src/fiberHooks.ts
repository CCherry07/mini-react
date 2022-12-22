import { FiberNode } from "./fiber"
import internals from 'shared/internals'
import { Dispatch, Dispatcher } from "react/src/currentDispatcher"
import { createUpdate, createUpdateQueue, enqueueUpdate, UpdateQueue } from "./updateQueue"
import { scheduleUpdateOnFiber } from "./workLoop"
import { Action } from "shared/ReactTypes"
interface Hook {
  // hook 自身的数据
  memoizedState: any
  updatedQueue: unknown
  next: Hook | null
}

let currentlyRenderingFiber: FiberNode | null = null
let workInProgressHook: Hook | null = null
const { CurrentDispatcher } = internals
export function renderWithHooks(wip: FiberNode) {
  // 赋值
  currentlyRenderingFiber = wip
  // 重置
  wip.memoizedState = null

  const current = wip.alternate

  if (current !== null) {
    // update
  } else {
    // mount
    CurrentDispatcher.current = HooksDispatcherOnMount
  }
  // component type is function
  const Component = wip.type
  const props = wip.pendingProps
  const children = Component(props)
  // 重置
  currentlyRenderingFiber = null
  return children

}

const HooksDispatcherOnMount: Dispatcher = {
  useState: mountState
}

function mountState<State>(initialState: (() => State) | State): [State, Dispatch<State>] {
  // 找到当前useState里面的hook 数据
  const hook = mountWorkInProgressHook()
  let memoizedState;
  if (initialState instanceof Function) {
    memoizedState = initialState()
  } else {
    memoizedState = initialState
  }
  const queue = createUpdateQueue<State>()
  hook.updatedQueue = queue
  hook.memoizedState = memoizedState

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue)
  queue.dispatch = dispatch
  return [memoizedState, dispatch]
}

function dispatchSetState<State>(fiber: FiberNode, updatedQueue: UpdateQueue<State>, action: Action<State>) {
  const update = createUpdate(action)
  enqueueUpdate(updatedQueue, update)
  scheduleUpdateOnFiber(fiber)
}

function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    updatedQueue: null,
    next: null
  }
  if (workInProgressHook === null) {
    // mount 第一个hook 
    if (currentlyRenderingFiber === null) {
      throw new Error('hook must be called in the scope of a function component');
    } else {
      workInProgressHook = hook
      currentlyRenderingFiber.memoizedState = workInProgressHook
    }
  } else {
    // 后续的hook
    workInProgressHook.next = hook
    workInProgressHook = hook
  }
  return workInProgressHook
}
