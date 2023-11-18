import { ApiResponseStatus } from 'src/enum/api-response.enum';

export class ApiResponse<T> {
  status: ApiResponseStatus;
  data?: T;
  error?: string;

  constructor(status: ApiResponseStatus, data?: T, error?: string) {
    this.status = status;
    this.data = data;
    this.error = error;
  }
}
