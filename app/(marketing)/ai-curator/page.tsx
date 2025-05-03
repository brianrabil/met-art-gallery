import { Container } from "@/components/container";
import { FAQSection } from "@/components/faq-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { PricingSection } from "@/components/pricing-section";
import { Button } from "@/components/ui/button";
import {
	CheckIcon,
	PlayIcon,
	ShieldCheckIcon,
	StarIcon,
	TruckIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
	return (
		<div className="font-sans antialiased text-foreground bg-background">
			{/* Hero */}
			<section className="relative isolate overflow-hidden bg-gradient-to-br from-background via-background to-muted">
				<Container className="z-20 py-24 lg:gap-8 lg:flex lg:flex-row lg:items-center ">
					<div className="flex flex-col justify-center lg:items-start lg:w-1/2">
						<div className="xs:mx-auto w-auto flex items-center justify-center gap-2 p-2 mt-10">
							<div className="flex -space-x-2">
								<img
									className="rounded-full ring-1 ring-background"
									src="https://originui.com/avatar-80-03.jpg"
									width={28}
									height={28}
									alt="Avatar 01"
								/>
								<img
									className="rounded-full ring-1 ring-background"
									src="https://originui.com/avatar-80-04.jpg"
									width={28}
									height={28}
									alt="Avatar 02"
								/>
								<img
									className="rounded-full ring-1 ring-background"
									src="https://originui.com/avatar-80-05.jpg"
									width={28}
									height={28}
									alt="Avatar 03"
								/>
								<img
									className="rounded-full ring-1 ring-background"
									src="https://originui.com/avatar-80-06.jpg"
									width={28}
									height={28}
									alt="Avatar 04"
								/>
							</div>
							<p className="ml-0 text-base font-medium text-muted-foreground">
								Join 1,000+ happy decorators
							</p>
						</div>
						<h1 className="mt-4 text-5xl font-serif font-extrabold tracking-tight text-foreground leading-tight sm:text-6xl text-center lg:text-left">
							{/* {meta.siteName} */}
							Snap One Photo. Get Curated Art That Fits.
						</h1>
						<p className="mt-6 text-xl font-semibold text-primary leading-snug text-center lg:text-left">
							Museum-quality pieces, matched to your wall—in seconds.
						</p>
						<p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl text-center lg:text-left">
							Snap one photo. Our vision model reads your wall’s palette, scale,
							and style, then curates museum-quality pieces that work in your
							space. Instantly preview, order prints with easy-assemble frames,
							and unlock digital downloads and an Apple Wallet NFT card.
						</p>
						<div className="mt-8 flex justify-center gap-4 lg:justify-start">
							<Link href="#get-started" passHref>
								<Button
									size="lg"
									className="text-base sm:text-lg py-4 font-medium"
								>
									Start Decorating
								</Button>
							</Link>
							<Link passHref href="#video">
								<Button
									size="lg"
									variant="secondary"
									className="text-base sm:text-lg py-4 font-medium"
								>
									<PlayIcon />
									Watch Demo
								</Button>
							</Link>
						</div>

						<div className="mt-10">
							<ul className="text-xs text-muted-foreground pl-0 justify-center lg:flex-col flex flex-wrap gap-4 mx-auto lg:mx-0">
								<li className="flex items-center gap-2 text-sm">
									<TruckIcon
										className="size-5 text-[#6366F1]"
										aria-label="Worldwide Shipping"
									/>
									<span className="font-medium">
										Fast, Secure Shipping Worldwide
									</span>
								</li>
								<li className="flex items-center gap-2 text-sm">
									<StarIcon
										className="size-5 text-[#00B67A]"
										aria-label="Trustpilot"
									/>
									<span className="font-medium">4.9/5 Trustpilot Score</span>
								</li>
								<li className="flex items-center gap-2 text-sm">
									<ShieldCheckIcon
										className="size-5 text-primary"
										aria-label="Secure Checkout"
									/>
									<span className="font-medium">Secure Stripe Checkout</span>
								</li>
							</ul>
						</div>
					</div>
					{/* Placeholder mockup image */}
					<div className="relative mt-10 w-full lg:mt-0 lg:w-1/2">
						<Image
							src="/hero-2.png"
							alt="Room with art overlay"
							width={800}
							height={600}
							className="rounded-xl shadow-xl ring-1 ring-border"
						/>
					</div>
				</Container>
			</section>
			<section className="py-24 bg-background" id="why">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<h2 className="text-3xl font-bold tracking-tight text-foreground text-center">
						Why PaletteMatch Beats Browsing
					</h2>
					<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
						<div className="space-y-6">
							<div className="flex items-start gap-4">
								<CheckIcon className="h-6 w-6 text-primary" />
								<p className="text-lg text-foreground">
									3 AI‑matched pieces in &lt; 10 sec
								</p>
							</div>
							<div className="flex items-start gap-4">
								<CheckIcon className="h-6 w-6 text-primary" />
								<p className="text-lg text-foreground">
									Auto‑scaled to 70% of wall width, color ΔE ≤ 25
								</p>
							</div>
							<div className="flex items-start gap-4">
								<CheckIcon className="h-6 w-6 text-primary" />
								<p className="text-lg text-foreground">
									Live AR preview in any browser
								</p>
							</div>
							<div className="flex items-start gap-4">
								<CheckIcon className="h-6 w-6 text-primary" />
								<p className="text-lg text-foreground">
									Print‑on‑demand, ships in days
								</p>
							</div>
							<div className="flex items-start gap-4">
								<CheckIcon className="h-6 w-6 text-primary" />
								<p className="text-lg text-foreground">
									Public‑domain works—no legal grey zones
								</p>
							</div>
						</div>
						<div className="rounded-lg border border-dashed border-border p-8 text-center italic text-muted-foreground">
							"Scrolling endless catalogs, Photoshop mock‑ups, and framing store
							trips? That was yesterday."
						</div>
					</div>
				</div>
			</section>
			<section className="py-24 bg-muted" id="how">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<h2 className="text-3xl font-bold tracking-tight text-foreground text-center mb-16">
						How It Works
					</h2>
					<ol className="relative border-l border-border max-w-3xl mx-auto space-y-12">
						{[
							{
								title: "Shoot",
								body: "Hold an A4/US-Letter sheet on your wall, snap a photo, upload.",
							},
							{
								title: "Curate",
								body: "AI analyzes color, composition & scale, then pulls ideal works from 500 k public-domain Met images.",
							},
							{
								title: "Preview",
								body: "Drag-to-place mock-ups or switch to WebXR for a true-size view.",
							},
							{
								title: "Own",
								body: "One-click checkout—Stripe for payment, Printful for giclée print & flat-pack frame.",
							},
							{
								title: "Enjoy Everywhere",
								body: "Download desktop/phone/iPad wallpapers, social-media banners, plus an Apple Wallet NFT card.",
							},
						].map((step, idx) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<li key={idx} className="ml-6">
								<span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
									{idx + 1}
								</span>
								<h3 className="text-xl font-semibold text-foreground">
									{step.title}
								</h3>
								<p className="mt-1 text-muted-foreground">{step.body}</p>
							</li>
						))}
					</ol>
				</div>
			</section>
			<PricingSection />
			<section className="py-24 bg-muted" id="testimonials">
				<div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
					<h2 className="text-3xl font-bold tracking-tight text-foreground">
						Designers &amp; Resellers ❤️ PaletteMatch
					</h2>
					<div className="mt-12 grid gap-8 md:grid-cols-2">
						<div className="rounded-lg bg-background p-8 shadow-sm border border-border">
							<p className="text-lg text-muted-foreground">
								“I mocked up a client’s living room in five minutes and closed a
								$1,200 print package the same day.”
							</p>
							<p className="mt-4 font-semibold text-foreground">
								— Ava R., Interior Stylist
							</p>
						</div>
						<div className="rounded-lg bg-background p-8 shadow-sm border border-border">
							<p className="text-lg text-muted-foreground">
								“Bulk CSV upload plus the colour‑match API let me list 50 framed
								prints on Etsy by Monday.”
							</p>
							<p className="mt-4 font-semibold text-foreground">
								— Jorge M., Print Seller
							</p>
						</div>
					</div>
				</div>
			</section>
			<FAQSection />
			<NewsletterSection />
			<section className="py-24 bg-primary" id="get-started">
				<Container className="py-24 sm:py-32">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-balance text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl">
							Ready to See Your Walls Differently?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-indigo-200">
							Transform your space in minutes—no guesswork, no hassle. Upload a
							photo, get perfectly matched art, and preview your new look
							instantly. Discover how easy it is to create a gallery wall that’s
							uniquely yours.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Link
								href="/signup"
								className="mt-8 inline-block rounded-lg bg-background px-8 py-4 text-lg font-semibold text-primary shadow-lg hover:shadow-xl transition-colors hover:bg-muted"
							>
								Upload a Room Photo
							</Link>
							{/* <a href="#" className="text-sm/6 font-semibold text-white">
									Learn more <span aria-hidden="true">→</span>
								</a> */}
						</div>
					</div>
				</Container>
			</section>
		</div>
	);
}
