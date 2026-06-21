import { User } from '@prisma/client';
import { userRepository } from '../repositories/user.repository';
import { CreateUserInput, UpdateUserInput } from '../validations/user.validation';
import { GetUsersResult } from '../types';
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
   *
   * Unique constraints (email, aadhaar, pan) are enforced at the DB level.
   * A duplicate will cause Prisma to throw a P2002 error, which the global
   * error handler converts to a 409 Conflict response.
   */
  async createUser(data: CreateUserInput): Promise<User> {
    return userRepository.create(data);
  }

  /**
   * Fetch a single active user by ID.
   * Returns NotFoundError if the user doesn't exist or is soft-deleted.
   */
  async getUserById(id: number): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Retrieve a paginated list of active users with pagination metadata.
   * Explicit return type ensures the controller knows the exact shape.
   */
  async getUsers(page: number, limit: number, search?: string): Promise<GetUsersResult> {
    const { data, total } = await userRepository.findPaginated(page, limit, search);

    // Avoid dividing by zero on an unlikely but theoretically possible limit of 0
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

    return {
      data,
      pagination: { page, limit, total, totalPages },
    };
  }

  /**
   * Update an existing user.
   *
   * We do an explicit existence check (findById) before updating so we
   * can return a clean 404 rather than relying solely on Prisma's P2025.
   * The DB-level unique constraints still guard against duplicate email/PAN/Aadhaar.
   *
   * NOTE (TOCTOU): There is a theoretical race condition between findById and
   * update — another request could delete the user in that window. If it does,
   * Prisma throws P2025 which our error handler already maps to a 404. Acceptable
   * for this scope; full mitigation requires optimistic concurrency (version field).
   */
  async updateUser(id: number, data: UpdateUserInput): Promise<User> {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('User not found');
    }

    return userRepository.update(id, data);
  }

  /**
   * Soft delete a user by setting deletedAt.
   *
   * Uses the repository's atomic softDelete (updateMany with deletedAt IS NULL guard)
   * to avoid the TOCTOU window: if the user was already deleted between our check
   * and the update, the count will be 0 and we throw NotFoundError.
   */
  async deleteUser(id: number): Promise<void> {
    const affected = await userRepository.softDelete(id);

    if (affected === 0) {
      throw new NotFoundError('User not found');
    }
  }

  /**
   * Retrieves overall statistics for users.
   */
  async getStats() {
    return userRepository.getStats();
  }
}

export const userService = new UserService();
