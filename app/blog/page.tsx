import { HeroPost, Intro, MoreStories } from "@/components/blog-post";
import { Container } from "@/components/container";

const posts = [
	{
		slug: "top-10-impressionist-paintings-met-modern-home",
		title: "Top 10 Impressionist Paintings from The Met for Modern Home",
		date: "2025-05-02T00:00:00.000Z",
		coverImage:
			"https://images.metmuseum.org/CRDImages/ep/web-large/DT1854.jpg",
		author: {
			name: "Editorial Board",
			picture: "/avatar.png",
		},
		excerpt:
			"Discover ten timeless Impressionist masterpieces—each in the public domain—perfectly suited for contemporary interiors, complete with hi-res images ready for PaletteMatch AR previews, fine-art prints, or digital décor.",
		categories: ["Art", "Impressionism"],
		photoCredit:
			"Image courtesy of The Metropolitan Museum of Art (Open Access)",
		ogImage: {
			url: "https://images.metmuseum.org/CRDImages/ep/web-large/DT1854.jpg",
		},
		content: "",
		preview: false,
	},
	{
		slug: "how-to-style-van-gogh-bedroom",
		title: "How to Style Your Bedroom Like Van Gogh’s Masterpiece",
		date: "2025-06-15T00:00:00.000Z",
		coverImage: "https://images.metmuseum.org/CRDImages/ep/original/DT1567.jpg",
		author: {
			name: "Samantha Lee",
			picture: "/avatar2.png",
		},
		excerpt:
			"Transform your personal space with color, texture, and arrangement tips inspired by Van Gogh’s iconic 'Bedroom in Arles.' Explore public domain art, palette ideas, and modern décor pairings for a restful, artful retreat.",
		categories: ["Art", "Home Decor", "Van Gogh"],
		photoCredit: "Image courtesy of The Metropolitan Museum of Art",
		ogImage: {
			url: "https://images.metmuseum.org/CRDImages/ep/original/DT1567.jpg",
		},
		content: "",
		preview: false,
	},
	{
		slug: "choose-the-perfect-frame-style",
		title: "Choose the Perfect Frame: 6 Styles That Elevate Met Prints",
		date: "2025-05-06T00:00:00.000Z",
		coverImage:
			"https://images.metmuseum.org/CRDImages/ep/original/DP145918.jpg",
		author: {
			name: "Editorial Board",
			picture: "/avatar.png",
		},
		excerpt:
			"From minimalist float mounts to ornate gold leaf mouldings, discover how six classic frame styles transform Metropolitan Museum of Art prints into gallery-worthy statement pieces.",
		categories: ["Art", "Framing"],
		photoCredit: "The Metropolitan Museum of Art, Open Access",
		ogImage: {
			url: "https://images.metmuseum.org/CRDImages/ep/original/DP145918.jpg",
		},
		content:
			"# Framing Matters: Six Styles, Endless Impact\n\nA well-chosen frame doesn’t just protect your print—it finishes the story the artwork is trying to tell. Below are six timeless frame profiles, complete with pro tips on where each shines best and how to preview them in **PaletteMatch AR**.\n\n## 1. Thin Maple Float\n\nLight, Scandinavian, and barely-there—perfect for airy interiors and pastel color schemes.\n\n## 2. Satin-Black Box\n\nCreates a crisp boundary that makes high-chroma Impressionist hues pop against white walls.\n\n## 3. Antique Gold Leaf\n\nThe go-to for classical dramas like Sargent or Degas; pairs beautifully with rich jewel-tone paint.\n\n## 4. Brushed Aluminum\n\nIndustrial edge that echoes loft hardware and concrete backdrops while remaining neutral.\n\n## 5. White Gallery Wrap\n\nDisappears into white walls, letting bold compositions (think Van Gogh) steal every glance.\n\n## 6. Walnut Scoop\n\nWarm, mid-century appeal—ideal for spaces with teak furniture or terracotta accents.\n\n### Test in Your Space\n\n*Open **PaletteMatch AR**, tap **Frame Preview**, and cycle through the six presets above to see instant side-by-side mock-ups.*\n\n---\n\n*Images © The Metropolitan Museum of Art (OA). Frame renders generated with PaletteMatch AR.*",
	},
	{
		slug: "van-gogh-color-palettes-contemporary-interiors",
		title: "Van Gogh Color Palettes for Contemporary Interiors",
		date: "2025-05-06T00:00:00.000Z",
		coverImage:
			"https://images.metmuseum.org/CRDImages/ep/original/DP229743.jpg",
		author: {
			name: "Editorial Board",
			picture: "/avatar.png",
		},
		excerpt:
			"Translate five iconic Van Gogh paintings from The Met into ready-to-use interior color palettes—complete with HEX codes and styling tips for walls, textiles, and accent décor.",
		categories: ["Art", "Color Theory"],
		photoCredit: "The Metropolitan Museum of Art, Open Access",
		ogImage: {
			url: "https://images.metmuseum.org/CRDImages/ep/original/DP229743.jpg",
		},
		content:
			"# Van Gogh Hues: Paint-Box to Paint-Roller\n\nVincent Van Gogh’s saturated strokes are more than art history—they’re an interior designer’s cheat-sheet. Here are five Met masterpieces distilled into modern palettes you can copy-paste into any project.\n\n## 1. *Jalais Hill, Pontoise* (1867)\n\n- **Olive Field** `#6A7B4E`\n- **Cloud Mist** `#D9DCCD`\n- **Stone Path** `#8E826B`\n\n### Use It ▶  Earthy kitchens, linen upholstery, rattan décor.\n\n## 2. *Wheat Field with Cypresses* (1889)\n\n- **Cobalt Sky** `#3E6FB8`\n- **Golden Wheat** `#E2BD55`\n- **Cypress Green** `#2E5A4F`\n\n### Use It ▶  Statement bedroom wall + brass lighting fixtures.\n\n## 3. *Olive Trees* (1889)\n\n- **Sage Leaf** `#9AA872`\n- **Sunlit Earth** `#C49A6C`\n- **Twilight Violet** `#574B66`\n\n### Use It ▶  Outdoor fabrics, terrazzo floor chips.\n\n## 4. *Irises* (1890)\n\n- **Petal Blue** `#305BA8`\n- **Stem Green** `#4E7C57`\n- **Brown Soil** `#8D6B4E`\n\n### Use It ▶  Bathroom tile accents, entry-hall runner.\n\n## 5. *Self-Portrait with Straw Hat* (1887)\n\n- **Straw Hat** `#E0C36E`\n- **Teal Jacket** `#356B6C`\n- **Coral Background** `#D8846B`\n\n### Use It ▶  Home office accent wall, throw pillows.\n\n---\n\n**PaletteMatch Tip** — Upload a photo of your room and let the app suggest which of Van Gogh’s palettes matches best (ΔE ≤ 10 for key surfaces).\n\n*All artwork images © The Metropolitan Museum of Art (Open Access).*",
	},
];

export default function Index() {
	const allPosts = posts;
	const heroPost = allPosts[allPosts.length - 1];
	const morePosts = allPosts.slice(0, allPosts.length - 1);

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
