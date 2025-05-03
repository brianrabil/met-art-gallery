import { $fetch } from "@/lib/fetch";
import { objectSchema, paginationSchema, sortSchema } from "@/lib/schema";
import { os } from "@orpc/server";
import { z } from "zod";

const base = os.$context();

export const getObjects = base
	// .input(paginationSchema.and(sortSchema))
	.handler(async () => {
		return await $fetch("/objects", {
			throw: true,
		});
	})
	.callable();

export const getObjectById = base
	.input(z.number())
	.handler(async ({ input }) => {
		try {
			return await $fetch("/objects/:objectID", {
				params: { objectID: input },
				throw: true,
			});
		} catch (error) {
			if (error instanceof Error && error.message.includes("Not Found")) {
				return null; // Object doesn’t exist
			}
			throw error; // Re-throw other unexpected errors
		}
	})
	.callable();

export const search = base
	.input(
		z.object({
			q: z.string().default(""),
			artistOrCulture: z.coerce.boolean().optional(),
			dateBegin: z.coerce.number().optional(),
			dateEnd: z.coerce.number().optional(),
			departmentId: z.coerce.number().optional(),
			geoLocation: z.coerce.string().optional(),
			hasImages: z.coerce.boolean().optional().default(true),
			medium: z.coerce.string().optional(),
			isOnView: z.coerce.boolean().optional(),
			isHighlight: z.coerce.boolean().optional(),
			title: z.coerce.boolean().optional(),
			tags: z.coerce.boolean().optional(),
			pagination: paginationSchema.optional(),
			sort: sortSchema.optional(),
		}),
	)
	.handler(async ({ input: { pagination, sort, ...query } }) => {
		const { total, objectIDs } = await $fetch("/search", {
			query,
			throw: true,
		});

		const offset = pagination?.offset ?? 0;
		const limit = pagination?.limit ?? 10;

		// Calculate pagination
		const currentPage = Math.floor(offset / limit);
		const startIndex = offset;
		const endIndex = startIndex + limit;
		const paginatedObjectIDs = objectIDs?.slice(startIndex, endIndex) ?? [];
		const hasMore = endIndex < total;
		const nextPage = hasMore ? currentPage + 1 : null;

		return {
			objectIDs: paginatedObjectIDs,
			total,
			hasMore,
			nextPage,
			page: currentPage,
		};
	})
	.callable();

export const getRandomFeaturedArtwork = base
	.output(objectSchema.or(z.null()))
	.handler(async () => {
		// Featured artwork IDs with good images
		const featuredArtworkIds = [
			436535, // Wheat Field with Cypresses - Van Gogh
			459106, // Bridge over a Pond of Water Lilies - Monet
			437984, // Irises - Van Gogh
			438722, // Bouquet of Sunflowers - Van Gogh
			436947, // The Starry Night - Van Gogh
			435882, // The Harvesters - Pieter Bruegel
			437133, // The Dance Class - Degas
			438815, // The Gulf of Marseilles - Cézanne
			436965, // Garden at Sainte-Adresse - Monet
			437430, // The Death of Socrates - Jacques-Louis David
			10481, // The Great Wave off Kanagawa - Hokusai
			11417, // Sphinx of Hatshepsut
			544740, // Aristotle with a Bust of Homer - Rembrandt
			435809, // View of Toledo - El Greco
		];

		const dayOfWeek = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
		const randomId = featuredArtworkIds[dayOfWeek % featuredArtworkIds.length];

		return await $fetch("/objects/:objectID", {
			params: {
				objectID: randomId,
			},
			throw: true,
		});
	})
	.callable();

export const getDepartments = base
	.handler(async () => {
		return await $fetch("/departments", {
			throw: true,
		});
	})
	.callable();

export const router = {
	search,
	getObjects,
	getObjectById,
	getDepartments,
	getRandomFeaturedArtwork,
};
