import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Client } from './clients.entity';
import { Transaction } from './transactions.entity';
import { AbstractEntity } from './abstract.entity';

export enum StatusType {
  PROCESSING = 'processing',
  FAILED = 'failed',
  SUCCESS = 'success',
}

@Entity({ name: 'transfer_histories' })
export class TransferHistory extends AbstractEntity {
  @ManyToOne(() => Transaction, (transaction) => transaction.transfer_histories)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Client, (client) => client.transfer_histories)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({
    type: 'enum',
    enum: StatusType,
  })
  status: StatusType;
}
