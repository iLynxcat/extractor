// we import the templates as modules so that they get bundled into the compiled binary!
declare module "*.html" {
	const value: string;
	export default value;
}
