import { Permission } from './permission.interface';

// ## PERMISSIONS MAP ##
// 1 - System
// 2 - Material
// 3 - Staff
// 4 - StaffRole
// 5 - StaffRolePermission
// 6 - Product
// 7 - Customers
// 8 - Invoice
// 9 - Order

export enum System {
  ChangeSetting = 'system.change-setting',
}

export enum Material {
  List = 'material.list',
  Get = 'material.get',
}

export enum Staff {
  Create = 'staff.create',
  Update = 'staff.update',
  Get = 'staff.get',
  Delete = 'staff.delete',
  List = 'staff.list',
}

export enum StaffRole {
  List = 'staff-role.list',
  Create = 'staff-role.create',
  Update = 'staff-role.update',
  Get = 'staff-role.get',
  Delete = 'staff-role.delete',
}

export enum StaffRolePermission {
  List = 'staff-role-permisison.list',
}

export enum Product {
  Get = 'product.get',
  List = 'product.list',
  Create = 'product.create',
  Update = 'product.update',
  Delete = 'product.delete',
}

export enum Customer {
  Create = 'customer.create',
  Update = 'customer.update',
  Get = 'customer.get',
  Delete = 'customer.delete',
  List = 'customer.list',
}

export enum Invoice {
  Get = 'invoice.get',
  List = 'invoice.list',
  Create = 'invoice.create',
  Update = 'invoice.update',
  Delete = 'invoice.delete',
}

export enum Order {
  Get = 'order.get',
  List = 'order.list',
  Create = 'order.create',
  Update = 'order.update',
  Delete = 'order.delete',
  ChangeStatus = 'order.changestatus',
}

export const PermissionIds = {
  System,
  Material,
  Staff,
  StaffRole,
  StaffRolePermission,
  Customer,
  Product,
  Invoice,
  Order,
};

export const permissions: Permission[] = [
  // ========== [system] =========
  { id: System.ChangeSetting, description: '' },

  // ========== [material] ==========
  { id: Material.Get, description: '' },
  { id: Material.List, description: '' },

  // ========== [staff] ==========
  { id: Staff.Get, description: '' },
  { id: Staff.List, description: '' },
  { id: Staff.Create, description: '' },
  { id: Staff.Update, description: '' },
  { id: Staff.Delete, description: '' },

  // ========== [staff-role] ==========
  { id: StaffRole.Get, description: '' },
  { id: StaffRole.List, description: '' },
  { id: StaffRole.Create, description: '' },
  { id: StaffRole.Update, description: '' },
  { id: StaffRole.Delete, description: '' },

  // ========== [staff-role-permisisons] ==========
  { id: StaffRolePermission.List, description: '' },

  // ========== [procuct] ==========
  { id: Product.Get, description: '' },
  { id: Product.List, description: '' },
  { id: Product.Create, description: '' },
  { id: Product.Update, description: '' },
  { id: Product.Delete, description: '' },

  // ========== [customers] ==========
  { id: Customer.Get, description: '' },
  { id: Customer.List, description: '' },
  { id: Customer.Create, description: '' },
  { id: Customer.Update, description: '' },
  { id: Customer.Delete, description: '' },

  // ========== [invoice] ==========
  { id: Invoice.Get, description: '' },
  { id: Invoice.List, description: '' },
  { id: Invoice.Create, description: '' },
  { id: Invoice.Update, description: '' },
  { id: Invoice.Delete, description: '' },

  // ========== [order] ==========
  { id: Order.Get, description: '' },
  { id: Order.List, description: '' },
  { id: Order.Create, description: '' },
  { id: Order.Update, description: '' },
  { id: Order.Delete, description: '' },
];
