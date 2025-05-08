import { Container } from "@/components/container";
import { meta } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const EXAMPLE_PATH = "blog";
export const CMS_NAME = "Markdown";
export const HOME_OG_IMAGE_URL =
	"https://og-image.vercel.app/Next.js%20Blog%20Starter%20Example.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg";

export type Author = {
	name: string;
	picture: string;
};

export type Post = {
	slug: string;
	title: string;
	date: string;
	coverImage?: string;
	author?: Author;
	excerpt?: string;
	tags: string[];
	categories?: string[];
	photoCredit?: string;
	ogImage: {
		url: string;
	};
	content?: string;
	preview?: boolean;
};

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// CoverImage
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

const CoverImage = ({
	title,
	src,
	slug,
}: {
	title?: string;
	src?: string;
	slug?: string;
}) => {
	const image = (
		<Image
			src={src ?? "/placeholder.png"}
			alt={`Cover Image for ${title}`}
			className={cn("shadow-sm w-full object-cover", {
				"hover:shadow-lg transition-shadow duration-200": slug,
			})}
			width={1300}
			height={630}
		/>
	);
	return (
		<div className="sm:mx-0">
			{slug ? (
				<Link href={`/blog/${slug}`} aria-label={title}>
					{image}
				</Link>
			) : (
				image
			)}
		</div>
	);
};

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// PostPreview
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export function PostPreview({
	title,
	coverImage,
	date,
	excerpt,
	author,
	slug,
}: {
	title?: string;
	coverImage?: string;
	date?: string;
	excerpt?: string;
	author?: Author;
	slug?: string;
}) {
	return (
		<div>
			<div className="mb-5">
				<CoverImage slug={slug} title={title} src={coverImage} />
			</div>
			<h3 className="text-3xl font-semibold mb-3 font-serif leading-snug">
				<Link href={`/blog/${slug}`} className="hover:underline">
					{title}
				</Link>
			</h3>
			{!!date && (
				<div className="text-base mb-4">
					<DateFormatter dateString={date} />
				</div>
			)}
			<p className="text-lg leading-relaxed mb-4">{excerpt}</p>
			<div className="flex items-center gap-2">
				{author && (
					<>
						<Avatar>
							<AvatarImage src={author.picture} alt={author.name} />
							<AvatarFallback>
								{author.name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.slice(0, 2)
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>

						<div className="text-lg font-bold">{author.name}</div>
					</>
				)}
			</div>
		</div>
	);
}

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// DateFormatter
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

const DateFormatter = ({
	dateString,
}: {
	dateString: string;
}) => {
	const date = parseISO(dateString);
	return <time dateTime={dateString}>{format(date, "LLLL	d, yyyy")}</time>;
};

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Alert
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export const Alert = ({
	preview,
}: {
	preview?: boolean;
}) => {
	return (
		<div
			className={cn("border-b dark:bg-slate-800", {
				"bg-neutral-800 border-neutral-800 text-white": preview,
				"bg-neutral-50 border-neutral-200": !preview,
			})}
		>
			<Container>
				<div className="py-2 text-center text-sm">
					{preview ? (
						<>
							This page is a preview.{" "}
							<a
								href="/api/exit-preview"
								className="underline hover:text-teal-300 duration-200 transition-colors"
							>
								Click here
							</a>{" "}
							to exit preview mode.
						</>
					) : (
						<>
							The source code for this blog is{" "}
							<a
								href={`https://github.com/vercel/next.js/tree/canary/examples/${EXAMPLE_PATH}`}
								className="underline hover:text-blue-600 duration-200 transition-colors"
							>
								available on GitHub
							</a>
							.
						</>
					)}
				</div>
			</Container>
		</div>
	);
};

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// PostTitle
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export function PostTitle({
	children,
}: {
	children?: ReactNode;
}) {
	return (
		<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
			{children}
		</h1>
	);
}

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// MoreStories
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export function MoreStories({
	posts,
}: {
	posts: Post[];
}) {
	return (
		<section>
			<h2 className="mb-8 text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
				More Stories
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
				{posts.map((post) => (
					<PostPreview
						key={post.slug}
						title={post.title}
						coverImage={post.coverImage}
						date={post.date}
						author={post.author}
						slug={post.slug}
						excerpt={post.excerpt}
					/>
				))}
			</div>
		</section>
	);
}

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// PostBody
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export function PostBody({
	content,
}: {
	content: string;
}) {
	return (
		<div className="max-w-2xl mx-auto">
			<div
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</div>
	);
}

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// PostHeader
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export function PostHeader({
	title,
	coverImage,
	date,
	author,
}: {
	title: string;
	coverImage: string;
	date: string;
	author: Author;
}) {
	return (
		<>
			<PostTitle>{title}</PostTitle>
			<div className="hidden md:block md:mb-12">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src={author.picture} alt={author.name} />
						<AvatarFallback>
							{author.name
								.split(" ")
								.map((n) => n[0])
								.join("")
								.slice(0, 2)
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="text-lg font-bold">{author.name}</div>
				</div>
			</div>
			<div className="mb-8 md:mb-16 sm:mx-0">
				<CoverImage title={title} src={coverImage} />
			</div>
			<div className="max-w-2xl mx-auto">
				<div className="block md:hidden mb-6">
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage src={author.picture} alt={author.name} />
							<AvatarFallback>
								{author.name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.slice(0, 2)
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="text-lg font-bold">{author.name}</div>
					</div>
				</div>
				<div className="mb-6 text-lg">
					<DateFormatter dateString={date} />
				</div>
			</div>
		</>
	);
}

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// HeroPost
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export function HeroPost({
	title,
	coverImage,
	date,
	excerpt,
	author,
	slug,
}: {
	title?: string;
	coverImage?: string;
	date?: string;
	excerpt?: string;
	author?: Author;
	slug?: string;
}) {
	if (!slug) return null;
	return (
		<section>
			<div className="mb-8 md:mb-16">
				<CoverImage title={title} src={coverImage} slug={slug} />
			</div>
			<div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
				<div>
					<h3 className="mb-4 text-4xl lg:text-5xl leading-tight">
						<Link
							href={`/blog/${slug}`}
							className="hover:underline font-serif text-foreground"
						>
							{title}
						</Link>
					</h3>
					{!!date && (
						<div className="mb-4 md:mb-0 text-base">
							<DateFormatter dateString={date} />
						</div>
					)}
				</div>
				<div>
					<p className="text-lg leading-relaxed mb-4">{excerpt}</p>
					{!!author && (
						<div className="flex items-center gap-2">
							<Avatar>
								<AvatarImage src={author.picture} alt={author.name} />
								<AvatarFallback>
									{author.name
										.split(" ")
										.map((n) => n[0])
										.join("")
										.slice(0, 2)
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="text-lg font-bold">{author.name}</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Intro
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export function Intro() {
	return (
		<section className="flex-col pt-8 md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
			<h1 className="text-5xl md:text-8xl italic font-serif tracking-tighter leading-tight md:pr-8">
				Blog
			</h1>
			<h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
				Ideas, case studies, and behind-the-scenes looks at how {meta.siteName}{" "}
				fuses AI, design, and museum-grade art.
			</h4>
		</section>
	);
}
