import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email';

/**
 * User Repository Interface
 * Defines the contract for user data access
 */
export interface IUserRepository {
  /**
   * Saves a user to the database
   * @param user - User entity to save
   * @returns Promise<User> saved user with ID
   */
  save(user: User): Promise<User>;

  /**
   * Finds a user by ID
   * @param id - User ID
   * @returns Promise<User | null> user or null if not found
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by email
   * @param email - User email
   * @returns Promise<User | null> user or null if not found
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Finds all users with pagination
   * @param skip - Number of records to skip
   * @param take - Number of records to take
   * @returns Promise<User[]> array of users
   */
  findAll(skip?: number, take?: number): Promise<User[]>;

  /**
   * Counts total number of users
   * @returns Promise<number> total count
   */
  count(): Promise<number>;

  /**
   * Updates a user
   * @param user - User entity with updates
   * @returns Promise<User> updated user
   */
  update(user: User): Promise<User>;

  /**
   * Deletes a user by ID
   * @param id - User ID
   * @returns Promise<void>
   */
  delete(id: string): Promise<void>;

  /**
   * Checks if email already exists
   * @param email - Email to check
   * @param excludeUserId - User ID to exclude from check (for updates)
   * @returns Promise<boolean> true if exists
   */
  emailExists(email: Email, excludeUserId?: string): Promise<boolean>;
}

