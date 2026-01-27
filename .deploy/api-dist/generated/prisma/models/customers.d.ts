import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model customers
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type customersModel = runtime.Types.Result.DefaultSelection<Prisma.$customersPayload>;
export type AggregateCustomers = {
    _count: CustomersCountAggregateOutputType | null;
    _min: CustomersMinAggregateOutputType | null;
    _max: CustomersMaxAggregateOutputType | null;
};
export type CustomersMinAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    company_name: string | null;
    customer_type: string | null;
    payment_terms: string | null;
    notes: string | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type CustomersMaxAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    company_name: string | null;
    customer_type: string | null;
    payment_terms: string | null;
    notes: string | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type CustomersCountAggregateOutputType = {
    id: number;
    farm_id: number;
    name: number;
    email: number;
    phone: number;
    company_name: number;
    customer_type: number;
    payment_terms: number;
    address: number;
    tags: number;
    notes: number;
    is_active: number;
    created_at: number;
    _all: number;
};
export type CustomersMinAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    email?: true;
    phone?: true;
    company_name?: true;
    customer_type?: true;
    payment_terms?: true;
    notes?: true;
    is_active?: true;
    created_at?: true;
};
export type CustomersMaxAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    email?: true;
    phone?: true;
    company_name?: true;
    customer_type?: true;
    payment_terms?: true;
    notes?: true;
    is_active?: true;
    created_at?: true;
};
export type CustomersCountAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    email?: true;
    phone?: true;
    company_name?: true;
    customer_type?: true;
    payment_terms?: true;
    address?: true;
    tags?: true;
    notes?: true;
    is_active?: true;
    created_at?: true;
    _all?: true;
};
export type CustomersAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which customers to aggregate.
     */
    where?: Prisma.customersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of customers to fetch.
     */
    orderBy?: Prisma.customersOrderByWithRelationInput | Prisma.customersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.customersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` customers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` customers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned customers
    **/
    _count?: true | CustomersCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: CustomersMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: CustomersMaxAggregateInputType;
};
export type GetCustomersAggregateType<T extends CustomersAggregateArgs> = {
    [P in keyof T & keyof AggregateCustomers]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCustomers[P]> : Prisma.GetScalarType<T[P], AggregateCustomers[P]>;
};
export type customersGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.customersWhereInput;
    orderBy?: Prisma.customersOrderByWithAggregationInput | Prisma.customersOrderByWithAggregationInput[];
    by: Prisma.CustomersScalarFieldEnum[] | Prisma.CustomersScalarFieldEnum;
    having?: Prisma.customersScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CustomersCountAggregateInputType | true;
    _min?: CustomersMinAggregateInputType;
    _max?: CustomersMaxAggregateInputType;
};
export type CustomersGroupByOutputType = {
    id: string;
    farm_id: string | null;
    name: string;
    email: string | null;
    phone: string | null;
    company_name: string | null;
    customer_type: string | null;
    payment_terms: string | null;
    address: runtime.JsonValue | null;
    tags: string[];
    notes: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    _count: CustomersCountAggregateOutputType | null;
    _min: CustomersMinAggregateOutputType | null;
    _max: CustomersMaxAggregateOutputType | null;
};
type GetCustomersGroupByPayload<T extends customersGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CustomersGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CustomersGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CustomersGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CustomersGroupByOutputType[P]>;
}>>;
export type customersWhereInput = {
    AND?: Prisma.customersWhereInput | Prisma.customersWhereInput[];
    OR?: Prisma.customersWhereInput[];
    NOT?: Prisma.customersWhereInput | Prisma.customersWhereInput[];
    id?: Prisma.UuidFilter<"customers"> | string;
    farm_id?: Prisma.UuidNullableFilter<"customers"> | string | null;
    name?: Prisma.StringFilter<"customers"> | string;
    email?: Prisma.StringNullableFilter<"customers"> | string | null;
    phone?: Prisma.StringNullableFilter<"customers"> | string | null;
    company_name?: Prisma.StringNullableFilter<"customers"> | string | null;
    customer_type?: Prisma.StringNullableFilter<"customers"> | string | null;
    payment_terms?: Prisma.StringNullableFilter<"customers"> | string | null;
    address?: Prisma.JsonNullableFilter<"customers">;
    tags?: Prisma.StringNullableListFilter<"customers">;
    notes?: Prisma.StringNullableFilter<"customers"> | string | null;
    is_active?: Prisma.BoolNullableFilter<"customers"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"customers"> | Date | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    orders?: Prisma.OrdersListRelationFilter;
    recurring_order_schedules?: Prisma.Recurring_order_schedulesListRelationFilter;
};
export type customersOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    company_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    customer_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    payment_terms?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    tags?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    farms?: Prisma.farmsOrderByWithRelationInput;
    orders?: Prisma.ordersOrderByRelationAggregateInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesOrderByRelationAggregateInput;
};
export type customersWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.customersWhereInput | Prisma.customersWhereInput[];
    OR?: Prisma.customersWhereInput[];
    NOT?: Prisma.customersWhereInput | Prisma.customersWhereInput[];
    farm_id?: Prisma.UuidNullableFilter<"customers"> | string | null;
    name?: Prisma.StringFilter<"customers"> | string;
    email?: Prisma.StringNullableFilter<"customers"> | string | null;
    phone?: Prisma.StringNullableFilter<"customers"> | string | null;
    company_name?: Prisma.StringNullableFilter<"customers"> | string | null;
    customer_type?: Prisma.StringNullableFilter<"customers"> | string | null;
    payment_terms?: Prisma.StringNullableFilter<"customers"> | string | null;
    address?: Prisma.JsonNullableFilter<"customers">;
    tags?: Prisma.StringNullableListFilter<"customers">;
    notes?: Prisma.StringNullableFilter<"customers"> | string | null;
    is_active?: Prisma.BoolNullableFilter<"customers"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"customers"> | Date | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    orders?: Prisma.OrdersListRelationFilter;
    recurring_order_schedules?: Prisma.Recurring_order_schedulesListRelationFilter;
}, "id">;
export type customersOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    company_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    customer_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    payment_terms?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    tags?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.customersCountOrderByAggregateInput;
    _max?: Prisma.customersMaxOrderByAggregateInput;
    _min?: Prisma.customersMinOrderByAggregateInput;
};
export type customersScalarWhereWithAggregatesInput = {
    AND?: Prisma.customersScalarWhereWithAggregatesInput | Prisma.customersScalarWhereWithAggregatesInput[];
    OR?: Prisma.customersScalarWhereWithAggregatesInput[];
    NOT?: Prisma.customersScalarWhereWithAggregatesInput | Prisma.customersScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"customers"> | string;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"customers"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"customers"> | string;
    email?: Prisma.StringNullableWithAggregatesFilter<"customers"> | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"customers"> | string | null;
    company_name?: Prisma.StringNullableWithAggregatesFilter<"customers"> | string | null;
    customer_type?: Prisma.StringNullableWithAggregatesFilter<"customers"> | string | null;
    payment_terms?: Prisma.StringNullableWithAggregatesFilter<"customers"> | string | null;
    address?: Prisma.JsonNullableWithAggregatesFilter<"customers">;
    tags?: Prisma.StringNullableListFilter<"customers">;
    notes?: Prisma.StringNullableWithAggregatesFilter<"customers"> | string | null;
    is_active?: Prisma.BoolNullableWithAggregatesFilter<"customers"> | boolean | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"customers"> | Date | string | null;
};
export type customersCreateInput = {
    id?: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    customer_type?: string | null;
    payment_terms?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersCreatetagsInput | string[];
    notes?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutCustomersInput;
    orders?: Prisma.ordersCreateNestedManyWithoutCustomersInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutCustomersInput;
};
export type customersUncheckedCreateInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    customer_type?: string | null;
    payment_terms?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersCreatetagsInput | string[];
    notes?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutCustomersInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutCustomersInput;
};
export type customersUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    company_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payment_terms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersUpdatetagsInput | string[];
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutCustomersNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutCustomersNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutCustomersNestedInput;
};
export type customersUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    company_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payment_terms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersUpdatetagsInput | string[];
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutCustomersNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutCustomersNestedInput;
};
export type customersCreateManyInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    customer_type?: string | null;
    payment_terms?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersCreatetagsInput | string[];
    notes?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type customersUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    company_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payment_terms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersUpdatetagsInput | string[];
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type customersUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    company_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payment_terms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersUpdatetagsInput | string[];
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type customersCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    company_name?: Prisma.SortOrder;
    customer_type?: Prisma.SortOrder;
    payment_terms?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    tags?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type customersMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    company_name?: Prisma.SortOrder;
    customer_type?: Prisma.SortOrder;
    payment_terms?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type customersMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    company_name?: Prisma.SortOrder;
    customer_type?: Prisma.SortOrder;
    payment_terms?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type CustomersListRelationFilter = {
    every?: Prisma.customersWhereInput;
    some?: Prisma.customersWhereInput;
    none?: Prisma.customersWhereInput;
};
export type customersOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CustomersNullableScalarRelationFilter = {
    is?: Prisma.customersWhereInput | null;
    isNot?: Prisma.customersWhereInput | null;
};
export type customersCreatetagsInput = {
    set: string[];
};
export type customersUpdatetagsInput = {
    set?: string[];
    push?: string | string[];
};
export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null;
};
export type customersCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.customersCreateWithoutFarmsInput, Prisma.customersUncheckedCreateWithoutFarmsInput> | Prisma.customersCreateWithoutFarmsInput[] | Prisma.customersUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.customersCreateOrConnectWithoutFarmsInput | Prisma.customersCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.customersCreateManyFarmsInputEnvelope;
    connect?: Prisma.customersWhereUniqueInput | Prisma.customersWhereUniqueInput[];
};
export type customersUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.customersCreateWithoutFarmsInput, Prisma.customersUncheckedCreateWithoutFarmsInput> | Prisma.customersCreateWithoutFarmsInput[] | Prisma.customersUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.customersCreateOrConnectWithoutFarmsInput | Prisma.customersCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.customersCreateManyFarmsInputEnvelope;
    connect?: Prisma.customersWhereUniqueInput | Prisma.customersWhereUniqueInput[];
};
export type customersUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.customersCreateWithoutFarmsInput, Prisma.customersUncheckedCreateWithoutFarmsInput> | Prisma.customersCreateWithoutFarmsInput[] | Prisma.customersUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.customersCreateOrConnectWithoutFarmsInput | Prisma.customersCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.customersUpsertWithWhereUniqueWithoutFarmsInput | Prisma.customersUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.customersCreateManyFarmsInputEnvelope;
    set?: Prisma.customersWhereUniqueInput | Prisma.customersWhereUniqueInput[];
    disconnect?: Prisma.customersWhereUniqueInput | Prisma.customersWhereUniqueInput[];
    delete?: Prisma.customersWhereUniqueInput | Prisma.customersWhereUniqueInput[];
    connect?: Prisma.customersWhereUniqueInput | Prisma.customersWhereUniqueInput[];
    update?: Prisma.customersUpdateWithWhereUniqueWithoutFarmsInput | Prisma.customersUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.customersUpdateManyWithWhereWithoutFarmsInput | Prisma.customersUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.customersScalarWhereInput | Prisma.customersScalarWhereInput[];
};
export type customersUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.customersCreateWithoutFarmsInput, Prisma.customersUncheckedCreateWithoutFarmsInput> | Prisma.customersCreateWithoutFarmsInput[] | Prisma.customersUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.customersCreateOrConnectWithoutFarmsInput | Prisma.customersCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.customersUpsertWithWhereUniqueWithoutFarmsInput | Prisma.customersUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.customersCreateManyFarmsInputEnvelope;
    set?: Prisma.customersWhereUniqueInput | Prisma.customersWhereUniqueInput[];
    disconnect?: Prisma.customersWhereUniqueInput | Prisma.customersWhereUniqueInput[];
    delete?: Prisma.customersWhereUniqueInput | Prisma.customersWhereUniqueInput[];
    connect?: Prisma.customersWhereUniqueInput | Prisma.customersWhereUniqueInput[];
    update?: Prisma.customersUpdateWithWhereUniqueWithoutFarmsInput | Prisma.customersUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.customersUpdateManyWithWhereWithoutFarmsInput | Prisma.customersUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.customersScalarWhereInput | Prisma.customersScalarWhereInput[];
};
export type customersCreateNestedOneWithoutOrdersInput = {
    create?: Prisma.XOR<Prisma.customersCreateWithoutOrdersInput, Prisma.customersUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.customersCreateOrConnectWithoutOrdersInput;
    connect?: Prisma.customersWhereUniqueInput;
};
export type customersUpdateOneWithoutOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.customersCreateWithoutOrdersInput, Prisma.customersUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.customersCreateOrConnectWithoutOrdersInput;
    upsert?: Prisma.customersUpsertWithoutOrdersInput;
    disconnect?: Prisma.customersWhereInput | boolean;
    delete?: Prisma.customersWhereInput | boolean;
    connect?: Prisma.customersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.customersUpdateToOneWithWhereWithoutOrdersInput, Prisma.customersUpdateWithoutOrdersInput>, Prisma.customersUncheckedUpdateWithoutOrdersInput>;
};
export type customersCreateNestedOneWithoutRecurring_order_schedulesInput = {
    create?: Prisma.XOR<Prisma.customersCreateWithoutRecurring_order_schedulesInput, Prisma.customersUncheckedCreateWithoutRecurring_order_schedulesInput>;
    connectOrCreate?: Prisma.customersCreateOrConnectWithoutRecurring_order_schedulesInput;
    connect?: Prisma.customersWhereUniqueInput;
};
export type customersUpdateOneWithoutRecurring_order_schedulesNestedInput = {
    create?: Prisma.XOR<Prisma.customersCreateWithoutRecurring_order_schedulesInput, Prisma.customersUncheckedCreateWithoutRecurring_order_schedulesInput>;
    connectOrCreate?: Prisma.customersCreateOrConnectWithoutRecurring_order_schedulesInput;
    upsert?: Prisma.customersUpsertWithoutRecurring_order_schedulesInput;
    disconnect?: Prisma.customersWhereInput | boolean;
    delete?: Prisma.customersWhereInput | boolean;
    connect?: Prisma.customersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.customersUpdateToOneWithWhereWithoutRecurring_order_schedulesInput, Prisma.customersUpdateWithoutRecurring_order_schedulesInput>, Prisma.customersUncheckedUpdateWithoutRecurring_order_schedulesInput>;
};
export type customersCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    customer_type?: string | null;
    payment_terms?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersCreatetagsInput | string[];
    notes?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    orders?: Prisma.ordersCreateNestedManyWithoutCustomersInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutCustomersInput;
};
export type customersUncheckedCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    customer_type?: string | null;
    payment_terms?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersCreatetagsInput | string[];
    notes?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutCustomersInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutCustomersInput;
};
export type customersCreateOrConnectWithoutFarmsInput = {
    where: Prisma.customersWhereUniqueInput;
    create: Prisma.XOR<Prisma.customersCreateWithoutFarmsInput, Prisma.customersUncheckedCreateWithoutFarmsInput>;
};
export type customersCreateManyFarmsInputEnvelope = {
    data: Prisma.customersCreateManyFarmsInput | Prisma.customersCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type customersUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.customersWhereUniqueInput;
    update: Prisma.XOR<Prisma.customersUpdateWithoutFarmsInput, Prisma.customersUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.customersCreateWithoutFarmsInput, Prisma.customersUncheckedCreateWithoutFarmsInput>;
};
export type customersUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.customersWhereUniqueInput;
    data: Prisma.XOR<Prisma.customersUpdateWithoutFarmsInput, Prisma.customersUncheckedUpdateWithoutFarmsInput>;
};
export type customersUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.customersScalarWhereInput;
    data: Prisma.XOR<Prisma.customersUpdateManyMutationInput, Prisma.customersUncheckedUpdateManyWithoutFarmsInput>;
};
export type customersScalarWhereInput = {
    AND?: Prisma.customersScalarWhereInput | Prisma.customersScalarWhereInput[];
    OR?: Prisma.customersScalarWhereInput[];
    NOT?: Prisma.customersScalarWhereInput | Prisma.customersScalarWhereInput[];
    id?: Prisma.UuidFilter<"customers"> | string;
    farm_id?: Prisma.UuidNullableFilter<"customers"> | string | null;
    name?: Prisma.StringFilter<"customers"> | string;
    email?: Prisma.StringNullableFilter<"customers"> | string | null;
    phone?: Prisma.StringNullableFilter<"customers"> | string | null;
    company_name?: Prisma.StringNullableFilter<"customers"> | string | null;
    customer_type?: Prisma.StringNullableFilter<"customers"> | string | null;
    payment_terms?: Prisma.StringNullableFilter<"customers"> | string | null;
    address?: Prisma.JsonNullableFilter<"customers">;
    tags?: Prisma.StringNullableListFilter<"customers">;
    notes?: Prisma.StringNullableFilter<"customers"> | string | null;
    is_active?: Prisma.BoolNullableFilter<"customers"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"customers"> | Date | string | null;
};
export type customersCreateWithoutOrdersInput = {
    id?: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    customer_type?: string | null;
    payment_terms?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersCreatetagsInput | string[];
    notes?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutCustomersInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesCreateNestedManyWithoutCustomersInput;
};
export type customersUncheckedCreateWithoutOrdersInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    customer_type?: string | null;
    payment_terms?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersCreatetagsInput | string[];
    notes?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedCreateNestedManyWithoutCustomersInput;
};
export type customersCreateOrConnectWithoutOrdersInput = {
    where: Prisma.customersWhereUniqueInput;
    create: Prisma.XOR<Prisma.customersCreateWithoutOrdersInput, Prisma.customersUncheckedCreateWithoutOrdersInput>;
};
export type customersUpsertWithoutOrdersInput = {
    update: Prisma.XOR<Prisma.customersUpdateWithoutOrdersInput, Prisma.customersUncheckedUpdateWithoutOrdersInput>;
    create: Prisma.XOR<Prisma.customersCreateWithoutOrdersInput, Prisma.customersUncheckedCreateWithoutOrdersInput>;
    where?: Prisma.customersWhereInput;
};
export type customersUpdateToOneWithWhereWithoutOrdersInput = {
    where?: Prisma.customersWhereInput;
    data: Prisma.XOR<Prisma.customersUpdateWithoutOrdersInput, Prisma.customersUncheckedUpdateWithoutOrdersInput>;
};
export type customersUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    company_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payment_terms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersUpdatetagsInput | string[];
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutCustomersNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutCustomersNestedInput;
};
export type customersUncheckedUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    company_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payment_terms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersUpdatetagsInput | string[];
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutCustomersNestedInput;
};
export type customersCreateWithoutRecurring_order_schedulesInput = {
    id?: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    customer_type?: string | null;
    payment_terms?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersCreatetagsInput | string[];
    notes?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutCustomersInput;
    orders?: Prisma.ordersCreateNestedManyWithoutCustomersInput;
};
export type customersUncheckedCreateWithoutRecurring_order_schedulesInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    customer_type?: string | null;
    payment_terms?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersCreatetagsInput | string[];
    notes?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    orders?: Prisma.ordersUncheckedCreateNestedManyWithoutCustomersInput;
};
export type customersCreateOrConnectWithoutRecurring_order_schedulesInput = {
    where: Prisma.customersWhereUniqueInput;
    create: Prisma.XOR<Prisma.customersCreateWithoutRecurring_order_schedulesInput, Prisma.customersUncheckedCreateWithoutRecurring_order_schedulesInput>;
};
export type customersUpsertWithoutRecurring_order_schedulesInput = {
    update: Prisma.XOR<Prisma.customersUpdateWithoutRecurring_order_schedulesInput, Prisma.customersUncheckedUpdateWithoutRecurring_order_schedulesInput>;
    create: Prisma.XOR<Prisma.customersCreateWithoutRecurring_order_schedulesInput, Prisma.customersUncheckedCreateWithoutRecurring_order_schedulesInput>;
    where?: Prisma.customersWhereInput;
};
export type customersUpdateToOneWithWhereWithoutRecurring_order_schedulesInput = {
    where?: Prisma.customersWhereInput;
    data: Prisma.XOR<Prisma.customersUpdateWithoutRecurring_order_schedulesInput, Prisma.customersUncheckedUpdateWithoutRecurring_order_schedulesInput>;
};
export type customersUpdateWithoutRecurring_order_schedulesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    company_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payment_terms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersUpdatetagsInput | string[];
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutCustomersNestedInput;
    orders?: Prisma.ordersUpdateManyWithoutCustomersNestedInput;
};
export type customersUncheckedUpdateWithoutRecurring_order_schedulesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    company_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payment_terms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersUpdatetagsInput | string[];
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutCustomersNestedInput;
};
export type customersCreateManyFarmsInput = {
    id?: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    company_name?: string | null;
    customer_type?: string | null;
    payment_terms?: string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersCreatetagsInput | string[];
    notes?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type customersUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    company_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payment_terms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersUpdatetagsInput | string[];
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    orders?: Prisma.ordersUpdateManyWithoutCustomersNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUpdateManyWithoutCustomersNestedInput;
};
export type customersUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    company_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payment_terms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersUpdatetagsInput | string[];
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    orders?: Prisma.ordersUncheckedUpdateManyWithoutCustomersNestedInput;
    recurring_order_schedules?: Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutCustomersNestedInput;
};
export type customersUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    company_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    payment_terms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    tags?: Prisma.customersUpdatetagsInput | string[];
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type CustomersCountOutputType
 */
