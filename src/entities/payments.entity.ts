import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Transaction } from './transactions.entity';

@Entity({ name: 'payments' })
export class Payment extends AbstractEntity {
  @ManyToOne(() => Transaction, (transaction) => transaction.payments)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column()
  transaction_reference: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  amount_paid: number;

  @Column()
  status: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  amount_expected: number;
}
