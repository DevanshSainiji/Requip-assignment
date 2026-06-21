import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/apiResponse';
import { CreateUserInput, UpdateUserInput } from '../types';

/**
 * UserController — translates HTTP requests into service calls and formats responses.
 *
 * It assumes validation middleware has already run, so req.body is typed and safe.
 * All async handlers are wrapped in try/catch that pass errors to `next(error)`,
 * which routes them to our global error handler.
 */
export class UserController {
  /**
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
   * Get a paginated list of users.
   */
  getList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // req.query is validated and coerced by `validateQuery` middleware
      const { page, limit, search } = req.query as unknown as {
        page: number;
        limit: number;
        search?: string;
      };
      
      const result = await userService.getUsers(page, limit, search);
      
      sendSuccess(res, result.data, 'Users fetched successfully', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update an existing user.
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'Invalid user ID' });
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
   * Soft delete a user.
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'Invalid user ID' });
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
