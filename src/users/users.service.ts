import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../utils/prisma.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { User } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // GET ALL USERS
  getUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { orders: true },
    });
  }

  // GET ONE USER
  async getUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { orders: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  // CREATE USER
  createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
      include: { orders: true },
    });
  }

  // UPDATE USER
  updateUser(id: number, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { orders: true },
    });
  }
}
