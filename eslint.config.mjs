import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginJs from '@eslint/js'
import pluginReactConfig from 'eslint-plugin-react'

export default tseslint.config(
    ...tseslint.configs.recommended,
    pluginReactConfig,
    pluginReactConfig.configs.flat.recommended,
    pluginJs.configs.recommended,
    tseslint.configs.strictTypeChecked,
    {
        extends: ['eslint:recommended', 'plugin:react/recommended'],
        ignores: ['public/assets/fontawesome', 'webpack.config.js', 'dist/*'],
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        settings: {
            react: {
                version: 'detect',
            },
        },
        languageOptions: {
            ecmaVersion: 2022,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: ['react'],
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'no-case-declarations': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
        },
    }
)
