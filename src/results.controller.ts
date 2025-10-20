import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ResultsService } from './app.service';
import { Result } from 'generated/prisma';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
    public async results(): Promise<Array<Result>> {
        try {
            const results = await this.resultsService.results({});
            if (!results || results.length === 0) {
                throw new HttpException('No results found', HttpStatus.NOT_FOUND);
            }
            return results;
        } catch (err) {
            if (err) {
                throw new HttpException('Not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException('Generic', HttpStatus.BAD_GATEWAY);
        }
    }

}
