import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model farms
 *
 */
export type farmsModel = runtime.Types.Result.DefaultSelection<Prisma.$farmsPayload>;
export type AggregateFarms = {
    _count: FarmsCountAggregateOutputType | null;
    _min: FarmsMinAggregateOutputType | null;
    _max: FarmsMaxAggregateOutputType | null;
};
export type FarmsMinAggregateOutputType = {
    tenant_id: string | null;
    id: string | null;
    name: string | null;
    slug: string | null;
    logo_url: string | null;
    brand_color: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type FarmsMaxAggregateOutputType = {
    tenant_id: string | null;
    id: string | null;
    name: string | null;
    slug: string | null;
    logo_url: string | null;
    brand_color: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type FarmsCountAggregateOutputType = {
    tenant_id: number;
    id: number;
    name: number;
    slug: number;
    logo_url: number;
    brand_color: number;
    contact_email: number;
    contact_phone: number;
    address: number;
    settings: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type FarmsMinAggregateInputType = {
    tenant_id?: true;
    id?: true;
    name?: true;
    slug?: true;
    logo_url?: true;
    brand_color?: true;
    contact_email?: true;
    contact_phone?: true;
    created_at?: true;
    updated_at?: true;
};
export type FarmsMaxAggregateInputType = {
    tenant_id?: true;
    id?: true;
    name?: true;
    slug?: true;
    logo_url?: true;
    brand_color?: true;
    contact_email?: true;
    contact_phone?: true;
    created_at?: true;
    updated_at?: true;
};
export type FarmsCountAggregateInputType = {
    tenant_id?: true;
    id?: true;
    name?: true;
    slug?: true;
    logo_url?: true;
    brand_color?: true;
    contact_email?: true;
    contact_phone?: true;
    address?: true;
    settings?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type FarmsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which farms to aggregate.
     */
    where?: Prisma.farmsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farms to fetch.
     */
    orderBy?: Prisma.farmsOrderByWithRelationInput | Prisma.farmsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.farmsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farms from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farms.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned farms
    **/
    _count?: true | FarmsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: FarmsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: FarmsMaxAggregateInputType;
};
export type GetFarmsAggregateType<T extends FarmsAggregateArgs> = {
    [P in keyof T & keyof AggregateFarms]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFarms[P]> : Prisma.GetScalarType<T[P], AggregateFarms[P]>;
};
export type farmsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.farmsWhereInput;
    orderBy?: Prisma.farmsOrderByWithAggregationInput | Prisma.farmsOrderByWithAggregationInput[];
    by: Prisma.FarmsScalarFieldEnum[] | Prisma.FarmsScalarFieldEnum;
    having?: Prisma.farmsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FarmsCountAggregateInputType | true;
    _min?: FarmsMinAggregateInputType;
    _max?: FarmsMaxAggregateInputType;
};
export type FarmsGroupByOutputType = {
    tenant_id: string | null;
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    brand_color: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    address: runtime.JsonValue | null;
    settings: runtime.JsonValue | null;
    created_at: Date | null;
    updated_at: Date | null;
    _count: FarmsCountAggregateOutputType | null;
    _min: FarmsMinAggregateOutputType | null;
    _max: FarmsMaxAggregateOutputType | null;
};
type GetFarmsGroupByPayload<T extends farmsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FarmsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FarmsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FarmsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FarmsGroupByOutputType[P]>;
}>>;
export type farmsWhereInput = {
    AND?: Prisma.farmsWhereInput | Prisma.farmsWhereInput[];
    OR?: Prisma.farmsWhereInput[];
    NOT?: Prisma.farmsWhereInput | Prisma.farmsWhereInput[];
    tenant_id?: Prisma.UuidNullableFilter<"farms"> | string | null;
    id?: Prisma.UuidFilter<"farms"> | string;
    name?: Prisma.StringFilter<"farms"> | string;
    slug?: Prisma.StringFilter<"farms"> | string;
    logo_url?: Prisma.StringNullableFilter<"farms"> | string | null;
    brand_color?: Prisma.StringNullableFilter<"farms"> | string | null;
    contact_email?: Prisma.StringNullableFilter<"farms"> | string | null;
    contact_phone?: Prisma.StringNullableFilter<"farms"> | string | null;
    address?: Prisma.JsonNullableFilter<"farms">;
    settings?: Prisma.JsonNullableFilter<"farms">;
    created_at?: Prisma.DateTimeNullableFilter<"farms"> | Date | string | null;
    updated_at?: Prisma.DateTimeNullableFilter<"farms"> | Date | string | null;
    blends?: Prisma.BlendsListRelationFilter;
    customers?: Prisma.CustomersListRelationFilter;
    employees?: Prisma.EmployeesListRelationFilter;
    farm_layouts?: Prisma.Farm_layoutsListRelationFilter;
    farm_users?: Prisma.Farm_usersListRelationFilter;
    tenants?: Prisma.XOR<Prisma.TenantsNullableScalarRelationFilter, Prisma.tenantsWhereInput> | null;
    machines?: Prisma.MachinesListRelationFilter;
    orders?: Prisma.OrdersListRelationFilter;
    product_categories?: Prisma.Product_categoriesListRelationFilter;
    products?: Prisma.ProductsListRelationFilter;
    rack_assignments?: Prisma.Rack_assignmentsListRelationFilter;
    recurring_order_schedules?: Prisma.Recurring_order_schedulesListRelationFilter;
    supplies?: Prisma.SuppliesListRelationFilter;
    supply_categories?: Prisma.Supply_categoriesListRelationFilter;
    tasks?: Prisma.TasksListRelationFilter;
};
export type farmsOrderByWithRelationInput = {
    tenant_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    logo_url?: Prisma.SortOrderInput | Prisma.SortOrder;
    brand_color?: Prisma.SortOrderInput | Prisma.SortOrder;
    contact_email?: Prisma.SortOrderInput | Prisma.SortOrder;
    contact_phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    settings?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    blends?: Prisma.blendsOrderByRelationAggregateInput;
    customers?: Prisma.customersOrderByRelationAggregateInput;
    employees?: Prisma.employeesOrderByRelationAggregateInput;
    farm_layouts?: Prisma.farm_layoutsOrderByRelationAggregateInput;
    farm_users?: Prisma.farm_usersOrderByRelationAggregateInput;
    tenants?: Prisma.tenantsOrderByWithRelationInput;
    machines?: Prisma.machinesOrderByRelationAggregateInput;
    orders?: Prisma.ordersOrderByRelationAggregateInput;
    product_categories?: Prisma.product_categoriesOrderByRelationAggregateInput;
    products?: Prisma.productsOrderByRelationAggregateInput;
    rack_assignments?: Prisma.rack_assignmentsOrderByRelationAggregateInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesOrderByRelationAggregateInput;
    supplies?: Prisma.suppliesOrderByRelationAggregateInput;
    supply_categories?: Prisma.supply_categoriesOrderByRelationAggregateInput;
    tasks?: Prisma.tasksOrderByRelationAggregateInput;
};
export type farmsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    slug?: string;
    AND?: Prisma.farmsWhereInput | Prisma.farmsWhereInput[];
    OR?: Prisma.farmsWhereInput[];
    NOT?: Prisma.farmsWhereInput | Prisma.farmsWhereInput[];
    tenant_id?: Prisma.UuidNullableFilter<"farms"> | string | null;
    name?: Prisma.StringFilter<"farms"> | string;
    logo_url?: Prisma.StringNullableFilter<"farms"> | string | null;
    brand_color?: Prisma.StringNullableFilter<"farms"> | string | null;
    contact_email?: Prisma.StringNullableFilter<"farms"> | string | null;
    contact_phone?: Prisma.StringNullableFilter<"farms"> | string | null;
    address?: Prisma.JsonNullableFilter<"farms">;
    settings?: Prisma.JsonNullableFilter<"farms">;
    created_at?: Prisma.DateTimeNullableFilter<"farms"> | Date | string | null;
    updated_at?: Prisma.DateTimeNullableFilter<"farms"> | Date | string | null;
    blends?: Prisma.BlendsListRelationFilter;
    customers?: Prisma.CustomersListRelationFilter;
    employees?: Prisma.EmployeesListRelationFilter;
    farm_layouts?: Prisma.Farm_layoutsListRelationFilter;
    farm_users?: Prisma.Farm_usersListRelationFilter;
    tenants?: Prisma.XOR<Prisma.TenantsNullableScalarRelationFilter, Prisma.tenantsWhereInput> | null;
    machines?: Prisma.MachinesListRelationFilter;
    orders?: Prisma.OrdersListRelationFilter;
    product_categories?: Prisma.Product_categoriesListRelationFilter;
    products?: Prisma.ProductsListRelationFilter;
    rack_assignments?: Prisma.Rack_assignmentsListRelationFilter;
    recurring_order_schedules?: Prisma.Recurring_order_schedulesListRelationFilter;
    supplies?: Prisma.SuppliesListRelationFilter;
    supply_categories?: Prisma.Supply_categoriesListRelationFilter;
    tasks?: Prisma.TasksListRelationFilter;
}, "id" | "slug">;
export type farmsOrderByWithAggregationInput = {
    tenant_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    logo_url?: Prisma.SortOrderInput | Prisma.SortOrder;
    brand_color?: Prisma.SortOrderInput | Prisma.SortOrder;
    contact_email?: Prisma.SortOrderInput | Prisma.SortOrder;
    contact_phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    settings?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    updated_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.farmsCountOrderByAggregateInput;
    _max?: Prisma.farmsMaxOrderByAggregateInput;
    _min?: Prisma.farmsMinOrderByAggregateInput;
};
export type farmsScalarWhereWithAggregatesInput = {
    AND?: Prisma.farmsScalarWhereWithAggregatesInput | Prisma.farmsScalarWhereWithAggregatesInput[];
    OR?: Prisma.farmsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.farmsScalarWhereWithAggregatesInput | Prisma.farmsScalarWhereWithAggregatesInput[];
    tenant_id?: Prisma.UuidNullableWithAggregatesFilter<"farms"> | string | null;
    id?: Prisma.UuidWithAggregatesFilter<"farms"> | string;
    name?: Prisma.StringWithAggregatesFilter<"farms"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"farms"> | string;
    logo_url?: Prisma.StringNullableWithAggregatesFilter<"farms"> | string | null;
    brand_color?: Prisma.StringNullableWithAggregatesFilter<"farms"> | string | null;
    contact_email?: Prisma.StringNullableWithAggregatesFilter<"farms"> | string | null;
    contact_phone?: Prisma.StringNullableWithAggregatesFilter<"farms"> | string | null;
    address?: Prisma.JsonNullableWithAggregatesFilter<"farms">;
    settings?: Prisma.JsonNullableWithAggregatesFilter<"farms">;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"farms"> | Date | string | null;
    updated_at?: Prisma.DateTimeNullableWithAggregatesFilter<"farms"> | Date | string | null;
};
export type farmsCreateInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateManyInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};
export type farmsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farmsUncheckedUpdateManyInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type FarmsNullableScalarRelationFilter = {
    is?: Prisma.farmsWhereInput | null;
    isNot?: Prisma.farmsWhereInput | null;
};
export type farmsCountOrderByAggregateInput = {
    tenant_id?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    logo_url?: Prisma.SortOrder;
    brand_color?: Prisma.SortOrder;
    contact_email?: Prisma.SortOrder;
    contact_phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    settings?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type farmsMaxOrderByAggregateInput = {
    tenant_id?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    logo_url?: Prisma.SortOrder;
    brand_color?: Prisma.SortOrder;
    contact_email?: Prisma.SortOrder;
    contact_phone?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type farmsMinOrderByAggregateInput = {
    tenant_id?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    logo_url?: Prisma.SortOrder;
    brand_color?: Prisma.SortOrder;
    contact_email?: Prisma.SortOrder;
    contact_phone?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type FarmsListRelationFilter = {
    every?: Prisma.farmsWhereInput;
    some?: Prisma.farmsWhereInput;
    none?: Prisma.farmsWhereInput;
};
export type farmsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type farmsCreateNestedOneWithoutBlendsInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutBlendsInput, Prisma.farmsUncheckedCreateWithoutBlendsInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutBlendsInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutBlendsNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutBlendsInput, Prisma.farmsUncheckedCreateWithoutBlendsInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutBlendsInput;
    upsert?: Prisma.farmsUpsertWithoutBlendsInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutBlendsInput, Prisma.farmsUpdateWithoutBlendsInput>, Prisma.farmsUncheckedUpdateWithoutBlendsInput>;
};
export type farmsCreateNestedOneWithoutCustomersInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutCustomersInput, Prisma.farmsUncheckedCreateWithoutCustomersInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutCustomersInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutCustomersNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutCustomersInput, Prisma.farmsUncheckedCreateWithoutCustomersInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutCustomersInput;
    upsert?: Prisma.farmsUpsertWithoutCustomersInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutCustomersInput, Prisma.farmsUpdateWithoutCustomersInput>, Prisma.farmsUncheckedUpdateWithoutCustomersInput>;
};
export type farmsCreateNestedOneWithoutEmployeesInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutEmployeesInput, Prisma.farmsUncheckedCreateWithoutEmployeesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutEmployeesInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutEmployeesNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutEmployeesInput, Prisma.farmsUncheckedCreateWithoutEmployeesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutEmployeesInput;
    upsert?: Prisma.farmsUpsertWithoutEmployeesInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutEmployeesInput, Prisma.farmsUpdateWithoutEmployeesInput>, Prisma.farmsUncheckedUpdateWithoutEmployeesInput>;
};
export type farmsCreateNestedOneWithoutFarm_layoutsInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutFarm_layoutsInput, Prisma.farmsUncheckedCreateWithoutFarm_layoutsInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutFarm_layoutsInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutFarm_layoutsNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutFarm_layoutsInput, Prisma.farmsUncheckedCreateWithoutFarm_layoutsInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutFarm_layoutsInput;
    upsert?: Prisma.farmsUpsertWithoutFarm_layoutsInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutFarm_layoutsInput, Prisma.farmsUpdateWithoutFarm_layoutsInput>, Prisma.farmsUncheckedUpdateWithoutFarm_layoutsInput>;
};
export type farmsCreateNestedOneWithoutFarm_usersInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutFarm_usersInput, Prisma.farmsUncheckedCreateWithoutFarm_usersInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutFarm_usersInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutFarm_usersNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutFarm_usersInput, Prisma.farmsUncheckedCreateWithoutFarm_usersInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutFarm_usersInput;
    upsert?: Prisma.farmsUpsertWithoutFarm_usersInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutFarm_usersInput, Prisma.farmsUpdateWithoutFarm_usersInput>, Prisma.farmsUncheckedUpdateWithoutFarm_usersInput>;
};
export type farmsCreateNestedOneWithoutMachinesInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutMachinesInput, Prisma.farmsUncheckedCreateWithoutMachinesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutMachinesInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutMachinesNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutMachinesInput, Prisma.farmsUncheckedCreateWithoutMachinesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutMachinesInput;
    upsert?: Prisma.farmsUpsertWithoutMachinesInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutMachinesInput, Prisma.farmsUpdateWithoutMachinesInput>, Prisma.farmsUncheckedUpdateWithoutMachinesInput>;
};
export type farmsCreateNestedOneWithoutOrdersInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutOrdersInput, Prisma.farmsUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutOrdersInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutOrdersInput, Prisma.farmsUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutOrdersInput;
    upsert?: Prisma.farmsUpsertWithoutOrdersInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutOrdersInput, Prisma.farmsUpdateWithoutOrdersInput>, Prisma.farmsUncheckedUpdateWithoutOrdersInput>;
};
export type farmsCreateNestedOneWithoutProduct_categoriesInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutProduct_categoriesInput, Prisma.farmsUncheckedCreateWithoutProduct_categoriesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutProduct_categoriesInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutProduct_categoriesNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutProduct_categoriesInput, Prisma.farmsUncheckedCreateWithoutProduct_categoriesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutProduct_categoriesInput;
    upsert?: Prisma.farmsUpsertWithoutProduct_categoriesInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutProduct_categoriesInput, Prisma.farmsUpdateWithoutProduct_categoriesInput>, Prisma.farmsUncheckedUpdateWithoutProduct_categoriesInput>;
};
export type farmsCreateNestedOneWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutProductsInput, Prisma.farmsUncheckedCreateWithoutProductsInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutProductsInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutProductsInput, Prisma.farmsUncheckedCreateWithoutProductsInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutProductsInput;
    upsert?: Prisma.farmsUpsertWithoutProductsInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutProductsInput, Prisma.farmsUpdateWithoutProductsInput>, Prisma.farmsUncheckedUpdateWithoutProductsInput>;
};
export type farmsCreateNestedOneWithoutRack_assignmentsInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutRack_assignmentsInput, Prisma.farmsUncheckedCreateWithoutRack_assignmentsInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutRack_assignmentsInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutRack_assignmentsNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutRack_assignmentsInput, Prisma.farmsUncheckedCreateWithoutRack_assignmentsInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutRack_assignmentsInput;
    upsert?: Prisma.farmsUpsertWithoutRack_assignmentsInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutRack_assignmentsInput, Prisma.farmsUpdateWithoutRack_assignmentsInput>, Prisma.farmsUncheckedUpdateWithoutRack_assignmentsInput>;
};
export type farmsCreateNestedOneWithoutRecurring_order_schedulesInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutRecurring_order_schedulesInput, Prisma.farmsUncheckedCreateWithoutRecurring_order_schedulesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutRecurring_order_schedulesInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutRecurring_order_schedulesNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutRecurring_order_schedulesInput, Prisma.farmsUncheckedCreateWithoutRecurring_order_schedulesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutRecurring_order_schedulesInput;
    upsert?: Prisma.farmsUpsertWithoutRecurring_order_schedulesInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutRecurring_order_schedulesInput, Prisma.farmsUpdateWithoutRecurring_order_schedulesInput>, Prisma.farmsUncheckedUpdateWithoutRecurring_order_schedulesInput>;
};
export type farmsCreateNestedOneWithoutSuppliesInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutSuppliesInput, Prisma.farmsUncheckedCreateWithoutSuppliesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutSuppliesInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutSuppliesNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutSuppliesInput, Prisma.farmsUncheckedCreateWithoutSuppliesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutSuppliesInput;
    upsert?: Prisma.farmsUpsertWithoutSuppliesInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutSuppliesInput, Prisma.farmsUpdateWithoutSuppliesInput>, Prisma.farmsUncheckedUpdateWithoutSuppliesInput>;
};
export type farmsCreateNestedOneWithoutSupply_categoriesInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutSupply_categoriesInput, Prisma.farmsUncheckedCreateWithoutSupply_categoriesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutSupply_categoriesInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutSupply_categoriesNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutSupply_categoriesInput, Prisma.farmsUncheckedCreateWithoutSupply_categoriesInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutSupply_categoriesInput;
    upsert?: Prisma.farmsUpsertWithoutSupply_categoriesInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutSupply_categoriesInput, Prisma.farmsUpdateWithoutSupply_categoriesInput>, Prisma.farmsUncheckedUpdateWithoutSupply_categoriesInput>;
};
export type farmsCreateNestedOneWithoutTasksInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutTasksInput, Prisma.farmsUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutTasksInput;
    connect?: Prisma.farmsWhereUniqueInput;
};
export type farmsUpdateOneWithoutTasksNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutTasksInput, Prisma.farmsUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutTasksInput;
    upsert?: Prisma.farmsUpsertWithoutTasksInput;
    disconnect?: Prisma.farmsWhereInput | boolean;
    delete?: Prisma.farmsWhereInput | boolean;
    connect?: Prisma.farmsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.farmsUpdateToOneWithWhereWithoutTasksInput, Prisma.farmsUpdateWithoutTasksInput>, Prisma.farmsUncheckedUpdateWithoutTasksInput>;
};
export type farmsCreateNestedManyWithoutTenantsInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutTenantsInput, Prisma.farmsUncheckedCreateWithoutTenantsInput> | Prisma.farmsCreateWithoutTenantsInput[] | Prisma.farmsUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutTenantsInput | Prisma.farmsCreateOrConnectWithoutTenantsInput[];
    createMany?: Prisma.farmsCreateManyTenantsInputEnvelope;
    connect?: Prisma.farmsWhereUniqueInput | Prisma.farmsWhereUniqueInput[];
};
export type farmsUncheckedCreateNestedManyWithoutTenantsInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutTenantsInput, Prisma.farmsUncheckedCreateWithoutTenantsInput> | Prisma.farmsCreateWithoutTenantsInput[] | Prisma.farmsUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutTenantsInput | Prisma.farmsCreateOrConnectWithoutTenantsInput[];
    createMany?: Prisma.farmsCreateManyTenantsInputEnvelope;
    connect?: Prisma.farmsWhereUniqueInput | Prisma.farmsWhereUniqueInput[];
};
export type farmsUpdateManyWithoutTenantsNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutTenantsInput, Prisma.farmsUncheckedCreateWithoutTenantsInput> | Prisma.farmsCreateWithoutTenantsInput[] | Prisma.farmsUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutTenantsInput | Prisma.farmsCreateOrConnectWithoutTenantsInput[];
    upsert?: Prisma.farmsUpsertWithWhereUniqueWithoutTenantsInput | Prisma.farmsUpsertWithWhereUniqueWithoutTenantsInput[];
    createMany?: Prisma.farmsCreateManyTenantsInputEnvelope;
    set?: Prisma.farmsWhereUniqueInput | Prisma.farmsWhereUniqueInput[];
    disconnect?: Prisma.farmsWhereUniqueInput | Prisma.farmsWhereUniqueInput[];
    delete?: Prisma.farmsWhereUniqueInput | Prisma.farmsWhereUniqueInput[];
    connect?: Prisma.farmsWhereUniqueInput | Prisma.farmsWhereUniqueInput[];
    update?: Prisma.farmsUpdateWithWhereUniqueWithoutTenantsInput | Prisma.farmsUpdateWithWhereUniqueWithoutTenantsInput[];
    updateMany?: Prisma.farmsUpdateManyWithWhereWithoutTenantsInput | Prisma.farmsUpdateManyWithWhereWithoutTenantsInput[];
    deleteMany?: Prisma.farmsScalarWhereInput | Prisma.farmsScalarWhereInput[];
};
export type farmsUncheckedUpdateManyWithoutTenantsNestedInput = {
    create?: Prisma.XOR<Prisma.farmsCreateWithoutTenantsInput, Prisma.farmsUncheckedCreateWithoutTenantsInput> | Prisma.farmsCreateWithoutTenantsInput[] | Prisma.farmsUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.farmsCreateOrConnectWithoutTenantsInput | Prisma.farmsCreateOrConnectWithoutTenantsInput[];
    upsert?: Prisma.farmsUpsertWithWhereUniqueWithoutTenantsInput | Prisma.farmsUpsertWithWhereUniqueWithoutTenantsInput[];
    createMany?: Prisma.farmsCreateManyTenantsInputEnvelope;
    set?: Prisma.farmsWhereUniqueInput | Prisma.farmsWhereUniqueInput[];
    disconnect?: Prisma.farmsWhereUniqueInput | Prisma.farmsWhereUniqueInput[];
    delete?: Prisma.farmsWhereUniqueInput | Prisma.farmsWhereUniqueInput[];
    connect?: Prisma.farmsWhereUniqueInput | Prisma.farmsWhereUniqueInput[];
    update?: Prisma.farmsUpdateWithWhereUniqueWithoutTenantsInput | Prisma.farmsUpdateWithWhereUniqueWithoutTenantsInput[];
    updateMany?: Prisma.farmsUpdateManyWithWhereWithoutTenantsInput | Prisma.farmsUpdateManyWithWhereWithoutTenantsInput[];
    deleteMany?: Prisma.farmsScalarWhereInput | Prisma.farmsScalarWhereInput[];
};
export type farmsCreateWithoutBlendsInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutBlendsInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutBlendsInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutBlendsInput, Prisma.farmsUncheckedCreateWithoutBlendsInput>;
};
export type farmsUpsertWithoutBlendsInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutBlendsInput, Prisma.farmsUncheckedUpdateWithoutBlendsInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutBlendsInput, Prisma.farmsUncheckedCreateWithoutBlendsInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutBlendsInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutBlendsInput, Prisma.farmsUncheckedUpdateWithoutBlendsInput>;
};
export type farmsUpdateWithoutBlendsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutBlendsInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutCustomersInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutCustomersInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutCustomersInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutCustomersInput, Prisma.farmsUncheckedCreateWithoutCustomersInput>;
};
export type farmsUpsertWithoutCustomersInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutCustomersInput, Prisma.farmsUncheckedUpdateWithoutCustomersInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutCustomersInput, Prisma.farmsUncheckedCreateWithoutCustomersInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutCustomersInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutCustomersInput, Prisma.farmsUncheckedUpdateWithoutCustomersInput>;
};
export type farmsUpdateWithoutCustomersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutCustomersInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutEmployeesInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutEmployeesInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutEmployeesInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutEmployeesInput, Prisma.farmsUncheckedCreateWithoutEmployeesInput>;
};
export type farmsUpsertWithoutEmployeesInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutEmployeesInput, Prisma.farmsUncheckedUpdateWithoutEmployeesInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutEmployeesInput, Prisma.farmsUncheckedCreateWithoutEmployeesInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutEmployeesInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutEmployeesInput, Prisma.farmsUncheckedUpdateWithoutEmployeesInput>;
};
export type farmsUpdateWithoutEmployeesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutEmployeesInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutFarm_layoutsInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutFarm_layoutsInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutFarm_layoutsInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutFarm_layoutsInput, Prisma.farmsUncheckedCreateWithoutFarm_layoutsInput>;
};
export type farmsUpsertWithoutFarm_layoutsInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutFarm_layoutsInput, Prisma.farmsUncheckedUpdateWithoutFarm_layoutsInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutFarm_layoutsInput, Prisma.farmsUncheckedCreateWithoutFarm_layoutsInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutFarm_layoutsInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutFarm_layoutsInput, Prisma.farmsUncheckedUpdateWithoutFarm_layoutsInput>;
};
export type farmsUpdateWithoutFarm_layoutsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutFarm_layoutsInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutFarm_usersInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutFarm_usersInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutFarm_usersInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutFarm_usersInput, Prisma.farmsUncheckedCreateWithoutFarm_usersInput>;
};
export type farmsUpsertWithoutFarm_usersInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutFarm_usersInput, Prisma.farmsUncheckedUpdateWithoutFarm_usersInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutFarm_usersInput, Prisma.farmsUncheckedCreateWithoutFarm_usersInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutFarm_usersInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutFarm_usersInput, Prisma.farmsUncheckedUpdateWithoutFarm_usersInput>;
};
export type farmsUpdateWithoutFarm_usersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutFarm_usersInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutMachinesInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutMachinesInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutMachinesInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutMachinesInput, Prisma.farmsUncheckedCreateWithoutMachinesInput>;
};
export type farmsUpsertWithoutMachinesInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutMachinesInput, Prisma.farmsUncheckedUpdateWithoutMachinesInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutMachinesInput, Prisma.farmsUncheckedCreateWithoutMachinesInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutMachinesInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutMachinesInput, Prisma.farmsUncheckedUpdateWithoutMachinesInput>;
};
export type farmsUpdateWithoutMachinesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutMachinesInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutOrdersInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutOrdersInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutOrdersInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutOrdersInput, Prisma.farmsUncheckedCreateWithoutOrdersInput>;
};
export type farmsUpsertWithoutOrdersInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutOrdersInput, Prisma.farmsUncheckedUpdateWithoutOrdersInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutOrdersInput, Prisma.farmsUncheckedCreateWithoutOrdersInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutOrdersInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutOrdersInput, Prisma.farmsUncheckedUpdateWithoutOrdersInput>;
};
export type farmsUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutOrdersInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutProduct_categoriesInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutProduct_categoriesInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutProduct_categoriesInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutProduct_categoriesInput, Prisma.farmsUncheckedCreateWithoutProduct_categoriesInput>;
};
export type farmsUpsertWithoutProduct_categoriesInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutProduct_categoriesInput, Prisma.farmsUncheckedUpdateWithoutProduct_categoriesInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutProduct_categoriesInput, Prisma.farmsUncheckedCreateWithoutProduct_categoriesInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutProduct_categoriesInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutProduct_categoriesInput, Prisma.farmsUncheckedUpdateWithoutProduct_categoriesInput>;
};
export type farmsUpdateWithoutProduct_categoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutProduct_categoriesInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutProductsInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutProductsInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutProductsInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutProductsInput, Prisma.farmsUncheckedCreateWithoutProductsInput>;
};
export type farmsUpsertWithoutProductsInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutProductsInput, Prisma.farmsUncheckedUpdateWithoutProductsInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutProductsInput, Prisma.farmsUncheckedCreateWithoutProductsInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutProductsInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutProductsInput, Prisma.farmsUncheckedUpdateWithoutProductsInput>;
};
export type farmsUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutProductsInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutRack_assignmentsInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutRack_assignmentsInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutRack_assignmentsInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutRack_assignmentsInput, Prisma.farmsUncheckedCreateWithoutRack_assignmentsInput>;
};
export type farmsUpsertWithoutRack_assignmentsInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutRack_assignmentsInput, Prisma.farmsUncheckedUpdateWithoutRack_assignmentsInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutRack_assignmentsInput, Prisma.farmsUncheckedCreateWithoutRack_assignmentsInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutRack_assignmentsInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutRack_assignmentsInput, Prisma.farmsUncheckedUpdateWithoutRack_assignmentsInput>;
};
export type farmsUpdateWithoutRack_assignmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutRack_assignmentsInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutRecurring_order_schedulesInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutRecurring_order_schedulesInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutRecurring_order_schedulesInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutRecurring_order_schedulesInput, Prisma.farmsUncheckedCreateWithoutRecurring_order_schedulesInput>;
};
export type farmsUpsertWithoutRecurring_order_schedulesInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutRecurring_order_schedulesInput, Prisma.farmsUncheckedUpdateWithoutRecurring_order_schedulesInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutRecurring_order_schedulesInput, Prisma.farmsUncheckedCreateWithoutRecurring_order_schedulesInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutRecurring_order_schedulesInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutRecurring_order_schedulesInput, Prisma.farmsUncheckedUpdateWithoutRecurring_order_schedulesInput>;
};
export type farmsUpdateWithoutRecurring_order_schedulesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutRecurring_order_schedulesInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutSuppliesInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutSuppliesInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutSuppliesInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutSuppliesInput, Prisma.farmsUncheckedCreateWithoutSuppliesInput>;
};
export type farmsUpsertWithoutSuppliesInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutSuppliesInput, Prisma.farmsUncheckedUpdateWithoutSuppliesInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutSuppliesInput, Prisma.farmsUncheckedCreateWithoutSuppliesInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutSuppliesInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutSuppliesInput, Prisma.farmsUncheckedUpdateWithoutSuppliesInput>;
};
export type farmsUpdateWithoutSuppliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutSuppliesInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutSupply_categoriesInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutSupply_categoriesInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutSupply_categoriesInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutSupply_categoriesInput, Prisma.farmsUncheckedCreateWithoutSupply_categoriesInput>;
};
export type farmsUpsertWithoutSupply_categoriesInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutSupply_categoriesInput, Prisma.farmsUncheckedUpdateWithoutSupply_categoriesInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutSupply_categoriesInput, Prisma.farmsUncheckedCreateWithoutSupply_categoriesInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutSupply_categoriesInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutSupply_categoriesInput, Prisma.farmsUncheckedUpdateWithoutSupply_categoriesInput>;
};
export type farmsUpdateWithoutSupply_categoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutSupply_categoriesInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutTasksInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutTasksInput = {
    tenant_id?: string | null;
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutTasksInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutTasksInput, Prisma.farmsUncheckedCreateWithoutTasksInput>;
};
export type farmsUpsertWithoutTasksInput = {
    update: Prisma.XOR<Prisma.farmsUpdateWithoutTasksInput, Prisma.farmsUncheckedUpdateWithoutTasksInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutTasksInput, Prisma.farmsUncheckedCreateWithoutTasksInput>;
    where?: Prisma.farmsWhereInput;
};
export type farmsUpdateToOneWithWhereWithoutTasksInput = {
    where?: Prisma.farmsWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutTasksInput, Prisma.farmsUncheckedUpdateWithoutTasksInput>;
};
export type farmsUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutTasksInput = {
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsCreateWithoutTenantsInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutFarmsInput;
};
export type farmsUncheckedCreateWithoutTenantsInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    blends?: Prisma.blendsUncheckedCreateNestedManyWithoutFarmsInput;
    customers?: Prisma.customersUncheckedCreateNestedManyWithoutFarmsInput;
    employees?: Prisma.employeesUncheckedCreateNestedManyWithoutFarmsInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput;
    farm_users?: Prisma.farm_usersUncheckedCreateNestedManyWithoutFarmsInput;
    machines?: Prisma.machinesUncheckedCreateNestedManyWithoutFarmsInput;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutFarmsInput;
    product_categories?: Prisma.product_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    products?: Prisma.productsUncheckedCreateNestedManyWithoutFarmsInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutFarmsInput;
    supply_categories?: Prisma.supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutFarmsInput;
};
export type farmsCreateOrConnectWithoutTenantsInput = {
    where: Prisma.farmsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farmsCreateWithoutTenantsInput, Prisma.farmsUncheckedCreateWithoutTenantsInput>;
};
export type farmsCreateManyTenantsInputEnvelope = {
    data: Prisma.farmsCreateManyTenantsInput | Prisma.farmsCreateManyTenantsInput[];
    skipDuplicates?: boolean;
};
export type farmsUpsertWithWhereUniqueWithoutTenantsInput = {
    where: Prisma.farmsWhereUniqueInput;
    update: Prisma.XOR<Prisma.farmsUpdateWithoutTenantsInput, Prisma.farmsUncheckedUpdateWithoutTenantsInput>;
    create: Prisma.XOR<Prisma.farmsCreateWithoutTenantsInput, Prisma.farmsUncheckedCreateWithoutTenantsInput>;
};
export type farmsUpdateWithWhereUniqueWithoutTenantsInput = {
    where: Prisma.farmsWhereUniqueInput;
    data: Prisma.XOR<Prisma.farmsUpdateWithoutTenantsInput, Prisma.farmsUncheckedUpdateWithoutTenantsInput>;
};
export type farmsUpdateManyWithWhereWithoutTenantsInput = {
    where: Prisma.farmsScalarWhereInput;
    data: Prisma.XOR<Prisma.farmsUpdateManyMutationInput, Prisma.farmsUncheckedUpdateManyWithoutTenantsInput>;
};
export type farmsScalarWhereInput = {
    AND?: Prisma.farmsScalarWhereInput | Prisma.farmsScalarWhereInput[];
    OR?: Prisma.farmsScalarWhereInput[];
    NOT?: Prisma.farmsScalarWhereInput | Prisma.farmsScalarWhereInput[];
    tenant_id?: Prisma.UuidNullableFilter<"farms"> | string | null;
    id?: Prisma.UuidFilter<"farms"> | string;
    name?: Prisma.StringFilter<"farms"> | string;
    slug?: Prisma.StringFilter<"farms"> | string;
    logo_url?: Prisma.StringNullableFilter<"farms"> | string | null;
    brand_color?: Prisma.StringNullableFilter<"farms"> | string | null;
    contact_email?: Prisma.StringNullableFilter<"farms"> | string | null;
    contact_phone?: Prisma.StringNullableFilter<"farms"> | string | null;
    address?: Prisma.JsonNullableFilter<"farms">;
    settings?: Prisma.JsonNullableFilter<"farms">;
    created_at?: Prisma.DateTimeNullableFilter<"farms"> | Date | string | null;
    updated_at?: Prisma.DateTimeNullableFilter<"farms"> | Date | string | null;
};
export type farmsCreateManyTenantsInput = {
    id?: string;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_color?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};
export type farmsUpdateWithoutTenantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateWithoutTenantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUncheckedUpdateManyWithoutFarmsNestedInput;
    customers?: Prisma.customersUncheckedUpdateManyWithoutFarmsNestedInput;
    employees?: Prisma.employeesUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_layouts?: Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput;
    farm_users?: Prisma.farm_usersUncheckedUpdateManyWithoutFarmsNestedInput;
    machines?: Prisma.machinesUncheckedUpdateManyWithoutFarmsNestedInput;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutFarmsNestedInput;
    product_categories?: Prisma.product_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    products?: Prisma.productsUncheckedUpdateManyWithoutFarmsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutFarmsNestedInput;
    supply_categories?: Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutFarmsNestedInput;
};
export type farmsUncheckedUpdateManyWithoutTenantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    logo_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    brand_color?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contact_phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    settings?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updated_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type FarmsCountOutputType
 */
export type FarmsCountOutputType = {
    blends: number;
    customers: number;
    employees: number;
    farm_layouts: number;
    farm_users: number;
    machines: number;
    orders: number;
    product_categories: number;
    products: number;
    rack_assignments: number;
    recurring_order_schedules: number;
    supplies: number;
    supply_categories: number;
    tasks: number;
};
export type FarmsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blends?: boolean | FarmsCountOutputTypeCountBlendsArgs;
    customers?: boolean | FarmsCountOutputTypeCountCustomersArgs;
    employees?: boolean | FarmsCountOutputTypeCountEmployeesArgs;
    farm_layouts?: boolean | FarmsCountOutputTypeCountFarm_layoutsArgs;
    farm_users?: boolean | FarmsCountOutputTypeCountFarm_usersArgs;
    machines?: boolean | FarmsCountOutputTypeCountMachinesArgs;
    orders?: boolean | FarmsCountOutputTypeCountOrdersArgs;
    product_categories?: boolean | FarmsCountOutputTypeCountProduct_categoriesArgs;
    products?: boolean | FarmsCountOutputTypeCountProductsArgs;
    rack_assignments?: boolean | FarmsCountOutputTypeCountRack_assignmentsArgs;
    recurring_order_schedules?: boolean | FarmsCountOutputTypeCountRecurring_order_schedulesArgs;
    supplies?: boolean | FarmsCountOutputTypeCountSuppliesArgs;
    supply_categories?: boolean | FarmsCountOutputTypeCountSupply_categoriesArgs;
    tasks?: boolean | FarmsCountOutputTypeCountTasksArgs;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FarmsCountOutputType
     */
    select?: Prisma.FarmsCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountBlendsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.blendsWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountCustomersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.customersWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountEmployeesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.employeesWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountFarm_layoutsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.farm_layoutsWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountFarm_usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.farm_usersWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountMachinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.machinesWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ordersWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountProduct_categoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.product_categoriesWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountProductsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.productsWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountRack_assignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.rack_assignmentsWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountRecurring_order_schedulesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.recurring_order_schedulesWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountSuppliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.suppliesWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountSupply_categoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.supply_categoriesWhereInput;
};
/**
 * FarmsCountOutputType without action
 */
export type FarmsCountOutputTypeCountTasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.tasksWhereInput;
};
export type farmsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    tenant_id?: boolean;
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    logo_url?: boolean;
    brand_color?: boolean;
    contact_email?: boolean;
    contact_phone?: boolean;
    address?: boolean;
    settings?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    blends?: boolean | Prisma.farms$blendsArgs<ExtArgs>;
    customers?: boolean | Prisma.farms$customersArgs<ExtArgs>;
    employees?: boolean | Prisma.farms$employeesArgs<ExtArgs>;
    farm_layouts?: boolean | Prisma.farms$farm_layoutsArgs<ExtArgs>;
    farm_users?: boolean | Prisma.farms$farm_usersArgs<ExtArgs>;
    tenants?: boolean | Prisma.farms$tenantsArgs<ExtArgs>;
    machines?: boolean | Prisma.farms$machinesArgs<ExtArgs>;
    orders?: boolean | Prisma.farms$ordersArgs<ExtArgs>;
    product_categories?: boolean | Prisma.farms$product_categoriesArgs<ExtArgs>;
    products?: boolean | Prisma.farms$productsArgs<ExtArgs>;
    rack_assignments?: boolean | Prisma.farms$rack_assignmentsArgs<ExtArgs>;
    recurring_order_schedules?: boolean | Prisma.farms$recurring_order_schedulesArgs<ExtArgs>;
    supplies?: boolean | Prisma.farms$suppliesArgs<ExtArgs>;
    supply_categories?: boolean | Prisma.farms$supply_categoriesArgs<ExtArgs>;
    tasks?: boolean | Prisma.farms$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.FarmsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["farms"]>;
