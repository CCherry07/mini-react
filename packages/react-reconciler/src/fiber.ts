import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
// import { Update } from './updateQueue';

/**
 * @param { WorkTag } tag type WorkTag
 * @param { Props } pendingProps type Props
 * @param { Key } key type Key
 * @returns FiberNode
 * @constructor
 * @description fiberNode
 * @see
 * @since 0.0.1
 * @version 0.0.1
 */

export class FiberNode {
  tag: WorkTag
  key: Key
  stateNode: any // dom节点
  type: any // 类型 function class string number null undefined provider consumer
  ref: null | Ref; // ref
  
  return: FiberNode | null; // 父fiberNode
  sibling: FiberNode | null; // 兄弟fiberNode
  child: FiberNode | null; // 子fiberNode
  index: number; // 索引
  
  pendingProps: Props // 传入的props
  memoizedProps: Props | null // 旧的props
  memoizedState: any // 当组件为函数组件时，memoizedState为hook的state 为类组件时，memoizedState为类组件的state
  // 双缓冲 指针
  alternate: FiberNode | null
  // action flags
  flags: Flags // 副作用标识
  subTreeFlags: Flags // 子树副作用标识
  updateQueue: unknown // 更新队列
  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // 实例
    this.tag = tag
    this.key = key
    // hostcomponent dom
    this.stateNode = null
    // component type
    this.type = null
    // 指向 父fiberNode 构成树状结构
    this.return = null
    this.sibling = null
    this.child = null
    // ul li
    this.index = 0

    this.ref = null

    // 作为工作单元
    this.pendingProps = pendingProps
    this.memoizedProps = null
    this.memoizedState = null
    // 双缓冲 指针（对应fiberNode）
    this.alternate = null
    // 副作用
    this.flags = NoFlags
    this.subTreeFlags = NoFlags
    this.updateQueue = null
  }

}

// FiberRootNode.current -> hostRootFiber
// hostRootFiber.stateNode -> FiberRootNode
// hostRootFiber.child -> App

export class FiberRootNode {
  container: Container
  current: FiberNode
  finishedWork: FiberNode | null
  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container
    this.current = hostRootFiber
    hostRootFiber.stateNode = this
    this.finishedWork = null
  }
}

export const createWorkInprogress = (current: FiberNode, pendingProps: Props): FiberNode => {
  let wip = current.alternate // 双缓冲 指针 交替 作为工作单元 用于更新 与 current 交替
  // 首屏
  if (wip === null) {
    wip = new FiberNode(current.tag, pendingProps, current.key)
    wip.stateNode = current.stateNode
    wip.alternate = current
    current.alternate = wip
  } else {
    wip.pendingProps = pendingProps
    wip.flags = NoFlags
    wip.subTreeFlags = NoFlags
  }
  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.flags = current.flags;
  wip.child = current.child
  wip.memoizedProps = current.memoizedProps
  wip.memoizedState = current.memoizedState
  return wip
}

export function createFiberFromElement(element: ReactElementType): FiberNode {
  const { type, key, props } = element
  let fiberTag: WorkTag = FunctionComponent
  if (typeof type === 'string') {
    // dom 元素
    fiberTag = HostComponent

  } else if (typeof type !== 'function' && __DEV__) {
    console.warn("未定义的 type 类型", element);
  }
  const fiber = new FiberNode(fiberTag, props, key)
  fiber.type = type
  return fiber
}
