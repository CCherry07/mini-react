// DFS 递归 递阶段

import { ReactElementType } from "shared/ReactTypes";
import { mountChildFibers, reconcileChildFibers } from "./ChildReconciler";
import { FiberNode } from "./fiber";
import { processUpdateQueue, UpdateQueue } from "./updateQueue";
import { HostComponent, HostRoot, HostText } from "./workTags";


export const beginWork = (wip: FiberNode) => {
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip)
    case HostComponent:
      return updateHostComponent(wip)
    case HostText:
      return null
    default:
      if (__DEV__) {
        console.warn(`beginWork ${wip.tag} 未匹配到`);
      }
      break;
  }

  return null
  // 返回之fiberNode
}


function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState
  const updateQueue = wip.updateQueue as UpdateQueue<Element>
  const pending = updateQueue.shared.pending
  updateQueue.shared.pending = null
  const { memoizeState } = processUpdateQueue(baseState, pending)
  wip.memoizedState = memoizeState
  // 
  const nextChildren = wip.memoizedState
  reconcileChildren(wip, nextChildren)
  return wip
}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps
  const nextChildren = nextProps.children
  reconcileChildren(wip, nextChildren)
  return null
}

function reconcileChildren(wip: FiberNode, children: ReactElementType | null) {
  const current = wip.alternate
  if (current !== null) {
    // update
    wip.child = reconcileChildFibers(wip, current?.child, children)
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children)
  }
}

