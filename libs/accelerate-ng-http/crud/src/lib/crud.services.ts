// external imports
import jQuery from 'jquery';
import { map, Observable } from 'rxjs';

// internal imports
import { GenericType } from '@rn-accelerate-ng/core';
import {
  AbstractHTTPService,
  BaseResponse,
  DownloadResponse,
} from '@rn-accelerate-ng/http';
import {
  BulkDeleteResponse,
  ListResponse,
  ReadModel,
  UploadResponse,
  WriteModel,
} from './crud.types';

/**
 * Abstract class for backend service.
 * @template $Q - Type extending RequestModel.
 * @template $S - Type extending ResponseModel.
 */
export abstract class BackendService<
  $Q extends WriteModel,
  $S extends ReadModel,
> extends AbstractHTTPService {
  /**
   * Constructor for BackendService.
   * @param basePath - Base path for the service.
   * @param apiPath - API path for the service.
   */
  constructor(apiPath: string) {
    super(apiPath);
  }

  /**
   * Retrieves the list of entities.
   * @param queryParams - Query parameters for the request.
   * @param options - Additional options for the request.
   * @returns Observable of ListResponse.
   */
  list(
    queryParams?: GenericType,
    options?: GenericType,
  ): Observable<ListResponse<$S>> {
    queryParams ??= {};
    queryParams['limit'] ??= 2000;

    return this.GET<ListResponse<$S>>('list', '', queryParams, options);
  }

  /**
   * Creates a new entity.
   * @param object - Object to be created.
   * @param options - Additional options for the request.
   * @returns Observable of created entity.
   */
  create(object: $Q, options?: GenericType): Observable<$S> {
    return this.POST<$S>('create', '', object, {}, options);
  }

  /**
   * Retrieves the entity for the given id.
   * @param id - ID of the entity.
   * @param queryParams - Query parameters for the request.
   * @param options - Additional options for the request.
   * @returns Observable of the entity.
   */
  read(
    id: number,
    queryParams?: GenericType,
    options?: GenericType,
  ): Observable<$S> {
    return this.GET<$S>('read', String(id), queryParams, options);
  }

  /**
   * Updates the entity for the given id.
   * @param id - ID of the entity.
   * @param object - Object to be updated.
   * @param options - Additional options for the request.
   * @returns Observable of updated entity.
   */
  update(id: number, object: $Q, options?: GenericType): Observable<$S> {
    return this.PUT<$S>('update', String(id), object, {}, options);
  }

  /**
   * Deletes the entity for the given id.
   * @param id - ID of the entity.
   * @param options - Additional options for the request.
   * @returns Observable of boolean indicating success.
   */
  delete(id: number, options?: GenericType): Observable<boolean> {
    return this.DELETE<BaseResponse>(
      'delete',
      String(id),
      {},
      {},
      options,
    ).pipe(map((_response: BaseResponse) => _response['status'] === 'success'));
  }

  /**
   * Provides the path for dropzone upload.
   * @param fileInputId - ID of the file input element.
   * @param options - Additional options for the request.
   * @returns Observable of UploadResponse.
   */
  upload(
    fileInputId: string,
    options?: GenericType,
  ): Observable<UploadResponse> {
    console.info(
      'BackendService.upload: fileInputId = %s | options = %s',
      fileInputId,
      options,
    );
    const formData = new FormData();
    formData.append('file', jQuery(`#${fileInputId}`).prop('files')[0]);

    return this.POST<UploadResponse>('upload', 'upload', formData, {}, options);
  }

  /**
   * Provides the path for dropzone upload template.
   * @param queryParams - Query parameters for the request.
   * @param options - Additional options for the request.
   * @returns Observable of DownloadResponse.
   */
  uploadTemplate(
    queryParams?: GenericType,
    options?: GenericType,
  ): Observable<DownloadResponse> {
    return this.GET<DownloadResponse>(
      'download',
      'upload/template',
      queryParams,
      options,
    );
  }

  /**
   * Provides the path for downloading.
   * @param queryParams - Query parameters for the request.
   * @param options - Additional options for the request.
   * @returns Observable of DownloadResponse.
   */
  download(
    queryParams?: GenericType,
    options?: GenericType,
  ): Observable<DownloadResponse> {
    return this.POST<DownloadResponse>(
      'download',
      'download',
      queryParams,
      {},
      options,
    );
  }

  /**
   * Creates multiple entities.
   * @param objects - Array of objects to be created.
   * @param options - Additional options for the request.
   * @returns Observable of array of created entities.
   */
  bulkCreate(objects: $Q[], options?: GenericType): Observable<$S[]> {
    return this.POST<$S[]>('bulkCreate', 'bulk-create', objects, {}, options);
  }

  /**
   * Deletes multiple entities for the given ids.
   * @param ids - Array of IDs of the entities.
   * @param options - Additional options for the request.
   * @returns Observable of BulkDeleteResponse.
   */
  bulkDelete(
    ids: number[],
    options?: GenericType,
  ): Observable<BulkDeleteResponse> {
    return this.DELETE<BulkDeleteResponse>(
      'bulkDelete',
      'bulk-delete',
      { ids: ids },
      {},
      options,
    );
  }
}
