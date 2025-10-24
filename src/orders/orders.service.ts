import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from '../utils/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './orders.interface';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(OrdersService.name);

  // ✅ Get all orders
  public async orders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderWhereUniqueInput;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }): Promise<Order[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log('GET /v1/orders requested');
    return await this.prisma.order.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        results: true, // ✅ include results in the returned order
      },
    });
  }

  // ✅ Get a single order
  public async order(orderWhereUniqueInput: Prisma.OrderWhereUniqueInput): Promise<Order | null> {
    this.logger.log(`GET /v1/orders/${orderWhereUniqueInput.id}`);
    return await this.prisma.order.findUnique({
      where: orderWhereUniqueInput,
      include: {
        results: true,
      },
    });
  }

  // ✅ Create a new order
  public async createOrder(data: CreateOrderDto): Promise<Order> {
    const modifiedOrder = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.logger.debug(`Creating new order: ${JSON.stringify(modifiedOrder)}`);

    const newOrder = await this.prisma.order.create({
      data: {
        userId: modifiedOrder.userId,
        createdAt: modifiedOrder.createdAt,
        updatedAt: modifiedOrder.updatedAt,
        results: {
          connect: modifiedOrder.results.map((id) => ({ id })), // connect by UUID
        },
      },
      include: {
        results: true,
      },
    });

    return newOrder;
  }

  // ✅ Update an existing order
  public async updateOrder(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: UpdateOrderDto;
  }): Promise<Order> {
    const { where, data } = params;
    this.logger.log(`Updating order ${where.id}`);

    try {
      const updatedOrder = await this.prisma.order.update({
        where,
        data: {
          ...(data.userId && { userId: data.userId }), // ✅ conditional spread for userId
          ...(data.results && {
            results: {
              connect: data.results.map((id) => ({ id })),
            },
          }),
          updatedAt: new Date(),
        },
        include: {
          results: true,
        },
      });

      this.logger.log(`Order ${updatedOrder.id} updated successfully`);
      return updatedOrder;
    } catch (err) {
      this.logger.error(`Failed to update order ${where.id}`, err);
      throw new HttpException(err.message, HttpStatus.CONFLICT);
    }
  }

  // ✅ Delete an order
  public async deleteOrder(params: { where: Prisma.OrderWhereUniqueInput }): Promise<Order> {
    this.logger.log(`Deleting order ${params.where.id}`);
    return await this.prisma.order.delete({
      where: params.where,
      include: {
        results: true,
      },
    });
  }
}