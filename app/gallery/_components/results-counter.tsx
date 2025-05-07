"use client";
import NumberFlow from "@number-flow/react";
import { useStore } from "@tanstack/react-store";
import { store } from "../_store";

export function ResultsCounter() {
	const total = useStore(store, (state) => state.total);
	const loaded = useStore(store, (state) => state.loaded);
	return (
		<div>
			<span>
				<NumberFlow value={total} /> artworks found
			</span>
			<span className="ml-2 text-muted-foreground">
				Fetched <NumberFlow value={loaded} />
			</span>
		</div>
	);
}
