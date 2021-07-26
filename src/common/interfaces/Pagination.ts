export interface WithPaginationOptions {
  page?: number;
  limit?: number;
}

export interface WithPaginationResult<T> {
  data: T[];
  total: number; // total data, not per page
  page: {
    limit: number; // show per page
    total: number; // total page per page
    current: number; // current page
  };
}
