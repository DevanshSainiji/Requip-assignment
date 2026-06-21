import { userRepository } from '../repositories/user.repository';
import { CreateUserInput, UpdateUserInput, UserRecord } from '../types';
import { NotFoundError } from '../utils/AppError';

/**
 * UserService — handles business logic and orchestration.
 *
 * It relies on the repository to fetch data and performs business checks
 * before mutating state. Errors thrown here are caught by the controller
 * and routed to the global error handler.
 */
export class UserService {
  /**
   * Create a new user.
   * Unique constraints (email, aadhaar, pan) are enforced by the database,
   * and any violations will throw a P2002 error caught by the global error handler.
   */
  async createUser(data: CreateUserInput): Promise<UserRecord> {
    return userRepository.create(data);
  }

  /**
   * Retrieve a paginated list of users, including pagination metadata.
   */
  async getUsers(page: number, limit: number, search?: string) {
    const { data, total } = await userRepository.findPaginated(page, limit, search);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Update an existing user.
   * If the user doesn't exist or is soft-deleted, throws NotFoundError.
   */
  async updateUser(id: number, data: UpdateUserInput): Promise<UserRecord> {
    // 1. Verify existence and active status
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('User not found');
    }

    // 2. Perform update
    // Uniqueness of email/aadhaar/pan is still guarded by DB constraints
    return userRepository.update(id, data);
  }

  /**
   * Soft delete a user by setting their deletedAt timestamp.
   * Throws NotFoundError if the user is already deleted or missing.
   */
  async deleteUser(id: number): Promise<void> {
    // 1. Verify existence
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('User not found');
    }

    // 2. Soft delete
    await userRepository.softDelete(id);
  }
}

export const userService = new UserService();
