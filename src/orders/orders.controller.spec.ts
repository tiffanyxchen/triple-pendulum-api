import { Test, TestingModule } from '@nestjs/testing';
import { OrdersV1Controller } from './orders.controller';
import { OrdersService } from './orders.service';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockOrder = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 1001,
  results: [],
};

describe('OrdersV1Controller', () => {
  let controller: OrdersV1Controller;
  let service: OrdersService;

  const mockOrdersService = {
    createOrder: jest.fn(),
    orders: jest.fn(),
    order: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersV1Controller],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compile();

    controller = module.get<OrdersV1Controller>(OrdersV1Controller);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should throw bad request if order is undefined', async () => {
    await expect(controller.create(undefined as any)).rejects.toThrow(
      new HttpException('No order data', HttpStatus.BAD_REQUEST),
    );
  });

  it('should throw unauthorized if userId is missing', async () => {
    const invalidOrder = { results: ['uuid-1'] } as any;
    await expect(controller.create(invalidOrder)).rejects.toThrow(
      new HttpException('Unauthorized: missing userId', HttpStatus.UNAUTHORIZED),
    );
  });

  it('should throw conflict if results are missing', async () => {
    const invalidOrder = { userId: 1001 } as any;
    await expect(controller.create(invalidOrder)).rejects.toThrow(
      new HttpException('No results in order', HttpStatus.CONFLICT),
    );
  });

  it('should create a new order successfully', async () => {
    const validOrder = { userId: 1001, results: ['uuid-1'] };
    mockOrdersService.createOrder.mockResolvedValue(mockOrder);

    const result = await controller.create(validOrder);
    expect(service.createOrder).toHaveBeenCalledWith(validOrder);
    expect(result).toEqual(mockOrder);
  });

  it('should throw 500 if service throws an error', async () => {
    const validOrder = { userId: 1001, results: ['uuid-1'] };
    mockOrdersService.createOrder.mockRejectedValue(
      new HttpException('Something happened', HttpStatus.INTERNAL_SERVER_ERROR),
    );

    await expect(controller.create(validOrder)).rejects.toThrow(
      new HttpException('Something happened', HttpStatus.INTERNAL_SERVER_ERROR),
    );
  });
});
