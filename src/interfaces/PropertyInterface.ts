import { FindOptionsOrderValue } from 'typeorm';
import { Property } from '../entities';
import { PaginationResponse } from './PaginationInterface';

export interface PropertiesResponse {
  properties: Property[];
  pagination: PaginationResponse;
}

export interface PropertyInput extends Omit<Property, 'id'> {}

export interface PropertyFilter extends Partial<Omit<PropertyInput, 'price'>> {
  priceMin?: number;
  priceMax?: number;
}

export interface PropertyOrder {
  orderBy?: keyof Property;
  order?: FindOptionsOrderValue;
}
