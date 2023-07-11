import { PartialType } from '@nestjs/mapped-types';
import { CreateB54Dto } from './create-b54.dto';

export class UpdateB54Dto extends PartialType(CreateB54Dto) {}
