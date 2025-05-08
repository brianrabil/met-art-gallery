import { getPostBySlug } from "@/app/blog/api";
import { Container } from "@/components/container";
import { MdxLayout } from "@/components/mdx-layout";
import { meta } from "@/lib/meta";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "../api";

type Params = {
	params: Promise<{
		slug: string;
	}>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
	const params = await props.params;
	const post = posts.find(({ slug }) => slug === params.slug);

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
			images: [post.coverImage ?? ""],
		},
	};
}

export async function generateStaticParams() {
	return posts.map((post) => ({
		slug: post.slug,
	}));
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const { default: Post } = await import(`@/content/${slug}.mdx`);

	if (!slug) {
		return notFound();
	}

	return (
		<article className="py-16">
			<Container>
				<MdxLayout>
					<Post />
				</MdxLayout>

				<footer className="mt-8">
					<h3 className="mb-2 text-lg font-semibold">Tags</h3>
					<div className="flex flex-wrap gap-2">
						{/* {post.tags.map((tag) => (
							<Badge key={tag} variant="secondary">
								<Link href={`/category/${tag.toLowerCase().replace(" ", "-")}`}>
									{tag}
								</Link>
							</Badge>
						))} */}
					</div>
				</footer>
			</Container>
		</article>
	);
}
