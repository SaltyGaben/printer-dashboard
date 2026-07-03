import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.ts', '**/*.tsx', '**/*.vue'],

  rules: {
    // JS / TS rules
    'prefer-const': ['error'],
    'no-var': ['error'],
    'func-style': ['error', 'expression'],
    'no-unused-vars': ['warn'],
    'no-console': ['warn'],
    'no-debugger': ['warn'],
    'indent': ['error', 'tab', { "SwitchCase": 1 }],
    'semi': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],

    'vue/html-indent': ['error', 'tab', { baseIndent: 1, alignAttributesVertically: true }],
    'vue/no-unused-vars': ['warn'],
    'vue/no-mutating-props': ['error'],
    'vue/require-prop-types': ['error'],
    'vue/multi-word-component-names': ['off'],
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/max-attributes-per-line': ['error', { singleline: 3, multiline: 1 }],
    'vue/singleline-html-element-content-newline': ['off'],
    'vue/multiline-html-element-content-newline': ['off'],

    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/consistent-type-imports': ['error'],

    // Disable Prettier-specific rules
    'no-undef': 'off'
  },
})
