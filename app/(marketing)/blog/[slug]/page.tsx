import {
	Alert,
	CMS_NAME,
	// MoreStories,
	PostBody,
	PostHeader,
} from "@/components/blog-post";
import { Container } from "@/components/container";
import { getAllPosts, getPostBySlug } from "@/lib/blog-api";
import { markdownToHtml } from "@/lib/markdown-to-html";
import { meta } from "@/lib/meta";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function BlogPost(props: Params) {
	const params = await props.params;
	const post = getPostBySlug(params.slug);

	if (!post) {
		return notFound();
	}

	const content = await markdownToHtml(post.content || "");

	return (
		<>
			<Alert preview={post.preview} />
			<Container>
				{/* <Header /> */}
				<article className="mt-16 mb-32">
					<PostHeader
						title={post.title}
						coverImage={post.coverImage}
						date={post.date}
						author={post.author}
					/>
					<PostBody content={content} />
				</article>
			</Container>
		</>
	);
}

type Params = {
	params: Promise<{
		slug: string;
	}>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
	const params = await props.params;
	const post = getPostBySlug(params.slug);

	if (!post) {
		return notFound();
	}

	const title = `${post.title} | ${meta.siteName}`;

	return {
		title,
		openGraph: {
			title,
			images: [post.ogImage.url],
		},
	};
}

export async function generateStaticParams() {
	const posts = getAllPosts();

	return posts.map((post) => ({
		slug: post.slug,
	}));
}
