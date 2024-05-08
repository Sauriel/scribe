// @ts-ignore
import { Mark } from 'tiptap';
// @ts-ignore
import { toggleMark, updateMark, markInputRule } from 'tiptap-commands';

export const DEFAULT_SIZE = "inherit";

export default class FontSize extends Mark {

  get name() {
    return 'size';
  }

  get defaultOptions() {
    return {
      levels: [ DEFAULT_SIZE ]
    };
  }

  get schema() {
    return {
      attrs: {
        size: {
          default: DEFAULT_SIZE,
        },
      },
      parseDOM: [{
        style: 'font-size',
        // @ts-ignore
        getAttrs: value => ({
          size: value
        }),
      }, ],
      // @ts-ignore
      toDOM: mark => {
        return ["span", {
          style: `font-size: ${mark.attrs.size};`
        }, 0];
      }
    };
  }

  // @ts-ignore
  commands({ type }) {
    // @ts-ignore
    return (attrs) => attrs.size === DEFAULT_SIZE ? toggleMark(type, attrs) : updateMark(type, attrs)
  }

  // @ts-ignore
  inputRules({ type }) {
    return [
      markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type),
    ];
  }
}