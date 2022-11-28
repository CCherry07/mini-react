/* eslint-disable @typescript-eslint/no-explicit-any */
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import type { Type, Key, Props, Ref, ReactElementType, ElementType } from 'shared/ReactTypes';

const ReactElement = function (type: Type, key: Key, ref: Ref, props: Props): ReactElementType {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: "cherry"
  }
  return element
}
export const jsx = (type: ElementType, config: Record<string, any>, ...maybeChildren: any) => {
  let key: Key = null;
  const props: Props = {}
  let ref: Ref = null
  for (const prop in config) {
    const val = config[prop]
    //key
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val
      }
      continue
    }
    // ref
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val
      }
      continue
    }
    // 本身的属性
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }
    // maybeChildren
    const maybeChildrenLength = maybeChildren.length
    if (maybeChildrenLength) {
      if (maybeChildrenLength === 1) {
        props.children = maybeChildren[0]
      } else {
        props.children = maybeChildren
      }
    }
  }
  return ReactElement(type, key, ref, props)
}


export const jsxDEV = (type: ElementType, config: Record<string, any>) => {
  let key: Key = null;
  const props: Props = {}
  let ref: Ref = null
  for (const prop in config) {
    const val = config[prop]
    //key
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val
      }
      continue
    }
    // ref
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val
      }
      continue
    }
    // 本身的属性
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }
  }
  return ReactElement(type, key, ref, props)
}
