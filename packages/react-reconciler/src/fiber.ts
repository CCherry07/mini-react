import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
// import { Update } from './updateQueue';
export class FiberNode {
  tag: WorkTag
  key: Key
  pendingProps: Props
  stateNode: any
  type: any
  ref: null | Ref;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  memoizedProps: Props | null
  memoizedState: any
  // 双缓冲 指针
  alternate: FiberNode | null
  // action flags
  flags: Flags
  subTreeFlags: Flags
  updateQueue: unknown
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
  let wip = current.alternate
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
