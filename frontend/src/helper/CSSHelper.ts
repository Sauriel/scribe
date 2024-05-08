export default class CSSHelper {
  public static prefixStyles(prefix: string, styles: string): string {
    let prefixLength = prefix.length;
    let char;
    let nextChar;
    let isAt;
    let isIn;

    // makes sure the prefix will not concatenate the selector
    prefix += ' ';

    // removes comments
    styles = styles.replace( /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '' );

    // makes sure nextChar will not target a space
    styles = styles.replace( /}(\s*)@/g, '}@' );
    styles = styles.replace( /}(\s*)}/g, '}}' );

    for (let i = 0; i < styles.length-2; i++) {
      char = styles[i];
      nextChar = styles[i+1];

      if (char === '@' && nextChar !== 'f') {
        isAt = true;
      }
      if (!isAt && char === '{') {
        isIn = true;
      }
      if (isIn && char === '}') {
        isIn = false;
      }

      if (!isIn && nextChar !== '@' && nextChar !== '}' && (char === '}' || char === ',' || ((char === '{' || char === ';') && isAt))) {
        styles = styles.slice(0, i+1) + prefix + styles.slice(i+1);
        i += prefixLength;
        isAt = false;
      }
    };

    // prefix the first select if it is not `@media` and if it is not yet prefixed
    if (styles.indexOf(prefix) !== 0 && styles.indexOf('@') !== 0) {
      styles = prefix + styles;
    }

    return styles;
  }
}