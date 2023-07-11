import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { B54Module } from '../b54/b54.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transactions.entity';

@Module({
  imports: [B54Module, TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
