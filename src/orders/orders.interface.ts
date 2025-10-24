import { IsNotEmpty, IsNumber, IsArray, IsUUID, IsOptional } from 'class-validator';
import { Prisma } from '@prisma/client';

//
// ---------- Prisma Entity Types ----------
//

// ✅ Matches your Prisma `Result` model
export type Result = {
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
  orderId?: number | null;
  userId?: number | null;
};

// ✅ Matches your Prisma `User` model
export type User = {
  id: number;
  email: string;
  name: string;
  address?: string | null;
  roles: string[];
};

// ✅ Matches your Prisma `Order` model (no total field)
export interface Order {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: number | null;
  results: Result[];
}

//
// ---------- DTOs for Validation ----------
//

// ✅ DTO for creating a new Order
export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  results: string[]; // UUIDs of existing Result records
}

// ✅ DTO for updating an Order
export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  userId?: number; // ✅ now explicitly marked optional

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  results?: string[]; // ✅ also optional to allow partial updates
}