export type farmsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    tenant_id?: boolean;
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    logo_url?: boolean;
    brand_color?: boolean;
    contact_email?: boolean;
    contact_phone?: boolean;
    address?: boolean;
    settings?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    tenants?: boolean | Prisma.farms$tenantsArgs<ExtArgs>;
}, ExtArgs["result"]["farms"]>;
export type farmsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    tenant_id?: boolean;
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    logo_url?: boolean;
    brand_color?: boolean;
    contact_email?: boolean;
    contact_phone?: boolean;
    address?: boolean;
    settings?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    tenants?: boolean | Prisma.farms$tenantsArgs<ExtArgs>;
}, ExtArgs["result"]["farms"]>;
export type farmsSelectScalar = {
    tenant_id?: boolean;
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    logo_url?: boolean;
    brand_color?: boolean;
    contact_email?: boolean;
    contact_phone?: boolean;
    address?: boolean;
    settings?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type farmsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"tenant_id" | "id" | "name" | "slug" | "logo_url" | "brand_color" | "contact_email" | "contact_phone" | "address" | "settings" | "created_at" | "updated_at", ExtArgs["result"]["farms"]>;
export type farmsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blends?: boolean | Prisma.farms$blendsArgs<ExtArgs>;
    customers?: boolean | Prisma.farms$customersArgs<ExtArgs>;
    employees?: boolean | Prisma.farms$employeesArgs<ExtArgs>;
    farm_layouts?: boolean | Prisma.farms$farm_layoutsArgs<ExtArgs>;
    farm_users?: boolean | Prisma.farms$farm_usersArgs<ExtArgs>;
    tenants?: boolean | Prisma.farms$tenantsArgs<ExtArgs>;
    machines?: boolean | Prisma.farms$machinesArgs<ExtArgs>;
    orders?: boolean | Prisma.farms$ordersArgs<ExtArgs>;
    product_categories?: boolean | Prisma.farms$product_categoriesArgs<ExtArgs>;
    products?: boolean | Prisma.farms$productsArgs<ExtArgs>;
    rack_assignments?: boolean | Prisma.farms$rack_assignmentsArgs<ExtArgs>;
    recurring_order_schedules?: boolean | Prisma.farms$recurring_order_schedulesArgs<ExtArgs>;
    supplies?: boolean | Prisma.farms$suppliesArgs<ExtArgs>;
    supply_categories?: boolean | Prisma.farms$supply_categoriesArgs<ExtArgs>;
    tasks?: boolean | Prisma.farms$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.FarmsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type farmsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenants?: boolean | Prisma.farms$tenantsArgs<ExtArgs>;
};
export type farmsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tenants?: boolean | Prisma.farms$tenantsArgs<ExtArgs>;
};
export type $farmsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "farms";
    objects: {
        blends: Prisma.$blendsPayload<ExtArgs>[];
        customers: Prisma.$customersPayload<ExtArgs>[];
        employees: Prisma.$employeesPayload<ExtArgs>[];
        farm_layouts: Prisma.$farm_layoutsPayload<ExtArgs>[];
        farm_users: Prisma.$farm_usersPayload<ExtArgs>[];
        tenants: Prisma.$tenantsPayload<ExtArgs> | null;
        machines: Prisma.$machinesPayload<ExtArgs>[];
        orders: Prisma.$ordersPayload<ExtArgs>[];
        product_categories: Prisma.$product_categoriesPayload<ExtArgs>[];
        products: Prisma.$productsPayload<ExtArgs>[];
        rack_assignments: Prisma.$rack_assignmentsPayload<ExtArgs>[];
        recurring_order_schedules: Prisma.$recurring_order_schedulesPayload<ExtArgs>[];
        supplies: Prisma.$suppliesPayload<ExtArgs>[];
        supply_categories: Prisma.$supply_categoriesPayload<ExtArgs>[];
        tasks: Prisma.$tasksPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        tenant_id: string | null;
        id: string;
        name: string;
        slug: string;
        logo_url: string | null;
        brand_color: string | null;
        contact_email: string | null;
        contact_phone: string | null;
        address: runtime.JsonValue | null;
        settings: runtime.JsonValue | null;
        created_at: Date | null;
        updated_at: Date | null;
    }, ExtArgs["result"]["farms"]>;
    composites: {};
};
export type farmsGetPayload<S extends boolean | null | undefined | farmsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$farmsPayload, S>;
export type farmsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<farmsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FarmsCountAggregateInputType | true;
};
export interface farmsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['farms'];
        meta: {
            name: 'farms';
        };
    };
    /**
     * Find zero or one Farms that matches the filter.
     * @param {farmsFindUniqueArgs} args - Arguments to find a Farms
     * @example
     * // Get one Farms
     * const farms = await prisma.farms.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends farmsFindUniqueArgs>(args: Prisma.SelectSubset<T, farmsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Farms that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {farmsFindUniqueOrThrowArgs} args - Arguments to find a Farms
     * @example
     * // Get one Farms
     * const farms = await prisma.farms.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends farmsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, farmsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Farms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farmsFindFirstArgs} args - Arguments to find a Farms
     * @example
     * // Get one Farms
     * const farms = await prisma.farms.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends farmsFindFirstArgs>(args?: Prisma.SelectSubset<T, farmsFindFirstArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Farms that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farmsFindFirstOrThrowArgs} args - Arguments to find a Farms
     * @example
     * // Get one Farms
     * const farms = await prisma.farms.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends farmsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, farmsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Farms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farmsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Farms
     * const farms = await prisma.farms.findMany()
     *
     * // Get first 10 Farms
     * const farms = await prisma.farms.findMany({ take: 10 })
     *
     * // Only select the `tenant_id`
     * const farmsWithTenant_idOnly = await prisma.farms.findMany({ select: { tenant_id: true } })
     *
     */
    findMany<T extends farmsFindManyArgs>(args?: Prisma.SelectSubset<T, farmsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Farms.
     * @param {farmsCreateArgs} args - Arguments to create a Farms.
     * @example
     * // Create one Farms
     * const Farms = await prisma.farms.create({
     *   data: {
     *     // ... data to create a Farms
     *   }
     * })
     *
     */
    create<T extends farmsCreateArgs>(args: Prisma.SelectSubset<T, farmsCreateArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Farms.
     * @param {farmsCreateManyArgs} args - Arguments to create many Farms.
     * @example
     * // Create many Farms
     * const farms = await prisma.farms.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends farmsCreateManyArgs>(args?: Prisma.SelectSubset<T, farmsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Farms and returns the data saved in the database.
     * @param {farmsCreateManyAndReturnArgs} args - Arguments to create many Farms.
     * @example
     * // Create many Farms
     * const farms = await prisma.farms.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Farms and only return the `tenant_id`
     * const farmsWithTenant_idOnly = await prisma.farms.createManyAndReturn({
     *   select: { tenant_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends farmsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, farmsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Farms.
     * @param {farmsDeleteArgs} args - Arguments to delete one Farms.
     * @example
     * // Delete one Farms
     * const Farms = await prisma.farms.delete({
     *   where: {
     *     // ... filter to delete one Farms
     *   }
     * })
     *
     */
    delete<T extends farmsDeleteArgs>(args: Prisma.SelectSubset<T, farmsDeleteArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Farms.
     * @param {farmsUpdateArgs} args - Arguments to update one Farms.
     * @example
     * // Update one Farms
     * const farms = await prisma.farms.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends farmsUpdateArgs>(args: Prisma.SelectSubset<T, farmsUpdateArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Farms.
     * @param {farmsDeleteManyArgs} args - Arguments to filter Farms to delete.
     * @example
     * // Delete a few Farms
     * const { count } = await prisma.farms.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends farmsDeleteManyArgs>(args?: Prisma.SelectSubset<T, farmsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Farms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farmsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Farms
     * const farms = await prisma.farms.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends farmsUpdateManyArgs>(args: Prisma.SelectSubset<T, farmsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Farms and returns the data updated in the database.
     * @param {farmsUpdateManyAndReturnArgs} args - Arguments to update many Farms.
     * @example
     * // Update many Farms
     * const farms = await prisma.farms.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Farms and only return the `tenant_id`
     * const farmsWithTenant_idOnly = await prisma.farms.updateManyAndReturn({
     *   select: { tenant_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends farmsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, farmsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Farms.
     * @param {farmsUpsertArgs} args - Arguments to update or create a Farms.
     * @example
     * // Update or create a Farms
     * const farms = await prisma.farms.upsert({
     *   create: {
     *     // ... data to create a Farms
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Farms we want to update
     *   }
     * })
     */
    upsert<T extends farmsUpsertArgs>(args: Prisma.SelectSubset<T, farmsUpsertArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Farms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farmsCountArgs} args - Arguments to filter Farms to count.
     * @example
     * // Count the number of Farms
     * const count = await prisma.farms.count({
     *   where: {
     *     // ... the filter for the Farms we want to count
     *   }
     * })
    **/
    count<T extends farmsCountArgs>(args?: Prisma.Subset<T, farmsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FarmsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Farms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FarmsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FarmsAggregateArgs>(args: Prisma.Subset<T, FarmsAggregateArgs>): Prisma.PrismaPromise<GetFarmsAggregateType<T>>;
    /**
     * Group by Farms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farmsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends farmsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: farmsGroupByArgs['orderBy'];
    } : {
        orderBy?: farmsGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, farmsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFarmsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the farms model
     */
    readonly fields: farmsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for farms.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__farmsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    blends<T extends Prisma.farms$blendsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$blendsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    customers<T extends Prisma.farms$customersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$customersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    employees<T extends Prisma.farms$employeesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$employeesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    farm_layouts<T extends Prisma.farms$farm_layoutsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$farm_layoutsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    farm_users<T extends Prisma.farms$farm_usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$farm_usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    tenants<T extends Prisma.farms$tenantsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$tenantsArgs<ExtArgs>>): Prisma.Prisma__tenantsClient<runtime.Types.Result.GetResult<Prisma.$tenantsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    machines<T extends Prisma.farms$machinesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$machinesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    orders<T extends Prisma.farms$ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ordersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    product_categories<T extends Prisma.farms$product_categoriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$product_categoriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$product_categoriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    products<T extends Prisma.farms$productsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$productsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    rack_assignments<T extends Prisma.farms$rack_assignmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$rack_assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    recurring_order_schedules<T extends Prisma.farms$recurring_order_schedulesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$recurring_order_schedulesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    supplies<T extends Prisma.farms$suppliesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$suppliesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    supply_categories<T extends Prisma.farms$supply_categoriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$supply_categoriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    tasks<T extends Prisma.farms$tasksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farms$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the farms model
 */
export interface farmsFieldRefs {
    readonly tenant_id: Prisma.FieldRef<"farms", 'String'>;
    readonly id: Prisma.FieldRef<"farms", 'String'>;
    readonly name: Prisma.FieldRef<"farms", 'String'>;
    readonly slug: Prisma.FieldRef<"farms", 'String'>;
    readonly logo_url: Prisma.FieldRef<"farms", 'String'>;
    readonly brand_color: Prisma.FieldRef<"farms", 'String'>;
    readonly contact_email: Prisma.FieldRef<"farms", 'String'>;
    readonly contact_phone: Prisma.FieldRef<"farms", 'String'>;
    readonly address: Prisma.FieldRef<"farms", 'Json'>;
    readonly settings: Prisma.FieldRef<"farms", 'Json'>;
    readonly created_at: Prisma.FieldRef<"farms", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"farms", 'DateTime'>;
}
/**
 * farms findUnique
 */
export type farmsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsInclude<ExtArgs> | null;
    /**
     * Filter, which farms to fetch.
     */
    where: Prisma.farmsWhereUniqueInput;
};
/**
 * farms findUniqueOrThrow
 */
export type farmsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsInclude<ExtArgs> | null;
    /**
     * Filter, which farms to fetch.
     */
    where: Prisma.farmsWhereUniqueInput;
};
/**
 * farms findFirst
 */
export type farmsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsInclude<ExtArgs> | null;
    /**
     * Filter, which farms to fetch.
     */
    where?: Prisma.farmsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farms to fetch.
     */
    orderBy?: Prisma.farmsOrderByWithRelationInput | Prisma.farmsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for farms.
     */
    cursor?: Prisma.farmsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farms from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farms.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of farms.
     */
    distinct?: Prisma.FarmsScalarFieldEnum | Prisma.FarmsScalarFieldEnum[];
};
/**
 * farms findFirstOrThrow
 */
export type farmsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsInclude<ExtArgs> | null;
    /**
     * Filter, which farms to fetch.
     */
    where?: Prisma.farmsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farms to fetch.
     */
    orderBy?: Prisma.farmsOrderByWithRelationInput | Prisma.farmsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for farms.
     */
    cursor?: Prisma.farmsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farms from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farms.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of farms.
     */
    distinct?: Prisma.FarmsScalarFieldEnum | Prisma.FarmsScalarFieldEnum[];
};
/**
 * farms findMany
 */
export type farmsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsInclude<ExtArgs> | null;
    /**
     * Filter, which farms to fetch.
     */
    where?: Prisma.farmsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farms to fetch.
     */
    orderBy?: Prisma.farmsOrderByWithRelationInput | Prisma.farmsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing farms.
     */
    cursor?: Prisma.farmsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farms from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farms.
     */
    skip?: number;
    distinct?: Prisma.FarmsScalarFieldEnum | Prisma.FarmsScalarFieldEnum[];
};
/**
 * farms create
 */
export type farmsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsInclude<ExtArgs> | null;
    /**
     * The data needed to create a farms.
     */
    data: Prisma.XOR<Prisma.farmsCreateInput, Prisma.farmsUncheckedCreateInput>;
};
/**
 * farms createMany
 */
export type farmsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many farms.
     */
    data: Prisma.farmsCreateManyInput | Prisma.farmsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * farms createManyAndReturn
 */
export type farmsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * The data used to create many farms.
     */
    data: Prisma.farmsCreateManyInput | Prisma.farmsCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * farms update
 */
export type farmsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsInclude<ExtArgs> | null;
    /**
     * The data needed to update a farms.
     */
    data: Prisma.XOR<Prisma.farmsUpdateInput, Prisma.farmsUncheckedUpdateInput>;
    /**
     * Choose, which farms to update.
     */
    where: Prisma.farmsWhereUniqueInput;
};
/**
 * farms updateMany
 */
export type farmsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update farms.
     */
    data: Prisma.XOR<Prisma.farmsUpdateManyMutationInput, Prisma.farmsUncheckedUpdateManyInput>;
    /**
     * Filter which farms to update
     */
    where?: Prisma.farmsWhereInput;
    /**
     * Limit how many farms to update.
     */
    limit?: number;
};
/**
 * farms updateManyAndReturn
 */
export type farmsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * The data used to update farms.
     */
    data: Prisma.XOR<Prisma.farmsUpdateManyMutationInput, Prisma.farmsUncheckedUpdateManyInput>;
    /**
     * Filter which farms to update
     */
    where?: Prisma.farmsWhereInput;
    /**
     * Limit how many farms to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * farms upsert
 */
export type farmsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsInclude<ExtArgs> | null;
    /**
     * The filter to search for the farms to update in case it exists.
     */
    where: Prisma.farmsWhereUniqueInput;
    /**
     * In case the farms found by the `where` argument doesn't exist, create a new farms with this data.
     */
    create: Prisma.XOR<Prisma.farmsCreateInput, Prisma.farmsUncheckedCreateInput>;
    /**
     * In case the farms was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.farmsUpdateInput, Prisma.farmsUncheckedUpdateInput>;
};
/**
 * farms delete
 */
export type farmsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsInclude<ExtArgs> | null;
    /**
     * Filter which farms to delete.
     */
    where: Prisma.farmsWhereUniqueInput;
};
/**
 * farms deleteMany
 */
export type farmsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which farms to delete
     */
    where?: Prisma.farmsWhereInput;
    /**
     * Limit how many farms to delete.
     */
    limit?: number;
};
/**
 * farms.blends
 */
export type farms$blendsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blends
     */
    select?: Prisma.blendsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the blends
     */
    omit?: Prisma.blendsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.blendsInclude<ExtArgs> | null;
    where?: Prisma.blendsWhereInput;
    orderBy?: Prisma.blendsOrderByWithRelationInput | Prisma.blendsOrderByWithRelationInput[];
    cursor?: Prisma.blendsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BlendsScalarFieldEnum | Prisma.BlendsScalarFieldEnum[];
};
/**
 * farms.customers
 */
export type farms$customersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: Prisma.customersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the customers
     */
    omit?: Prisma.customersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.customersInclude<ExtArgs> | null;
    where?: Prisma.customersWhereInput;
    orderBy?: Prisma.customersOrderByWithRelationInput | Prisma.customersOrderByWithRelationInput[];
    cursor?: Prisma.customersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomersScalarFieldEnum | Prisma.CustomersScalarFieldEnum[];
};
/**
 * farms.employees
 */
export type farms$employeesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesInclude<ExtArgs> | null;
    where?: Prisma.employeesWhereInput;
    orderBy?: Prisma.employeesOrderByWithRelationInput | Prisma.employeesOrderByWithRelationInput[];
    cursor?: Prisma.employeesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmployeesScalarFieldEnum | Prisma.EmployeesScalarFieldEnum[];
};
/**
 * farms.farm_layouts
 */
