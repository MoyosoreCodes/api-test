import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transactions.entity';
import { Repository } from 'typeorm';
import { ITransaction } from './dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  create(transaction: ITransaction) {
    const newClient = this.transactionRepository.create(transaction);
    return this.transactionRepository.save(newClient);
  }

  generateInterest(principal, interestRate, duration, interestType = 'simple') {
    switch (interestType) {
      case 'simple':
        const simpleInterest =
          Number(principal) *
          (Number(interestRate) / 100) *
          (Number(duration) / 360);
        return Number(simpleInterest.toFixed(2));
      case 'compound':
        const amountAfterInterest =
          Number(principal) *
          Math.pow(1 + Number(interestRate) / 36000, duration);
        const compoundInterest = amountAfterInterest - Number(principal);
        return Number(compoundInterest.toFixed(2));
    }
  }
}
