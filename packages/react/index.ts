import { Dispatcher, resloveDispatcher } from "./src/currentDispatcher";
import CurrentDispatcher from './src/currentDispatcher'
import { jsxDEV } from "./src/jsx";

export const useState: Dispatcher['useState'] = (initialState) => {
  const dispatcher = resloveDispatcher()
  return dispatcher.useState(initialState)
};
// 内部数据共享层
export const _SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  CurrentDispatcher
}
export default {
  version: "0.0.0",
  createElement: jsxDEV
}
