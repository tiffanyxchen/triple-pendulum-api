import { Test, TestingModule } from '@nestjs/testing';
import { ResultsService } from './results.service';
import { PrismaService } from '../utils/prisma.service';
import { Result } from '@prisma/client';

// 🧪 Mock data for testing
const mockResults: Result[] = [
  {
    id: 'uuid-1',
    name: 'Test Result 1',
    theta1_init: 0.1,
    theta2_init: 0.2,
    theta3_init: 0.3,
    theta1_series: [0.1, 0.2],
    theta2_series: [0.3, 0.4],
    theta3_series: [0.5, 0.6],
    time: [0, 1],
    x1: [1, 2],
    y1: [3, 4],
    x2: [5, 6],
    y2: [7, 8],
    x3: [9, 10],
    y3: [11, 12],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'uuid-2',
    name: 'Test Result 2',
    theta1_init: 0.5,
    theta2_init: 0.6,
    theta3_init: 0.7,
    theta1_series: [0.1],
    theta2_series: [0.2],
    theta3_series: [0.3],
    time: [0],
    x1: [1],
    y1: [2],
    x2: [3],
    y2: [4],
    x3: [5],
    y3: [6],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ✅ Mock PrismaService for Result operations
const mockPrismaService = {
  result: {
    findMany: jest.fn().mockResolvedValue(mockResults),
    findUnique: jest.fn().mockImplementation(({ where: { id } }) =>
      mockResults.find((r) => r.id === id),
    ),
    create: jest.fn().mockImplementation(({ data }) => ({
      id: 'uuid-new',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    })),
    update: jest.fn().mockImplementation(({ where: { id }, data }) => ({
      ...mockResults.find((r) => r.id === id),
      ...data,
      updatedAt: new Date(),
    })),
    delete: jest.fn().mockImplementation(({ where: { id } }) =>
      mockResults.find((r) => r.id === id),
    ),
  },
};

describe('ResultsService', () => {
  let service: ResultsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all results', async () => {
    const results = await service.results({});
    expect(prisma.result.findMany).toHaveBeenCalledWith();
    expect(results).toEqual(mockResults);
  });

  it('should return a result by ID', async () => {
    const result = await service.result({ id: 'uuid-2' });
    expect(prisma.result.findUnique).toHaveBeenCalledWith({ where: { id: 'uuid-2' } });
    expect(result).toEqual(mockResults[1]);
  });

  it('should create a new result', async () => {
    const newData = {
      name: 'New Test',
      theta1_init: 1,
      theta2_init: 2,
      theta3_init: 3,
      theta1_series: [],
      theta2_series: [],
      theta3_series: [],
      time: [],
      x1: [],
      y1: [],
      x2: [],
      y2: [],
      x3: [],
      y3: [],
    };
    const result = await service.createResult(newData);
    expect(prisma.result.create).toHaveBeenCalledWith({ data: newData });
    expect(result.id).toBe('uuid-new');
  });

  it('should update a result', async () => {
    const updated = await service.updateResult({
      where: { id: 'uuid-1' },
      data: { theta1_init: 9.9 },
    });
    expect(prisma.result.update).toHaveBeenCalledWith();
    expect(updated.theta1_init).toBe(9.9);
  });

  it('should delete a result', async () => {
    const deleted = await service.deleteResult({ id: 'uuid-1' });
    expect(prisma.result.delete).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
    expect(deleted).toEqual(mockResults[0]);
  });
});
