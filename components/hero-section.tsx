import { Button } from "@/components/ui/button";
import type { router } from "@/lib/api/router";
import type { InferRouterOutputs } from "@orpc/server";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./container";

export default function HeroSection({
	object,
}: {
	object: Partial<InferRouterOutputs<typeof router.met.getFeaturedArtwork>>;
}) {
	return (
		<section className="relative w-full h-[80vh] min-h-[600px]  flex items-center">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				{object?.primaryImage ? (
					<Image
						src={object.primaryImage}
						alt={object.title || "Featured artwork"}
						fill
						className="object-cover"
						priority
						sizes="100vw"
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-700" />
				)}
				{/* Overlay */}
				{/* Gradient overlay that blends to the background */}
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						background:
							"linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 60%, rgba(30,41,59,1) 100%)",
						mixBlendMode: "multiply",
					}}
				/>
			</div>

			{/* Content */}
			<Container className="relative mb-auto z-10 pt-16 flex flex-col justify-center h-[80vh]">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
					<div className="text-white space-y-6">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight">
							Discover Art Masterpieces
						</h1>
						<p className="text-lg md:text-xl text-white/90 max-w-lg">
							Explore the Metropolitan Museum of Art's vast collection of
							artwork, artifacts, and historical objects from around the world.
						</p>
						<div className="flex flex-wrap gap-4">
							<Link passHref href="/search" prefetch>
								<Button
									size="lg"
									className="bg-background hover:bg-background/80 text-foreground hover:text-foreground"
								>
									Explore Collection
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
							{/* <Link passHref href="/departments">
								<Button className="bg-transparent" variant="outline" size="lg">
									Browse Departments
								</Button>
							</Link> */}
						</div>
					</div>

					{/* <div className="hidden lg:block bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-white/10">
						<div className="space-y-4">
							<h2 className="text-2xl font-medium text-white">
								{object?.title || "Untitled"}
							</h2>
							{object?.artistDisplayName && (
								<p className="text-white/80">
									By{" "}
									<span className="font-medium">
										{object.artistDisplayName}
									</span>
									{object.objectDate && `, ${object?.objectDate}`}
								</p>
							)}
							{object?.department && (
								<p className="text-white/70">{object.department}</p>
							)}
							<Button asChild variant="link" className="text-white p-0 h-auto">
								<Link href={`/object/${object?.objectID}`}>
									View Details
									<ArrowRight className="ml-1 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</div> */}
				</div>

				{/* Attribution */}
				<div className="absolute bottom-4 right-4 z-10">
					<Link
						href={`/object/${object?.objectID}`}
						className="text-xs text-white/70 hover:text-white bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm"
					>
						{object?.title}{" "}
						{object?.artistDisplayName ? `by ${object?.artistDisplayName}` : ""}
					</Link>
				</div>
			</Container>
		</section>
	);
}
