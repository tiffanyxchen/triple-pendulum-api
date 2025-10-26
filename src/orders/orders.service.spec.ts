import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../utils/prisma.service';
import { Order } from '@prisma/client';

const mockOrders: Order[] = [
  {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1,
    // no total field in schema — remove if not in your model
  },
  {
    id: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 2,
  },
];

const mockPrismaService = {
  order: {
    findMany: jest.fn().mockResolvedValue(mockOrders),
    findUnique: jest.fn().mockImplementation(({ where }) =>
      mockOrders.find((o) => o.id === where.id),
    ),
    create: jest.fn().mockImplementation(({ data }) => ({
      id: mockOrders.length + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    update: jest.fn().mockImplementation(({ where, data }) => ({
      ...mockOrders.find((o) => o.id === where.id),
      ...data,
    })),
    delete: jest.fn().mockImplementation(({ where }) =>
      mockOrders.find((o) => o.id === where.id),
    ),
  },
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all orders', async () => {
    const orders = await service.orders({});
    expect(mockPrismaService.order.findMany).toHaveBeenCalled();
    expect(orders).toEqual(mockOrders);
  });

  it('should return an order by id', async () => {
    const order = await service.order({ id: 2 });
    expect(mockPrismaService.order.findUnique).toHaveBeenCalled();
    expect(order).toEqual(mockOrders[1]);
  });

  it('should create an order', async () => {
    const newOrder = await service.createOrder({ userId: 3, results: [] });
    expect(mockPrismaService.order.create).toHaveBeenCalled();
    expect(newOrder.userId).toBe(3);
  });

  it('should update an order', async () => {
    const updated = await service.updateOrder({
      where: { id: 1 },
      data: { results: [] },
    });
    expect(mockPrismaService.order.update).toHaveBeenCalled();
    expect(updated.id).toBe(1);
  });

  it('should delete an order', async () => {
    const deleted = await service.deleteOrder({ where: { id: 1 } });
    expect(mockPrismaService.order.delete).toHaveBeenCalled();
    expect(deleted).toEqual(mockOrders[0]);
  });
});
