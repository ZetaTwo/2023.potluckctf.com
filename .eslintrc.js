module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-recommended', '@vue/standard', 'plugin:vue-scoped-css/vue3-recommended',
    ],
    parserOptions: {
        parser: '@babel/eslint-parser',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'comma-dangle': ['error', 'always-multiline'],
        indent: ['error', 4],
        'array-element-newline': ['error', { multiline: true }],
        'vue/require-prop-types': 'off', // TODO this rule should not be off, i'm just too lazy right now to fix them
        'vue-scoped-css/no-unused-selector': 'off', // seems to not care about selectors in child components
        'vue/max-attributes-per-line': ['error', { singleline: { max: 2 } }],
    },
}
