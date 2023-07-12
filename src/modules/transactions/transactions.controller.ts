import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpCode,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { B54Service } from '../b54/b54.service';
import { LockboxWithdrawal, RequestDrawdown } from './dto';
import { ClientsService } from '../clients/clients.service';
import { Client } from 'src/entities/clients.entity';
import { ClientType } from '../clients/dto';
import * as randomstring from 'randomstring';
import { addDays, format } from 'date-fns';
import { PaymentsService } from '../payments/payments.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly b54Service: B54Service,
    private readonly clientService: ClientsService,
    private readonly paymentService: PaymentsService,
  ) {}

  @Post('/drawdown-requests')
  create(@Body() requestDrawdownDto: RequestDrawdown) {
    const { amount, tenor } = requestDrawdownDto;
    return this.b54Service.requestDrawdown({ amount, tenor });
  }

  @Get('/credit-limit')
  fetchCurrentCreditLimit() {
    return this.b54Service.fetchCurrentCreditLimit();
  }

  @Get('/active-drawdown')
  fetchActiveDrawdown() {
    return this.b54Service.fetchActiveDrawdown();
  }

  @Post('/lockbox-withdraw')
  async lockboxWithdrawal(@Body() lockboxWithdrawalDto: LockboxWithdrawal) {
    const { amount, bank_code, account_type, account_number } =
      lockboxWithdrawalDto;

    const { data } = await this.b54Service.listBanks();
    const userBank = data.find((bank) => bank?.code === bank_code);

    return await this.b54Service.lockboxWithdrawal({
      name: userBank?.name,
      amount,
      account_type,
      account_number,
      bank_code,
    });
  }

  @Get('/banks')
  listBanks(@Body() lockboxWithdrawalDto) {
    return this.b54Service.listBanks();
  }

  @Post('/register')
  async registerTransactions() {
    const clients: Client[] = await this.clientService.findAll();
    const activeDrawdown = await this.b54Service.fetchActiveDrawdown();
    let transactions = [];
    let financed_transactions = [];
    const amountDrawn = activeDrawdown.data?.amount_drawn;
    const disbursement_date = new Date(activeDrawdown.data?.disbursement_date);
    const maturity_date = new Date(activeDrawdown.data?.maturity_date);
    const amount_disbursed = Number((amountDrawn * 0.5).toFixed(2));
    const amount_expected = Number((amountDrawn * 0.7).toFixed(2));
    const paymentAmount = Number((amountDrawn * 0.35).toFixed(2));

    for (let client of clients) {
      let transaction_reference = randomstring.generate({
        length: 16,
        charset: 'alphanumeric',
      });
      let transactionObj = {
        client: {},
        transaction_reference,
        disbursement_date,
        expected_payment_date: maturity_date,
        reason: 'Loan',
        amount_payable: amount_expected,
        financier: 'B54',
      };

      let financedTransactionsObj = {
        transaction_reference,
        amount: 500,
        drawdown_id: activeDrawdown.data?.id,
        payments: [
          {
            disbursement_date,
            expected_payment_date: maturity_date,
            amount: paymentAmount,
          },
          {
            disbursement_date,
            expected_payment_date: maturity_date,
            amount: paymentAmount,
          },
        ],
      };

      if (client.client_type === ClientType.BUSINESS) {
        transactionObj.client = {
          business_name: client.business_name,
          contact_number: client.contact_number,
          id_type: 'rc_number',
          id_value: client.rc_number,
        };
      } else if (client.client_type === ClientType.INDIVIDUAL) {
        transactionObj.client = {
          first_name: client.first_name,
          last_name: client.last_name,
          contact_number: client.contact_number,
          id_type: client.id_type,
          id_value: client.id_value,
        };
      }

      transactions.push(transactionObj);
      financed_transactions.push(financedTransactionsObj);
      const newTransaction = this.transactionsService.create({
        client,
        reference: transaction_reference,
        transaction_date: disbursement_date,
        amount_disbursed,
        expected_payment_date: maturity_date,
        number_of_installments: financedTransactionsObj.payments.length,
        amount_expected: amount_expected,
      });

      for (let payment of financedTransactionsObj.payments) {
        this.paymentService.create({
          transaction: newTransaction,
          transaction_reference,
          amount_paid: 0,
          status: 'pending',
          amount_expected: paymentAmount,
        });
      }

    }

    return await this.b54Service.registerTransactions(
      transactions,
      financed_transactions,
    );
  }

  @Post('/repayments')
  async bulkRepayments() {
    const pendingPayments = await this.paymentService.findPendingPayments();
    let payments = [];
    for (let pendingPayment of pendingPayments) {
      payments.push({
        transaction_reference: pendingPayment.transaction_reference,
        amount: pendingPayment.amount_expected,
      });
    }

    const { success, message, data } = await this.b54Service.bulkRepayments(
      payments,
    );

    if (success) {
      for (let pendingPayment of pendingPayments) {
        await this.paymentService.updatePendingPaymentAmount(
          pendingPayment.id,
          pendingPayment.amount_expected,
        );

        const newPaymentInfo = await this.paymentService.findById(
          pendingPayment.id,
        );
        if (
          !Number(newPaymentInfo.amount_expected) ||
          Number(newPaymentInfo.amount_expected) === 0
        ) {
          await this.paymentService.completePayment(pendingPayment.id);
        }
      }
    }
    return { success, message, data };
  }

  @Get()
  async fetchTransactions() {
    return await this.b54Service.fetchTransactions();
  }

  @Post('/webhooks')
  @HttpCode(200)
  async webhookHandler(@Request() req, @Body() body) {
    console.log({ body });
  }
}
