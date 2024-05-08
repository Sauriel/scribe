module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": import.meta.env.PROD ? "warn" : "off",
    "no-debugger": import.meta.env.PROD ? "warn" : "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-var-requires": "off",
    "no-control-regex": "off",
    "no-useless-escape": "off",
  },
};
