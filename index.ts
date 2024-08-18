import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { stream } from "hono/streaming";
import { readdir, stat } from "node:fs/promises";
import { filterAsync } from "./filterAsync";

const packageMeta = await import("./package.json");

console.log(`${packageMeta.name} v${packageMeta.version}`);

checkUploadsDir: {
	const gitignoreFile = Bun.file("./uploads/.gitignore");

	if (await gitignoreFile.exists()) break checkUploadsDir;

	await Bun.write(gitignoreFile, "*\n", {
		createPath: true,
	});
}

const app = new Hono();

app.use(logger());

app
	.get("/", async (c) => {
		return c.html(await Bun.file("./index.html").text());
	})
	.post(async (c) => {
		c.header("Content-type", "text/html");

		return stream(c, async (stream) => {
			await stream.write(
				"<body><h1>Upload status</h1><p>Receiving your file...</p>"
			);

			const body = await c.req.parseBody();
			const file = body["file"];

			if (!(file instanceof File)) {
				await stream.write(
					'<p>You did not submit a valid file. <a href="/">Retry!</a></p></body>'
				);
				return;
			}

			console.log(`rcv ${(<File>file).name}: writing...`);
			try {
				await Bun.write(`./uploads/${(<File>file).name}`, file);
			} catch (err) {
				console.log(`rcv ${(<File>file).name}: error`);
				console.error(err);
				await stream.write(
					`<p>Could not receive ${
						(<File>file).name
					}. Check server for logs.<br><a href="/">Back to uploader</a></p></body>`
				);
				return;
			}
			console.log(`rcv ${(<File>file).name}: ok`);

			await stream.write(
				`<p>Succesfully received ${
					(<File>file).name
				}<br><a href="/">Another!</a></p></body>`
			);
		});
	});

app.get("/uploads", async (c) => {
	const dirData = await filterAsync(
		await readdir("./uploads"),
		async (filename) => {
			if (filename === ".gitignore") return false;

			const fileStat = await stat(`./uploads/${filename}`);

			return !fileStat.isDirectory();
		}
	);

	const rewriter = new HTMLRewriter().on("#file_list", {
		element(element) {
			for (const filename of dirData) {
				element.append(
					`<li><a download="${filename}" href="/uploads/${filename}">${filename}</a></li>`,
					{
						html: true,
					}
				);
			}
		},
	});

	return rewriter.transform(c.html(await Bun.file("./catalog.html").text()));
});

// you can technically access subfolders with this but they are unlisted.
// just... don't be dumb and put sensitive stuff into uploads/**
app.use("/uploads/*", serveStatic({ root: "./" }));

const server = Bun.serve({
	port: 8080,
	fetch: app.fetch,
});

console.log(`listening at ${server.url}`);
