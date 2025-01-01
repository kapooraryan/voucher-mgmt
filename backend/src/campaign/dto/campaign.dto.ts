import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsISO8601,
} from 'class-validator';
import { DiscountType } from '@prisma/client';

export class CampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsISO8601()
  startDate: string;

  @IsNotEmpty()
  @IsISO8601()
  endDate: string;

  @IsOptional()
  @IsNumber()
  targetCategoryId?: number;

  @IsEnum(DiscountType)
  @IsNotEmpty()
  discountType: DiscountType;

  @IsNumber()
  @IsNotEmpty()
  discountValue: number;

  @IsOptional()
  @IsNumber()
  maxUsageLimit?: number;

  @IsOptional()
  @IsNumber()
  minCartValue?: number;
}
