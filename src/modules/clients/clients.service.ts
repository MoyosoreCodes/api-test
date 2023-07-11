import { Injectable } from '@nestjs/common';
import { ICreateClient } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/entities/clients.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}
  create(client: ICreateClient) {
    const newClient = this.clientRepository.create(client);
    return this.clientRepository.save(newClient);
  }

  async findOne(whereQuery: FindOptionsWhere<Client>) {
    return this.clientRepository.findOne({ where: whereQuery });
  }
}
