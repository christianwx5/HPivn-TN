export enum Actions {
  // exclusive to superadmin grant all actions
  MANAGE = 'manage',

  // common actions between subjects (resources)
  CREATE = 'create',
  READ = 'read',
  READ_ALL = 'read-all',
  UPDATE = 'update',
  BULK_UPDATE = 'bulk-update',
  DELETE = 'delete',

  // extra actions
  SEND_EMAIL = 'send-email',
  GET_REPORT = 'get-report',
  EXPORTABLE = 'exportable',
  IMPORTABLE = 'importable',

  // extra actions related to wherehouse
  CREATE_TRANSFER = 'create-transfer',
  READ_TRANSFER = 'read-transfer',
  UPDATE_TRANSFER = 'update-transfer',
  DELETE_TRANSFER = 'delete-transfer',
}

export enum Resources {
  ALL = 'all', // exclusive to superadmin grant all resources
  CONTACTS = 'contacts',
  USERS = 'users',
  BILLS = 'bills',
  CATEGORIES = 'categories',
  COMPANIES = 'companies',
  INVOICES = 'invoices',
  ITEMS = 'items',
  PAYMENTS = 'payments',
  REPORTS = 'reports',
  INVENTORY_ADJUSTEMENT = 'inventory-adjustement',
  EXPORTABLE = 'exportable',
  PRICE_LIST = 'price-list',
  WHEREHOUSES = 'wherehouses',
  SELLERS = 'sellers',
  CURRENCIES = 'currencies',
}
