import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../utils/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(UsersService.name);

  // ✅ Get all users
  public async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    try {
      this.logger.log('Fetching all users');
      return await this.prisma.user.findMany(params);
    } catch (err) {
      this.logger.error('Failed to fetch users', err);
      throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ Get a single user by ID
  public async user(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    try {
      this.logger.log(`Fetching user with ID: ${where.id}`);
      return await this.prisma.user.findUnique({ where });
    } catch (err) {
      this.logger.error(`Failed to fetch user ${where.id}`, err);
      throw new HttpException('Failed to fetch user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ Create a new user
  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      this.logger.log(`Creating new user: ${data.email}`);
      return await this.prisma.user.create({ data });
    } catch (err) {
      this.logger.error('Failed to create user', err);
      throw new HttpException('Failed to create user', HttpStatus.BAD_REQUEST);
    }
  }

  // ✅ Update an existing user
  public async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    try {
      this.logger.log(`Updating user with ID: ${where.id}`);
      return await this.prisma.user.update({ where, data });
    } catch (err) {
      this.logger.error(`Failed to update user ${where.id}`, err);
      throw new HttpException('Failed to update user', HttpStatus.BAD_REQUEST);
    }
  }

  // ✅ Delete a user
  public async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    try {
      this.logger.log(`Deleting user with ID: ${where.id}`);
      return await this.prisma.user.delete({ where });
    } catch (err) {
      this.logger.error(`Failed to delete user ${where.id}`, err);
      throw new HttpException('Failed to delete user', HttpStatus.NOT_FOUND);
    }
  }
}
