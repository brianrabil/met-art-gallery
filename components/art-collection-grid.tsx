"use client";

import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { getObjectById, getObjectsByDepartment } from "@/lib/api";
import type { ArtObject } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { type JSX, useEffect, useState } from "react";

type Card = {
	id: number;
	content: JSX.Element | React.ReactNode | string;
	className: string;
	thumbnail: string;
	objectData: ArtObject;
};

export default function ArtCollectionGrid() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const departmentId = searchParams.get("department");
	const page = Number.parseInt(searchParams.get("page") || "1");

	const [cards, setCards] = useState<Card[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(1);
	const [selected, setSelected] = useState<Card | null>(null);
	const [lastSelected, setLastSelected] = useState<Card | null>(null);

	const itemsPerPage = 9;

	useEffect(() => {
		async function fetchObjects() {
			setLoading(true);
			try {
				const result = await getObjectsByDepartment(
					departmentId ? Number.parseInt(departmentId) : undefined,
				);

				const total = Math.ceil(result.total / itemsPerPage);
				setTotalPages(total > 0 ? total : 1);

				const startIndex = (page - 1) * itemsPerPage;
				const endIndex = startIndex + itemsPerPage;
				const pageObjectIds = result.objectIDs.slice(startIndex, endIndex);

				const objectsData = await Promise.all(
					pageObjectIds.map(async (id) => {
						const object = await getObjectById(id);
						return object;
					}),
				);

				// Filter out objects without images and create cards
				const newCards = objectsData
					.filter(
						(object): object is ArtObject =>
							!!object && !!object.primaryImageSmall,
					)
					.map((object) => ({
						id: object.objectID,
						thumbnail: object.primaryImageSmall,
						className: getRandomCardClass(),
						content: (
							<div className="text-white">
								<h3 className="text-xl font-medium mb-1">
									{object.title || "Untitled"}
								</h3>
								{object.artistDisplayName && (
									<p className="text-sm text-white/80 mb-3">
										{object.artistDisplayName}
									</p>
								)}
								<Button
									variant="outline"
									size="sm"
									className="border-white text-white hover:bg-white/20"
									onClick={(e) => {
										e.stopPropagation();
										router.push(`/object/${object.objectID}`);
									}}
								>
									View Details
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</div>
						),
						objectData: object,
					}));

				setCards(newCards);
			} catch (error) {
				console.error("Error fetching objects:", error);
				setCards([]);
			} finally {
				setLoading(false);
			}
		}

		fetchObjects();
	}, [departmentId, page, router]);

	const handleClick = (card: Card) => {
		setLastSelected(selected);
		setSelected(card);
	};

	const handleOutsideClick = () => {
		setLastSelected(selected);
		setSelected(null);
	};

	if (loading) {
		return <LoadingGrid />;
	}

	if (cards.length === 0) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-semibold">No objects found</h2>
				<p className="text-muted-foreground mt-2">
					Try selecting a different department or browsing the collection
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="w-full h-full grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
				{cards.map((card, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className={cn(card.className, "aspect-[3/4] md:aspect-square")}
					>
						<motion.div
							onClick={() => handleClick(card)}
							className={cn(
								card.className,
								"relative overflow-hidden cursor-pointer",
								selected?.id === card.id
									? "rounded-lg absolute inset-0 h-3/4 w-full md:w-3/4 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
									: lastSelected?.id === card.id
										? "z-40 bg-white rounded-xl h-full w-full"
										: "bg-white rounded-xl h-full w-full",
							)}
							layoutId={`card-${card.id}`}
						>
							{selected?.id === card.id && <SelectedCard selected={selected} />}
							<ImageComponent card={card} />
						</motion.div>
					</div>
				))}
				<motion.div
					onClick={handleOutsideClick}
					className={cn(
						"fixed inset-0 bg-black opacity-0 z-10",
						selected?.id ? "pointer-events-auto" : "pointer-events-none",
					)}
					animate={{ opacity: selected?.id ? 0.7 : 0 }}
				/>
			</div>

			<Pagination currentPage={page} totalPages={totalPages} />
		</div>
	);
}

const ImageComponent = ({ card }: { card: Card }) => {
	return (
		<motion.img
			layoutId={`image-${card.id}-image`}
			src={card.thumbnail}
			height="500"
			width="500"
			className={cn(
				"object-cover object-center absolute inset-0 h-full w-full transition duration-200",
			)}
			alt={card.objectData.title || "Artwork"}
		/>
	);
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
	return (
		<div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
			<motion.div
				initial={{
					opacity: 0,
				}}
				animate={{
					opacity: 0.6,
				}}
				className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
			/>
			<motion.div
				layoutId={`content-${selected?.id}`}
				initial={{
					opacity: 0,
					y: 100,
				}}
				animate={{
					opacity: 1,
					y: 0,
				}}
				exit={{
					opacity: 0,
					y: 100,
				}}
				transition={{
					duration: 0.3,
					ease: "easeInOut",
				}}
				className="relative px-8 pb-4 z-[70]"
			>
				{selected?.content}
			</motion.div>
		</div>
	);
};

function getRandomCardClass() {
	// This function returns a random height class for visual variety
	const heights = ["row-span-1", "row-span-1", "row-span-1", "row-span-2"];
	return heights[Math.floor(Math.random() * heights.length)];
}

function LoadingGrid() {
	return (
		<div className="w-full h-full grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4">
			{Array(9)
				.fill(0)
				.map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className="aspect-square bg-muted animate-pulse rounded-xl"
					/>
				))}
		</div>
	);
}
