import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
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
  // 双缓冲 指针
  alternate: FiberNode | null
  // action flags
  flags: Flags
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
    // 双缓冲 指针（对应fiberNode）
    this.alternate = null
    // 副作用
    this.flags = NoFlags
  }

}
