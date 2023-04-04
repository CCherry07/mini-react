import { appendChildToContainer, Container } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import { MutationMask, NoFlags, Placement } from "./fiberFlags";
import { HostComponent, HostRoot, HostText } from "./workTags";

// nextEffect 为下一个需要处理的fiber节点
let nextEffect: FiberNode | null = null
/**
 * 
 * @param finishedWork type FiberNode
 * @returns void
 * @description 从fiber节点开始工作,找到root节点
 * @see
 * @since 0.0.1
 * @version 0.0.1
 */

export const commitMutationEffects = (finishedWork: FiberNode) => {
  nextEffect = finishedWork
  while (nextEffect !== null) {
    if (__DEV__) {
      console.warn('commitMutationEffects down');
    }
    // 向下遍历
    const child: FiberNode | null = nextEffect.child
    // 当存在子节点 并且子节点有副作用 则将子节点作为下一个处理的节点，找到最深的存在副作用子节点
    if ((nextEffect.subTreeFlags & MutationMask) !== NoFlags && child !== null) {
      nextEffect = child
    } else {
      // 向上遍历处理 副作用
      up: while (nextEffect !== null) {
        commitMutationEffectsOnFiber(nextEffect)
        if (__DEV__) {
          console.warn('commitMutationEffects up');
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

/**
 * 
 * @param finishedWork type FiberNode 需要处理副作用的fiber节点
 * @returns void
 * @description 提交副作用
 * @see
 * @since 0.0.1
 * @version 0.0.1
 */

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
// 查找fiber 父节点的dom stateNode 为真实dom
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
    // 如果是root dom 则是返回 fiber 的 container
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
    appendChildToContainer(hostParent, finishedWork.stateNode) // 将dom 插入到父节点
    return
  }

  const child = finishedWork.child // 获取子fiber节点
  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent) // 递归插入子节点 先处理子节点 再处理兄弟节点
    let sibling = child.sibling // 如果存在兄弟节点 则继续插入
    while (sibling !== null) {
      if (__DEV__) {
        console.warn('appendPlacementNodeIntoContainer');
      }
      appendPlacementNodeIntoContainer(sibling, hostParent)
      sibling = sibling.sibling
    }
  }
}
