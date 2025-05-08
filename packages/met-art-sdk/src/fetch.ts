import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";

export const $fetch = createFetch({
	baseURL: "https://collectionapi.metmuseum.org/public/collection/v1",
	schema: createSchema({
		"/departments": {
			output: z.object({
				departments: z.array(
					z
						.object({
							departmentId: z.number().int(),
							displayName: z.string(),
						})
						.nullable(),
				),
			}),
		},
		"/objects": {
			output: z.object({
				objectIDs: z.array(z.number().int()).nullable(),
			}),
		},
		"/objects/:objectID": {
			params: z.object({
				objectID: z.number(),
			}),
			output: z
				.object({
					objectID: z.number().nullable(),
					isHighlight: z.boolean().nullable(),
					accessionNumber: z.string().nullable(),
					accessionYear: z.string().nullable(),
					isPublicDomain: z.boolean().nullable(),
					primaryImage: z.string().nullable(),
					primaryImageSmall: z.string().nullable(),
					additionalImages: z.array(z.string()).nullable(),
					constituents: z
						.array(
							z
								.object({
									constituentID: z.number().nullable(),
									role: z.string().nullable(),
									name: z.string().nullable(),
									constituentULAN_URL: z.string().nullable(),
									constituentWikidata_URL: z.string().nullable(),
									gender: z.string().nullable().optional(),
								})
								.nullable(),
						)
						.nullable(),
					department: z.string().nullable(),
					objectName: z.string().nullable(),
					title: z.string().nullable(),
					culture: z.string().nullable(),
					period: z.string().nullable(),
					dynasty: z.string().nullable(),
					reign: z.string().nullable(),
					portfolio: z.string().nullable(),
					artistRole: z.string().nullable(),
					artistPrefix: z.string().nullable(),
					artistDisplayName: z.string().nullable(),
					artistDisplayBio: z.string().nullable(),
					artistSuffix: z.string().nullable(),
					artistAlphaSort: z.string().nullable(),
					artistNationality: z.string().nullable(),
					artistBeginDate: z.string().nullable(),
					artistEndDate: z.string().nullable(),
					artistGender: z.string().nullable(),
					artistWikidata_URL: z.string().nullable(),
					artistULAN_URL: z.string().nullable(),
					objectDate: z.string().nullable(),
					objectBeginDate: z.number().nullable(),
					objectEndDate: z.number().nullable(),
					medium: z.string().nullable(),
					dimensions: z.string().nullable(),
					dimensionsParsed: z
						.array(
							z.object({
								element: z.string().nullable(),
								dimensionType: z.string().nullable(),
								dimension: z.number().nullable(),
							}),
						)
						.nullable(),
					measurements: z
						.array(
							z.object({
								elementName: z.string().nullable(),
								elementDescription: z.string().nullable(),
								elementMeasurements: z
									.record(z.string(), z.number())
									.nullable(),
							}),
						)
						.nullable(),
					creditLine: z.string().nullable(),
					geographyType: z.string().nullable(),
					city: z.string().nullable(),
					state: z.string().nullable(),
					county: z.string().nullable(),
					country: z.string().nullable(),
					region: z.string().optional().nullable(),
					subregion: z.string().optional().nullable(),
					locale: z.string().optional().nullable(),
					locus: z.string().optional().nullable(),
					excavation: z.string().optional().nullable(),
					river: z.string().optional().nullable(),
					classification: z.string().nullable(),
					rightsAndReproduction: z.string().nullable(),
					linkResource: z.string().nullable(),
					metadataDate: z.string().nullable(), // ISO 8601 datetime string (e.g., "2018-10-17T10:24:43.197Z")
					repository: z.string().nullable(),
					objectURL: z.string().nullable(),
					tags: z
						.array(
							z.object({
								term: z.string().nullable(),
								AAT_URL: z.string().nullable(),
								Wikidata_URL: z.string().nullable(),
							}),
						)
						.nullable(),
					objectWikidata_URL: z.string().nullable(),
					isTimelineWork: z.boolean(),
					GalleryNumber: z.string(),
				})
				.partial()
				.nullable(),
		},
		"/search": {
			query: z.object({
				q: z.string().default(""),
				artistOrCulture: z.boolean().optional(),
				dateBegin: z.number().optional(),
				dateEnd: z.number().optional(),
				departmentId: z.number().optional(),
				geoLocation: z.string().optional(),
				hasImages: z.boolean().optional(),
				medium: z.string().optional(),
				isOnView: z.boolean().optional(),
				isHighlight: z.boolean().optional(),
				title: z.boolean().optional(),
				tags: z.boolean().optional(),
			}),
			output: z.object({
				total: z.number().int(),
				objectIDs: z
					.array(z.number().int().nullable())
					.optional()
					.nullable()
					.default([]),
			}),
		},
	}),
});
