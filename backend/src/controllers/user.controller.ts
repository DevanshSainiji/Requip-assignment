import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { parseId } from '../utils/parseId';
import { CreateUserInput, UpdateUserInput, PaginationQuery } from '../validations/user.validation';

/**
 * UserController — translates HTTP requests into service calls and formats responses.
 *
 * It assumes validation middleware has already run, so req.body / req.query
 * are typed and clean. All async handlers pass errors to `next(error)` which
 * routes them to the global error handler.
 */
export class UserController {
  /**
   * POST /api/v1/users
   * Create a new user.
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body as CreateUserInput;
      const user = await userService.createUser(userData);
      sendSuccess(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/users
   * Get a paginated list of users.
   */
  getList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // req.query has been validated and coerced by validateQuery(paginationQuerySchema)
      const { page, limit, search } = req.query as unknown as PaginationQuery;
      const result = await userService.getUsers(page, limit, search);
      sendSuccess(res, result.data, 'Users fetched successfully', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/users/:id
   * Update an existing user.
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // parseId handles undefined (noUncheckedIndexedAccess) and non-numeric strings
      const id = parseId(req.params['id']);
      if (id === null) {
        sendError(res, 'Invalid user ID', 400);
        return;
      }

      const userData = req.body as UpdateUserInput;
      const user = await userService.updateUser(id, userData);
      sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/users/:id
   * Soft delete a user.
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseId(req.params['id']);
      if (id === null) {
        sendError(res, 'Invalid user ID', 400);
        return;
      }

      await userService.deleteUser(id);
      sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