export type CustomersCountOutputType = {
    orders: number;
    recurring_order_schedules: number;
};
export type CustomersCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    orders?: boolean | CustomersCountOutputTypeCountOrdersArgs;
    recurring_order_schedules?: boolean | CustomersCountOutputTypeCountRecurring_order_schedulesArgs;
};
/**
 * CustomersCountOutputType without action
 */
export type CustomersCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomersCountOutputType
     */
    select?: Prisma.CustomersCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * CustomersCountOutputType without action
 */
export type CustomersCountOutputTypeCountOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ordersWhereInput;
};
/**
 * CustomersCountOutputType without action
 */
export type CustomersCountOutputTypeCountRecurring_order_schedulesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.recurring_order_schedulesWhereInput;
};
export type customersSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    company_name?: boolean;
    customer_type?: boolean;
    payment_terms?: boolean;
    address?: boolean;
    tags?: boolean;
    notes?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.customers$farmsArgs<ExtArgs>;
    orders?: boolean | Prisma.customers$ordersArgs<ExtArgs>;
    recurring_order_schedules?: boolean | Prisma.customers$recurring_order_schedulesArgs<ExtArgs>;
    _count?: boolean | Prisma.CustomersCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customers"]>;
export type customersSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    company_name?: boolean;
    customer_type?: boolean;
    payment_terms?: boolean;
    address?: boolean;
    tags?: boolean;
    notes?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.customers$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["customers"]>;
