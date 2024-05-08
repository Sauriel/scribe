// @ts-ignore
import { Mark } from 'tiptap';
// @ts-ignore
import { updateMark, toggleMark, markInputRule } from 'tiptap-commands';

export default class FontFamily extends Mark {

  constructor(readonly defaultFont: string) {
    super()
  }

  get name() {
    return 'font';
  }

  get defaultOptions() {
    return {
      levels: [ this.defaultFont ]
    };
  }

  get schema() {
    return {
      attrs: {
        font: {
          default: this.defaultFont,
        },
      },
      parseDOM: [{
        style: 'font-family',
        // @ts-ignore
        getAttrs: value => ({
          font: value
        }),
      }, ],
      // @ts-ignore
      toDOM: mark => {
        const fontFamily = mark.attrs.font;
        return ["span", {
          style: `font-family: ${fontFamily};`
        }, 0];
      }
    };
  }

  // @ts-ignore
  commands({ type }) {
    // @ts-ignore
    return (attrs) => attrs.font === this.defaultFont ? toggleMark(type, attrs) : updateMark(type, attrs)
  }

  // @ts-ignore
  inputRules({ type }) {
    return [
      markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type),
    ];
  }
}