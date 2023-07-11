import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { B54Service } from '../b54/b54.service';
import { RequestDrawdown } from './dto';

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
  findOne(@Param('id') id: string) {
    return this.b54Service.fetchActiveDrawdown()
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
