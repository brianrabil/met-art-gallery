import { relations } from "drizzle-orm";
import {
	integer,
	real,
	sqliteTable,
	text,
	unique,
} from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
//
// Departments Table
export const departments = sqliteTable("departments", {
	departmentId: integer().primaryKey(),
	displayName: text().notNull().unique(),
});

// Objects Table
export const objects = sqliteTable("objects", {
	id: integer().primaryKey(),
	objectID: integer().notNull().unique(),
	isHighlight: integer({ mode: "boolean" }),
	accessionNumber: text(),
	accessionYear: text(),
	isPublicDomain: integer({ mode: "boolean" }),
	primaryImage: text(),
	primaryImageSmall: text(),
	department: text(),
	objectName: text(),
	title: text(),
	culture: text(),
	period: text(),
	dynasty: text(),
	reign: text(),
	portfolio: text(),
	artistRole: text(),
	artistPrefix: text(),
	artistDisplayName: text(),
	artistDisplayBio: text(),
	artistSuffix: text(),
	artistAlphaSort: text(),
	artistNationality: text(),
	artistBeginDate: text(),
	artistEndDate: text(),
	artistGender: text(),
	artistWikidataURL: text(),
	artistULANURL: text(),
	objectDate: text(),
	objectBeginDate: integer(),
	objectEndDate: integer(),
	medium: text(),
	dimensions: text(),
	creditLine: text(),
	geographyType: text(),
	city: text(),
	state: text(),
	county: text(),
	country: text(),
	region: text(),
	subregion: text(),
	locale: text(),
	locus: text(),
	excavation: text(),
	river: text(),
	classification: text(),
	rightsAndReproduction: text(),
	linkResource: text(),
	metadataDate: text(),
	repository: text(),
	objectURL: text(),
	objectWikidataURL: text(),
	isTimelineWork: integer({ mode: "boolean" }),
	galleryNumber: text(),
});

// Constituents Table
export const constituents = sqliteTable("constituents", {
	id: integer().primaryKey(),
	objectID: integer()
		.notNull()
		.references(() => objects.objectID),
	constituentID: integer(),
	role: text(),
	name: text(),
	constituentULANURL: text(),
	constituentWikidataURL: text(),
	gender: text(),
});

// Measurements Table
export const measurements = sqliteTable("measurements", {
	id: integer().primaryKey(),
	objectID: integer()
		.notNull()
		.references(() => objects.objectID),
	elementName: text(),
	elementDescription: text(),
	// Store measurements as JSON text or normalized fields
	height: real(), // From elementMeasurements.Height
	width: real(), // From elementMeasurements.Width
	length: real(), // From elementMeasurements.Length
});

// Dimensions Parsed Table (alternative to measurements if needed)
export const dimensionsParsed = sqliteTable("dimensions_parsed", {
	id: integer().primaryKey(),
	objectID: integer()
		.notNull()
		.references(() => objects.objectID),
	element: text().notNull(),
	dimensionType: text().notNull(),
	dimension: real().notNull(),
});

// Tags Table
export const tags = sqliteTable("tags", {
	id: integer().primaryKey(),
	objectID: integer()
		.notNull()
		.references(() => objects.objectID),
	term: text(),
	AATURL: text(),
	wikidataURL: text(),
});

// Additional Images Table
export const additionalImages = sqliteTable("additional_images", {
	id: integer().primaryKey(),
	objectID: integer()
		.notNull()
		.references(() => objects.objectID),
	imageURL: text(),
});

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Relations
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

// Relationships
export const objectsRelations = relations(objects, ({ one, many }) => ({
	// department: one(departments, {
	// 	fields: [objects.department],
	// 	references: [departments.displayName],
	// }),
	constituents: many(constituents),
	measurements: many(measurements),
	dimensionsParsed: many(dimensionsParsed),
	tags: many(tags),
	additionalImages: many(additionalImages),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
	objects: many(objects),
}));

export const constituentsRelations = relations(constituents, ({ one }) => ({
	object: one(objects, {
		fields: [constituents.objectID],
		references: [objects.objectID],
	}),
}));

export const measurementsRelations = relations(measurements, ({ one }) => ({
	object: one(objects, {
		fields: [measurements.objectID],
		references: [objects.objectID],
	}),
}));

export const dimensionsParsedRelations = relations(
	dimensionsParsed,
	({ one }) => ({
		object: one(objects, {
			fields: [dimensionsParsed.objectID],
			references: [objects.objectID],
		}),
	}),
);

export const tagsRelations = relations(tags, ({ one }) => ({
	object: one(objects, {
		fields: [tags.objectID],
		references: [objects.objectID],
	}),
}));

export const additionalImagesRelations = relations(
	additionalImages,
	({ one }) => ({
		object: one(objects, {
			fields: [additionalImages.objectID],
			references: [objects.objectID],
		}),
	}),
);
