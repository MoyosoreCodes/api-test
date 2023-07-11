import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export enum Type {
  BVN = 'bvn',
  NIN = 'nin',
  DRIVERS_LICENSE = 'drivers_license',
}

export enum ClientType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
}

export interface ICreateClient {
  first_name: string;
  last_name: string;
  contact_number: string;
  id_type: Type;
  id_value: string;
  client_type: ClientType;
  business_name?: string;
}

export class CreateClientDto {
  @ValidateIf((obj) => obj.client_type === ClientType.INDIVIDUAL)
  @IsNotEmpty({
    message: `first name required for type ${ClientType.INDIVIDUAL}`,
  })
  first_name: string;

  @ValidateIf((obj) => obj.client_type === ClientType.INDIVIDUAL)
  @IsNotEmpty({
    message: `last name required for type ${ClientType.INDIVIDUAL}`,
  })
  last_name: string;

  @IsNotEmpty()
  contact_number: string;

  @IsEnum(Type)
  @IsOptional()
  id_type: Type;

  @IsOptional()
  id_value: string;

  @IsEnum(ClientType)
  @IsNotEmpty()
  client_type: ClientType;

//   @ValidateIf((obj) => obj.client_type === ClientType.BUSINESS)
//   @IsNotEmpty({
//     message: `business name required for type ${ClientType.BUSINESS}`,
//   })
  @IsString()
  @IsOptional()
  business_name: string;

  @IsString()
  @IsOptional()
  rc_number: string;
}
