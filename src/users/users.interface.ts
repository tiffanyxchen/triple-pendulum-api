// users.interface.ts

import { Result } from '../results/results.interface'; // adjust path if needed

export interface User {
  id?: number;          // optional for creation
  email: string;
  name: string;
  address?: string | null; // optional
  results?: Result[];   // list of results requested by the user
  createdAt?: Date;
  updatedAt?: Date;
}
