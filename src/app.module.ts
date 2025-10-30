import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [
    UsersModule,   // ← REQUIRED
    OrdersModule,
    ResultsModule,
  ],
})
export class AppModule {}
