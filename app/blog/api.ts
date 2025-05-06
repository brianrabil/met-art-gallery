import fs from "node:fs";
import { join } from "node:path";
import type { Post } from "@/components/blog-post";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "content");

export function getPostSlugs() {
	return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
	const realSlug = slug.replace(/\.mdx?$/, "");
	const mdxPath = join(postsDirectory, `${realSlug}.mdx`);
	const mdPath = join(postsDirectory, `${realSlug}.md`);
	let fullPath = "";
	if (fs.existsSync(mdxPath)) {
		fullPath = mdxPath;
	} else if (fs.existsSync(mdPath)) {
		fullPath = mdPath;
	} else {
		throw new Error(`Post not found: ${realSlug}`);
	}
	const fileContents = fs.readFileSync(fullPath, "utf8");
	const { data, content } = matter(fileContents);

	return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
	const slugs = getPostSlugs();
	const posts = slugs
		.map((slug) => getPostBySlug(slug))
		// sort posts by date in descending order
		.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
	return posts;
}