export type farms$farm_layoutsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsInclude<ExtArgs> | null;
    where?: Prisma.farm_layoutsWhereInput;
    orderBy?: Prisma.farm_layoutsOrderByWithRelationInput | Prisma.farm_layoutsOrderByWithRelationInput[];
    cursor?: Prisma.farm_layoutsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Farm_layoutsScalarFieldEnum | Prisma.Farm_layoutsScalarFieldEnum[];
};
/**
 * farms.farm_users
 */
export type farms$farm_usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_users
     */
    select?: Prisma.farm_usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_users
     */
    omit?: Prisma.farm_usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_usersInclude<ExtArgs> | null;
    where?: Prisma.farm_usersWhereInput;
    orderBy?: Prisma.farm_usersOrderByWithRelationInput | Prisma.farm_usersOrderByWithRelationInput[];
    cursor?: Prisma.farm_usersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Farm_usersScalarFieldEnum | Prisma.Farm_usersScalarFieldEnum[];
};
/**
 * farms.tenants
 */
export type farms$tenantsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tenants
     */
    select?: Prisma.tenantsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the tenants
     */
    omit?: Prisma.tenantsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.tenantsInclude<ExtArgs> | null;
    where?: Prisma.tenantsWhereInput;
};
/**
 * farms.machines
 */
export type farms$machinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the machines
     */
    select?: Prisma.machinesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the machines
     */
    omit?: Prisma.machinesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.machinesInclude<ExtArgs> | null;
    where?: Prisma.machinesWhereInput;
    orderBy?: Prisma.machinesOrderByWithRelationInput | Prisma.machinesOrderByWithRelationInput[];
    cursor?: Prisma.machinesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MachinesScalarFieldEnum | Prisma.MachinesScalarFieldEnum[];
};
/**
 * farms.orders
 */
