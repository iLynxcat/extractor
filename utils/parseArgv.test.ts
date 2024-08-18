import { test, expect } from "bun:test";
import { getArgumentValue } from "./parseArgv";

test("parses argument value with equals", () => {
	const argv = ["sweet", "--name=awesome", "sauce"];
	const value = getArgumentValue("name", argv);
	expect(value).toEqual("awesome");
});

test("parses argument value passed separately", () => {
	const argv = ["sweet", "--name", "awesome", "sauce"];
	const value = getArgumentValue("name", argv);
	expect(value).toEqual("awesome");
});

test("returns only last argument value", () => {
	const argv = ["sweet", "--name", "awesome", "--name", "sauce"];
	const value = getArgumentValue("name", argv);
	expect(value).toEqual("sauce");
});

test("is null when requested argument doesn't exist", () => {
	const argv = ["sweet", "--nonsense", "awesome", "sauce"];
	const value = getArgumentValue("name", argv);
	expect(value).toEqual(null);
});
