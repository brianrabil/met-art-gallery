import {
	type SearchParams,
	searchParamsParsers,
	serializeSearchParams,
} from "@/lib/search-params";

/** Base URL for the Metropolitan Museum of Art Collection API. */
const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

/**
 * Response structure for the objects endpoint, listing all valid object IDs.
 */
export interface ObjectsResponse {
	/** Total number of publicly available objects. */
	total: number;
	/** Array of object IDs for publicly available objects. */
	objectIDs: number[];
}

/**
 * Response structure for a single object, containing detailed metadata.
 */
export interface ObjectResponse {
	objectID: number;
	isHighlight: boolean;
	accessionNumber: string;
	accessionYear: string;
	isPublicDomain: boolean;
	primaryImage: string;
	primaryImageSmall: string;
	additionalImages: string[];
	constituents: Constituent[];
	department: string;
	objectName: string;
	title: string;
	culture: string;
	period: string;
	dynasty: string;
	reign: string;
	portfolio: string;
	artistRole: string;
	artistPrefix: string;
	artistDisplayName: string;
	artistDisplayBio: string;
	artistSuffix: string;
	artistAlphaSort: string;
	artistNationality: string;
	artistBeginDate: string;
	artistEndDate: string;
	artistGender: string;
	artistWikidata_URL: string;
	artistULAN_URL: string;
	objectDate: string;
	objectBeginDate: number;
	objectEndDate: number;
	medium: string;
	dimensions: string;
	measurements: Measurement[];
	creditLine: string;
	geographyType: string;
	city: string;
	state: string;
	county: string;
	country: string;
	region: string;
	subregion: string;
	locale: string;
	locus: string;
	excavation: string;
	river: string;
	classification: string;
	rightsAndReproduction: string;
	linkResource: string;
	metadataDate: string;
	repository: string;
	objectURL: string;
	tags: Tag[];
	objectWikidata_URL: string;
	isTimelineWork: boolean;
	GalleryNumber: string;
}

/**
 * Details of a constituent (e.g., artist) associated with an object.
 */
interface Constituent {
	constituentID: number;
	role: string;
	name: string;
	constituentULAN_URL: string;
	constituentWikidata_URL: string;
	gender: string;
}

/**
 * Measurement details for an object’s elements.
 */
interface Measurement {
	elementName: string;
	elementDescription: string | null;
	elementMeasurements: Record<string, number>;
}

/**
 * Subject keyword tag associated with an object.
 */
interface Tag {
	term: string;
	AAT_URL: string;
	Wikidata_URL: string;
}

/**
 * Details of a curatorial department.
 */
export interface Department {
	departmentId: number;
	displayName: string;
}

/**
 * Response structure for the departments endpoint.
 */
export interface DepartmentsResponse {
	departments: Department[];
}

/**
 * Pagination parameters for endpoints supporting infinite scrolling.
 */
export interface PaginationParams {
	page?: number;
	pageSize?: number;
}

/**
 * Augmented response for infinite pagination of objects.
 */
export interface PaginatedObjectsResponse extends ObjectsResponse {
	pageObjectIDs: number[];
	page: number;
	pageSize: number;
	hasMore: boolean;
	nextPage?: number;
}

/**
 * Augmented response for infinite pagination of search results.
 */
export interface PaginatedSearchResponse extends ObjectsResponse {
	page: number;
	pageSize: number;
	hasMore: boolean;
	nextPage?: number;
}

/**
 * Augmented response for infinite pagination of departments.
 */
export interface PaginatedDepartmentsResponse extends DepartmentsResponse {
	pageDepartments: Department[];
	page: number;
	pageSize: number;
	hasMore: boolean;
	nextPage?: number;
}

/**
 * Fetches a list of all valid object IDs, returning paginated data for infinite scrolling.
 */
export async function getObjects(
	params: PaginationParams & {
		metadataDate?: string;
		departmentIds?: string;
	} = {},
	fetchOptions?: RequestInit,
): Promise<PaginatedObjectsResponse> {
	const url = new URL(`${BASE_URL}/objects`);

	const response = await fetch(url.toString(), fetchOptions);
	if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
	const data: ObjectsResponse = await response.json();

	const page = params.page ?? 0;
	const pageSize = params.pageSize ?? 10;
	const totalCount = data.objectIDs.length;
	const offset = page * pageSize;

	const pageObjectIDs = data.objectIDs.slice(offset, offset + pageSize);
	const hasMore = offset + pageSize < totalCount;
	const nextPage = hasMore ? page + 1 : undefined;

	return {
		...data,
		pageObjectIDs,
		page,
		pageSize,
		hasMore,
		nextPage,
	};
}

/**
 * Fetches detailed metadata for a single object by its ID.
 */
export async function getObject(
	objectID: number,
	fetchOptions?: RequestInit,
): Promise<ObjectResponse> {
	const url = `${BASE_URL}/objects/${objectID}`;
	const response = await fetch(url, fetchOptions);
	if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
	return response.json();
}

/**
 * Fetches a list of all curatorial departments, returning paginated results.
 */
export async function getDepartments(
	params: PaginationParams = {},
	fetchOptions?: RequestInit,
): Promise<PaginatedDepartmentsResponse> {
	const url = new URL(`${BASE_URL}/departments`);
	const response = await fetch(url.toString(), fetchOptions);
	if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
	const data: DepartmentsResponse = await response.json();

	const page = params.page ?? 0;
	const pageSize = params.pageSize ?? 10;
	const totalCount = data.departments.length;
	const offset = page * pageSize;

	const pageDepartments = data.departments.slice(offset, offset + pageSize);
	const hasMore = offset + pageSize < totalCount;
	const nextPage = hasMore ? page + 1 : undefined;

	return {
		departments: data.departments,
		pageDepartments,
		page,
		pageSize,
		hasMore,
		nextPage,
	};
}

/**
 * Searches for objects matching the provided query parameters, returning paginated data.
 */
export async function search(
	params: Partial<SearchParams> & PaginationParams,
	fetchOptions?: RequestInit,
): Promise<PaginatedSearchResponse> {
	const { page = 0, pageSize = 10, ...queryParams } = params;
	const url = new URL(`${BASE_URL}/search`);
	const queryString = serializeSearchParams(url, queryParams);
	const response = await fetch(queryString, fetchOptions);
	console.log(response);

	if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
	const result: ObjectsResponse = await response.json();

	const totalCount = result.total;
	const offset = page * pageSize;
	const pageIDs = result.objectIDs.slice(offset, offset + pageSize);
	const hasMore = offset + pageSize < totalCount;
	const nextPage = hasMore ? page + 1 : undefined;

	return {
		total: result.total,
		page,
		pageSize,
		objectIDs: pageIDs,
		hasMore,
		nextPage,
	};
}

export { searchParamsParsers, serializeSearchParams };