export type farms$ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the orders
     */
    select?: Prisma.ordersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the orders
     */
    omit?: Prisma.ordersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ordersInclude<ExtArgs> | null;
    where?: Prisma.ordersWhereInput;
    orderBy?: Prisma.ordersOrderByWithRelationInput | Prisma.ordersOrderByWithRelationInput[];
    cursor?: Prisma.ordersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrdersScalarFieldEnum | Prisma.OrdersScalarFieldEnum[];
};
/**
 * farms.product_categories
 */
export type farms$product_categoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the product_categories
     */
    select?: Prisma.product_categoriesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the product_categories
     */
    omit?: Prisma.product_categoriesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.product_categoriesInclude<ExtArgs> | null;
    where?: Prisma.product_categoriesWhereInput;
    orderBy?: Prisma.product_categoriesOrderByWithRelationInput | Prisma.product_categoriesOrderByWithRelationInput[];
    cursor?: Prisma.product_categoriesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Product_categoriesScalarFieldEnum | Prisma.Product_categoriesScalarFieldEnum[];
};
/**
 * farms.products
 */
export type farms$productsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: Prisma.productsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the products
     */
    omit?: Prisma.productsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.productsInclude<ExtArgs> | null;
    where?: Prisma.productsWhereInput;
    orderBy?: Prisma.productsOrderByWithRelationInput | Prisma.productsOrderByWithRelationInput[];
    cursor?: Prisma.productsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductsScalarFieldEnum | Prisma.ProductsScalarFieldEnum[];
};
/**
 * farms.rack_assignments
 */
