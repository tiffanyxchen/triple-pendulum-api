import { 
    Controller, 
    Get, 
    Patch, 
    Param,
    Body,
    HttpException, 
    HttpStatus } from '@nestjs/common';
import { ResultsService } from './results.service';
import { Result } from 'generated/prisma';
import { UpdateResultDto } from './dto/update-result.dto'; // ✅ DTO import

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

    @Patch(':id')
    public async update(
        @Param('id') id: string,
        @Body() result: UpdateResultDto,
    ): Promise<Result> {
        try {
            return await this.resultsService.updateResult({
                where: { id },
                data: result,
            });
        } catch (err) {
        if (err) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException('Generic', HttpStatus.BAD_GATEWAY);
        }
    }
}