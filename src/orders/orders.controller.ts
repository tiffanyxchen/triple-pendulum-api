import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './orders.interface';
import { OrdersService } from './orders.service';
import { Order } from '@prisma/client';

@Controller('v1/orders')
export class OrdersV1Controller {
  constructor(private readonly ordersService: OrdersService) {}
  private readonly logger = new Logger(OrdersV1Controller.name);

  // ✅ CREATE a new order
  @Post()
  public async create(@Body() order: CreateOrderDto): Promise<Order> {
    if (!order) {
      throw new HttpException('No order data', HttpStatus.BAD_REQUEST);
    }
    if (!order.userId) {
      throw new HttpException('Unauthorized: missing userId', HttpStatus.UNAUTHORIZED);
    }
    if (!order.results || order.results.length === 0) {
      throw new HttpException('No results in order', HttpStatus.CONFLICT);
    }

    try {
      const newOrder = await this.ordersService.createOrder(order);
      return newOrder;
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('Failed to create order', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ GET all orders
  @Get()
  public async orders(): Promise<Order[]> {
    try {
      return await this.ordersService.orders({});
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('Failed to get orders', HttpStatus.BAD_GATEWAY);
    }
  }

  // ✅ GET a single order by ID
  @Get(':id')
  public async order(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    const found = await this.ordersService.order({ id });
    if (!found) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return found;
  }

  // ✅ UPDATE an order
  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() order: UpdateOrderDto,
  ): Promise<Order> {
    try {
      const updated = await this.ordersService.updateOrder({
        where: { id },
        data: order,
      });
      return updated;
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
  }

  // ✅ DELETE an order
  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    try {
      const deleted = await this.ordersService.deleteOrder({ where: { id } });
      return deleted;
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
  }
}
