// users.interface.ts

import { Result } from '../results/results.interface'; // adjust path if needed

export interface User {
  id: number;
  email: string;
  name: string;
  address: string|null;
  roles: string[];
  // createdAt: Date;
  // updatedAt: Date;
  orders: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number | null;
    // Add more fields if Order has more
  }[];
}