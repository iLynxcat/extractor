import prettierConfigA11y from "prettier-config-a11y" with { type: "json" };

/** @type {import('prettier').Config} */
export default {
	...prettierConfigA11y,
	trailingComma: "all",
};
