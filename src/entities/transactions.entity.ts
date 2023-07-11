import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Client } from './clients.entity';
import { Payment } from './payments.entity';
import { TransferHistory } from './transfer_histories.entity';
import { AbstractEntity } from './abstract.entity';

@Entity({ name: 'transactions' })
export class Transaction extends AbstractEntity {
  @ManyToOne(() => Client, (client) => client.transactions)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column()
  reference: string;

  @Column({ type: 'timestamp' })
  transaction_date: Date;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  amount_disbursed: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  interest_rate: number;

  @Column()
  tenor: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  amount_paid: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  amount_outstanding: number;

  @Column({ type: 'timestamp' })
  expected_payment_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  actual_payment_date: Date;

  @Column()
  number_of_installments: number;

  @Column({ nullable: true, type: 'float' })
  amount_expected: number;

  @OneToMany(() => Payment, (payment) => payment.transaction)
  payments: Payment[];

  @OneToMany(
    () => TransferHistory,
    (transferHistory) => transferHistory.transaction,
  )
  transfer_histories: TransferHistory[];
}
