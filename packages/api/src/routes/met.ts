import { ORPCError } from "@orpc/client";
import { base, withAdmin, withDatabase } from "@repo/api/orpc";
import { $fetch } from "@repo/met-art-sdk/fetch";
import {
	objectSchema,
	paginationSchema,
	sortSchema,
} from "@repo/met-art-sdk/schema";
import { z } from "zod";

const getArtworks = base.handler(async () => {
	return await $fetch("/objects", {
		throw: true,
		next: {
			tags: ["met-objects"],
		},
	});
});

const getArtworkById = base.input(z.number()).handler(async ({ input }) => {
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
});

const searchArtworks = base
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
			next: {
				tags: ["met-search", JSON.stringify(query)],
				revalidate: 86400, // once a day = 60 * 60 * 24 seconds				revalidate:
			},
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
	});

const getFeaturedArtwork = base
	.output(objectSchema.or(z.null()))
	.handler(async ({ context }) => {
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

		if (!randomId) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "No featured artwork found",
			});
		}

		return await $fetch("/objects/:objectID", {
			params: {
				objectID: randomId,
			},
			throw: true,
			next: {
				tags: ["met-object", String(randomId)],
				revalidate: 86400, // once a day = 60 * 60 * 24 seconds				revalidate:
			},
		});
	});

const getDepartments = base.handler(async () => {
	return await $fetch("/departments", {
		throw: true,
		next: {
			tags: ["met-departments"],
			revalidate: 86400, // once a day = 60 * 60 * 24 seconds				revalidate:
		},
	});
});

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Artwork Sync
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

const sync = base
	.use(withDatabase)
	.use(withAdmin)
	.handler(async () => {
		const { data, error } = await $fetch("/objects", {
			next: {
				revalidate: 86400, // once a day = 60 * 60 * 24 seconds
				tags: ["met-objects"],
			},
		});

		if (error) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", error);
		}

		if (!data.objectIDs) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "No object IDs found",
			});
		}

		const mediums = new Set();
		const cultures = new Set();
		const departments = new Set();
		const tags = new Set();

		await Promise.all(
			data.objectIDs.map(async (objectID) => {
				// We cache these client-side
				const object = await $fetch("/objects/:objectID", {
					params: { objectID },
					throw: true,
				});
				if (object?.isPublicDomain) {
					console.info("Synced artwork", object);
					mediums.add(object.medium);
					cultures.add(object.culture);
					departments.add(object.department);
					for (const tag of object.tags ?? []) tags.add(tag);
				}
			}),
		);

		await Promise.all([
			Bun.write("./lib/generated/mediums.json", JSON.stringify([...mediums])),
			Bun.write("./lib/generated/cultures.json", JSON.stringify([...cultures])),
			Bun.write(
				"./lib/generated/departments.json",
				JSON.stringify([...departments]),
			),
			Bun.write("./lib/generated/tags.json", JSON.stringify([...tags])),
		]);

		console.log(`Synced ${mediums.size} mediums`);
		console.log(`Synced ${cultures.size} cultures`);
		console.log(`Synced ${departments.size} departments`);
		console.log(`Synced ${tags.size} tags`);
	});

export const metRouter = {
	searchArtworks,
	getArtworks,
	getArtworkById,
	getDepartments,
	getFeaturedArtwork,
	sync,
};
