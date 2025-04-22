"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
}

export default function Pagination({
	currentPage,
	totalPages,
}: PaginationProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		router.push(`/?${params.toString()}`);
	};

	// Generate page numbers to display
	const getPageNumbers = () => {
		const pages = [];
		const maxPagesToShow = 5;

		if (totalPages <= maxPagesToShow) {
			// Show all pages if total is less than max to show
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always include first page
			pages.push(1);

			// Calculate start and end of page range
			let start = Math.max(2, currentPage - 1);
			let end = Math.min(totalPages - 1, currentPage + 1);

			// Adjust if at the beginning
			if (currentPage <= 2) {
				end = Math.min(totalPages - 1, maxPagesToShow - 1);
			}

			// Adjust if at the end
			if (currentPage >= totalPages - 1) {
				start = Math.max(2, totalPages - maxPagesToShow + 2);
			}

			// Add ellipsis if needed
			if (start > 2) {
				pages.push(-1); // -1 represents ellipsis
			}

			// Add middle pages
			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			// Add ellipsis if needed
			if (end < totalPages - 1) {
				pages.push(-2); // -2 represents ellipsis
			}

			// Always include last page
			pages.push(totalPages);
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="flex justify-center items-center space-x-2">
			<Button
				variant="outline"
				size="icon"
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				<ChevronLeft className="h-4 w-4" />
				<span className="sr-only">Previous page</span>
			</Button>

			{pageNumbers.map((page, index) => {
				if (page < 0) {
					// Render ellipsis
					return (
						<span
							key={`ellipsis-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
							className="px-2"
						>
							&hellip;
						</span>
					);
				}

				return (
					<Button
						key={page}
						variant={currentPage === page ? "default" : "outline"}
						size="sm"
						onClick={() => handlePageChange(page)}
						aria-current={currentPage === page ? "page" : undefined}
					>
						{page}
					</Button>
				);
			})}

			<Button
				variant="outline"
				size="icon"
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				<ChevronRight className="h-4 w-4" />
				<span className="sr-only">Next page</span>
			</Button>
		</div>
	);
}
