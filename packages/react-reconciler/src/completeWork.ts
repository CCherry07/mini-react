import { appendInitialChild, Container, createInstance, createTextInstance } from "hostConfig";
import { FiberNode } from "./fiber";
import { NoFlags } from "./fiberFlags";
import { HostComponent, HostRoot, HostText } from "./workTags";

// DFS 递归 归阶段
export const completeWork = (wip: FiberNode) => {
  const newProps = wip.pendingProps
  const current = wip.alternate
  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // mount
        // 1.构建dom 
        const instance = createInstance(wip.type, newProps)
        appendAllChildren(instance, wip)
        // 2.插入dom
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null
    case HostText:

      if (current !== null && wip.stateNode) {
        // update
      } else {
        // mount
        // 1.构建dom 
        const instance = createTextInstance(newProps.content)
        wip.stateNode = instance
        // 2.插入dom
      }
      bubbleProperties(wip)
      return null
    case HostRoot:
      bubbleProperties(wip)
      return null
    default:
      break;
  }
  return null
}

function appendAllChildren(parent: Container, wip: FiberNode) {
  let node = wip.child
  while (node !== null) {
    if (node?.tag === HostComponent || node?.tag === HostText) {
      appendInitialChild(parent, node.stateNode)
    } else if (node.child !== null) {
      node.child.return = node
      node = node.child
      continue
    }

    if (node === wip) {
      return
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return
      }
      node = node?.return
    }
    node.sibling.return = node.return
    node = node.sibling
  }
}


function bubbleProperties(wip: FiberNode) {
  let subTreeFlags = NoFlags
  let child = wip.child
  if (child !== null) {
    subTreeFlags |= child.subTreeFlags
    subTreeFlags |= child.flags
    child.return = wip
    child = child.sibling
  }
  wip.subTreeFlags |= subTreeFlags
}
