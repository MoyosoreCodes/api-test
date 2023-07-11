import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Transaction } from './transactions.entity';
// import { PaymentAccount } from './payment_accounts.entity';
import { TransferHistory } from './transfer_histories.entity';
import { ClientType, Type } from 'src/modules/clients/dto';

@Entity({ name: 'clients' })
export class Client extends AbstractEntity {
  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column()
  contact_number: string;

  @Column({ nullable: true })
  rc_number: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  business_name: string;

  @Column({ type: 'enum', enum: Type, nullable: true })
  id_type: Type;

  @Column({ nullable: true })
  id_value: string;

  @OneToMany(() => Transaction, (transaction) => transaction.client)
  transactions: Transaction[];

  @OneToMany(() => TransferHistory, (transferHistory) => transferHistory.client)
  transfer_histories: TransferHistory[];

  @Column({ enum: ClientType, nullable: false })
  client_type: ClientType;
}
