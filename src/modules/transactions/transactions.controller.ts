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

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly b54Service: B54Service,
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

  @Post('/webhooks')
  @HttpCode(200)
  async webhookHandler(@Request() req, @Body() body) {
    console.log({ body });

    if (body.event === 'transfer.success') {
      console.log('transfer.success');
      console.log({ body });
    } else if (body.event === 'transaction.success') {
    }
  }
}
