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
import { CreateOrderDto, Order, UpdateOrderDto } from './orders.interface';
import { OrdersService } from './orders.service';

@Controller('v1/orders')
export class OrdersV1Controller {
  constructor(private readonly ordersService: OrdersService) {}
  private readonly logger = new Logger(OrdersService.name);

  @Post()
  public async create(
    @Body() order: CreateOrderDto
  ): Promise<Order> {
    if (!order) {
      throw new HttpException('No order data', HttpStatus.BAD_REQUEST);
    }
    if (!order.userId) {
      throw new HttpException('Unauthorized: missing userId', HttpStatus.UNAUTHORIZED);
    }
    if (!order.results || order.results.length === 0) {
      throw new HttpException('No results in order', HttpStatus.CONFLICT);
    }
    if (!order.total) {
      throw new HttpException('No order total', HttpStatus.CONFLICT);
    }

    try {
      const newOrder = await this.ordersService.createOrder(order);
      return newOrder;
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('Something happened', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  public async orders(): Promise<Order[]> {
    try {
      return await this.ordersService.orders({});
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('Generic', HttpStatus.BAD_GATEWAY);
    }
  }

  @Get(':id')
  public async order(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Order> {
    const found = await this.ordersService.order({ id });
    if (!found) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return found;
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() order: UpdateOrderDto,
  ): Promise<Order> {
    try {
      return await this.ordersService.updateOrder({
        where: { id },
        data: order,
      });
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  public async delete(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Order> {
    try {
      return await this.ordersService.deleteOrder({ where: { id } });
    } catch (err) {
      this.logger.error(err);
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
  }
}
