export class CreateUserDto {
  email: string;
  name: string;
  address?: string;
  roles?: string[];
}

export class UpdateUserDto {
  email?: string;
  name?: string;
  address?: string;
  roles?: string[];
}
