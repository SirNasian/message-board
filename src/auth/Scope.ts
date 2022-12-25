export type Scope = "account_info" | "post";
const valid_scope = ["account_info", "post"];

export const validateScope = (scope: string): boolean =>
	scope.split(" ").reduce((valid: boolean, scope: string) => {
		return valid && valid_scope.includes(scope);
	}, true);

export const ensureValidScope = (scope: string): string =>
	scope
		.split(" ")
		.filter((scope) => valid_scope.includes(scope))
		.join(" ");

export const obtainScope = (scope: string): Scope[] =>
	validateScope(scope) ? scope.split(" ").map((scope) => scope as Scope) : [];
