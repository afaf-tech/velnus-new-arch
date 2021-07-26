import { StaffPosition } from '@app/staff/staff.constants';
import { PermissionIds as Perms } from '@app/permission';

export const setupAdminList = [
  {
    id: 1,
    username: 'admin',
    password: 'ganteng',
  },
];

export const setupStoreList = [
  {
    id: 1,
    name: 'Utama',
    address:
      'Graha Indah Blok A6 No, 19, Drajat, Kec. Paciran, Kabupaten Lamongan, Jawa Timur 62264',
  },
];

export const setupStoreRoleList = [
  {
    id: 1,
    slug: 'staff-manager',
    name: 'Staff Manager',
    permissions: [
      Perms.System.ChangeSetting,

      Perms.Material.Get,
      Perms.Material.List,

      Perms.Staff.Get,
      Perms.Staff.List,
      Perms.Staff.Create,
      Perms.Staff.Update,
      Perms.Staff.Delete,

      Perms.StaffRole.Get,
      Perms.StaffRole.List,
      Perms.StaffRole.Create,
      Perms.StaffRole.Update,
      Perms.StaffRole.Delete,

      Perms.StaffRolePermission.List,

      Perms.Product.Get,
      Perms.Product.List,
      Perms.Product.Create,
      Perms.Product.Update,
      Perms.Product.Delete,

      Perms.Customer.Get,
      Perms.Customer.List,
      Perms.Customer.Create,
      Perms.Customer.Update,
      Perms.Customer.Delete,

      Perms.Order.ChangeStatus,
    ],
    storeId: 1,
  },
  {
    id: 2,
    slug: 'staff-employe',
    name: 'General Staff',
    permissions: [
      Perms.Staff.Get,
      Perms.Staff.List,

      Perms.StaffRole.Get,
      Perms.StaffRole.List,

      Perms.StaffRolePermission.List,

      Perms.Customer.Get,
      Perms.Customer.List,

      Perms.Product.Get,
      Perms.Product.List,
    ],
    storeId: 1,
  },
];

export const setupStaffList = [
  {
    id: 1,
    username: 'staffadmin',
    password: 'admin123',
    name: 'Admin Staff Manager',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    position: StaffPosition.ADMINSTAFF,
    storeId: 1,
    roleId: 1,
  },
  {
    id: 2,
    username: 'staff',
    password: 'staff123',
    name: 'Common Staff',
    address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    position: StaffPosition.GENERALSTAFF,
    createdById: 1,
    storeId: 1,
    roleId: 2,
  },
];
