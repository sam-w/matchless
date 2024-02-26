module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:svelte/recommended',
        'plugin:svelte/prettier'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json', 'tsconfig.development.json'],
        extraFileExtensions: ['.svelte']
    },
    overrides: [
        {
            files: ['*.svelte'],
            parser: 'svelte-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser'
            }
        }
    ],
    env: {
        browser: true,
        es2017: true,
        node: true
    },
    rules: {
        '@typescript-eslint/no-unsafe-return': 'off',
        // Known false positives in SvelteKit
        'no-undef': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off'
    }
};
