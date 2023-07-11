import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity({ name: 'loan_requests' })
export class LoanRequests extends AbstractEntity {
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  amount: string;

  @Column()
  tenor: number;

  @Column()
  status: string;
}
