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

export interface PropertyFilters {
  cityId?: number;
  typeId?: number;
  statusId?: number;
  agentId?: string;
  isDraft?: boolean;
}
