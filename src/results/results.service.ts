import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Prisma, Result } from '@prisma/client';
import { PrismaService } from '../utils/prisma.service';
import { CreateResultDto, UpdateResultDto } from './results.interface'; // DTOs for validation

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(ResultsService.name);

  // ✅ Get all results
  public async results(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ResultWhereUniqueInput;
    where?: Prisma.ResultWhereInput;
    orderBy?: Prisma.ResultOrderByWithRelationInput;
  }): Promise<Result[]> {
    this.logger.log('GET /results - Fetching all results');
    return await this.prisma.result.findMany(params);
  }

  // ✅ Get a single result by ID
  public async result(where: Prisma.ResultWhereUniqueInput): Promise<Result | null> {
    this.logger.log(`Fetching result with ID: ${where.id}`);
    return await this.prisma.result.findUnique({ where });
  }

  // ✅ Create a new result record
  public async createResult(data: CreateResultDto): Promise<Result> {
    this.logger.log('Creating a new result entry');

    try {
      const newResult = await this.prisma.result.create({
        data: {
          theta1_init: data.theta1_init,
          theta2_init: data.theta2_init,
          theta3_init: data.theta3_init,
          theta1_series: data.theta1_series,
          theta2_series: data.theta2_series,
          theta3_series: data.theta3_series,
          time: data.time,
          x1: data.x1,
          y1: data.y1,
          x2: data.x2,
          y2: data.y2,
          x3: data.x3,
          y3: data.y3,
          userId: data.userId ?? null, // Optional field
        },
      });
      return newResult;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.CONFLICT);
    }
  }

  // ✅ Update an existing result
  public async updateResult(params: {
    where: Prisma.ResultWhereUniqueInput;
    data: UpdateResultDto;
  }): Promise<Result> {
    const { where, data } = params;
    this.logger.log(`Updating result ${where.id}`);

    try:
      const updatedResult = await this.prisma.result.update({
        where,
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      return updatedResult;
    } catch (err) {
      throw new HttpException('Failed to update result', HttpStatus.CONFLICT);
    }
  }

  // ✅ Delete a result
  public async deleteResult(where: Prisma.ResultWhereUniqueInput): Promise<Result> {
    this.logger.log(`Deleting result ${where.id}`);
    return await this.prisma.result.delete({ where, });
  }
}
