import { beginWork } from "./beginWork";
import { commitMutationEffects } from "./commitWork";
import { completeWork } from './completeWork';
import { createWorkInprogress, FiberNode, FiberRootNode } from "./fiber";
import { MutationMask, NoFlags } from "./fiberFlags";
import { HostRoot } from "./workTags";

let workInProgress: FiberNode | null = null

function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInprogress(root.current, {})
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // 调度功能
  const root = markUpdateFromFiberToRoot(fiber)
  renderRoot(root)
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber
  let parent = node.return
  while (parent !== null) {
    if (__DEV__) {
      console.warn('markUpdateFromFiberToRoot');
    }
    node = parent
    parent = node.return
  }
  if (node.tag === HostRoot) {
    return node.stateNode
  }
  return null
}

function renderRoot(root: FiberRootNode) {
  // init 
  prepareFreshStack(root)

  do {
    try {
      workLoop()
      break
    } catch (error) {
      if (__DEV__) {
        console.error('workLoop 发生错误', error);
      }
      workInProgress = null
    }
    // eslint-disable-next-line no-constant-condition
  } while (true)

  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork

  // commit 
  commitRoot(root)
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork
  if (finishedWork === null) {
    return;
  }

  if (__DEV__) {
    console.warn(" commit 阶段开始 ", finishedWork);
  }

  // 重置
  root.finishedWork = null
  const subTreeFlagsEffect = (finishedWork.subTreeFlags & MutationMask) !== NoFlags
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags

  if (subTreeFlagsEffect || rootHasEffect) {
    // beforeMutation 阶段
    // mutation 阶段
    commitMutationEffects(finishedWork)
    // 切换 wip 双缓冲 fiber 树切换
    root.current = finishedWork
    //layout 阶段
  } else {
    root.current = finishedWork
  }

}

function workLoop() {
  while (workInProgress !== null) {
    if (__DEV__) {
      console.warn('workLoop');
    }
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber)
  fiber.memoizedProps = fiber.pendingProps

  if (next === null) {
    completeUnitOfWork(fiber)
  } else {
    workInProgress = next
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber
  do {
    completeWork(node)
    if (__DEV__) {
      console.warn('completeUnitOfWork');
    }
    const sibling = node.sibling
    if (sibling !== null) {
      workInProgress = sibling
      return
    }
    node = node.return
    workInProgress = null
  } while (node !== null);
}
