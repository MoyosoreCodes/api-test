import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payments.entity';
import { Repository } from 'typeorm';
import { IPayment } from './dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}
  create(payment: IPayment) {
    const newPayment = this.paymentRepository.create(payment);
    return this.paymentRepository.save(newPayment);
  }
  async findAll() {
    return await this.paymentRepository.find();
  }

  async findPendingPayments() {
    return await this.paymentRepository.find({ where: { status: 'pending' } });
  }

  async findById(id: string) {
    return this.paymentRepository.findOne({ where: {id} });
  }
  async completePayment(id: string) {
    return this.paymentRepository.update({ id }, {
      status: 'completed'
    });
  }

  async updatePendingPaymentAmount(id: string, amountPaid: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id, status: 'pending' },
    });
    await this.paymentRepository.update(
      { id, status: 'pending' },
      {
        amount_paid: Number(payment.amount_paid) + Number(amountPaid),
        amount_expected: Number(payment.amount_expected) - Number(amountPaid),
      },
    );
  }
}
