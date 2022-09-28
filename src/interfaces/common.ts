export interface ResultType {
  result?: boolean;
  message?: string;
  data?: any;
  page?: {
    offset: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}
