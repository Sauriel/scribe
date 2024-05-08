// @ts-ignore
import { Mark } from 'tiptap';
// @ts-ignore
import { updateMark, markInputRule } from 'tiptap-commands';

export default class Alignment extends Mark {

  get name() {
    return 'alignment';
  }

  get defaultOptions() {
    return {
      levels: ["left", "center", "right", "justify"]
    };
  }

  get schema() {
    return {
      attrs: {
        align: {
          default: 'left',
        },
      },
      parseDOM: [{
        style: 'text-align',
        // @ts-ignore
        getAttrs: value => ({
          align: value
        }),
      }, ],
      // @ts-ignore
      toDOM: mark => {
        return ["span", {
          class: `block text-${mark.attrs.align}`
        }, 0];
      }
    };
  }

  // @ts-ignore
  commands({ type }) {
    // @ts-ignore
    return attrs => updateMark(type, attrs);
  }

  // @ts-ignore
  inputRules({ type }) {
    return [
      markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type),
    ];
  }
}