export type farms$rack_assignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the rack_assignments
     */
    select?: Prisma.rack_assignmentsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the rack_assignments
     */
    omit?: Prisma.rack_assignmentsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.rack_assignmentsInclude<ExtArgs> | null;
    where?: Prisma.rack_assignmentsWhereInput;
    orderBy?: Prisma.rack_assignmentsOrderByWithRelationInput | Prisma.rack_assignmentsOrderByWithRelationInput[];
    cursor?: Prisma.rack_assignmentsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Rack_assignmentsScalarFieldEnum | Prisma.Rack_assignmentsScalarFieldEnum[];
};
/**
 * farms.recurring_order_schedules
 */
export type farms$recurring_order_schedulesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesInclude<ExtArgs> | null;
    where?: Prisma.recurring_order_schedulesWhereInput;
    orderBy?: Prisma.recurring_order_schedulesOrderByWithRelationInput | Prisma.recurring_order_schedulesOrderByWithRelationInput[];
    cursor?: Prisma.recurring_order_schedulesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Recurring_order_schedulesScalarFieldEnum | Prisma.Recurring_order_schedulesScalarFieldEnum[];
};
/**
 * farms.supplies
 */
export type farms$suppliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supplies
     */
    select?: Prisma.suppliesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supplies
     */
    omit?: Prisma.suppliesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.suppliesInclude<ExtArgs> | null;
    where?: Prisma.suppliesWhereInput;
    orderBy?: Prisma.suppliesOrderByWithRelationInput | Prisma.suppliesOrderByWithRelationInput[];
    cursor?: Prisma.suppliesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SuppliesScalarFieldEnum | Prisma.SuppliesScalarFieldEnum[];
};
/**
 * farms.supply_categories
 */
export type farms$supply_categoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_categories
     */
    select?: Prisma.supply_categoriesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_categories
     */
    omit?: Prisma.supply_categoriesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_categoriesInclude<ExtArgs> | null;
    where?: Prisma.supply_categoriesWhereInput;
    orderBy?: Prisma.supply_categoriesOrderByWithRelationInput | Prisma.supply_categoriesOrderByWithRelationInput[];
    cursor?: Prisma.supply_categoriesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Supply_categoriesScalarFieldEnum | Prisma.Supply_categoriesScalarFieldEnum[];
};
/**
 * farms.tasks
 */
export type farms$tasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: Prisma.tasksSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the tasks
     */
    omit?: Prisma.tasksOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.tasksInclude<ExtArgs> | null;
    where?: Prisma.tasksWhereInput;
    orderBy?: Prisma.tasksOrderByWithRelationInput | Prisma.tasksOrderByWithRelationInput[];
    cursor?: Prisma.tasksWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TasksScalarFieldEnum | Prisma.TasksScalarFieldEnum[];
};
/**
 * farms without action
 */
export type farmsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farms
     */
    select?: Prisma.farmsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farms
     */
    omit?: Prisma.farmsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farmsInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=farms.d.ts.map