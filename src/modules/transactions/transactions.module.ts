import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { B54Module } from '../b54/b54.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transactions.entity';
import { ClientsModule } from '../clients/clients.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [B54Module, ClientsModule, TypeOrmModule.forFeature([Transaction]), PaymentsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
