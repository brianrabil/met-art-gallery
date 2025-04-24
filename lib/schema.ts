import { z } from "zod";

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Object Schema
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

const measurementSchema = z.object({
	elementName: z.string().nullable(),
	elementDescription: z.string().nullable(),
	elementMeasurements: z.record(z.string(), z.number()).nullable(),
});

const tagSchema = z.object({
	term: z.string().nullable(),
	AAT_URL: z.string().nullable(),
	Wikidata_URL: z.string().nullable(),
});

const constituentSchema = z.object({
	constituentID: z.number().nullable(),
	role: z.string().nullable(),
	name: z.string().nullable(),
	constituentULAN_URL: z.string().nullable(),
	constituentWikidata_URL: z.string().nullable(),
	gender: z.string().optional().nullable(), // Optional, as specified
});

const dimensionSchema = z.object({
	element: z.string().nullable(),
	dimensionType: z.string().nullable(),
	dimension: z.number().nullable(),
});

export const objectSchema = z
	.object({
		objectID: z.number().nullable(),
		isHighlight: z.boolean().nullable(),
		accessionNumber: z.string().nullable(),
		accessionYear: z.string().nullable(),
		isPublicDomain: z.boolean().nullable(),
		primaryImage: z.string().nullable(),
		primaryImageSmall: z.string().nullable(),
		additionalImages: z.array(z.string()).nullable(),
		constituents: z.array(constituentSchema).nullable(),
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
		dimensionsParsed: z.array(dimensionSchema).nullable(),
		measurements: z.array(measurementSchema).nullable(),
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
		tags: z.array(tagSchema).nullable(),
		objectWikidata_URL: z.string().nullable(),
		isTimelineWork: z.boolean().nullable(),
		GalleryNumber: z.string().nullable(),
	})
	.partial();

export const paginationSchema = z.object({
	limit: z.number().min(1).max(100).default(10),
	offset: z.number().min(0).default(0),
});

export type PaginationType = z.infer<typeof paginationSchema>;

export const objectSchemaKeys = Object.keys(
	objectSchema.shape,
) as (keyof z.infer<typeof objectSchema>)[];

export const sortSchema = z.object({
	field: z
		.enum([
			objectSchemaKeys[0],
			...objectSchemaKeys.slice(1, objectSchemaKeys.length),
		])
		.default("objectName"),
	direction: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type SortType = z.infer<typeof sortSchema>;

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Search Schema
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export const searchInputSchema = z
	.object({
		q: z.string().default(""),
		isHighlight: z.boolean().optional(),
		title: z.boolean().optional(),
		tags: z.boolean().optional(),
		departmentId: z.number().int().optional(),
		isOnView: z.boolean().optional(),
		artistOrCulture: z.boolean().optional(),
		medium: z.string().optional(),
		hasImages: z.boolean().optional(),
		geoLocation: z.string().optional(),
		dateBegin: z.number().int().optional(),
		dateEnd: z.number().int().optional(),
	})
	.nullable()
	.and(paginationSchema.nullable())
	.optional()
	.and(sortSchema.nullable())
	.optional();

export const searchOutputSchema = z.object({
	/** The total number of publicly-available objects */
	total: z.number().int(),
	/** An array containing the object ID of publicly-available object */
	objectIDs: z.array(objectSchema),
	hasMore: z.boolean(),
	nextPage: z.boolean(),
});

/* Response from the /search endpoint */
export const searchResponseSchema = z.object({
	/** The total number of publicly-available objects */
	total: z.number().int(),
	/** An array containing the object ID of publicly-available object */
	objectIDs: z.array(z.number().int()).nullable().optional(),
});

export const objectsInputSchema = z
	.object({})
	.and(paginationSchema)
	.and(sortSchema);

export const objectsOutputSchema = z.object({
	total: z.number().int(),
	items: z.array(objectSchema),
});

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
