import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  IsNumber,
} from 'class-validator';

export class RequestDrawdown {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
    
  @IsNotEmpty()
  @IsNumber()
  tenor: number;
}
