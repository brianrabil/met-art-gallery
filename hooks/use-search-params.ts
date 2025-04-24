import { objectSchemaKeys } from "@/lib/schema";
import { createSerializer, parseAsStringEnum, useQueryStates } from "nuqs";
import { parseAsBoolean, parseAsInteger, parseAsString } from "nuqs";

// Define parsers for each search parameter
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
	limit: parseAsInteger,
	direction: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
	field: parseAsStringEnum(objectSchemaKeys),
};

// Create a serializer for the search parameters
// export const serializeSearchParams = createSerializer(searchParamsParsers);
export function useSearchParams() {
	return useQueryStates(searchParamsParsers);
}

export const serialize = createSerializer(searchParamsParsers);
