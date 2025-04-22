import type {
	ArtObject,
	CollectionFilterOptions,
	CollectionHighlight,
	CollectionItem,
	CollectionResult,
	Department,
	DepartmentHighlight,
	DetailedDepartment,
} from "@/lib/types";

const API_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

// Get a list of all departments
export async function getDepartments(): Promise<Department[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/departments`);

		if (!response.ok) {
			throw new Error(`Failed to fetch departments: ${response.status}`);
		}

		const data = await response.json();
		return data.departments;
	} catch (error) {
		console.error("Error fetching departments:", error);
		return [];
	}
}

// Get objects by department
export async function getObjectsByDepartment(departmentId?: number) {
	try {
		let url = `${API_BASE_URL}/objects`;

		if (departmentId) {
			url = `${API_BASE_URL}/objects?departmentIds=${departmentId}`;
		}

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch objects: ${response.status}`);
		}

		const data = await response.json();
		return {
			total: data.total || 0,
			objectIDs: data.objectIDs || [],
		};
	} catch (error) {
		console.error("Error fetching objects:", error);
		return { total: 0, objectIDs: [] };
	}
}

// Get object by ID
export async function getObjectById(
	objectId: number,
): Promise<ArtObject | null> {
	try {
		const response = await fetch(`${API_BASE_URL}/objects/${objectId}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch object ${objectId}: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error(`Error fetching object ${objectId}:`, error);
		return null;
	}
}

// Search objects by title or ID
export async function searchObjects(
	query: string,
	isId = false,
): Promise<number[]> {
	try {
		if (isId) {
			// If searching by ID, just return the ID if it's a valid number
			const objectId = Number.parseInt(query);
			if (!Number.isNaN(objectId)) {
				// Check if the object exists
				const object = await getObjectById(objectId);
				return object ? [objectId] : [];
			}
			return [];
		}

		// Search by title
		const response = await fetch(
			`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`,
		);

		if (!response.ok) {
			throw new Error(`Failed to search objects: ${response.status}`);
		}

		const data = await response.json();
		return data.objectIDs || [];
	} catch (error) {
		console.error("Error searching objects:", error);
		return [];
	}
}

// Get a random featured artwork (with image)
export async function getRandomFeaturedArtwork(): Promise<ArtObject | null> {
	try {
		// Featured artwork IDs with good images
		const featuredArtworkIds = [
			436535, // Wheat Field with Cypresses - Van Gogh
			459106, // Bridge over a Pond of Water Lilies - Monet
			437984, // Irises - Van Gogh
			438722, // Bouquet of Sunflowers - Van Gogh
			436947, // The Starry Night - Van Gogh
			435882, // The Harvesters - Pieter Bruegel
			437133, // The Dance Class - Degas
			438815, // The Gulf of Marseilles - Cézanne
			436965, // Garden at Sainte-Adresse - Monet
			437430, // The Death of Socrates - Jacques-Louis David
			10481, // The Great Wave off Kanagawa - Hokusai
			11417, // Sphinx of Hatshepsut
			544740, // Aristotle with a Bust of Homer - Rembrandt
			435809, // View of Toledo - El Greco
			436282, // Young Woman with a Water Pitcher - Vermeer
		];

		// Get a random ID from the featured list
		const randomId =
			featuredArtworkIds[Math.floor(Math.random() * featuredArtworkIds.length)];

		return await getObjectById(randomId);
	} catch (error) {
		console.error("Error fetching featured artwork:", error);
		return null;
	}
}

// Get detailed department information
export async function getDetailedDepartments(): Promise<DetailedDepartment[]> {
	try {
		// First get basic department data from the API
		const departments = await getDepartments();

		// Enhance with additional details (this would typically come from a database,
		// but we're creating mock data since the Met API doesn't provide these details)
		return departments.map((dept) => {
			const detailedDept = departmentDetails.find(
				(d) => d.departmentId === dept.departmentId,
			);

			if (detailedDept) {
				return {
					...dept,
					...detailedDept,
				};
			}

			// Fallback with generated data if we don't have details for this department
			return {
				...dept,
				description: `The ${dept.displayName} department houses a diverse collection of artworks and artifacts.`,
				longDescription: `The ${dept.displayName} department at the Metropolitan Museum of Art houses a diverse collection of artworks and artifacts spanning multiple centuries and regions. The collection includes various media and styles that showcase the rich cultural heritage represented in this department.`,
				image: `/placeholder.svg?height=800&width=1200&query=art%20${encodeURIComponent(dept.displayName)}`,
				regions: ["Global"],
				periods: ["Various"],
				highlights: [],
				collectionSize: Math.floor(Math.random() * 50000) + 1000,
				location: "Main Building",
				curator: "",
			};
		});
	} catch (error) {
		console.error("Error fetching detailed departments:", error);
		return [];
	}
}

// Get a specific department with detailed information
export async function getDetailedDepartment(
	departmentId: number,
): Promise<DetailedDepartment | null> {
	try {
		const departments = await getDetailedDepartments();
		return (
			departments.find((dept) => dept.departmentId === departmentId) || null
		);
	} catch (error) {
		console.error(`Error fetching department ${departmentId}:`, error);
		return null;
	}
}

// Get all unique regions across departments
export async function getAllRegions(): Promise<string[]> {
	try {
		const departments = await getDetailedDepartments();
		const allRegions = new Set<string>();

		departments.forEach((dept) => {
			dept.regions.forEach((region) => {
				allRegions.add(region);
			});
		});

		return Array.from(allRegions).sort();
	} catch (error) {
		console.error("Error fetching regions:", error);
		return [];
	}
}

// Get all unique periods across departments
export async function getAllPeriods(): Promise<string[]> {
	try {
		const departments = await getDetailedDepartments();
		const allPeriods = new Set<string>();

		departments.forEach((dept) => {
			dept.periods.forEach((period) => {
				allPeriods.add(period);
			});
		});

		return Array.from(allPeriods).sort();
	} catch (error) {
		console.error("Error fetching periods:", error);
		return [];
	}
}

// Get department highlights for hero section
export async function getDepartmentHighlights(): Promise<
	DepartmentHighlight[]
> {
	return [
		{
			name: "European Paintings",
			description: "Masterpieces from the Renaissance to Post-Impressionism",
			image: "/grand-european-hall.png",
		},
		{
			name: "Egyptian Art",
			description: "Ancient artifacts spanning over 4,000 years of history",
			image: "/karnak-columns.png",
		},
		{
			name: "Arms and Armor",
			description: "Ornate weapons and armor from around the world",
			image: "/armored-duel.png",
		},
		{
			name: "Asian Art",
			description: "Diverse works from across the Asian continent",
			image: "/serene-asian-temple.png",
		},
		{
			name: "Greek and Roman Art",
			description: "Classical sculptures, pottery, and artifacts",
			image: "/classical-collection.png",
		},
	];
}

// Get collection highlight for hero section
export async function getCollectionHighlight(): Promise<CollectionHighlight> {
	return {
		title: "Masterpieces Through the Ages",
		description:
			"Explore our curated collection featuring iconic works from different periods and cultures",
		image: "/collection-highlight.png",
	};
}

// Get featured collection items
export async function getFeaturedCollection(
	limit = 3,
): Promise<CollectionItem[]> {
	try {
		// Featured artwork IDs with good images
		const featuredArtworkIds = [
			436535, // Wheat Field with Cypresses - Van Gogh
			459106, // Bridge over a Pond of Water Lilies - Monet
			437984, // Irises - Van Gogh
			438722, // Bouquet of Sunflowers - Van Gogh
			436947, // The Starry Night - Van Gogh
			435882, // The Harvesters - Pieter Bruegel
			437133, // The Dance Class - Degas
			438815, // The Gulf of Marseilles - Cézanne
			436965, // Garden at Sainte-Adresse - Monet
			437430, // The Death of Socrates - Jacques-Louis David
			10481, // The Great Wave off Kanagawa - Hokusai
			11417, // Sphinx of Hatshepsut
			544740, // Aristotle with a Bust of Homer - Rembrandt
			435809, // View of Toledo - El Greco
			436282, // Young Woman with a Water Pitcher - Vermeer
		];

		// Shuffle and take the requested number
		const shuffled = [...featuredArtworkIds].sort(() => 0.5 - Math.random());
		const selected = shuffled.slice(0, limit);

		// Fetch the objects
		const items = await Promise.all(
			selected.map(async (id) => {
				const object = await getObjectById(id);
				if (!object) return null;

				return {
					id: object.objectID,
					title: object.title || "Untitled",
					artist: object.artistDisplayName || "Unknown Artist",
					image: object.primaryImage || "/placeholder.svg",
					description: object.objectDescription || "No description available.",
					period: object.period || undefined,
					style: object.classification || undefined,
					medium: object.medium || undefined,
					isHighlight: object.isHighlight,
					isPublicDomain: object.isPublicDomain,
					date: object.objectDate || undefined,
				};
			}),
		);

		return items.filter((item): item is CollectionItem => item !== null);
	} catch (error) {
		console.error("Error fetching featured collection:", error);
		return [];
	}
}

// Get filtered collection
export async function getFilteredCollection(
	options: CollectionFilterOptions,
): Promise<CollectionResult> {
	try {
		// In a real application, we would make an API call with these filters
		// For this demo, we'll simulate filtering with mock data

		// Get some objects from the API to start with
		const departmentId =
			options.period === "Ancient"
				? 10
				: options.period === "Renaissance"
					? 11
					: undefined;
		const result = await getObjectsByDepartment(departmentId);

		// Take a subset of IDs for this page
		const startIndex = (options.page - 1) * (options.limit || 12);
		const endIndex = startIndex + (options.limit || 12);
		const pageObjectIds = result.objectIDs?.slice(startIndex, endIndex) || [];

		// Fetch details for each object
		const objectsPromises = pageObjectIds.map(async (id) => {
			const object = await getObjectById(id);
			if (!object) return null;

			// Apply filters
			if (options.highlight && !object.isHighlight) return null;
			if (options.publicDomain && !object.isPublicDomain) return null;
			if (options.style && object.classification !== options.style) return null;
			if (
				options.medium &&
				!object.medium?.toLowerCase().includes(options.medium.toLowerCase())
			)
				return null;

			return {
				id: object.objectID,
				title: object.title || "Untitled",
				artist: object.artistDisplayName || "Unknown Artist",
				image: object.primaryImage || "/placeholder.svg",
				description: object.objectDescription || "No description available.",
				period: object.period || undefined,
				style: object.classification || undefined,
				medium: object.medium || undefined,
				isHighlight: object.isHighlight,
				isPublicDomain: object.isPublicDomain,
				date: object.objectDate || undefined,
			};
		});

		const objects = await Promise.all(objectsPromises);
		const filteredObjects = objects.filter(
			(item): item is CollectionItem => item !== null,
		);

		// Apply sorting
		const sortedObjects = sortCollectionItems(
			filteredObjects,
			options.sort || "relevance",
		);

		return {
			items: sortedObjects,
			totalItems: result.total,
			totalPages: Math.ceil(result.total / (options.limit || 12)),
		};
	} catch (error) {
		console.error("Error fetching filtered collection:", error);
		return {
			items: [],
			totalItems: 0,
			totalPages: 1,
		};
	}
}

// Get art periods
export async function getArtPeriods(): Promise<string[]> {
	return [
		"Ancient",
		"Medieval",
		"Renaissance",
		"Baroque",
		"Neoclassical",
		"Romantic",
		"Impressionist",
		"Modern",
		"Contemporary",
	];
}

// Get art styles
export async function getArtStyles(): Promise<string[]> {
	return [
		"Painting",
		"Sculpture",
		"Drawing",
		"Print",
		"Photograph",
		"Textile",
		"Ceramic",
		"Furniture",
		"Jewelry",
		"Armor",
	];
}

// Get art mediums
export async function getArtMediums(): Promise<string[]> {
	return [
		"Oil on canvas",
		"Watercolor",
		"Marble",
		"Bronze",
		"Wood",
		"Ink",
		"Tempera",
		"Acrylic",
		"Mixed media",
		"Silver",
		"Gold",
		"Ceramic",
	];
}

// Helper function to sort collection items
function sortCollectionItems(
	items: CollectionItem[],
	sort: string,
): CollectionItem[] {
	const sortedItems = [...items];

	switch (sort) {
		case "date-asc":
			return sortedItems.sort((a, b) =>
				(a.date || "").localeCompare(b.date || ""),
			);
		case "date-desc":
			return sortedItems.sort((a, b) =>
				(b.date || "").localeCompare(a.date || ""),
			);
		case "title-asc":
			return sortedItems.sort((a, b) => a.title.localeCompare(b.title));
		case "title-desc":
			return sortedItems.sort((a, b) => b.title.localeCompare(a.title));
		default:
			return sortedItems;
	}
}
