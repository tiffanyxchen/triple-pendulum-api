import { Module } from '@nestjs/common';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [ResultsModule],
})
export class AppModule {}

