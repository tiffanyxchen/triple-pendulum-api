import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

// 👇 This interface represents what Prisma returns from queries (READ)
export interface Result {
  id: string;
  name: string;
  theta1_init: number;
  theta2_init: number;
  theta3_init: number;
  theta1_series: Prisma.JsonValue;
  theta2_series: Prisma.JsonValue;
  theta3_series: Prisma.JsonValue;
  time: Prisma.JsonValue;
  x1: Prisma.JsonValue;
  y1: Prisma.JsonValue;
  x2: Prisma.JsonValue;
  y2: Prisma.JsonValue;
  x3: Prisma.JsonValue;
  y3: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ DTO for creating a new result (WRITE)
export class CreateResultDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsNumber()
  theta1_init: number;

  @IsNotEmpty()
  @IsNumber()
  theta2_init: number;

  @IsNotEmpty()
  @IsNumber()
  theta3_init: number;

  theta1_series: Prisma.InputJsonValue;
  theta2_series: Prisma.InputJsonValue;
  theta3_series: Prisma.InputJsonValue;
  time: Prisma.InputJsonValue;
  x1: Prisma.InputJsonValue;
  y1: Prisma.InputJsonValue;
  x2: Prisma.InputJsonValue;
  y2: Prisma.InputJsonValue;
  x3: Prisma.InputJsonValue;
  y3: Prisma.InputJsonValue;
}

// ✅ DTO for updating a result (WRITE)
export class UpdateResultDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  theta1_init?: number;

  @IsOptional()
  @IsNumber()
  theta2_init?: number;

  @IsOptional()
  @IsNumber()
  theta3_init?: number;

  @IsOptional()
  theta1_series?: Prisma.InputJsonValue;

  @IsOptional()
  theta2_series?: Prisma.InputJsonValue;

  @IsOptional()
  theta3_series?: Prisma.InputJsonValue;

  @IsOptional()
  time?: Prisma.InputJsonValue;

  @IsOptional()
  x1?: Prisma.InputJsonValue;

  @IsOptional()
  y1?: Prisma.InputJsonValue;

  @IsOptional()
  x2?: Prisma.InputJsonValue;

  @IsOptional()
  y2?: Prisma.InputJsonValue;

  @IsOptional()
  x3?: Prisma.InputJsonValue;

  @IsOptional()
  y3?: Prisma.InputJsonValue;
}