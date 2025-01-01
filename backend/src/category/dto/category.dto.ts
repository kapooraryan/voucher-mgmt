import { IsString, IsOptional, IsNumber, IsISO8601 } from 'class-validator';

export class CategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  minSpend?: number;

  @IsOptional()
  @IsNumber()
  maxSpend?: number;

  @IsOptional()
  @IsISO8601()
  dateJoinedBefore?: string;

  @IsOptional()
  @IsString()
  creditCardType?: string;

  @IsOptional()
  @IsString()
  lastLoginOption?: string;

  @IsOptional()
  @IsISO8601()
  lastLoginThreshold?: string;
}
