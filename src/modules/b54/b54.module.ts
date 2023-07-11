import { Module } from '@nestjs/common';
import { B54Service } from './b54.service';

@Module({
  controllers: [],
  providers: [B54Service],
  exports: [B54Service]
})
export class B54Module {}
