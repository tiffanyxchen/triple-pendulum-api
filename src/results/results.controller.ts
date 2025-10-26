import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Delete,
  Post,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { Result, CreateResultDto, UpdateResultDto } from './results.interface';
import { runSimulation } from '../utils/python-runner';

@Controller('v1/results')
export class ResultsV1Controller {
  constructor(private readonly resultsService: ResultsService) {}
  private readonly logger = new Logger(ResultsV1Controller.name);

  // 🐍 NEW: Run simulation + insert if not exist
  @Post('simulate')
  public async simulateAndSave(@Body() body: CreateResultDto): Promise<Result> {
    if (!body) {
      throw new HttpException('No input data', HttpStatus.BAD_REQUEST);
    }

    try {
      // 1. Check if result already exists in DB
      const existing = await this.resultsService.findByAngles({
        theta1_init: body.theta1_init,
        theta2_init: body.theta2_init,
        theta3_init: body.theta3_init,
      });

      if (existing) {
        this.logger.log(
          `Found existing result for (${body.theta1_init}, ${body.theta2_init}, ${body.theta3_init}) with ID ${existing.id}`,
        );
        return existing;
      }

      // 2. Run simulation
      this.logger.log(
        `Running simulation for theta1=${body.theta1_init}, theta2=${body.theta2_init}, theta3=${body.theta3_init}`,
      );
      const simulation = await runSimulation(body);

      // 3. Save to DB
      const saved = await this.resultsService.createResult({
        ...body,
        theta1_series: simulation.theta1_series,
        theta2_series: simulation.theta2_series,
        theta3_series: simulation.theta3_series,
        time: simulation.time,
        x1: simulation.x1,
        y1: simulation.y1,
        x2: simulation.x2,
        y2: simulation.y2,
        x3: simulation.x3,
        y3: simulation.y3,
      });

      this.logger.log(`Simulation saved successfully with ID: ${saved.id}`);
      return saved;
    } catch (err) {
      this.logger.error('Error during simulation', err);
      throw new HttpException(
        'Failed to simulate and save result',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 🧾 CREATE a new Result directly
  @Post()
  public async create(@Body() result: CreateResultDto): Promise<Result> {
    if (!result) {
      throw new HttpException('No result data', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.resultsService.createResult(result);
    } catch (err) {
      this.logger.error('Error creating result', err);
      throw new HttpException('Failed to create result', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 📊 GET all results
  @Get()
  public async results(): Promise<Result[]> {
    try {
      const results = await this.resultsService.results({});
      if (!results || results.length === 0) {
        throw new HttpException('No results found', HttpStatus.NOT_FOUND);
      }
      return results;
    } catch (err) {
      this.logger.error('Error fetching results', err);
      throw new HttpException('Failed to fetch results', HttpStatus.BAD_GATEWAY);
    }
  }

  // 🔍 GET single result by ID
  @Get(':id')
  public async result(@Param('id') id: string): Promise<Result> {
    try {
      const result = await this.resultsService.result({ id });
      if (!result) {
        throw new HttpException('Result not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (err) {
      this.logger.error(`Error fetching result with ID ${id}`, err);
      throw new HttpException('Failed to fetch result', HttpStatus.BAD_GATEWAY);
    }
  }

  // ✍️ UPDATE result
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() result: UpdateResultDto,
  ): Promise<Result> {
    try {
      const updated = await this.resultsService.updateResult({
        where: { id },
        data: result,
      });
      if (!updated) {
        throw new HttpException('Result not found', HttpStatus.NOT_FOUND);
      }
      return updated;
    } catch (err) {
      this.logger.error(`Error updating result with ID ${id}`, err);
      throw new HttpException('Failed to update result', HttpStatus.BAD_GATEWAY);
    }
  }

  // 🗑 DELETE result
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<Result> {
    try {
      const deleted = await this.resultsService.deleteResult({ id });
      if (!deleted) {
        throw new HttpException('Result not found', HttpStatus.NOT_FOUND);
      }
      return deleted;
    } catch (err) {
      this.logger.error(`Error deleting result with ID ${id}`, err);
      throw new HttpException('Failed to delete result', HttpStatus.BAD_GATEWAY);
    }
  }
}
