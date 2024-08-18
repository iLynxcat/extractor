import { $ } from "bun";

const version = (await import("./package.json")).version;
const SUPPORTED_TARGETS = [
	"bun-darwin-arm64",
	"bun-darwin-x64",
	"bun-linux-arm64",
	"bun-linux-x64",
	"bun-windows-x64",
];

for (const target of SUPPORTED_TARGETS) {
	await $`bun build --compile --target=${target} --outfile fileserver-${version}-${target} index.ts`;
}
