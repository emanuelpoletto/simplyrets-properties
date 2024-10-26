export interface PaginationResponse {
  skip: number;
  take: number;
  count: number;
}

export interface PaginationInput extends Partial<Omit<PaginationResponse, 'count'>> {}
