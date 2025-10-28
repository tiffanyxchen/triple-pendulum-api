import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { User } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  public async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  // GET /users/:id
  @Get(':id')
  public async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.getUser(id);
  }

  // POST /users
  @Post()
  public async createUser(@Body() data: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(data);
  }

  // PUT /users/:id
  @Put(':id')
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(id, data);
  }
}
