export interface MetadataItem {
  id: string;
  name: string;
}

export interface ProductTypesResponse {
  productTypes: MetadataItem[];
}

export interface AllergensResponse {
  allergens: MetadataItem[];
}
