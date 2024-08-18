# The Simplest File Uploader

I created this as the simplest way to transfer files into & out of a virtual
machine with networking but no other way to directly share files through the
hypervisor. (In this case, Windows XP via UTM.) The HTML is also super barebones
because I'm supporting IE8 here, lol!

## Standalone Setup

Download the latest binary for your platform from
[Releases](https://github.com/ilynxcat/the-simplest-uploader/releases).

Move the binary to a directory that you'd like to contain the `uploads/`
directory.

In a terminal, navigate to that directory then execute the binary.

## Setup with Code

After cloning repo, install dependencies:

```bash
bun install
```

To run:

```bash
bun serve
```

To develop:

```bash
bun dev
```

<small>This project was created using <code>bun init</code> in bun v1.1.20.
<a href="https://bun.sh" target="_blank">Bun</a> is a fast all-in-one JavaScript
runtime.</small>
