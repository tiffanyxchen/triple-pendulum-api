import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, User } from '@prisma/client';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name);

  // ✅ Create a new user
  @Post()
  public async create(@Body() data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.usersService.createUser(data);
    } catch (err) {
      this.logger.error('Failed to create user', err);
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ✅ Get all users
  @Get()
  public async getAll(): Promise<User[]> {
    try {
      return await this.usersService.users({});
    } catch (err) {
      this.logger.error('Failed to get users', err);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ Get a single user by ID
  @Get(':id')
  public async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.user({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // ✅ Update user
  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<User> {
    try {
      return await this.usersService.updateUser({
        where: { id },
        data,
      });
    } catch (err) {
      this.logger.error(`Failed to update user ${id}`, err);
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ✅ Delete user
  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      return await this.usersService.deleteUser({ id });
    } catch (err) {
      this.logger.error(`Failed to delete user ${id}`, err);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}

