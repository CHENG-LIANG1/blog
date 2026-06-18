import { QuartzTransformerPlugin } from "../types"
import { Element, Root } from "hast"
import { visit } from "unist-util-visit"

export const LazyImages: QuartzTransformerPlugin<never> = () => {
  return {
    name: "LazyImages",
    htmlPlugins() {
      return [
        () => {
          return (tree: Root) => {
            visit(tree, "element", (node: Element) => {
              if (node.tagName !== "img") {
                return
              }

              // Skip images that are explicitly marked as eager
              if (node.properties.loading === "eager") {
                return
              }

              node.properties.loading = "lazy"
              node.properties.decoding = "async"
            })
          }
        },
      ]
    },
  }
}
