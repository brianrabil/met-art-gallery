import {
	HeroPost,
	Intro,
	MoreStories,
	type Post,
} from "@/components/blog-post";
import { Container } from "@/components/container";
import { posts } from "./api";

export default function Index() {
	const allPosts = posts;
	const heroPost = allPosts[allPosts.length - 1];
	const morePosts = allPosts.slice(0, allPosts.length - 1);

	if (!heroPost) {
		throw new Error("Could not find hero post");
	}

	return (
		<>
			<Container>
				<Intro />
				<HeroPost
					title={heroPost.title}
					coverImage={heroPost.coverImage}
					date={heroPost.date}
					author={heroPost.author}
					slug={heroPost.slug as string}
					excerpt={heroPost.excerpt}
				/>
				{morePosts.length > 0 && <MoreStories posts={morePosts} />}
			</Container>
		</>
	);
}
