import { Controller, Post, Body, Get } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto';
import { B54Service } from '../b54/b54.service';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly b54Service: B54Service,
  ) {}

  @Post()
  async registerCustomer(@Body() createClientDto: CreateClientDto) {
    const { id_type, id_value, client_type } = createClientDto;

    const result = await this.b54Service.registerClient({
      unique_id: id_value,
      unique_id_type: id_type,
      type: client_type,
      ...createClientDto,
    });

    if (result.success) {
      const existingClient = await this.clientsService.findOne({
        id_type,
        id_value,
      });
      if (!existingClient) this.clientsService.create(createClientDto);
    }
    return result;
  }

  @Get()
  async fetchAllCustomers() {
    return await this.b54Service.fetchClients();
  }
}
