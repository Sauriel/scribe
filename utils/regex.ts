/* eslint-disable no-control-regex */

const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const HAS_LOWERCASE = /(?=.*[a-z])/;
const HAS_UPPERCASE = /(?=.*[A-Z])/;
const HAS_NUMBER = /(?=.*[0-9])/;
const HAS_SPECIAL = /(?=.*[^A-Za-z0-9])/;
const HAS_LENGTH = /(?=..{8,})/;
// one of each: lowercase, uppercase, number, special character. Also min. 8 chars
const PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

const REGEX = {
  EMAIL: EMAIL_REGEX,
  PASSWORD: PASSWORD_REGEX,
  PASSWORD_HINTS: {
    HAS_LENGTH,
    HAS_LOWERCASE,
    HAS_UPPERCASE,
    HAS_NUMBER,
    HAS_SPECIAL
  }
};

export default REGEX;