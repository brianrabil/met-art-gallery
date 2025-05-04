import { getAllPosts } from "@/app/blog/api";
import { HeroPost, Intro, MoreStories } from "@/components/blog-post";
import { Container } from "@/components/container";

export default function Index() {
	const allPosts = getAllPosts();
	const heroPost = allPosts[0];
	const morePosts = allPosts.slice(1);

	return (
		<>
			<Container>
				<Intro />
				<HeroPost
					title={heroPost.title}
					coverImage={heroPost.coverImage}
					date={heroPost.date}
					author={heroPost.author}
					slug={heroPost.slug}
					excerpt={heroPost.excerpt}
				/>
				{morePosts.length > 0 && <MoreStories posts={morePosts} />}
			</Container>
		</>
	);
}
