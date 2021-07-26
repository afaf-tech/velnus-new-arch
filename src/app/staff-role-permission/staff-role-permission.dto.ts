import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

@Exclude()
export class CreateStaffRolePermissionDto {
  @Expose()
  @IsNotEmpty()
  @IsInt()
  storeId: number;

  @Expose()
  @IsNotEmpty()
  permission: string;
}
