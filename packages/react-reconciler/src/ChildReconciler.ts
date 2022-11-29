import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { ReactElementType } from "shared/ReactTypes";
import { createFiberFromElement, FiberNode } from "./fiber";
import { Placement } from "./fiberFlags";
import { HostText } from "./workTags";

export function ChildReconciler(shouldTrackEffects: boolean) {

  function reconcileSingleElement(returnFiber: FiberNode, currentFiber: FiberNode | null, element: ReactElementType) {
    // 跟据ReactElementType 创建fiber
    const fiber = createFiberFromElement(element)
    fiber.return = returnFiber
    return fiber
  }
  // text
  function reconcileSingleTextNode(returnFiber: FiberNode, currentFiber: FiberNode | null, element: string | number) {
    // 跟据ReactElementType 创建fiber
    const fiber = new FiberNode(HostText, { content: element }, null)
    fiber.return = returnFiber
    return fiber
  }

  function placeSingleChild(fiber: FiberNode) {
    // 首屏渲染
    if (shouldTrackEffects && fiber.alternate === null) {
      fiber.flags |= Placement
    }
    return fiber
  }

  return function reconcileChildFibers(returnFiber: FiberNode, currentFiber: FiberNode | null, newChild: ReactElementType | null) {
    // 判断 fiber 类型
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFiber, newChild))
        default:
          if (__DEV__) {
            console.warn("未实现的 reconcileChild 的类型", newChild);
          }
          break;
      }
    }
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFiber, newChild))
    }

    if (__DEV__) {
      console.warn("未实现的 reconcileChild 的类型", newChild);
    }
    return null
  }
}

export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)
