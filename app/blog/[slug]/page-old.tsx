import { getAllPosts, getPostBySlug } from "@/app/blog/api";
import { Container } from "@/components/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { markdownToHtml } from "@/lib/markdown-to-html";
import { meta } from "@/lib/meta";
import { format, parseISO } from "date-fns";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function BlogPost(props: Params) {
	const params = await props.params;
	const post = getPostBySlug(params.slug);

	if (!post) {
		return notFound();
	}

	const content = await markdownToHtml(post.content || "");

	// For demo purposes - we're adding categories and tags
	// These would normally come from your post metadata
	const categories = ["Art", "Technology"];
	const tags = ["Met Gallery", "Art History", "Digital Experience"];

	return (
		<article className="py-16">
			<Container variant="constrained" width="narrow">
				<header className="mb-8">
					<nav className="mb-4">
						{categories.map((category, index) => (
							<React.Fragment key={category}>
								<Link
									href={`/category/${category.toLowerCase()}`}
									className="text-sm font-semibold text-primary hover:underline"
								>
									{category}
								</Link>
								{index < categories.length - 1 && (
									<span className="mx-2">/</span>
								)}
							</React.Fragment>
						))}
					</nav>
					<h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
					<p className="mb-4 text-xl text-muted-foreground">{post.excerpt}</p>
					<div className="mb-6 flex items-center gap-4">
						<Avatar>
							<AvatarImage src={post.author.picture} alt={post.author.name} />
							<AvatarFallback>
								{post.author.name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.slice(0, 2)
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="font-semibold">By {post.author.name}</p>
							<p className="text-sm text-muted-foreground">
								Posted on{" "}
								{format(parseISO(post.date), "MMM d, yyyy h:mm a 'EDT'")}
							</p>
						</div>
					</div>
					<Image
						src={post.coverImage}
						alt={post.title}
						width={1200}
						height={600}
						className="rounded-lg"
					/>
					<p className="mt-2 text-sm text-muted-foreground">
						Photo: Metropolitan Museum of Art
					</p>
				</header>

				<div className="prose-primary prose max-w-none dark:prose-invert">
					{/* Render the HTML content safely */}
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
					<div dangerouslySetInnerHTML={{ __html: content }} />
				</div>

				<footer className="mt-8">
					<h3 className="mb-2 text-lg font-semibold">Tags</h3>
					<div className="flex flex-wrap gap-2">
						{tags.map((tag) => (
							<Badge key={tag} variant="secondary">
								<Link href={`/tag/${tag.toLowerCase().replace(/ /g, "-")}`}>
									{tag}
								</Link>
							</Badge>
						))}
					</div>
				</footer>
			</Container>
		</article>
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
		description: post.excerpt,
		openGraph: {
			title,
			description: post.excerpt,
			images: [post.coverImage],
		},
	};
}

export async function generateStaticParams() {
	const posts = getAllPosts();

	return posts.map((post) => ({
		slug: post.slug,
	}));
}
