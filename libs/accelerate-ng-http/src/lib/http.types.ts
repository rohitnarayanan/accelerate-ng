// external imports

// internal imports
import { GenericType } from '@rn-accelerate-ng/core';

/** Base Type for Requests - Can add common request attributes **/
export type BaseRequest = GenericType;

/** Base Type for Response - Can add common response attributes **/
export type BaseResponse = GenericType;

/**
 * Type interface for an error response.
 *
 * @extends BaseResponse
 *
 * @property {number} timestamp - The timestamp when the error occurred.
 * @property {number} status - The HTTP status code of the error.
 * @property {string} error - A short description of the error.
 * @property {string} message - A detailed message about the error.
 * @property {string} path - The path of the request that caused the error.
 */
export interface ErrorResponse extends BaseResponse {
  readonly timestamp: number;
  readonly status: number;
  readonly error: string;
  readonly message: string;
  readonly path: string;
}

/**
 * Type interface for a download response.
 *
 * @extends BaseResponse
 *
 * @property {string} contentType - The MIME type of the downloaded content.
 * @property {string} fileName - The name of the downloaded file.
 * @property {string} data - The base64 encoded data of the downloaded file.
 */
export interface DownloadResponse extends BaseResponse {
  readonly contentType: string;
  readonly fileName: string;
  readonly data: string;
}
