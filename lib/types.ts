export interface Department {
  departmentId: number
  displayName: string
}

export interface DetailedDepartment extends Department {
  description: string
  longDescription: string
  image: string
  regions: string[]
  periods: string[]
  highlights: string[]
  collectionSize: number
  location: string
  curator: string
}

export interface DepartmentHighlight {
  name: string
  description: string
  image: string
}

export interface ArtObject {
  objectID: number
  isHighlight: boolean
  accessionNumber: string
  accessionYear: string
  isPublicDomain: boolean
  primaryImage: string
  primaryImageSmall: string
  additionalImages: string[]
  constituents: {
    constituentID: number
    role: string
    name: string
    constituentULAN_URL: string
    constituentWikidata_URL: string
  }[]
  department: string
  objectName: string
  title: string
  culture: string
  period: string
  dynasty: string
  reign: string
  portfolio: string
  artistRole: string
  artistPrefix: string
  artistDisplayName: string
  artistDisplayBio: string
  artistSuffix: string
  artistAlphaSort: string
  artistNationality: string
  artistBeginDate: string
  artistEndDate: string
  artistGender: string
  artistWikidata_URL: string
  artistULAN_URL: string
  objectDate: string
  objectBeginDate: number
  objectEndDate: number
  medium: string
  dimensions: string
  measurements: {
    elementName: string
    elementDescription: string
    elementMeasurements: {
      Height: number
      Length: number
      Width: number
    }
  }[]
  creditLine: string
  geographyType: string
  city: string
  state: string
  county: string
  country: string
  region: string
  subregion: string
  locale: string
  locus: string
  excavation: string
  river: string
  classification: string
  rightsAndReproduction: string
  linkResource: string
  metadataDate: string
  repository: string
  objectURL: string
  tags: {
    term: string
    AAT_URL: string
    Wikidata_URL: string
  }[]
  objectWikidata_URL: string
  isTimelineWork: boolean
  GalleryNumber: string
  objectDescription: string
}

export interface CollectionHighlight {
  title: string
  description: string
  image: string
}

export interface CollectionItem {
  id: number
  title: string
  artist: string
  image: string
  description: string
  period?: string
  style?: string
  medium?: string
  isHighlight: boolean
  isPublicDomain: boolean
  date?: string
}

export interface CollectionFilterOptions {
  page: number
  period?: string
  style?: string
  medium?: string
  sort?: string
  highlight?: boolean
  publicDomain?: boolean
  limit?: number
}

export interface CollectionResult {
  items: CollectionItem[]
  totalItems: number
  totalPages: number
}
