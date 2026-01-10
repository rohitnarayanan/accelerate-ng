// external imports

// internal imports
import { BaseRequest, BaseResponse } from '@rn-accelerate-ng/http';

/**
 * Interface for request model.
 * @extends BaseRequest.
 */
export interface WriteModel extends BaseRequest {
  id?: number | null;
}

/**
 * Interface for response model.
 * @extends BaseResponse.
 */
export interface ReadModel extends BaseResponse {
  readonly id: number;
}

/**
 * Interface for list response.
 * @extends BaseResponse.
 * @template T - Type extending ResponseModel.
 */
export interface ListResponse<T extends ReadModel> extends BaseResponse {
  readonly count: number;
  readonly next?: string | null;
  readonly previous?: string | null;
  readonly results: T[];
}

/**
 * Interface for bulk delete response.
 * @extends BaseResponse.
 */
export interface BulkDeleteResponse extends BaseResponse {
  readonly count: number;
  readonly message: string;
}

/**
 * Interface for upload response.
 * @extends BaseResponse.
 */
export interface UploadResponse extends BaseResponse {
  readonly inserts: number;
  readonly updates: number;
  readonly errors: number;
}
