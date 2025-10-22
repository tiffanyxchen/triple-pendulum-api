import { Test, TestingModule } from '@nestjs/testing';
import { ResultsV1Controller } from './results.controller';
import { ResultsService } from './results.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client'; // ✅ use Prisma.InputJsonValue for JSON fields
import { Result } from './results.interface';

const mockResults: Result[] = [
  {
    id: 'abc-123',
    name: 'Test Result',
    theta1_init: 0.5,
    theta2_init: 0.6,
    theta3_init: 0.7,
    theta1_series: JSON.parse(JSON.stringify([0.1, 0.2])) as Prisma.JsonValue,
    theta2_series: JSON.parse(JSON.stringify([0.3, 0.4])) as Prisma.JsonValue,
    theta3_series: JSON.parse(JSON.stringify([0.5, 0.6])) as Prisma.JsonValue,
    time: [0, 1] as Prisma.JsonValue,
    x1: [1, 2] as Prisma.JsonValue,
    y1: [2, 3] as Prisma.JsonValue,
    x2: [3, 4] as Prisma.JsonValue,
    y2: [4, 5] as Prisma.JsonValue,
    x3: [5, 6] as Prisma.JsonValue,
    y3: [6, 7] as Prisma.JsonValue,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('ResultsV1Controller', () => {
  let controller: ResultsV1Controller;
  let service: ResultsService;

  const mockResultsService = {
    results: jest.fn(),
    updateResult: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultsV1Controller],
      providers: [
        {
          provide: ResultsService,
          useValue: mockResultsService,
        },
      ],
    }).compile();

    controller = module.get<ResultsV1Controller>(ResultsV1Controller);
    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /results', () => {
    it('returns all results', async () => {
      mockResultsService.results.mockResolvedValue(mockResults);

      const res = await controller.results();
      expect(res).toEqual(mockResults);
      expect(service.results).toHaveBeenCalled();
    });

    it('throws 404 if no results found', async () => {
      mockResultsService.results.mockResolvedValue([]);

      await expect(controller.results()).rejects.toThrow(
        new HttpException('No results found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('PATCH /results/:id', () => {
    it('updates a result successfully', async () => {
      const updated = { ...mockResults[0], theta1_init: 1.5 };
      mockResultsService.updateResult.mockResolvedValue(updated);

      const res = await controller.update('abc-123', { theta1_init: 1.5 });
      expect(res).toEqual(updated);
      expect(service.updateResult).toHaveBeenCalledWith({
        where: { id: 'abc-123' },
        data: { theta1_init: 1.5 },
      });
    });

    it('throws 404 if result not found', async () => {
      mockResultsService.updateResult.mockRejectedValue(
        new HttpException('Not found', HttpStatus.NOT_FOUND),
      );

      await expect(
        controller.update('bad-id', { theta1_init: 2.0 }),
      ).rejects.toThrow(HttpException);
    });
  });
});
