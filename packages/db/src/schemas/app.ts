import { sql } from "drizzle-orm";
import {
	customType,
	integer,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

const float32Array = customType<{
	data: number[];
	config: { dimensions: number };
	configRequired: true;
	driverData: Buffer;
}>({
	dataType(config) {
		return `F32_BLOB(${config.dimensions})`;
	},
	fromDriver(value: Buffer) {
		return Array.from(new Float32Array(value.buffer));
	},
	toDriver(value: number[]) {
		return sql`vector32(${JSON.stringify(value)})`;
	},
});

export const fooTable = sqliteTable("foo", {
	bar: text("bar").notNull().default("Hey!"),
});

export const vectorTable = sqliteTable("vector_table", {
	id: integer("id").primaryKey(),
	vector: float32Array("vector", { dimensions: 3 }),
});
