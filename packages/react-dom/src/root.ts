// ReactDom.createRoot()

import { createContainer, updateContainer } from "react-reconciler";
import { ReactElementType } from "shared";
import { Container } from "./hostConfig";


export function createRoot(container: Container) {
  const root = createContainer(container)

  return {
    render(element: ReactElementType) {
      updateContainer(element, root)
    },
  }
}
