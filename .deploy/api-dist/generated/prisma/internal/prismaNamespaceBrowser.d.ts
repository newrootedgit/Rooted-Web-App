import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const ModelName: {
    readonly blend_ingredients: "blend_ingredients";
    readonly blends: "blends";
    readonly customers: "customers";
    readonly employees: "employees";
    readonly farm_layouts: "farm_layouts";
    readonly farm_users: "farm_users";
    readonly farms: "farms";
    readonly machines: "machines";
    readonly order_items: "order_items";
    readonly orders: "orders";
    readonly product_categories: "product_categories";
    readonly products: "products";
    readonly rack_assignments: "rack_assignments";
    readonly recurring_order_schedules: "recurring_order_schedules";
    readonly supplies: "supplies";
    readonly supply_categories: "supply_categories";
    readonly supply_purchases: "supply_purchases";
    readonly supply_usage: "supply_usage";
    readonly tasks: "tasks";
    readonly tenants: "tenants";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const Blend_ingredientsScalarFieldEnum: {
    readonly id: "id";
    readonly blend_id: "blend_id";
    readonly product_id: "product_id";
    readonly percentage: "percentage";
    readonly timing_override: "timing_override";
};
export type Blend_ingredientsScalarFieldEnum = (typeof Blend_ingredientsScalarFieldEnum)[keyof typeof Blend_ingredientsScalarFieldEnum];
export declare const BlendsScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly description: "description";
    readonly created_at: "created_at";
};
export type BlendsScalarFieldEnum = (typeof BlendsScalarFieldEnum)[keyof typeof BlendsScalarFieldEnum];
export declare const CustomersScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly email: "email";
    readonly phone: "phone";
    readonly company_name: "company_name";
    readonly customer_type: "customer_type";
    readonly payment_terms: "payment_terms";
    readonly address: "address";
    readonly tags: "tags";
    readonly notes: "notes";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
};
export type CustomersScalarFieldEnum = (typeof CustomersScalarFieldEnum)[keyof typeof CustomersScalarFieldEnum];
export declare const EmployeesScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly first_name: "first_name";
    readonly last_name: "last_name";
    readonly email: "email";
    readonly phone: "phone";
    readonly position: "position";
    readonly status: "status";
    readonly hire_date: "hire_date";
    readonly hourly_rate: "hourly_rate";
    readonly notes: "notes";
    readonly created_at: "created_at";
};
export type EmployeesScalarFieldEnum = (typeof EmployeesScalarFieldEnum)[keyof typeof EmployeesScalarFieldEnum];
export declare const Farm_layoutsScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly canvas_data: "canvas_data";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
};
export type Farm_layoutsScalarFieldEnum = (typeof Farm_layoutsScalarFieldEnum)[keyof typeof Farm_layoutsScalarFieldEnum];
export declare const Farm_usersScalarFieldEnum: {
    readonly id: "id";
    readonly tenant_id: "tenant_id";
    readonly farm_id: "farm_id";
    readonly clerk_user_id: "clerk_user_id";
    readonly role: "role";
    readonly first_name: "first_name";
    readonly last_name: "last_name";
    readonly email: "email";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
};
export type Farm_usersScalarFieldEnum = (typeof Farm_usersScalarFieldEnum)[keyof typeof Farm_usersScalarFieldEnum];
export declare const FarmsScalarFieldEnum: {
    readonly tenant_id: "tenant_id";
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly logo_url: "logo_url";
    readonly brand_color: "brand_color";
    readonly contact_email: "contact_email";
    readonly contact_phone: "contact_phone";
    readonly address: "address";
    readonly settings: "settings";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type FarmsScalarFieldEnum = (typeof FarmsScalarFieldEnum)[keyof typeof FarmsScalarFieldEnum];
export declare const MachinesScalarFieldEnum: {
    readonly id: "id";
    readonly tenant_id: "tenant_id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly display_name: "display_name";
    readonly device_id: "device_id";
    readonly created_at: "created_at";
    readonly aws_iot_thing_name: "aws_iot_thing_name";
    readonly status: "status";
    readonly last_seen_at: "last_seen_at";
    readonly current_wifi_ssid: "current_wifi_ssid";
};
export type MachinesScalarFieldEnum = (typeof MachinesScalarFieldEnum)[keyof typeof MachinesScalarFieldEnum];
export declare const Order_itemsScalarFieldEnum: {
    readonly id: "id";
    readonly order_id: "order_id";
    readonly product_id: "product_id";
    readonly blend_id: "blend_id";
    readonly quantity_oz: "quantity_oz";
    readonly harvest_date: "harvest_date";
    readonly overage_percent: "overage_percent";
    readonly trays_needed: "trays_needed";
    readonly soak_date: "soak_date";
    readonly seed_date: "seed_date";
    readonly move_to_light_date: "move_to_light_date";
    readonly created_at: "created_at";
};
export type Order_itemsScalarFieldEnum = (typeof Order_itemsScalarFieldEnum)[keyof typeof Order_itemsScalarFieldEnum];
export declare const OrdersScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly customer_id: "customer_id";
    readonly order_number: "order_number";
    readonly status: "status";
    readonly notes: "notes";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type OrdersScalarFieldEnum = (typeof OrdersScalarFieldEnum)[keyof typeof OrdersScalarFieldEnum];
export declare const Product_categoriesScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly description: "description";
    readonly created_at: "created_at";
};
export type Product_categoriesScalarFieldEnum = (typeof Product_categoriesScalarFieldEnum)[keyof typeof Product_categoriesScalarFieldEnum];
export declare const ProductsScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly category_id: "category_id";
    readonly name: "name";
    readonly sku: "sku";
    readonly days_soaking: "days_soaking";
    readonly days_germination: "days_germination";
    readonly days_light: "days_light";
    readonly avg_yield_per_tray: "avg_yield_per_tray";
    readonly seed_weight: "seed_weight";
    readonly seed_unit: "seed_unit";
    readonly unit_cost: "unit_cost";
    readonly unit_price: "unit_price";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
};
export type ProductsScalarFieldEnum = (typeof ProductsScalarFieldEnum)[keyof typeof ProductsScalarFieldEnum];
export declare const Rack_assignmentsScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly rack_element_id: "rack_element_id";
    readonly level: "level";
    readonly order_item_id: "order_item_id";
    readonly tray_count: "tray_count";
    readonly assigned_at: "assigned_at";
    readonly assigned_by: "assigned_by";
    readonly is_active: "is_active";
    readonly removed_at: "removed_at";
};
export type Rack_assignmentsScalarFieldEnum = (typeof Rack_assignmentsScalarFieldEnum)[keyof typeof Rack_assignmentsScalarFieldEnum];
export declare const Recurring_order_schedulesScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly customer_id: "customer_id";
    readonly name: "name";
    readonly schedule_type: "schedule_type";
    readonly days_of_week: "days_of_week";
    readonly interval_days: "interval_days";
    readonly start_date: "start_date";
    readonly end_date: "end_date";
    readonly lead_time_days: "lead_time_days";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
};
export type Recurring_order_schedulesScalarFieldEnum = (typeof Recurring_order_schedulesScalarFieldEnum)[keyof typeof Recurring_order_schedulesScalarFieldEnum];
export declare const SuppliesScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly category_id: "category_id";
    readonly product_id: "product_id";
    readonly name: "name";
    readonly sku: "sku";
    readonly current_stock: "current_stock";
    readonly unit: "unit";
    readonly reorder_level: "reorder_level";
    readonly created_at: "created_at";
};
export type SuppliesScalarFieldEnum = (typeof SuppliesScalarFieldEnum)[keyof typeof SuppliesScalarFieldEnum];
export declare const Supply_categoriesScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly description: "description";
    readonly created_at: "created_at";
};
export type Supply_categoriesScalarFieldEnum = (typeof Supply_categoriesScalarFieldEnum)[keyof typeof Supply_categoriesScalarFieldEnum];
export declare const Supply_purchasesScalarFieldEnum: {
    readonly id: "id";
    readonly supply_id: "supply_id";
    readonly quantity: "quantity";
    readonly unit_cost: "unit_cost";
    readonly total_cost: "total_cost";
    readonly supplier: "supplier";
    readonly lot_number: "lot_number";
    readonly expiry_date: "expiry_date";
    readonly purchase_date: "purchase_date";
    readonly notes: "notes";
    readonly created_at: "created_at";
};
export type Supply_purchasesScalarFieldEnum = (typeof Supply_purchasesScalarFieldEnum)[keyof typeof Supply_purchasesScalarFieldEnum];
export declare const Supply_usageScalarFieldEnum: {
    readonly id: "id";
    readonly supply_id: "supply_id";
    readonly task_id: "task_id";
    readonly quantity: "quantity";
    readonly usage_type: "usage_type";
    readonly notes: "notes";
    readonly created_at: "created_at";
};
export type Supply_usageScalarFieldEnum = (typeof Supply_usageScalarFieldEnum)[keyof typeof Supply_usageScalarFieldEnum];
export declare const TasksScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly order_item_id: "order_item_id";
    readonly title: "title";
    readonly type: "type";
    readonly due_date: "due_date";
    readonly status: "status";
    readonly priority: "priority";
    readonly completed_at: "completed_at";
    readonly completed_by: "completed_by";
    readonly completion_notes: "completion_notes";
    readonly actual_trays: "actual_trays";
    readonly seed_lot: "seed_lot";
    readonly created_at: "created_at";
};
export type TasksScalarFieldEnum = (typeof TasksScalarFieldEnum)[keyof typeof TasksScalarFieldEnum];
export declare const TenantsScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly contact_email: "contact_email";
    readonly contact_phone: "contact_phone";
    readonly settings: "settings";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type TenantsScalarFieldEnum = (typeof TenantsScalarFieldEnum)[keyof typeof TenantsScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const JsonNullValueInput: {
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const JsonNullValueFilter: {
    readonly DbNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly AnyNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map