import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...angular.configs.tsRecommended,
	...tseslint.configs.stylistic,
	...tseslint.configs.strict,
	{
		files: ["**/*.ts"],
		rules: {
			"@angular-eslint/component-selector": [
				"error",
				{
					type: "element",
					prefix: "",
					style: "kebab-case",
				},
			],
			"no-console": ["warn", {
				allow: ["error", "warn"],
			}],
			"@typescript-eslint/naming-convention": [
				"error",
				{
					"selector": ["function", "method"],
					"format": ["strictCamelCase"],
					"leadingUnderscore": "allow"
				},
				{
					"selector": ["property", "variable"],
					"format": ["camelCase", "UPPER_CASE"],
					"leadingUnderscore": "allow"
				}
			],
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/no-unused-vars": "error",
			"keyword-spacing": ["error", { "before": true, "after": true }],
			"indent": ["error", "tab"],
			"padding-line-between-statements": [
				"error",
				{
					"blankLine": "always",
					"prev": "*",
					"next": "*"
				},
				{
					"blankLine": "never",
					"prev": "import",
					"next": "import"
				},
				{
					"blankLine": "never",
					"prev": [
						"case",
						"default"
					],
					"next": "*"
				}
			],
			"lines-between-class-members": "error",
		},
	}
];