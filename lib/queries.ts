import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import {
  getDepartments,
  getObjectById,
  getObjectsByDepartment,
  searchObjects,
  getRandomFeaturedArtwork,
  getDetailedDepartments,
  getDetailedDepartment,
  getAllRegions,
  getAllPeriods,
  getDepartmentHighlights,
  getCollectionHighlight,
  getFeaturedCollection,
  getFilteredCollection,
  getArtPeriods,
  getArtStyles,
  getArtMediums,
} from "@/lib/api"
import type { CollectionFilterOptions } from "@/lib/types"

// Query keys
export const queryKeys = {
  departments: ["departments"],
  departmentDetail: (id: number) => ["department", id],
  detailedDepartments: ["detailedDepartments"],
  objectsByDepartment: (departmentId?: number) => ["objects", "department", departmentId],
  objectDetail: (id: number) => ["object", id],
  searchResults: (query: string, isId: boolean) => ["search", query, isId],
  featuredArtwork: ["featuredArtwork"],
  regions: ["regions"],
  periods: ["periods"],
  departmentHighlights: ["departmentHighlights"],
  collectionHighlight: ["collectionHighlight"],
  featuredCollection: (limit: number) => ["featuredCollection", limit],
  filteredCollection: (options: CollectionFilterOptions) => [
    "filteredCollection",
    options.page,
    options.period,
    options.style,
    options.medium,
    options.sort,
    options.highlight,
    options.publicDomain,
    options.limit,
  ],
  artPeriods: ["artPeriods"],
  artStyles: ["artStyles"],
  artMediums: ["artMediums"],
}

// Departments
export function useDepartments() {
  return useQuery({
    queryKey: queryKeys.departments,
    queryFn: getDepartments,
  })
}

export function useDepartmentsSuspense() {
  return useSuspenseQuery({
    queryKey: queryKeys.departments,
    queryFn: getDepartments,
  })
}

// Detailed Departments
export function useDetailedDepartments() {
  return useQuery({
    queryKey: queryKeys.detailedDepartments,
    queryFn: getDetailedDepartments,
  })
}

export function useDetailedDepartmentsSuspense() {
  return useSuspenseQuery({
    queryKey: queryKeys.detailedDepartments,
    queryFn: getDetailedDepartments,
  })
}

// Single Department Detail
export function useDetailedDepartment(departmentId: number) {
  return useQuery({
    queryKey: queryKeys.departmentDetail(departmentId),
    queryFn: () => getDetailedDepartment(departmentId),
    enabled: !!departmentId,
  })
}

export function useDetailedDepartmentSuspense(departmentId: number) {
  return useSuspenseQuery({
    queryKey: queryKeys.departmentDetail(departmentId),
    queryFn: () => getDetailedDepartment(departmentId),
  })
}

// Objects by Department
export function useObjectsByDepartment(departmentId?: number) {
  return useQuery({
    queryKey: queryKeys.objectsByDepartment(departmentId),
    queryFn: () => getObjectsByDepartment(departmentId),
  })
}

export function useObjectsByDepartmentSuspense(departmentId?: number) {
  return useSuspenseQuery({
    queryKey: queryKeys.objectsByDepartment(departmentId),
    queryFn: () => getObjectsByDepartment(departmentId),
  })
}

// Object Detail
export function useObjectDetail(objectId: number) {
  return useQuery({
    queryKey: queryKeys.objectDetail(objectId),
    queryFn: () => getObjectById(objectId),
    enabled: !!objectId,
  })
}

export function useObjectDetailSuspense(objectId: number) {
  return useSuspenseQuery({
    queryKey: queryKeys.objectDetail(objectId),
    queryFn: () => getObjectById(objectId),
  })
}

// Search
export function useSearchObjects(query: string, isId: boolean) {
  return useQuery({
    queryKey: queryKeys.searchResults(query, isId),
    queryFn: () => searchObjects(query, isId),
    enabled: !!query,
  })
}

export function useSearchObjectsSuspense(query: string, isId: boolean) {
  return useSuspenseQuery({
    queryKey: queryKeys.searchResults(query, isId),
    queryFn: () => searchObjects(query, isId),
  })
}

// Featured Artwork
export function useRandomFeaturedArtwork() {
  return useQuery({
    queryKey: queryKeys.featuredArtwork,
    queryFn: getRandomFeaturedArtwork,
  })
}

// Regions
export function useAllRegions() {
  return useQuery({
    queryKey: queryKeys.regions,
    queryFn: getAllRegions,
  })
}

// Periods
export function useAllPeriods() {
  return useQuery({
    queryKey: queryKeys.periods,
    queryFn: getAllPeriods,
  })
}

// Department Highlights
export function useDepartmentHighlights() {
  return useQuery({
    queryKey: queryKeys.departmentHighlights,
    queryFn: getDepartmentHighlights,
  })
}

// Collection Highlight
export function useCollectionHighlight() {
  return useQuery({
    queryKey: queryKeys.collectionHighlight,
    queryFn: getCollectionHighlight,
  })
}

// Featured Collection
export function useFeaturedCollection(limit = 3) {
  return useQuery({
    queryKey: queryKeys.featuredCollection(limit),
    queryFn: () => getFeaturedCollection(limit),
  })
}

// Filtered Collection
export function useFilteredCollection(options: CollectionFilterOptions) {
  return useQuery({
    queryKey: queryKeys.filteredCollection(options),
    queryFn: () => getFilteredCollection(options),
  })
}

// Art Periods
export function useArtPeriods() {
  return useQuery({
    queryKey: queryKeys.artPeriods,
    queryFn: getArtPeriods,
  })
}

// Art Styles
export function useArtStyles() {
  return useQuery({
    queryKey: queryKeys.artStyles,
    queryFn: getArtStyles,
  })
}

// Art Mediums
export function useArtMediums() {
  return useQuery({
    queryKey: queryKeys.artMediums,
    queryFn: getArtMediums,
  })
}

// Prefetching utilities
export function usePrefetchObject(objectId: number) {
  const queryClient = useQueryClient()

  return () => {
    if (objectId) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.objectDetail(objectId),
        queryFn: () => getObjectById(objectId),
      })
    }
  }
}

export function usePrefetchDepartment(departmentId: number) {
  const queryClient = useQueryClient()

  return () => {
    if (departmentId) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.departmentDetail(departmentId),
        queryFn: () => getDetailedDepartment(departmentId),
      })

      queryClient.prefetchQuery({
        queryKey: queryKeys.objectsByDepartment(departmentId),
        queryFn: () => getObjectsByDepartment(departmentId),
      })
    }
  }
}

export function usePrefetchCollection(options: CollectionFilterOptions) {
  const queryClient = useQueryClient()

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.filteredCollection(options),
      queryFn: () => getFilteredCollection(options),
    })
  }
}
