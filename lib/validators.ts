import { z } from "zod";

// Schema for the Objects endpoint (/public/collection/v1/objects)
export const objectsSchema = z
	.object({
		total: z.number().int(),
		objectIDs: z.array(z.number().int()),
	})
	.nullable();

// Schema for the Object endpoint (/public/collection/v1/objects/[objectID])
export const objectSchema = z
	.object({
		objectID: z.number().int(),
		isHighlight: z.boolean(),
		accessionNumber: z.string(),
		accessionYear: z.string(),
		isPublicDomain: z.boolean(),
		primaryImage: z.string().optional(),
		primaryImageSmall: z.string().optional(),
		additionalImages: z.array(z.string()),
		constituents: z
			.array(
				z.object({
					constituentID: z.number().int(),
					role: z.string(),
					name: z.string(),
					constituentULANURL: z.string().optional(),
					constituentWikidataURL: z.string().optional(),
					gender: z.string().optional(),
				}),
			)
			.nullable()
			.optional(),
		department: z.string(),
		objectName: z.string(),
		title: z.string(),
		culture: z.string().optional(),
		period: z.string().optional(),
		dynasty: z.string().optional(),
		reign: z.string().optional(),
		portfolio: z.string().optional(),
		artistRole: z.string().optional(),
		artistPrefix: z.string().optional(),
		artistDisplayName: z.string().optional(),
		artistDisplayBio: z.string().optional(),
		artistSuffix: z.string().optional(),
		artistAlphaSort: z.string().optional(),
		artistNationality: z.string().optional(),
		artistBeginDate: z.string().optional(),
		artistEndDate: z.string().optional(),
		artistGender: z.string().optional(),
		artistWikidataURL: z.string().optional(),
		artistULANURL: z.string().optional(),
		objectDate: z.string().optional(),
		objectBeginDate: z.number().int().optional(),
		objectEndDate: z.number().int().optional(),
		medium: z.string(),
		dimensions: z.string().optional(),
		measurements: z
			.array(
				z
					.object({
						elementName: z.string().nullable(),
						elementDescription: z.string().optional().nullable(),
						elementMeasurements: z
							.record(z.string(), z.number())
							.nullable()
							.optional(),
					})
					.nullable(),
			)
			.nullable()
			.optional(),
		creditLine: z.string(),
		geographyType: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		county: z.string().optional(),
		country: z.string().optional(),
		region: z.string().optional(),
		subregion: z.string().optional(),
		locale: z.string().optional(),
		locus: z.string().optional(),
		excavation: z.string().optional(),
		river: z.string().optional(),
		classification: z.string(),
		rightsAndReproduction: z.string().optional(),
		linkResource: z.string().optional(),
		metadataDate: z.string().datetime(),
		repository: z.string(),
		objectURL: z.string(),
		tags: z
			.array(
				z
					.object({
						term: z.string(),
						AATURL: z.string().optional(),
						wikidataURL: z.string().optional(),
					})
					.nullable(),
			)
			.nullable()
			.optional(),
		objectWikidataURL: z.string().optional(),
		isTimelineWork: z.boolean(),
		galleryNumber: z.string().optional(),
	})
	.nullable();

// Schema for the Departments endpoint (/public/collection/v1/departments)
export const departmentsSchema = z
	.object({
		departments: z.array(
			z
				.object({
					departmentId: z.number().int(),
					displayName: z.string(),
				})
				.nullable(),
		),
	})
	.nullable();

// Schema for the Search endpoint (/public/collection/v1/search)
export const searchResponseSchema = z
	.object({
		total: z.number().int(),
		objectIDs: z.array(z.number().int()),
	})
	.nullable();
