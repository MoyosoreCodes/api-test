import { Module } from '@nestjs/common';
import { DisbursementsService } from './disbursements.service';
import { DisbursementsController } from './disbursements.controller';

@Module({
  controllers: [DisbursementsController],
  providers: [DisbursementsService]
})
export class DisbursementsModule {}
