import { $ } from "bun";
import { getArgumentValue } from "./utils/parseArgv";
import { join as joinPath } from "node:path";

const outDir =
	// output to directory passed in via --outdir (i.e. `--outdir=build`, `--outdir build`)
	getArgumentValue("outdir") ??
	// output to directory name in BUILD_DIR
	import.meta.env.BUILD_DIR ??
	// output to current directory
	joinPath(import.meta.dirname, "build");
const version = (await import("./package.json")).version;
const SUPPORTED_TARGETS = [
	"bun-darwin-arm64",
	"bun-darwin-x64",
	"bun-linux-arm64",
	"bun-linux-x64",
	"bun-windows-x64",
];

for (const target of SUPPORTED_TARGETS) {
	await $`bun build --compile --minify --sourcemap --target=${target} --outfile ${joinPath(
		outDir,
		`fileserver-${version}-${target}`,
	)} index.ts`;
}
