import { beginWork } from "./beginWork";
import { completeWork } from './completeWork';
import { FiberNode } from "./fiber";

let workInProgress: FiberNode | null = null

function prepareFreshStack(fiber: FiberNode) {
  workInProgress = fiber
}

function renderRoot(root: FiberNode) {
  // init 
  prepareFreshStack(root)

  do {
    try {
      workLoop()
    } catch (error) {
      console.error('workLoop 发生错误', error);
      workInProgress = null
    }
    // eslint-disable-next-line no-constant-condition
  } while (true)
}

function workLoop() {
  while (workInProgress !== null) {
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
    const next = completeWork(node)
    const sibling = node.sibling
    if (sibling !== null) {
      workInProgress = sibling
      return
    }
    node = node.return
    workInProgress = null
  } while (node !== null);
}
