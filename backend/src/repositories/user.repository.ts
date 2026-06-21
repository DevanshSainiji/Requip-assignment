import { Prisma, User } from '@prisma/client';
import { prisma } from '../lib/prisma';

/**
 * UserRepository — handles all direct database interactions for the User model.
 *
 * All methods use Prisma's generated `User` type as the return shape.
 * The service layer never calls Prisma directly — all DB logic lives here.
 */
export class UserRepository {
  /**
   * Create a new user.
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  /**
   * Find an active (non-deleted) user by ID.
   * Returns null if the user doesn't exist or is soft-deleted.
   */
  async findById(id: number): Promise<User | null> {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  /**
   * Get a paginated list of active users, optionally filtered by search text.
   *
   * The two queries (data + count) run in parallel via Promise.all for
   * better throughput under load. Both share the same `where` clause to
   * guarantee the count and the page contents are always consistent.
   *
   * NOTE: MySQL's LIKE '%term%' does a full table scan — no index is used
   * for the contains filter. Acceptable for this dataset size; a full-text
   * index (`CREATE FULLTEXT INDEX`) would be needed at scale.
   */
  async findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Update a user's fields.
   *
   * Uses the primary key for the `where` clause. The service layer is
   * responsible for verifying the user exists and is active before calling
   * this method.
   */
  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Soft delete a user atomically.
   *
   * TOCTOU FIX: Uses `updateMany` with `{ id, deletedAt: null }` so the
   * operation only succeeds if the record is CURRENTLY active. This avoids
   * the race condition between "check if active" + "then delete" that a
   * two-step approach would have.
   *
   * Returns the count of rows affected (0 = user not found or already deleted,
   * 1 = successfully soft-deleted). The service uses this count to throw
   * NotFoundError if 0, eliminating the need for a pre-check query.
   */
  async softDelete(id: number): Promise<number> {
    const { count } = await prisma.user.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    return count;
  }
}

export const userRepository = new UserRepository();
