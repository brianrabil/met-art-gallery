import { context } from "@/lib/api/context";
import {
	objectSchema,
	objectsInputSchema,
	objectsOutputSchema,
	searchInputSchema,
	searchResponseSchema,
} from "@/lib/schema";
import { os, ORPCError } from "@orpc/server";
import {
	createSerializer,
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
} from "nuqs/server";
import { z } from "zod";
import { departmentsSchema } from "../validators";

const base = os.$context<typeof context>();

export const getObjectById = base
	.input(
		z.object({
			objectID: z.number(),
		}),
	)
	.output(objectSchema)
	.handler(async ({ context, input }) => {
		const res = await fetch(`${context.api.objects}/${input.objectID}`);
		const data = await res.json();
		return data;
	})
	.callable({
		context,
	});

export const getObjects = base
	.input(objectsInputSchema)
	.output(objectsOutputSchema)
	.handler(async ({ context, input }) => {
		const res = await fetch(`${context.api.objects}`);
		const data = await res.json();
		return data;
	})
	.callable({
		context,
	});

const searchParamsParsers = {
	q: parseAsString.withDefault("").withOptions({
		clearOnDefault: false,
	}),
	isHighlight: parseAsBoolean,
	title: parseAsBoolean,
	tags: parseAsBoolean,
	departmentId: parseAsInteger,
	isOnView: parseAsBoolean,
	artistOrCulture: parseAsBoolean,
	medium: parseAsString,
	hasImages: parseAsBoolean,
	geoLocation: parseAsString,
	dateBegin: parseAsInteger,
	dateEnd: parseAsInteger,
};

const serializer = createSerializer(searchParamsParsers);

/**
 * Search for objects in The Met Museum's collection.
 *
 * @param q - Search term (e.g. "sunflowers"). Returns a listing of all Object IDs for objects that contain the search query within the object’s data.
 * @param isHighlight - Boolean, true or false. Case sensitive. Returns objects that match the query and are designated as highlights. Highlights are selected works of art from The Met Museum’s permanent collection representing different cultures and time periods.
 * @param title - Boolean, true or false. Case sensitive. Returns objects that match the query, specifically searching against the title field for objects.
 * @param tags - Boolean, true or false. Case sensitive. Returns objects that match the query, specifically searching against the subject keyword tags field for objects.
 * @param departmentId - Integer. Returns objects that are a part of a specific department. For a list of departments and department IDs, refer to the /department endpoint: https://collectionapi.metmuseum.org/public/collection/v1/departments
 * @param isOnView - Boolean, true or false. Case sensitive. Returns objects that match the query and are on view in the museum.
 * @param artistOrCulture - Boolean, true or false. Case sensitive. Returns objects that match the query, specifically searching against the artist name or culture field for objects.
 * @param medium - String, with multiple values separated by the | operator. Case sensitive. Returns objects that match the query and are of the specified medium or object type. Examples include: "Ceramics", "Furniture", "Paintings", "Sculpture", "Textiles", etc.
 * @param hasImages - Boolean, true or false. Case sensitive. Returns objects that match the query and have images.
 * @param geoLocation - String, with multiple values separated by the | operator. Case sensitive. Returns objects that match the query and the specified geographic location. Examples include: "Europe", "France", "Paris", "China", "New York", etc.
 * @param dateBegin - Integer. Used together with dateEnd. Returns objects that match the query and fall between the dateBegin and dateEnd parameters. Examples include: dateBegin=1700&dateEnd=1800 for objects from 1700 A.D. to 1800 A.D., dateBegin=-100&dateEnd=100 for objects between 100 B.C. to 100 A.D.
 * @param dateEnd - Integer. Used together with dateBegin. See dateBegin for details.
 * @param limit - Pagination: number of results to return (default 10, min 1, max 100).
 * @param offset - Pagination: number of results to skip (default 0).
 * @param field - Sort: field to sort by.
 * @param direction - Sort: direction to sort ("asc" or "desc", default "desc").
 *
 * @returns An object containing the total number of publicly-available objects and an array of object IDs.
 */
export const search = base
	.input(searchInputSchema)
	.handler(async ({ input, context }) => {
		try {
			const url = serializer(context.api.search, {
				artistOrCulture: input?.artistOrCulture,
				dateBegin: input?.dateBegin,
				dateEnd: input?.dateEnd,
				departmentId: input?.departmentId,
				geoLocation: input?.geoLocation,
				hasImages: input?.hasImages ?? true,
				isHighlight: input?.isHighlight,
				medium: input?.medium,
				isOnView: input?.isOnView,
				q: input?.q ?? "",
				tags: input?.tags,
				title: input?.title,
			});

			const response = await fetch(url, {
				headers: {
					Accept: "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(
					`MET API request failed with status ${response.status}`,
				);
			}

			const data = await response.json();
			const parsed = searchResponseSchema.safeParse(data);
			if (parsed.error) {
				throw new ORPCError("Invalid MET API response format", {
					cause: parsed.error.cause,
					data: parsed.data,
					message: parsed.error.message,
				});
			}

			const {
				data: { total, objectIDs },
			} = parsed;

			const offset = input?.offset ?? 0;
			const limit = input?.limit ?? 10;

			// Calculate pagination
			const currentPage = Math.floor(offset / limit);
			const startIndex = offset;
			const endIndex = startIndex + limit;
			const paginatedObjectIDs = objectIDs?.slice(startIndex, endIndex) ?? [];
			const hasMore = endIndex < total;
			const nextPage = hasMore ? currentPage + 1 : null;

			// Return formatted response
			return {
				objectIDs: paginatedObjectIDs,
				total,
				hasMore,
				nextPage,
				page: currentPage,
			};
		} catch (error) {
			console.error("Search route error:", error);
			throw new Error("Failed to fetch search results");
		}
	})
	.callable({
		context,
	});

export const getRandomFeaturedArtwork = base
	.output(objectSchema.or(z.null()))
	.handler(async () => {
		try {
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

			// Get a random ID from the featured list
			const dayOfWeek = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
			const randomId =
				featuredArtworkIds[dayOfWeek % featuredArtworkIds.length];

			const res = await fetch(`${context.api.objects}/${randomId}`, {
				cache: "force-cache",
			});
			const data = await res.json();

			return data;
		} catch (error) {
			console.error("Error fetching featured artwork:", error);
			return null;
		}
	})
	.callable({
		context,
	});

// // Get all unique periods across departments
// export async function getAllPeriods(): Promise<string[]> {
// 	try {
// 		const departments = await getDetailedDepartments();
// 		const allPeriods = new Set<string>();

// 		departments.forEach((dept) => {
// 			dept.periods.forEach((period) => {
// 				allPeriods.add(period);
// 			});
// 		});

// 		return Array.from(allPeriods).sort();
// 	} catch (error) {
// 		console.error("Error fetching periods:", error);
// 		return [];
// 	}
// }

export const getDepartments = base
	.output(departmentsSchema)
	.handler(async ({ context, input }) => {
		const res = await fetch(`${context.api.departments}`);
		const data = await res.json();
		return data;
	});

// // Get a random featured artwork (with image)
// export async function _getRandomFeaturedArtwork(): Promise<ArtObject | null> {}

export const getSearchFilterOptions = base.handler(
	async ({ context, input }) => {
		const collection = await fetch(`${context.api.objects}`, {
			cache: "force-cache",
		});

		console.log(collection);

		return collection;
	},
);

export const router = {
	search,
	getObjects,
	getObjectById,
	getDepartments,
	getSearchFilterOptions,
	getRandomFeaturedArtwork,
};
