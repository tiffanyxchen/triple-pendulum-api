import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [
    UsersModule,  
    OrdersModule,
    ResultsModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'results'),  // serve TRIPLE-PENDULUM/results/
      serveRoot: '/results',                             // URL prefix: http://localhost:3000/results/...
    }),
  ],
})
export class AppModule {}
