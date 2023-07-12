import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/entities/clients.entity';
import { B54Module } from '../b54/b54.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), B54Module],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
