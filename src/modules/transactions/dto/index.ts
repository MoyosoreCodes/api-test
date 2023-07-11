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

export enum LockboxWithdrawalTypes {
  BANK = 'bank',
  MOMO = 'mobile-money',
}

export class LockboxWithdrawal {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  //   @IsNotEmpty()
  //   mobile_no: string;

  @IsNotEmpty()
  account_number: string;

  @IsNotEmpty()
  bank_code: string;

  @IsNotEmpty()
  @IsEnum(LockboxWithdrawalTypes)
  account_type: LockboxWithdrawalTypes;
}
