/**
 * Grab the value of a command line argument. Only supports long-form (i.e. `--name`) arguments.
 * @param argument Argument name to fetch (e.g. `name`)
 * @param argv String array of arguments to parse
 */
export function getArgumentValue(
	argument: string,
	argv?: string[],
): string | null {
	if (typeof argv === "undefined") argv = Bun.argv;

	const argNameIndex = argv.findLastIndex((arg) =>
			arg.startsWith(`--${argument}`),
		),
		thisArg = argv[argNameIndex],
		nextArg = argv[argNameIndex + 1];

	if (!thisArg) return null;

	// try getting via equals (like in `--name=Andy`)
	{
		// contains everytihng after the first = in this argument
		const postEqualsValue = thisArg.split("=").slice(1).join("=");
		if (postEqualsValue.length > 0) return postEqualsValue;
	}

	return nextArg ?? null;
}
