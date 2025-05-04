import type { PricingTier } from "@/components/pricing-section";

/**
 * Central site configuration
 * import { meta } from "@/lib/meta";
 */
export const meta = {
	// ──────────────────────────────────────────────────────────────
	// Brand & Global
	// ──────────────────────────────────────────────────────────────
	siteName: "Meet the Met",
	tagline: "Turn Any Wall Into a Gallery—In Seconds",
	avatar:
		"https://pbs.twimg.com/profile_images/1902563105386983424/vwXM3kdv_400x400.jpg",
	seo: {
		title: "ArtSync.ai — AI-Curated Wall Art in One Click",
		description:
			"Photograph your room and preview perfectly-sized Met masterpieces on your wall. Print, frame, and ship in days.",
		defaultOgImage: "/og-image.png",
		keywords:
			"art, interior design, augmented reality, AI, Metropolitan Museum of Art, wall art prints",
	},

	// Navigation (header & footer)
	navItems: {
		left: [{ name: "Shop", href: "/search" }],
		right: [{ name: "Magazine", href: "/blog" }],
	},
	footerNav: {
		company: [
			{ name: "About", href: "/about" },
			{ name: "Contact", href: "/contact" },
		],
		support: [{ name: "Help Center", href: "/help-center" }],
		legal: [
			{ name: "Terms of Service", href: "/terms" },
			// { name: "Refunds", href: "/refunds" },
			{ name: "Privacy Policy", href: "/privacy" },
			{ name: "Cookie Policy", href: "/cookies" },
			{ name: "Accessibility", href: "/accessibility" },
		],
	},

	// Contact & Company
	contact: {
		companyName: "ArtSync Labs LLC",
		email: "support@metartgallery.com",
		primaryPhone: "+1 571-438-7776",
		addressLine1: "1401 Elm St.",
		city: "Dallas",
		state: "TX",
		zipcode: "75202",
		country: "United States",
		get fullAddress() {
			return `${this.addressLine1}, ${this.city}, ${this.state} ${this.zipcode}, ${this.country}`;
		},
		get legalEmail() {
			return `legal@${this.email.split("@")[1]}`;
		},
		get dmcaEmail() {
			return `dmca@${this.email.split("@")[1]}`;
		},
	},

	// Social links (display only the ones you populate)
	social: {
		twitter: "https://twitter.com/artsync_ai",
		instagram: "https://instagram.com/artsync.ai",
		tiktok: "",
		linkedin: "https://linkedin.com/company/artsync",
		github: "https://github.com/artsynclabs",
	},

	// Pricing tiers (used in /pricing + Stripe checkout)
	pricing: {
		tiers: [
			{
				name: "Free",
				price: { monthly: "$0", yearly: "$0" },
				description: "3 daily matches, 720 p previews, watermarked collage",
				features: ["3 daily matches", "720 p previews", "Watermarked collage"],
				cta: "Try Free",
				// stripePriceIdMonthly: null,
				// stripePriceIdYearly: null,
			},
			{
				name: "Pro",
				price: { monthly: "$9", yearly: "$90" },
				description:
					"Unlimited matches, 4 K previews, CSV export, no watermarks",
				features: [
					"Unlimited matches",
					"4 K previews",
					"CSV export",
					"No watermarks",
				],
				cta: "Upgrade",
				popular: true,
				// stripePriceIdMonthly: "price_pro_monthly_123",
				// stripePriceIdYearly: "price_pro_yearly_123",
			},
			{
				name: "Print Orders",
				price: { once: "From $45" },
				description: "Framed prints fulfilled by Printful",
				features: [
					"Unlimited matches",
					"4 K previews",
					"CSV export",
					"No watermarks",
				],
				cta: "Shop Prints",
				highlighted: true,
				// stripePriceIdOnce: null, // set per-order dynamically
			},
		] satisfies Array<PricingTier>,
	},

	// FAQs (render on /faq or accordion component)
	faqs: [
		{
			id: 1,
			question: "How does ArtSync function to match art with my space?",
			answer:
				"ArtSync employs artificial intelligence to analyze a room’s color palette and dimensions from an uploaded photo, recommending artworks from The Metropolitan Museum of Art’s public-domain collection. Users can preview selections in augmented reality, choose frames, and order prints for delivery.",
		},
		{
			id: 2,
			question: "What are the pricing options for ArtSync’s services?",
			answer:
				"ArtSync offers a free plan with three daily art matches and 720 p previews. The Pro plan, at $9 per month, provides unlimited matches, 4 K previews, CSV export, and watermark removal. Framed print orders start at $45.",
		},
		{
			id: 3,
			question: "Is ArtSync accessible on mobile devices?",
			answer:
				"Yes. ArtSync works in modern mobile browsers, enabling users to upload photos and receive AI-curated art recommendations without installing an app.",
		},
		{
			id: 4,
			question: "Are ArtSync’s artworks legally usable?",
			answer:
				"All artworks shown in ArtSync come from The Met’s public-domain collection (CC0), permitting free use and distribution.",
		},
		{
			id: 5,
			question: "How long is the delivery time for ArtSync print orders?",
			answer:
				"Print-on-demand partners typically ship within a few days. Delivery usually takes one to two weeks, depending on the recipient’s location.",
		},
		{
			id: 6,
			question: "What is ArtSync’s policy for damaged print orders?",
			answer:
				"ArtSync guarantees a free reprint or refund within 30 days for any print that arrives damaged—no questions asked.",
		},
		{
			id: 7,
			question: "Does ArtSync support specific art styles or artists?",
			answer:
				"Yes. ArtSync offers a diverse array of artworks from The Met, spanning many styles and artists, with AI matching tailored to complement a room’s aesthetic.",
		},
		{
			id: 8,
			question: "How does ArtSync ensure art matches my room’s colors?",
			answer:
				"ArtSync’s AI performs advanced color analysis, using a ΔE ≤ 25 threshold to align artwork palettes with a room’s dominant colors.",
		},
		{
			id: 9,
			question: "Are uploaded photos secure on ArtSync?",
			answer:
				"ArtSync removes all EXIF data and deletes uploaded photos after 24 hours, complying with CCPA and GDPR regulations.",
		},
		{
			id: 10,
			question: "Can ArtSync be used for commercial purposes?",
			answer:
				"Because the artworks are public domain, they may be used commercially. Commercial use of the ArtSync platform itself requires a separate agreement.",
		},
	],

	// Feature flags / experimental toggles
	flags: {},
};
