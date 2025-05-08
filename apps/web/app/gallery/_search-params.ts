import { objectSchemaKeys } from "@/lib/api/routes/met/schema";
import {
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
} from "nuqs/server";

export const searchParamsParsers = {
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
	offset: parseAsInteger,
	limit: parseAsInteger.withDefault(12),
	direction: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
	field: parseAsStringEnum(objectSchemaKeys),
};
