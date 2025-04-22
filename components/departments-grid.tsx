"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDetailedDepartments } from "@/lib/api";
import type { DetailedDepartment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type React from "react";
import { type JSX, useEffect, useState } from "react";

type Card = {
	id: number;
	content: JSX.Element | React.ReactNode | string;
	className: string;
	thumbnail: string;
	departmentData: DetailedDepartment;
};

export default function DepartmentsGrid() {
	const searchParams = useSearchParams();
	const filterQuery = searchParams.get("filter") || "";
	const regionFilter = searchParams.get("region") || "";
	const periodFilter = searchParams.get("period") || "";

	const [cards, setCards] = useState<Card[]>([]);
	const [filteredCards, setFilteredCards] = useState<Card[]>([]);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState<Card | null>(null);
	const [lastSelected, setLastSelected] = useState<Card | null>(null);

	useEffect(() => {
		async function fetchDepartments() {
			setLoading(true);
			try {
				const departments = await getDetailedDepartments();

				const newCards = departments.map((dept) => ({
					id: dept.departmentId,
					thumbnail: dept.image,
					className: "aspect-[4/3]",
					content: (
						<div className="text-white">
							<h3 className="text-2xl font-medium mb-1">{dept.displayName}</h3>
							<p className="text-sm text-white/80 mb-3 line-clamp-2">
								{dept.description}
							</p>
							<div className="flex flex-wrap gap-2 mb-4">
								{dept.regions.map((region) => (
									<Badge
										key={region}
										variant="outline"
										className="border-white/40 text-white/90"
									>
										{region}
									</Badge>
								))}
							</div>
							<Button
								variant="outline"
								size="sm"
								className="border-white text-white hover:bg-white/20"
								onClick={(e) => {
									e.stopPropagation();
									window.location.href = `/departments/${dept.departmentId}`;
								}}
							>
								View Department
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</div>
					),
					departmentData: dept,
				}));

				setCards(newCards);
				setFilteredCards(newCards);
			} catch (error) {
				console.error("Error fetching departments:", error);
				setCards([]);
				setFilteredCards([]);
			} finally {
				setLoading(false);
			}
		}

		fetchDepartments();
	}, []);

	// Apply filters when filter parameters change
	useEffect(() => {
		if (cards.length === 0) return;

		const filtered = cards.filter((card) => {
			const dept = card.departmentData;
			const matchesQuery = filterQuery
				? dept.displayName.toLowerCase().includes(filterQuery.toLowerCase()) ||
					dept.description.toLowerCase().includes(filterQuery.toLowerCase())
				: true;

			const matchesRegion = regionFilter
				? dept.regions.some(
						(region) => region.toLowerCase() === regionFilter.toLowerCase(),
					)
				: true;

			const matchesPeriod = periodFilter
				? dept.periods.some(
						(period) => period.toLowerCase() === periodFilter.toLowerCase(),
					)
				: true;

			return matchesQuery && matchesRegion && matchesPeriod;
		});

		setFilteredCards(filtered);
	}, [filterQuery, regionFilter, periodFilter, cards]);

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

	if (filteredCards.length === 0) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-semibold">No departments found</h2>
				<p className="text-muted-foreground mt-2">
					Try adjusting your filters to see more results
				</p>
			</div>
		);
	}

	return (
		<div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto gap-6 relative">
			{filteredCards.map((card, i) => (
				<div key={i} className={cn(card.className, "")}>
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
	);
}

const ImageComponent = ({ card }: { card: Card }) => {
	return (
		<motion.div
			layoutId={`image-${card.id}-image`}
			className={cn("relative overflow-hidden absolute inset-0 h-full w-full")}
		>
			<Image
				src={card.thumbnail || "/placeholder.svg"}
				alt={card.departmentData.displayName}
				fill
				style={{ objectFit: "cover" }}
				className="transition duration-200"
			/>
		</motion.div>
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

function LoadingGrid() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array(9)
				.fill(0)
				.map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className="aspect-[4/3] bg-muted animate-pulse rounded-xl"
					/>
				))}
		</div>
	);
}
