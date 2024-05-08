import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export default Image.extend({
  name: "custom-image",

  addAttributes() {
    return {
      // @ts-ignore
      ...Image.config.addAttributes(),
      width: {
        default: "auto",
        rendered: true,
      },
      height: {
        default: "auto",
        rendered: true,
      },
      float: {
        default: "none",
        rendered: true,
      },
      noBg: {
        default: false,
        rendered: true,
      },
      pngMask: {
        default: false,
        rendered: true,
      },
    };
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ tr, commands }) => {
          // @ts-ignore
          if (tr.selection?.node?.type?.name == "custom-image") {
            return commands.updateAttributes("custom-image", options);
          } else {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          }
        },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    HTMLAttributes.class = " custom-image--float-" + node.attrs.float;
    if (node.attrs.noBg) {
      HTMLAttributes.class += " custom-image--no-bg";
    }
    let style = "height: " + node.attrs.height + "; width: " + node.attrs.width + ";";
    if (node.attrs.pngMask) {
      style += " shape-outside: url(" + node.attrs.src + "); shape-margin: 10px;";
    }
    HTMLAttributes.style = style;

    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
});
