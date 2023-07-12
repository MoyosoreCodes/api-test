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

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly b54Service: B54Service,
    private readonly clientService: ClientsService,
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

    // return {userBank, amount}
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
    const activeDrawdown  = await this.b54Service.fetchActiveDrawdown()
    let transactions = [];
    let financed_transactions = [];
    const amountDrawn = activeDrawdown.data?.amount_drawn;

    for (let client of clients) {
      let today = new Date();
      let transaction_reference = randomstring.generate({
        length: 16,
        charset: 'alphanumeric',
      });
      let transactionObj = {
        client: {},
        transaction_reference,
        disbursement_date: today,
        expected_payment_date: addDays(today, 7),
        reason: 'Loan',
        amount_payable: amountDrawn * 0.7,
        financier: 'B54',
      };

      let financedTransactionsObj = {
        transaction_reference,
        amount: amountDrawn * 0.5,
        drawdown_id: activeDrawdown.data?.id,
        payments: [
          {
            disbursement_date: today,
            expected_payment_date: addDays(today, 7),
            amount: amountDrawn * 0.5 * 0.7,
          },
          {
            disbursement_date: today,
            expected_payment_date: addDays(today, 7),
            amount: amountDrawn * 0.5 * 0.7,
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
    }

    return await this.b54Service.registerTransactions(
      transactions,
      financed_transactions,
    );
  }

  @Post('/webhooks')
  @HttpCode(200)
  async webhookHandler(@Request() req, @Body() body) {
    console.log({ body });
  }
}
