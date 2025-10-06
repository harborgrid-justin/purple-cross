/**
 * Refactor Helper - Import this in services/controllers to use constants
 *
 * Usage:
 * import { ServiceHelper } from '../utils/refactor-helper';
 *
 * // Instead of: throw new AppError('Patient not found', 404);
 * throw ServiceHelper.notFound('Patient');
 *
 * // Instead of: throw new AppError('Patient already exists', 400);
 * throw ServiceHelper.alreadyExists('Patient');
 *
 * // Instead of: const { page = 1, limit = 20 } = options;
 * const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = options;
 */

import { AppError } from '../middleware/error-handler';
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  PAGINATION,
  QUERY_MODE,
  SORT_ORDER,
  FIELDS,
} from '../constants';

export class ServiceHelper {
  /**
   * Throw a 404 Not Found error
   */
  static notFound(entity: string): never {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND(entity), HTTP_STATUS.NOT_FOUND);
  }

  /**
   * Throw a 400 Bad Request error for already existing entity
   */
  static alreadyExists(entity: string): never {
    throw new AppError(ERROR_MESSAGES.ALREADY_EXISTS(entity), HTTP_STATUS.BAD_REQUEST);
  }

  /**
   * Get pagination defaults
   */
  static getPagination(options: { page?: number; limit?: number }) {
    return {
      page: options.page ?? PAGINATION.DEFAULT_PAGE,
      limit: options.limit ?? PAGINATION.DEFAULT_LIMIT,
    };
  }

  /**
   * Build pagination response
   */
  static buildPaginationResponse(page: number, limit: number, total: number, data: any[]) {
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Common query modes
   */
  static get queryMode() {
    return QUERY_MODE;
  }

  /**
   * Common sort orders
   */
  static get sortOrder() {
    return SORT_ORDER;
  }

  /**
   * Common field names
   */
  static get fields() {
    return FIELDS;
  }
}

export class ControllerHelper {
  /**
   * Send success response with data
   */
  static success(res: any, data: any, statusCode = HTTP_STATUS.OK) {
    res.status(statusCode).json({
      status: 'success',
      data,
    });
  }

  /**
   * Send created response (201)
   */
  static created(res: any, data: any) {
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      data,
    });
  }

  /**
   * Send no content response (204)
   */
  static noContent(res: any) {
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  /**
   * Send success response with pagination
   */
  static successWithPagination(res: any, result: { data: any[]; pagination: any }) {
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      ...result,
    });
  }
}
