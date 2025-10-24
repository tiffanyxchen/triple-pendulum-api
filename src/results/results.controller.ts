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
import { Result } from './results.interface';
import { CreateResultDto, UpdateResultDto } from './results.interface';

@Controller('v1/results')
export class ResultsV1Controller {
  constructor(private readonly resultsService: ResultsService) {}
  private readonly logger = new Logger(ResultsService.name);

  // ✅ CREATE a new Result
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

  // ✅ GET all results
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

  // ✅ GET a single result by ID
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

  // ✅ UPDATE a result by ID
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

  // ✅ DELETE a result by ID
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
