import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client'; // using Prisma User type

@Controller('users') // ✅ Correct route, not 'orders'
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Get all users
  @Get()
  public async users(): Promise<User[]> {
    return await this.usersService.users({});
  }

  // ✅ Get a user by ID
  @Get(':id')
  public async user(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.user({ id });
  }

  // ✅ Create a new user
  @Post()
  public async create(@Body() userData: Partial<User>): Promise<User> {
    return await this.usersService.createUser({
      email: userData.email,
      name: userData.name,
      address: userData.address ?? null,
    });
  }

  // ✅ Update existing user
  @Put(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return await this.usersService.updateUser({
      where: { id },
      data: {
        email: userData.email,
        name: userData.name,
        address: userData.address ?? null,
      },
    });
  }
}
