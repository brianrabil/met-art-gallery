import { relations, sql } from "drizzle-orm";
import {
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { float32Array } from "../custom-types/vector";
import { users } from "./auth.generated";

const timestamps = {
	createdAt: text().notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text().notNull().default(sql`CURRENT_TIMESTAMP`),
};

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Preferences
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export const profiles = sqliteTable(
	"profiles",
	{
		id: integer().primaryKey().notNull(),
		location: integer().references(() => locations.id),
		theme: text().default("system"), // light | dark | system
		userId: text()
			.notNull()
			.references(() => users.id),
		...timestamps,
	},
	(table) => [
		uniqueIndex("profiles_user_id_idx").on(table.userId, table.id),
		index("profiles_location_idx").on(table.location),
		index("profiles_theme_idx").on(table.theme),
	],
);

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Bookmarks
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export const bookmarks = sqliteTable(
	"bookmarks",
	{
		id: integer().primaryKey().notNull(),
		profileId: integer()
			.notNull()
			.references(() => profiles.id),
		artworkId: integer()
			.notNull()
			.references(() => artworks.id),
		note: text(),
		...timestamps,
	},
	(table) => [
		uniqueIndex("bookmarks_profile_artwork").on(
			table.profileId,
			table.artworkId,
		),
		index("bookmarks_artwork_idx").on(table.artworkId),
	],
);

export const bookmarkRelations = relations(bookmarks, ({ one }) => ({
	profile: one(profiles, {
		fields: [bookmarks.profileId],
		references: [profiles.id],
	}),
	artwork: one(artworks, {
		fields: [bookmarks.artworkId],
		references: [artworks.id],
	}),
}));

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Follows
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export const follows = sqliteTable(
	"follows",
	{
		id: integer().primaryKey().notNull(),
		profileId: integer()
			.notNull()
			.references(() => profiles.id),
		artistId: integer()
			.notNull()
			.references(() => artists.id),
		note: text(),
		...timestamps,
	},
	(table) => [
		uniqueIndex("follows_profile_artist_uq").on(
			table.profileId,
			table.artistId,
		),
		index("follows_artist_idx").on(table.artistId),
	],
);

export const followsRelations = relations(follows, ({ one }) => ({
	user: one(profiles, {
		fields: [follows.profileId],
		references: [profiles.id],
	}),
	artists: one(artists, {
		fields: [follows.artistId],
		references: [artists.id],
	}),
}));

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Artists
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export const artists = sqliteTable(
	"artists",
	{
		id: integer().primaryKey().notNull(),
		role: text(),
		prefix: text(),
		name: text(),
		bio: text(),
		suffix: text(),
		alphaSort: text(),
		nationality: text(),
		beginDate: text(),
		endDate: text(),
		gender: text().default("unknown"),
		wikidata: text(),
		ulan: text(),
		credit: text(),
		...timestamps,
	},
	(table) => [
		uniqueIndex("artists_wikidata_uq").on(table.wikidata),
		uniqueIndex("artists_ulan_uq").on(table.ulan),
		index("artists_name_idx").on(table.name),
		index("artists_alpha_sort_idx").on(table.alphaSort),
	],
);

export const artistRelations = relations(artists, ({ many }) => ({
	/* one artist ⇢ many rows in the join-table                        */
	artistArtworks: many(artistArtworks),

	/* one artist ⇢ many rows in the join-table                        */
	follows: many(follows),
}));

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Artworks
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export const artworks = sqliteTable(
	"artworks",
	{
		id: integer().primaryKey().notNull(),
		title: text().notNull(),
		artist: text(),
		medium: text(),
		culture: text(),
		dimensions: text(),
		thumbnail: text(),
		wikidata: text(),
		license: text().default("Public Domain"),
		locationId: integer().references(() => locations.id),
		departmentId: integer().references(() => departments.id),
		metObjectId: integer().notNull(),
		metObjectUrl: text(),
		...timestamps,
	},
	(table) => [
		uniqueIndex("artworks_met_object_uq").on(table.metObjectId),
		index("artworks_department_idx").on(table.departmentId),
		index("artworks_location_idx").on(table.locationId),
		index("artworks_created_idx").on(table.createdAt),
	],
);

export const artworksRelations = relations(artworks, ({ many, one }) => ({
	/* one artwork ⇢ many rows in the join-table                       */
	artistArtworks: many(artistArtworks),
	/* one artwork ⇢ many rows in the join-table                       */
	bookmarks: many(bookmarks),
	/* one artwork ⇢ one location                                    */
	location: one(locations, {
		fields: [artworks.locationId],
		references: [locations.id],
	}),
	/* one artwork ⇢ one department                                    */
	department: one(departments, {
		fields: [artworks.departmentId],
		references: [departments.id],
	}),
}));

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Artist Artworks
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export const artistArtworks = sqliteTable(
	"artist_artworks",
	{
		id: integer().primaryKey().notNull(),
		role: text(),
		artistId: integer()
			.notNull()
			.references(() => artists.id),
		artworkId: integer()
			.notNull()
			.references(() => artworks.id),
		...timestamps,
	},
	(table) => [
		/* stop duplicate pairs */
		uniqueIndex("artist_artworks_uq").on(table.artistId, table.artworkId),
		/* support both join directions efficiently */
		index("artist_artworks_artist_idx").on(table.artistId),
		index("artist_artworks_artwork_idx").on(table.artworkId),
	],
);

export const artistArtworksRelations = relations(artistArtworks, ({ one }) => ({
	/* join-row ⇢ its artist                                          */
	artist: one(artists, {
		fields: [artistArtworks.artistId],
		references: [artists.id],
	}),
	/* join-row ⇢ its artwork                                         */
	artwork: one(artworks, {
		fields: [artistArtworks.artworkId],
		references: [artworks.id],
	}),
}));

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Locations
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export const locations = sqliteTable(
	"locations",
	{
		id: integer().primaryKey().notNull(),
		name: text(),
		address: text(),
		city: text(),
		state: text(),
		country: text(),
		county: text(),
		region: text(),
		subregion: text(),
		locale: text(),
		locus: text(),
		zipCode: text(),
		latitude: text(),
		longitude: text(),
		...timestamps,
	},
	(table) => [
		uniqueIndex("locations_lat_lon_uq").on(table.latitude, table.longitude),
		index("locations_city_idx").on(table.city),
		index("locations_country_idx").on(table.country),
	],
);

export const locationsRelations = relations(locations, ({ many }) => ({
	/* one location ⇢ many artworks */
	artworks: many(artworks),
}));

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Images
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export const images = sqliteTable(
	"images",
	{
		id: integer("id").primaryKey().notNull(),
		artworkId: integer("artwork_id")
			.notNull()
			.references(() => artworks.id),
		url: text("url").notNull(),
		width: integer("width"),
		height: integer("height"),
		description: text("description"),
		...timestamps,
	},
	(table) => [
		index("images_artwork_idx").on(table.artworkId),
		/* avoid duplicate URLs in case of re-scrapes */
		uniqueIndex("images_url_uq").on(table.url),
	],
);

export const imagesRelations = relations(images, ({ one }) => ({
	/* one image ⇢ one artwork                                         */
	artwork: one(artworks, {
		fields: [images.artworkId],
		references: [artworks.id],
	}),
}));

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Departments
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export const departments = sqliteTable(
	"departments",
	{
		id: integer("id").primaryKey().notNull(),
		name: text("name").notNull(),
		description: text("description").notNull(),
		...timestamps,
	},
	(table) => [uniqueIndex("departments_name_uq").on(table.name)],
);

export const departmentsRelations = relations(departments, ({ many }) => ({
	/* one department ⇢ many artworks                                  */
	artworks: many(artworks),
}));
