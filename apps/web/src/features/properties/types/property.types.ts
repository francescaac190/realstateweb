export interface PropertyMedia {
  id: string;
  propertyId: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  order: number;
  createdAt: string;
}

export interface PropertyType {
  id: number;
  code: string;
  name: string;
}

export interface PropertyStatus {
  id: number;
  code: string;
  name: string;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  address?: string;
  lat?: number;
  lng?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  suites?: number;
  areaM2?: string;
  builtAreaM2?: string;
  frontM2?: string;
  depthM2?: string;
  totalPrice?: string;
  pricePerM2?: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  agentId?: string;
  cityId?: number;
  zoneId?: number;
  typeId?: number;
  statusId?: number;
  currencyId?: number;
  type?: PropertyType;
  status?: PropertyStatus;
  currency?: Currency;
  media?: PropertyMedia[];
}

export interface CreatePropertyPayload {
  title: string;
  description?: string;
  typeId?: number;
  statusId?: number;
  currencyId?: number;
  totalPrice?: string;
  pricePerM2?: number;
  cityId?: number;
  zoneId?: number;
  address?: string;
  areaM2?: number;
  builtAreaM2?: number;
  frontM2?: number;
  depthM2?: number;
  bedrooms?: number;
  bathrooms?: number;
  suites?: number;
  parking?: number;
  isDraft?: boolean;
  agentId?: string;
  media?: Array<{ type: "IMAGE" | "VIDEO"; url: string; order: number }>;
}

export interface PropertyFilters {
  cityId?: number;
  typeId?: number;
  statusId?: number;
  agentId?: string;
  isDraft?: boolean;
}
