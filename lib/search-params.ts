import {
	createLoader,
	createSerializer,
	type inferParserType,
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
} from "nuqs/server";

// Define parsers for each search parameter
export const searchParamsParsers = {
	q: parseAsString.withDefault(""),
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
	page: parseAsInteger,
	pageSize: parseAsInteger,
};

export type SearchParams = inferParserType<typeof searchParamsParsers>;

export const serializeSearchParams = createSerializer(searchParamsParsers);

export const loadSearchParams = createLoader(searchParamsParsers);
