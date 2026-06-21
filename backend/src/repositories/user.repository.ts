import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { UserRecord } from '../types';

/**
 * UserRepository — handles all direct database interactions for the User model.
 *
 * Keeping DB queries here isolates Prisma from the business logic layer,
 * making the service layer easier to test (by mocking this repo) and easier
 * to refactor if the DB schema changes.
 */
export class UserRepository {
  /**
   * Create a new user.
   */
  async create(data: Prisma.UserCreateInput): Promise<UserRecord> {
    return prisma.user.create({ data });
  }

  /**
   * Find a user by ID, ensuring they are not soft-deleted.
   */
  async findById(id: number): Promise<UserRecord | null> {
    return prisma.user.findFirst({
      where: {
        id,
        deletedAt: null, // Always exclude soft-deleted records
      },
    });
  }

  /**
   * Get a paginated list of active users, optionally filtered by search text.
   */
  async findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: UserRecord[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null, // Active users only
      ...(search
        ? {
            OR: [
              { name: { contains: search } }, // Case-insensitive in MySQL by default
              { email: { contains: search } },
            ],
          }
        : {}),
    };

    // Run both queries in parallel for performance
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // Newest first
      }),
      prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Update a user's details.
   */
  async update(id: number, data: Prisma.UserUpdateInput): Promise<UserRecord> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Soft delete a user by setting the deletedAt timestamp.
   */
  async softDelete(id: number): Promise<UserRecord> {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const userRepository = new UserRepository();
