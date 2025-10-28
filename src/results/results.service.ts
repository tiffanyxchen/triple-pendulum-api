import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Prisma, Result } from '@prisma/client';
import { PrismaService } from '../utils/prisma.service';
import { CreateResultDto, UpdateResultDto } from './results.interface';
import { runSimulation } from '../utils/python-runner';

@Injectable()
export class ResultsService {
  private readonly logger = new Logger(ResultsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Get all results
  public async results(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ResultWhereUniqueInput;
    where?: Prisma.ResultWhereInput;
    orderBy?: Prisma.ResultOrderByWithRelationInput;
  }): Promise<Result[]> {
    this.logger.log('GET /results - Fetching all results');
    return this.prisma.result.findMany(params);
  }

  // Get a single result by ID
  public async result(where: Prisma.ResultWhereUniqueInput): Promise<Result | null> {
    this.logger.log(`Fetching result with ID: ${where.id}`);
    return this.prisma.result.findUnique({ where });
  }

  // Find result by angle combination
  public async findByAngles(where: {
    theta1_init: number;
    theta2_init: number;
    theta3_init: number;
  }): Promise<Result | null> {
    this.logger.log(
      `Checking if result exists for angles: ${where.theta1_init}, ${where.theta2_init}, ${where.theta3_init}`,
    );
    return this.prisma.result.findUnique({
      where: {
        theta1_init_theta2_init_theta3_init: where,
      },
    });
  }

  // ✅ NEW — simulate if needed and store the result
  public async simulateOrGetResult(angles: {
    theta1_init: number;
    theta2_init: number;
    theta3_init: number;
  }): Promise<Result> {
    // 1. Check if result already exists
    const existing = await this.findByAngles(angles);
    if (existing) {
      this.logger.log('Found existing result — returning it');
      return existing;
    }

    // 2. Run Python simulation
    this.logger.log('No result found — running simulation');
    const simData = await runSimulation(angles);

    // 3. Insert new record into database
    const newResult = await this.prisma.result.create({
      data: {
        name: 'Simulated Result',
        theta1_init: angles.theta1_init,
        theta2_init: angles.theta2_init,
        theta3_init: angles.theta3_init,
        theta1_series: simData.theta1_series as Prisma.InputJsonValue,
        theta2_series: simData.theta2_series as Prisma.InputJsonValue,
        theta3_series: simData.theta3_series as Prisma.InputJsonValue,
        time: simData.time as Prisma.InputJsonValue,
        x1: simData.x1 as Prisma.InputJsonValue,
        y1: simData.y1 as Prisma.InputJsonValue,
        x2: simData.x2 as Prisma.InputJsonValue,
        y2: simData.y2 as Prisma.InputJsonValue,
        x3: simData.x3 as Prisma.InputJsonValue,
        y3: simData.y3 as Prisma.InputJsonValue,
      },
    });

    this.logger.log(`Simulation complete — new result created with ID ${newResult.id}`);
    return newResult;
  }

  // Create a new result record
  public async createResult(data: CreateResultDto): Promise<Result> {
    this.logger.log('Creating a new result entry');
    try {
      return await this.prisma.result.create({
        data: {
          name: data.name ?? 'Untitled',
          theta1_init: data.theta1_init,
          theta2_init: data.theta2_init,
          theta3_init: data.theta3_init,
          theta1_series: data.theta1_series as Prisma.InputJsonValue,
          theta2_series: data.theta2_series as Prisma.InputJsonValue,
          theta3_series: data.theta3_series as Prisma.InputJsonValue,
          time: data.time as Prisma.InputJsonValue,
          x1: data.x1 as Prisma.InputJsonValue,
          y1: data.y1 as Prisma.InputJsonValue,
          x2: data.x2 as Prisma.InputJsonValue,
          y2: data.y2 as Prisma.InputJsonValue,
          x3: data.x3 as Prisma.InputJsonValue,
          y3: data.y3 as Prisma.InputJsonValue,
          gifPath: data.gifPath ?? null,   // ✅ NEW
        },
      });
    } catch (err) {
      this.logger.error('Error creating result', err);
      throw new HttpException(err.message, HttpStatus.CONFLICT);
    }
  }

  // Update an existing result
  public async updateResult(params: {
    where: Prisma.ResultWhereUniqueInput;
    data: UpdateResultDto;
  }): Promise<Result> {
    const { where, data } = params;
    this.logger.log(`Updating result ${where.id}`);
    try {
      return await this.prisma.result.update({
        where,
        data: {
          name: data.name ?? 'Untitled',
          theta1_init: data.theta1_init,
          theta2_init: data.theta2_init,
          theta3_init: data.theta3_init,
          theta1_series: data.theta1_series as Prisma.InputJsonValue,
          theta2_series: data.theta2_series as Prisma.InputJsonValue,
          theta3_series: data.theta3_series as Prisma.InputJsonValue,
          time: data.time as Prisma.InputJsonValue,
          x1: data.x1 as Prisma.InputJsonValue,
          y1: data.y1 as Prisma.InputJsonValue,
          x2: data.x2 as Prisma.InputJsonValue,
          y2: data.y2 as Prisma.InputJsonValue,
          x3: data.x3 as Prisma.InputJsonValue,
          y3: data.y3 as Prisma.InputJsonValue,
          gifPath: data.gifPath ?? undefined,
        },
      });
    } catch (err) {
      this.logger.error(`Error updating result ${where.id}`, err);
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Delete a result
  public async deleteResult(where: Prisma.ResultWhereUniqueInput): Promise<Result> {
    this.logger.log(`Deleting result ${where.id}`);
    try {
      return await this.prisma.result.delete({ where });
    } catch (err) {
      this.logger.error(`Error deleting result ${where.id}`, err);
      throw new HttpException('Failed to delete result', HttpStatus.NOT_FOUND);
    }
  }
}
