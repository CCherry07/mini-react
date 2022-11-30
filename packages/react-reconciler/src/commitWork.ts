import { appendChildToContainer, Container } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import { MutationMask, NoFlags, Placement } from "./fiberFlags";
import { HostComponent, HostRoot, HostText } from "./workTags";

let nextEffect: FiberNode | null = null
export const commitMutationEffects = (finishedWork: FiberNode) => {
  nextEffect = finishedWork
  while (nextEffect !== null) {
    if (__DEV__) {
      console.warn('commitMutationEffects1');
    }
    // 向下遍历
    const child: FiberNode | null = nextEffect.child
    if ((nextEffect.subTreeFlags & MutationMask) !== NoFlags && child !== null) {
      nextEffect = child
    } else {
      // 向上遍历 并处理 effact 
      up: while (nextEffect !== null) {
        commitMutationEffectsOnFiber(nextEffect)
        if (__DEV__) {
          console.warn('commitMutationEffects2');
        }
        const sibling: FiberNode | null = nextEffect.sibling
        if (sibling !== null) {
          nextEffect = sibling
          break up
        }
        nextEffect = nextEffect.return
      }
    }
  }
}

// 提交副作用
const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
  const flags = finishedWork.flags
  //Placement flag
  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork)
    // 移除 Placement flag
    finishedWork.flags &= ~Placement
  }
}

const commitPlacement = (finishedWork: FiberNode) => {
  if (__DEV__) {
    console.warn('执行commitPlacement', finishedWork);
  }
  const hostParent = getHostParent(finishedWork)
  // 将Placement flag 的dom 插入 找到的父节点 hostParent
  if (hostParent !== null) {
    appendPlacementNodeIntoContainer(finishedWork, hostParent)
  }
}
// 查找fiber 父节点的dom
function getHostParent(fiber: FiberNode): Container | null {
  let parent = fiber.return

  while (parent) {
    if (__DEV__) {
      console.warn('getHostParent');
    }
    const parentTag = parent.tag
    if (parentTag === HostComponent) {
      return parent.stateNode as Container
    }
    if (parentTag === HostRoot) {
      if (__DEV__) {
        console.warn('找到了root dom', parent.stateNode.container);
      }
      return (parent.stateNode as FiberRootNode).container
    }
    parent = parent.return
  }

  if (__DEV__) {
    console.warn('未找到 host parent');
  }
  return null
}

function appendPlacementNodeIntoContainer(finishedWork: FiberNode, hostParent: Container) {
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(hostParent, finishedWork.stateNode)
    return
  }

  const child = finishedWork.child
  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent)
    let sibling = child.sibling
    while (sibling !== null) {
      if (__DEV__) {
        console.warn('appendPlacementNodeIntoContainer');
      }
      appendPlacementNodeIntoContainer(sibling, hostParent)
      sibling = sibling.sibling
    }
  }
}
