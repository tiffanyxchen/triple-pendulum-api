import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsV1Controller } from './results.controller';
import { PrismaService } from 'src/utils/prisma.service';

@Module({
  controllers: [ResultsV1Controller],
  providers: [ResultsService, PrismaService],
  exports: [ResultsService], // make service available to other modules
})
export class ResultsModule {}