export type customersSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    company_name?: boolean;
    customer_type?: boolean;
    payment_terms?: boolean;
    address?: boolean;
    tags?: boolean;
    notes?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.customers$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["customers"]>;
export type customersSelectScalar = {
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    company_name?: boolean;
    customer_type?: boolean;
    payment_terms?: boolean;
    address?: boolean;
    tags?: boolean;
    notes?: boolean;
    is_active?: boolean;
    created_at?: boolean;
};
export type customersOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farm_id" | "name" | "email" | "phone" | "company_name" | "customer_type" | "payment_terms" | "address" | "tags" | "notes" | "is_active" | "created_at", ExtArgs["result"]["customers"]>;
export type customersInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.customers$farmsArgs<ExtArgs>;
    orders?: boolean | Prisma.customers$ordersArgs<ExtArgs>;
    recurring_order_schedules?: boolean | Prisma.customers$recurring_order_schedulesArgs<ExtArgs>;
    _count?: boolean | Prisma.CustomersCountOutputTypeDefaultArgs<ExtArgs>;
};
export type customersIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.customers$farmsArgs<ExtArgs>;
};
export type customersIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.customers$farmsArgs<ExtArgs>;
};
export type $customersPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "customers";
    objects: {
        farms: Prisma.$farmsPayload<ExtArgs> | null;
        orders: Prisma.$ordersPayload<ExtArgs>[];
        recurring_order_schedules: Prisma.$recurring_order_schedulesPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farm_id: string | null;
        name: string;
        email: string | null;
        phone: string | null;
        company_name: string | null;
        customer_type: string | null;
        payment_terms: string | null;
        address: runtime.JsonValue | null;
        tags: string[];
        notes: string | null;
        is_active: boolean | null;
        created_at: Date | null;
    }, ExtArgs["result"]["customers"]>;
    composites: {};
};
export type customersGetPayload<S extends boolean | null | undefined | customersDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$customersPayload, S>;
export type customersCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<customersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CustomersCountAggregateInputType | true;
};
export interface customersDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['customers'];
        meta: {
            name: 'customers';
        };
    };
    /**
     * Find zero or one Customers that matches the filter.
     * @param {customersFindUniqueArgs} args - Arguments to find a Customers
     * @example
     * // Get one Customers
     * const customers = await prisma.customers.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends customersFindUniqueArgs>(args: Prisma.SelectSubset<T, customersFindUniqueArgs<ExtArgs>>): Prisma.Prisma__customersClient<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Customers that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {customersFindUniqueOrThrowArgs} args - Arguments to find a Customers
     * @example
     * // Get one Customers
     * const customers = await prisma.customers.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends customersFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, customersFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__customersClient<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersFindFirstArgs} args - Arguments to find a Customers
     * @example
     * // Get one Customers
     * const customers = await prisma.customers.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends customersFindFirstArgs>(args?: Prisma.SelectSubset<T, customersFindFirstArgs<ExtArgs>>): Prisma.Prisma__customersClient<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Customers that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersFindFirstOrThrowArgs} args - Arguments to find a Customers
     * @example
     * // Get one Customers
     * const customers = await prisma.customers.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends customersFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, customersFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__customersClient<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customers.findMany()
     *
     * // Get first 10 Customers
     * const customers = await prisma.customers.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const customersWithIdOnly = await prisma.customers.findMany({ select: { id: true } })
     *
     */
    findMany<T extends customersFindManyArgs>(args?: Prisma.SelectSubset<T, customersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Customers.
     * @param {customersCreateArgs} args - Arguments to create a Customers.
     * @example
     * // Create one Customers
     * const Customers = await prisma.customers.create({
     *   data: {
     *     // ... data to create a Customers
     *   }
     * })
     *
     */
    create<T extends customersCreateArgs>(args: Prisma.SelectSubset<T, customersCreateArgs<ExtArgs>>): Prisma.Prisma__customersClient<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Customers.
     * @param {customersCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customers = await prisma.customers.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends customersCreateManyArgs>(args?: Prisma.SelectSubset<T, customersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Customers and returns the data saved in the database.
     * @param {customersCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customers = await prisma.customers.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Customers and only return the `id`
     * const customersWithIdOnly = await prisma.customers.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends customersCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, customersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Customers.
     * @param {customersDeleteArgs} args - Arguments to delete one Customers.
     * @example
     * // Delete one Customers
     * const Customers = await prisma.customers.delete({
     *   where: {
     *     // ... filter to delete one Customers
     *   }
     * })
     *
     */
    delete<T extends customersDeleteArgs>(args: Prisma.SelectSubset<T, customersDeleteArgs<ExtArgs>>): Prisma.Prisma__customersClient<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Customers.
     * @param {customersUpdateArgs} args - Arguments to update one Customers.
     * @example
     * // Update one Customers
     * const customers = await prisma.customers.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends customersUpdateArgs>(args: Prisma.SelectSubset<T, customersUpdateArgs<ExtArgs>>): Prisma.Prisma__customersClient<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Customers.
     * @param {customersDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customers.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends customersDeleteManyArgs>(args?: Prisma.SelectSubset<T, customersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customers = await prisma.customers.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends customersUpdateManyArgs>(args: Prisma.SelectSubset<T, customersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Customers and returns the data updated in the database.
     * @param {customersUpdateManyAndReturnArgs} args - Arguments to update many Customers.
     * @example
     * // Update many Customers
     * const customers = await prisma.customers.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Customers and only return the `id`
     * const customersWithIdOnly = await prisma.customers.updateManyAndReturn({
     *   select: { id: true },
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
    updateManyAndReturn<T extends customersUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, customersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Customers.
     * @param {customersUpsertArgs} args - Arguments to update or create a Customers.
     * @example
     * // Update or create a Customers
     * const customers = await prisma.customers.upsert({
     *   create: {
     *     // ... data to create a Customers
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customers we want to update
     *   }
     * })
     */
    upsert<T extends customersUpsertArgs>(args: Prisma.SelectSubset<T, customersUpsertArgs<ExtArgs>>): Prisma.Prisma__customersClient<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customers.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends customersCountArgs>(args?: Prisma.Subset<T, customersCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CustomersCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CustomersAggregateArgs>(args: Prisma.Subset<T, CustomersAggregateArgs>): Prisma.PrismaPromise<GetCustomersAggregateType<T>>;
    /**
     * Group by Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersGroupByArgs} args - Group by arguments.
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
    groupBy<T extends customersGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: customersGroupByArgs['orderBy'];
    } : {
        orderBy?: customersGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, customersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the customers model
     */
    readonly fields: customersFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for customers.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__customersClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farms<T extends Prisma.customers$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.customers$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    orders<T extends Prisma.customers$ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.customers$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ordersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    recurring_order_schedules<T extends Prisma.customers$recurring_order_schedulesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.customers$recurring_order_schedulesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the customers model
 */
export interface customersFieldRefs {
    readonly id: Prisma.FieldRef<"customers", 'String'>;
    readonly farm_id: Prisma.FieldRef<"customers", 'String'>;
    readonly name: Prisma.FieldRef<"customers", 'String'>;
    readonly email: Prisma.FieldRef<"customers", 'String'>;
    readonly phone: Prisma.FieldRef<"customers", 'String'>;
    readonly company_name: Prisma.FieldRef<"customers", 'String'>;
    readonly customer_type: Prisma.FieldRef<"customers", 'String'>;
    readonly payment_terms: Prisma.FieldRef<"customers", 'String'>;
    readonly address: Prisma.FieldRef<"customers", 'Json'>;
    readonly tags: Prisma.FieldRef<"customers", 'String[]'>;
    readonly notes: Prisma.FieldRef<"customers", 'String'>;
    readonly is_active: Prisma.FieldRef<"customers", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"customers", 'DateTime'>;
}
/**
 * customers findUnique
 */
export type customersFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which customers to fetch.
     */
    where: Prisma.customersWhereUniqueInput;
};
/**
 * customers findUniqueOrThrow
 */
export type customersFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which customers to fetch.
     */
    where: Prisma.customersWhereUniqueInput;
};
/**
 * customers findFirst
 */
export type customersFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which customers to fetch.
     */
    where?: Prisma.customersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of customers to fetch.
     */
    orderBy?: Prisma.customersOrderByWithRelationInput | Prisma.customersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for customers.
     */
    cursor?: Prisma.customersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` customers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` customers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of customers.
     */
    distinct?: Prisma.CustomersScalarFieldEnum | Prisma.CustomersScalarFieldEnum[];
};
/**
 * customers findFirstOrThrow
 */
export type customersFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which customers to fetch.
     */
    where?: Prisma.customersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of customers to fetch.
     */
    orderBy?: Prisma.customersOrderByWithRelationInput | Prisma.customersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for customers.
     */
    cursor?: Prisma.customersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` customers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` customers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of customers.
     */
    distinct?: Prisma.CustomersScalarFieldEnum | Prisma.CustomersScalarFieldEnum[];
};
/**
 * customers findMany
 */
export type customersFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which customers to fetch.
     */
    where?: Prisma.customersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of customers to fetch.
     */
    orderBy?: Prisma.customersOrderByWithRelationInput | Prisma.customersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing customers.
     */
    cursor?: Prisma.customersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` customers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` customers.
     */
    skip?: number;
    distinct?: Prisma.CustomersScalarFieldEnum | Prisma.CustomersScalarFieldEnum[];
};
/**
 * customers create
 */
export type customersCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a customers.
     */
    data: Prisma.XOR<Prisma.customersCreateInput, Prisma.customersUncheckedCreateInput>;
};
/**
 * customers createMany
 */
export type customersCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many customers.
     */
    data: Prisma.customersCreateManyInput | Prisma.customersCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * customers createManyAndReturn
 */
export type customersCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: Prisma.customersSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the customers
     */
    omit?: Prisma.customersOmit<ExtArgs> | null;
    /**
     * The data used to create many customers.
     */
    data: Prisma.customersCreateManyInput | Prisma.customersCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.customersIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * customers update
 */
export type customersUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a customers.
     */
    data: Prisma.XOR<Prisma.customersUpdateInput, Prisma.customersUncheckedUpdateInput>;
    /**
     * Choose, which customers to update.
     */
    where: Prisma.customersWhereUniqueInput;
};
/**
 * customers updateMany
 */
export type customersUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update customers.
     */
    data: Prisma.XOR<Prisma.customersUpdateManyMutationInput, Prisma.customersUncheckedUpdateManyInput>;
    /**
     * Filter which customers to update
     */
    where?: Prisma.customersWhereInput;
    /**
     * Limit how many customers to update.
     */
    limit?: number;
};
/**
 * customers updateManyAndReturn
 */
export type customersUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: Prisma.customersSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the customers
     */
    omit?: Prisma.customersOmit<ExtArgs> | null;
    /**
     * The data used to update customers.
     */
    data: Prisma.XOR<Prisma.customersUpdateManyMutationInput, Prisma.customersUncheckedUpdateManyInput>;
    /**
     * Filter which customers to update
     */
    where?: Prisma.customersWhereInput;
    /**
     * Limit how many customers to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.customersIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * customers upsert
 */
export type customersUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the customers to update in case it exists.
     */
    where: Prisma.customersWhereUniqueInput;
    /**
     * In case the customers found by the `where` argument doesn't exist, create a new customers with this data.
     */
    create: Prisma.XOR<Prisma.customersCreateInput, Prisma.customersUncheckedCreateInput>;
    /**
     * In case the customers was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.customersUpdateInput, Prisma.customersUncheckedUpdateInput>;
};
/**
 * customers delete
 */
export type customersDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which customers to delete.
     */
    where: Prisma.customersWhereUniqueInput;
};
/**
 * customers deleteMany
 */
export type customersDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which customers to delete
     */
    where?: Prisma.customersWhereInput;
    /**
     * Limit how many customers to delete.
     */
    limit?: number;
};
/**
 * customers.farms
 */
export type customers$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.farmsWhereInput;
};
/**
 * customers.orders
 */
export type customers$ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * customers.recurring_order_schedules
 */
export type customers$recurring_order_schedulesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * customers without action
 */
export type customersDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=customers.d.ts.map