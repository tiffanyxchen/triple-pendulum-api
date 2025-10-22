import { IsNotEmpty, IsNumber, IsArray, IsUUID } from 'class-validator';

//
// ---------- Prisma Entity Types ----------
//

// This matches your Prisma `Result` model
export type Result = {
  id: string;
  theta1_init: number;
  theta2_init: number;
  theta3_init: number;
  theta1_series: number[];
  theta2_series: number[];
  theta3_series: number[];
  time: number[];
  x1: number[];
  y1: number[];
  x2: number[];
  y2: number[];
  x3: number[];
  y3: number[];
  createdAt: Date;
  orderId?: number | null;
  userId?: number | null;
};

// This matches your Prisma `User` model
export type User = {
  id: number;
  email: string;
  name: string;
  address?: string | null;
  roles: string[];
};

export interface Order {
  id: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  results: Result[];
}

//
// ---------- DTOs for Validation ----------
//

export class CreateOrderDto {
  @IsNumber()
  total: number;

  @IsNumber()
  userId: number;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  results: string[]; // UUIDs of existing Result records
}

export class UpdateOrderDto {
  @IsNumber()
  total: number;

  @IsArray()
  @IsUUID('all', { each: true })
  results: string[];
}
