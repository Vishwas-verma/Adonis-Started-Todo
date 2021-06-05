const fs = require("fs");
const path = require("path");

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, ".prettierrc"), "utf8"));

module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: [
        "airbnb-typescript/base",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
        "plugin:prettier/recommended"
    ],
    plugins: ["@typescript-eslint", "prettier"],
    env: {
        jest: true,
        browser: true,
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        project: "./tsconfig.json"
    },
    ignorePatterns: ["/*.*"],
    rules: {
        "@typescript-eslint/no-inferrable-types": [
            2,
            {
                ignoreParameters: true
            }
        ],
        "indent": 0,
        "semi": [2, "always"],
        "@typescript-eslint/interface-name-prefix": 0,
        "@typescript-eslint/no-empty-interface": 0,
        "object-shorthand": [0, "never"],
        "quotes": ["warn"],
        "@typescript-eslint/no-var-requires": 0,
        "member-ordering": 0,
        "object-literal-sort-keys": 0,
        "no-shadowed-variable": 0,
        "no-consecutive-blank-lines": 0,
        "no-string-literal": 0,
        "jsx-no-multiline-js": 0,
        "jsx-boolean-value": 0,
        "arrow-parens": 0,
        "no-implicit-dependencies": 0,
        "no-submodule-imports": 0,
        "no-case-declarations": 1,
        "@typescript-eslint/no-empty-function": 0,
        "@typescript-eslint/indent": 0,
        "@typescript-eslint/no-unused-expressions": 0,
        "@typescript-eslint/no-unused-vars": ["warn"],
        "@typescript-eslint/no-use-before-define": ["warn"],
        "no-underscore-dangle": 0,
        "@typescript-eslint/camelcase": 0,
        "prettier/prettier": ["error", prettierOptions],
        "class-methods-use-this": 0,
        "import/order": 0,
        "import/imports-first": 0,
        "import/newline-after-import": 0,
        "import/no-dynamic-require": 0,
        "import/no-extraneous-dependencies": 0,
        "import/no-named-as-default": 0,
        "import/no-unresolved": [2, { caseSensitive: false }], // ts already checks case sensitive imports
        "import/prefer-default-export": 0,
        "import/no-cycle": 1,
        "no-param-reassign": 1,
        "max-len": 0,
        "newline-per-chained-call": 0,
        "no-confusing-arrow": 0,
        "no-console": 1,
        "no-use-before-define": 0,
        "require-yield": 0,
        "prefer-template": 0,
        "@typescript-eslint/ban-ts-ignore": 0,
        "@typescript-eslint/require-await": 1,
        "@typescript-eslint/no-unsafe-assignment": 0,
        "@typescript-eslint/restrict-plus-operands": 0,
        "no-useless-escape": 0,
        "@typescript-eslint/await-thenable": 0,
        " @typescript-eslint/restrict-template-expressions": 0,
        "@typescript-eslint/no-unsafe-return": 0,
        "@typescript-eslint/no-unsafe-member-access": 0,
        "prefer-destructuring": 0,
        "max-classes-per-file": 0,
        "no-unneeded-ternary": 0,
        "consistent-return": 0,
        "no-new": 0,
        "@typescript-eslint/return-await": 0,
        "no-else-return": 0,
        "no-await-in-loop": 0,
        "no-restricted-syntax": 0,
        "@typescript-eslint/naming-convention": 0,
        "arrow-body-style": 0,
        "@typescript-eslint/no-unsafe-call": 0,
        "@typescript-eslint/no-shadow": 0,
        "no-plusplus": 0,
        "no-useless-return": 0,
        "@typescript-eslint/no-unnecessary-type-assertion": 0,
        "operator-assignment": 0,
        "eqeqeq": 0,
        "no-nested-ternary": 0,
        "@typescript-eslint/dot-notation": 0,
        "no-useless-computed-key": 0,
        "@typescript-eslint/no-misused-promises": 0,
        "@typescript-eslint/lines-between-class-members": 0,
        "no-control-regex": 0,
        "@typescript-eslint/no-throw-literal": 0,
        "@typescript-eslint/ban-ts-comment": 0,
        "@typescript-eslint/restrict-template-expressions": 0,
        "@typescript-eslint/unbound-method": 0,
        "no-useless-concat": 0,
        "no-restricted-globals": 0,
        "no-empty": 0,
        "@typescript-eslint/ban-types": 0,
        "no-prototype-builtins": 0,
        "import/no-named-default": 0,
        "no-multi-assign": 0,
        "default-case": 0,
        "prefer-const": 0,
        "strict": 0,
        "lines-around-directive": 0,
        "one-var": 0,
        "@typescript-eslint/no-floating-promises": 0,
        "enforceForLogicalOperands": 0,
        "no-lone-blocks": 0,
        "no-extra-boolean-cast": 0
    },
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts"]
        },
        "import/resolver": {
            typescript: {
                alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
                project: "tsconfig.json"
            }
        },
        "import/ignore": ["types"]
    }
};
