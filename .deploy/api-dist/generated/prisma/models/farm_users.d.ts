import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model farm_users
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type farm_usersModel = runtime.Types.Result.DefaultSelection<Prisma.$farm_usersPayload>;
export type AggregateFarm_users = {
    _count: Farm_usersCountAggregateOutputType | null;
    _min: Farm_usersMinAggregateOutputType | null;
    _max: Farm_usersMaxAggregateOutputType | null;
};
export type Farm_usersMinAggregateOutputType = {
    id: string | null;
    tenant_id: string | null;
    farm_id: string | null;
    clerk_user_id: string | null;
    role: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type Farm_usersMaxAggregateOutputType = {
    id: string | null;
    tenant_id: string | null;
    farm_id: string | null;
    clerk_user_id: string | null;
    role: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type Farm_usersCountAggregateOutputType = {
    id: number;
    tenant_id: number;
    farm_id: number;
    clerk_user_id: number;
    role: number;
    first_name: number;
    last_name: number;
    email: number;
    is_active: number;
    created_at: number;
    _all: number;
};
export type Farm_usersMinAggregateInputType = {
    id?: true;
    tenant_id?: true;
    farm_id?: true;
    clerk_user_id?: true;
    role?: true;
    first_name?: true;
    last_name?: true;
    email?: true;
    is_active?: true;
    created_at?: true;
};
export type Farm_usersMaxAggregateInputType = {
    id?: true;
    tenant_id?: true;
    farm_id?: true;
    clerk_user_id?: true;
    role?: true;
    first_name?: true;
    last_name?: true;
    email?: true;
    is_active?: true;
    created_at?: true;
};
export type Farm_usersCountAggregateInputType = {
    id?: true;
    tenant_id?: true;
    farm_id?: true;
    clerk_user_id?: true;
    role?: true;
    first_name?: true;
    last_name?: true;
    email?: true;
    is_active?: true;
    created_at?: true;
    _all?: true;
};
export type Farm_usersAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which farm_users to aggregate.
     */
    where?: Prisma.farm_usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farm_users to fetch.
     */
    orderBy?: Prisma.farm_usersOrderByWithRelationInput | Prisma.farm_usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.farm_usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farm_users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farm_users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned farm_users
    **/
    _count?: true | Farm_usersCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Farm_usersMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Farm_usersMaxAggregateInputType;
};
export type GetFarm_usersAggregateType<T extends Farm_usersAggregateArgs> = {
    [P in keyof T & keyof AggregateFarm_users]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFarm_users[P]> : Prisma.GetScalarType<T[P], AggregateFarm_users[P]>;
};
export type farm_usersGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.farm_usersWhereInput;
    orderBy?: Prisma.farm_usersOrderByWithAggregationInput | Prisma.farm_usersOrderByWithAggregationInput[];
    by: Prisma.Farm_usersScalarFieldEnum[] | Prisma.Farm_usersScalarFieldEnum;
    having?: Prisma.farm_usersScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Farm_usersCountAggregateInputType | true;
    _min?: Farm_usersMinAggregateInputType;
    _max?: Farm_usersMaxAggregateInputType;
};
export type Farm_usersGroupByOutputType = {
    id: string;
    tenant_id: string | null;
    farm_id: string | null;
    clerk_user_id: string;
    role: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    _count: Farm_usersCountAggregateOutputType | null;
    _min: Farm_usersMinAggregateOutputType | null;
    _max: Farm_usersMaxAggregateOutputType | null;
};
type GetFarm_usersGroupByPayload<T extends farm_usersGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Farm_usersGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Farm_usersGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Farm_usersGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Farm_usersGroupByOutputType[P]>;
}>>;
export type farm_usersWhereInput = {
    AND?: Prisma.farm_usersWhereInput | Prisma.farm_usersWhereInput[];
    OR?: Prisma.farm_usersWhereInput[];
    NOT?: Prisma.farm_usersWhereInput | Prisma.farm_usersWhereInput[];
    id?: Prisma.UuidFilter<"farm_users"> | string;
    tenant_id?: Prisma.UuidNullableFilter<"farm_users"> | string | null;
    farm_id?: Prisma.UuidNullableFilter<"farm_users"> | string | null;
    clerk_user_id?: Prisma.StringFilter<"farm_users"> | string;
    role?: Prisma.StringFilter<"farm_users"> | string;
    first_name?: Prisma.StringNullableFilter<"farm_users"> | string | null;
    last_name?: Prisma.StringNullableFilter<"farm_users"> | string | null;
    email?: Prisma.StringNullableFilter<"farm_users"> | string | null;
    is_active?: Prisma.BoolNullableFilter<"farm_users"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"farm_users"> | Date | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    tenants?: Prisma.XOR<Prisma.TenantsNullableScalarRelationFilter, Prisma.tenantsWhereInput> | null;
};
export type farm_usersOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenant_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    clerk_user_id?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    first_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    last_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    farms?: Prisma.farmsOrderByWithRelationInput;
    tenants?: Prisma.tenantsOrderByWithRelationInput;
};
export type farm_usersWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    clerk_user_id?: string;
    AND?: Prisma.farm_usersWhereInput | Prisma.farm_usersWhereInput[];
    OR?: Prisma.farm_usersWhereInput[];
    NOT?: Prisma.farm_usersWhereInput | Prisma.farm_usersWhereInput[];
    tenant_id?: Prisma.UuidNullableFilter<"farm_users"> | string | null;
    farm_id?: Prisma.UuidNullableFilter<"farm_users"> | string | null;
    role?: Prisma.StringFilter<"farm_users"> | string;
    first_name?: Prisma.StringNullableFilter<"farm_users"> | string | null;
    last_name?: Prisma.StringNullableFilter<"farm_users"> | string | null;
    email?: Prisma.StringNullableFilter<"farm_users"> | string | null;
    is_active?: Prisma.BoolNullableFilter<"farm_users"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"farm_users"> | Date | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    tenants?: Prisma.XOR<Prisma.TenantsNullableScalarRelationFilter, Prisma.tenantsWhereInput> | null;
}, "id" | "clerk_user_id">;
export type farm_usersOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenant_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    clerk_user_id?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    first_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    last_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.farm_usersCountOrderByAggregateInput;
    _max?: Prisma.farm_usersMaxOrderByAggregateInput;
    _min?: Prisma.farm_usersMinOrderByAggregateInput;
};
export type farm_usersScalarWhereWithAggregatesInput = {
    AND?: Prisma.farm_usersScalarWhereWithAggregatesInput | Prisma.farm_usersScalarWhereWithAggregatesInput[];
    OR?: Prisma.farm_usersScalarWhereWithAggregatesInput[];
    NOT?: Prisma.farm_usersScalarWhereWithAggregatesInput | Prisma.farm_usersScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"farm_users"> | string;
    tenant_id?: Prisma.UuidNullableWithAggregatesFilter<"farm_users"> | string | null;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"farm_users"> | string | null;
    clerk_user_id?: Prisma.StringWithAggregatesFilter<"farm_users"> | string;
    role?: Prisma.StringWithAggregatesFilter<"farm_users"> | string;
    first_name?: Prisma.StringNullableWithAggregatesFilter<"farm_users"> | string | null;
    last_name?: Prisma.StringNullableWithAggregatesFilter<"farm_users"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"farm_users"> | string | null;
    is_active?: Prisma.BoolNullableWithAggregatesFilter<"farm_users"> | boolean | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"farm_users"> | Date | string | null;
};
export type farm_usersCreateInput = {
    id?: string;
    clerk_user_id: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutFarm_usersInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarm_usersInput;
};
export type farm_usersUncheckedCreateInput = {
    id?: string;
    tenant_id?: string | null;
    farm_id?: string | null;
    clerk_user_id: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type farm_usersUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clerk_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutFarm_usersNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutFarm_usersNestedInput;
};
export type farm_usersUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    clerk_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_usersCreateManyInput = {
    id?: string;
    tenant_id?: string | null;
    farm_id?: string | null;
    clerk_user_id: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type farm_usersUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clerk_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_usersUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    clerk_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_usersCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenant_id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    clerk_user_id?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type farm_usersMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenant_id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    clerk_user_id?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type farm_usersMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenant_id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    clerk_user_id?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type Farm_usersListRelationFilter = {
    every?: Prisma.farm_usersWhereInput;
    some?: Prisma.farm_usersWhereInput;
    none?: Prisma.farm_usersWhereInput;
};
export type farm_usersOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type farm_usersCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.farm_usersCreateWithoutFarmsInput, Prisma.farm_usersUncheckedCreateWithoutFarmsInput> | Prisma.farm_usersCreateWithoutFarmsInput[] | Prisma.farm_usersUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.farm_usersCreateOrConnectWithoutFarmsInput | Prisma.farm_usersCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.farm_usersCreateManyFarmsInputEnvelope;
    connect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
};
export type farm_usersUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.farm_usersCreateWithoutFarmsInput, Prisma.farm_usersUncheckedCreateWithoutFarmsInput> | Prisma.farm_usersCreateWithoutFarmsInput[] | Prisma.farm_usersUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.farm_usersCreateOrConnectWithoutFarmsInput | Prisma.farm_usersCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.farm_usersCreateManyFarmsInputEnvelope;
    connect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
};
export type farm_usersUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.farm_usersCreateWithoutFarmsInput, Prisma.farm_usersUncheckedCreateWithoutFarmsInput> | Prisma.farm_usersCreateWithoutFarmsInput[] | Prisma.farm_usersUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.farm_usersCreateOrConnectWithoutFarmsInput | Prisma.farm_usersCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.farm_usersUpsertWithWhereUniqueWithoutFarmsInput | Prisma.farm_usersUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.farm_usersCreateManyFarmsInputEnvelope;
    set?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    disconnect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    delete?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    connect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    update?: Prisma.farm_usersUpdateWithWhereUniqueWithoutFarmsInput | Prisma.farm_usersUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.farm_usersUpdateManyWithWhereWithoutFarmsInput | Prisma.farm_usersUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.farm_usersScalarWhereInput | Prisma.farm_usersScalarWhereInput[];
};
export type farm_usersUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.farm_usersCreateWithoutFarmsInput, Prisma.farm_usersUncheckedCreateWithoutFarmsInput> | Prisma.farm_usersCreateWithoutFarmsInput[] | Prisma.farm_usersUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.farm_usersCreateOrConnectWithoutFarmsInput | Prisma.farm_usersCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.farm_usersUpsertWithWhereUniqueWithoutFarmsInput | Prisma.farm_usersUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.farm_usersCreateManyFarmsInputEnvelope;
    set?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    disconnect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    delete?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    connect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    update?: Prisma.farm_usersUpdateWithWhereUniqueWithoutFarmsInput | Prisma.farm_usersUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.farm_usersUpdateManyWithWhereWithoutFarmsInput | Prisma.farm_usersUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.farm_usersScalarWhereInput | Prisma.farm_usersScalarWhereInput[];
};
export type farm_usersCreateNestedManyWithoutTenantsInput = {
    create?: Prisma.XOR<Prisma.farm_usersCreateWithoutTenantsInput, Prisma.farm_usersUncheckedCreateWithoutTenantsInput> | Prisma.farm_usersCreateWithoutTenantsInput[] | Prisma.farm_usersUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.farm_usersCreateOrConnectWithoutTenantsInput | Prisma.farm_usersCreateOrConnectWithoutTenantsInput[];
    createMany?: Prisma.farm_usersCreateManyTenantsInputEnvelope;
    connect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
};
export type farm_usersUncheckedCreateNestedManyWithoutTenantsInput = {
    create?: Prisma.XOR<Prisma.farm_usersCreateWithoutTenantsInput, Prisma.farm_usersUncheckedCreateWithoutTenantsInput> | Prisma.farm_usersCreateWithoutTenantsInput[] | Prisma.farm_usersUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.farm_usersCreateOrConnectWithoutTenantsInput | Prisma.farm_usersCreateOrConnectWithoutTenantsInput[];
    createMany?: Prisma.farm_usersCreateManyTenantsInputEnvelope;
    connect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
};
export type farm_usersUpdateManyWithoutTenantsNestedInput = {
    create?: Prisma.XOR<Prisma.farm_usersCreateWithoutTenantsInput, Prisma.farm_usersUncheckedCreateWithoutTenantsInput> | Prisma.farm_usersCreateWithoutTenantsInput[] | Prisma.farm_usersUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.farm_usersCreateOrConnectWithoutTenantsInput | Prisma.farm_usersCreateOrConnectWithoutTenantsInput[];
    upsert?: Prisma.farm_usersUpsertWithWhereUniqueWithoutTenantsInput | Prisma.farm_usersUpsertWithWhereUniqueWithoutTenantsInput[];
    createMany?: Prisma.farm_usersCreateManyTenantsInputEnvelope;
    set?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    disconnect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    delete?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    connect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    update?: Prisma.farm_usersUpdateWithWhereUniqueWithoutTenantsInput | Prisma.farm_usersUpdateWithWhereUniqueWithoutTenantsInput[];
    updateMany?: Prisma.farm_usersUpdateManyWithWhereWithoutTenantsInput | Prisma.farm_usersUpdateManyWithWhereWithoutTenantsInput[];
    deleteMany?: Prisma.farm_usersScalarWhereInput | Prisma.farm_usersScalarWhereInput[];
};
export type farm_usersUncheckedUpdateManyWithoutTenantsNestedInput = {
    create?: Prisma.XOR<Prisma.farm_usersCreateWithoutTenantsInput, Prisma.farm_usersUncheckedCreateWithoutTenantsInput> | Prisma.farm_usersCreateWithoutTenantsInput[] | Prisma.farm_usersUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.farm_usersCreateOrConnectWithoutTenantsInput | Prisma.farm_usersCreateOrConnectWithoutTenantsInput[];
    upsert?: Prisma.farm_usersUpsertWithWhereUniqueWithoutTenantsInput | Prisma.farm_usersUpsertWithWhereUniqueWithoutTenantsInput[];
    createMany?: Prisma.farm_usersCreateManyTenantsInputEnvelope;
    set?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    disconnect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    delete?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    connect?: Prisma.farm_usersWhereUniqueInput | Prisma.farm_usersWhereUniqueInput[];
    update?: Prisma.farm_usersUpdateWithWhereUniqueWithoutTenantsInput | Prisma.farm_usersUpdateWithWhereUniqueWithoutTenantsInput[];
    updateMany?: Prisma.farm_usersUpdateManyWithWhereWithoutTenantsInput | Prisma.farm_usersUpdateManyWithWhereWithoutTenantsInput[];
    deleteMany?: Prisma.farm_usersScalarWhereInput | Prisma.farm_usersScalarWhereInput[];
};
export type farm_usersCreateWithoutFarmsInput = {
    id?: string;
    clerk_user_id: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    tenants?: Prisma.tenantsCreateNestedOneWithoutFarm_usersInput;
};
export type farm_usersUncheckedCreateWithoutFarmsInput = {
    id?: string;
    tenant_id?: string | null;
    clerk_user_id: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type farm_usersCreateOrConnectWithoutFarmsInput = {
    where: Prisma.farm_usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.farm_usersCreateWithoutFarmsInput, Prisma.farm_usersUncheckedCreateWithoutFarmsInput>;
};
export type farm_usersCreateManyFarmsInputEnvelope = {
    data: Prisma.farm_usersCreateManyFarmsInput | Prisma.farm_usersCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type farm_usersUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.farm_usersWhereUniqueInput;
    update: Prisma.XOR<Prisma.farm_usersUpdateWithoutFarmsInput, Prisma.farm_usersUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.farm_usersCreateWithoutFarmsInput, Prisma.farm_usersUncheckedCreateWithoutFarmsInput>;
};
export type farm_usersUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.farm_usersWhereUniqueInput;
    data: Prisma.XOR<Prisma.farm_usersUpdateWithoutFarmsInput, Prisma.farm_usersUncheckedUpdateWithoutFarmsInput>;
};
export type farm_usersUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.farm_usersScalarWhereInput;
    data: Prisma.XOR<Prisma.farm_usersUpdateManyMutationInput, Prisma.farm_usersUncheckedUpdateManyWithoutFarmsInput>;
};
export type farm_usersScalarWhereInput = {
    AND?: Prisma.farm_usersScalarWhereInput | Prisma.farm_usersScalarWhereInput[];
    OR?: Prisma.farm_usersScalarWhereInput[];
    NOT?: Prisma.farm_usersScalarWhereInput | Prisma.farm_usersScalarWhereInput[];
    id?: Prisma.UuidFilter<"farm_users"> | string;
    tenant_id?: Prisma.UuidNullableFilter<"farm_users"> | string | null;
    farm_id?: Prisma.UuidNullableFilter<"farm_users"> | string | null;
    clerk_user_id?: Prisma.StringFilter<"farm_users"> | string;
    role?: Prisma.StringFilter<"farm_users"> | string;
    first_name?: Prisma.StringNullableFilter<"farm_users"> | string | null;
    last_name?: Prisma.StringNullableFilter<"farm_users"> | string | null;
    email?: Prisma.StringNullableFilter<"farm_users"> | string | null;
    is_active?: Prisma.BoolNullableFilter<"farm_users"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"farm_users"> | Date | string | null;
};
export type farm_usersCreateWithoutTenantsInput = {
    id?: string;
    clerk_user_id: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutFarm_usersInput;
};
export type farm_usersUncheckedCreateWithoutTenantsInput = {
    id?: string;
    farm_id?: string | null;
    clerk_user_id: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type farm_usersCreateOrConnectWithoutTenantsInput = {
    where: Prisma.farm_usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.farm_usersCreateWithoutTenantsInput, Prisma.farm_usersUncheckedCreateWithoutTenantsInput>;
};
export type farm_usersCreateManyTenantsInputEnvelope = {
    data: Prisma.farm_usersCreateManyTenantsInput | Prisma.farm_usersCreateManyTenantsInput[];
    skipDuplicates?: boolean;
};
export type farm_usersUpsertWithWhereUniqueWithoutTenantsInput = {
    where: Prisma.farm_usersWhereUniqueInput;
    update: Prisma.XOR<Prisma.farm_usersUpdateWithoutTenantsInput, Prisma.farm_usersUncheckedUpdateWithoutTenantsInput>;
    create: Prisma.XOR<Prisma.farm_usersCreateWithoutTenantsInput, Prisma.farm_usersUncheckedCreateWithoutTenantsInput>;
};
export type farm_usersUpdateWithWhereUniqueWithoutTenantsInput = {
    where: Prisma.farm_usersWhereUniqueInput;
    data: Prisma.XOR<Prisma.farm_usersUpdateWithoutTenantsInput, Prisma.farm_usersUncheckedUpdateWithoutTenantsInput>;
};
export type farm_usersUpdateManyWithWhereWithoutTenantsInput = {
    where: Prisma.farm_usersScalarWhereInput;
    data: Prisma.XOR<Prisma.farm_usersUpdateManyMutationInput, Prisma.farm_usersUncheckedUpdateManyWithoutTenantsInput>;
};
export type farm_usersCreateManyFarmsInput = {
    id?: string;
    tenant_id?: string | null;
    clerk_user_id: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type farm_usersUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clerk_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tenants?: Prisma.tenantsUpdateOneWithoutFarm_usersNestedInput;
};
export type farm_usersUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    clerk_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_usersUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    clerk_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_usersCreateManyTenantsInput = {
    id?: string;
    farm_id?: string | null;
    clerk_user_id: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type farm_usersUpdateWithoutTenantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clerk_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutFarm_usersNestedInput;
};
export type farm_usersUncheckedUpdateWithoutTenantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    clerk_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_usersUncheckedUpdateManyWithoutTenantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    clerk_user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_usersSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenant_id?: boolean;
    farm_id?: boolean;
    clerk_user_id?: boolean;
    role?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    email?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.farm_users$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.farm_users$tenantsArgs<ExtArgs>;
}, ExtArgs["result"]["farm_users"]>;
export type farm_usersSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenant_id?: boolean;
    farm_id?: boolean;
    clerk_user_id?: boolean;
    role?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    email?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.farm_users$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.farm_users$tenantsArgs<ExtArgs>;
}, ExtArgs["result"]["farm_users"]>;
export type farm_usersSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenant_id?: boolean;
    farm_id?: boolean;
    clerk_user_id?: boolean;
    role?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    email?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.farm_users$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.farm_users$tenantsArgs<ExtArgs>;
}, ExtArgs["result"]["farm_users"]>;
export type farm_usersSelectScalar = {
    id?: boolean;
    tenant_id?: boolean;
    farm_id?: boolean;
    clerk_user_id?: boolean;
    role?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    email?: boolean;
    is_active?: boolean;
    created_at?: boolean;
};
export type farm_usersOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenant_id" | "farm_id" | "clerk_user_id" | "role" | "first_name" | "last_name" | "email" | "is_active" | "created_at", ExtArgs["result"]["farm_users"]>;
export type farm_usersInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.farm_users$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.farm_users$tenantsArgs<ExtArgs>;
};
export type farm_usersIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.farm_users$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.farm_users$tenantsArgs<ExtArgs>;
};
export type farm_usersIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.farm_users$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.farm_users$tenantsArgs<ExtArgs>;
};
export type $farm_usersPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "farm_users";
    objects: {
        farms: Prisma.$farmsPayload<ExtArgs> | null;
        tenants: Prisma.$tenantsPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenant_id: string | null;
        farm_id: string | null;
        clerk_user_id: string;
        role: string;
        first_name: string | null;
        last_name: string | null;
        email: string | null;
        is_active: boolean | null;
        created_at: Date | null;
    }, ExtArgs["result"]["farm_users"]>;
    composites: {};
};
export type farm_usersGetPayload<S extends boolean | null | undefined | farm_usersDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$farm_usersPayload, S>;
export type farm_usersCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<farm_usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Farm_usersCountAggregateInputType | true;
};
export interface farm_usersDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['farm_users'];
        meta: {
            name: 'farm_users';
        };
    };
    /**
     * Find zero or one Farm_users that matches the filter.
     * @param {farm_usersFindUniqueArgs} args - Arguments to find a Farm_users
     * @example
     * // Get one Farm_users
     * const farm_users = await prisma.farm_users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends farm_usersFindUniqueArgs>(args: Prisma.SelectSubset<T, farm_usersFindUniqueArgs<ExtArgs>>): Prisma.Prisma__farm_usersClient<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Farm_users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {farm_usersFindUniqueOrThrowArgs} args - Arguments to find a Farm_users
     * @example
     * // Get one Farm_users
     * const farm_users = await prisma.farm_users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends farm_usersFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, farm_usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__farm_usersClient<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Farm_users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_usersFindFirstArgs} args - Arguments to find a Farm_users
     * @example
     * // Get one Farm_users
     * const farm_users = await prisma.farm_users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends farm_usersFindFirstArgs>(args?: Prisma.SelectSubset<T, farm_usersFindFirstArgs<ExtArgs>>): Prisma.Prisma__farm_usersClient<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Farm_users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_usersFindFirstOrThrowArgs} args - Arguments to find a Farm_users
     * @example
     * // Get one Farm_users
     * const farm_users = await prisma.farm_users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends farm_usersFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, farm_usersFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__farm_usersClient<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Farm_users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Farm_users
     * const farm_users = await prisma.farm_users.findMany()
     *
     * // Get first 10 Farm_users
     * const farm_users = await prisma.farm_users.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const farm_usersWithIdOnly = await prisma.farm_users.findMany({ select: { id: true } })
     *
     */
    findMany<T extends farm_usersFindManyArgs>(args?: Prisma.SelectSubset<T, farm_usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Farm_users.
     * @param {farm_usersCreateArgs} args - Arguments to create a Farm_users.
     * @example
     * // Create one Farm_users
     * const Farm_users = await prisma.farm_users.create({
     *   data: {
     *     // ... data to create a Farm_users
     *   }
     * })
     *
     */
    create<T extends farm_usersCreateArgs>(args: Prisma.SelectSubset<T, farm_usersCreateArgs<ExtArgs>>): Prisma.Prisma__farm_usersClient<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Farm_users.
     * @param {farm_usersCreateManyArgs} args - Arguments to create many Farm_users.
     * @example
     * // Create many Farm_users
     * const farm_users = await prisma.farm_users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends farm_usersCreateManyArgs>(args?: Prisma.SelectSubset<T, farm_usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Farm_users and returns the data saved in the database.
     * @param {farm_usersCreateManyAndReturnArgs} args - Arguments to create many Farm_users.
     * @example
     * // Create many Farm_users
     * const farm_users = await prisma.farm_users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Farm_users and only return the `id`
     * const farm_usersWithIdOnly = await prisma.farm_users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends farm_usersCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, farm_usersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Farm_users.
     * @param {farm_usersDeleteArgs} args - Arguments to delete one Farm_users.
     * @example
     * // Delete one Farm_users
     * const Farm_users = await prisma.farm_users.delete({
     *   where: {
     *     // ... filter to delete one Farm_users
     *   }
     * })
     *
     */
    delete<T extends farm_usersDeleteArgs>(args: Prisma.SelectSubset<T, farm_usersDeleteArgs<ExtArgs>>): Prisma.Prisma__farm_usersClient<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Farm_users.
     * @param {farm_usersUpdateArgs} args - Arguments to update one Farm_users.
     * @example
     * // Update one Farm_users
     * const farm_users = await prisma.farm_users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends farm_usersUpdateArgs>(args: Prisma.SelectSubset<T, farm_usersUpdateArgs<ExtArgs>>): Prisma.Prisma__farm_usersClient<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Farm_users.
     * @param {farm_usersDeleteManyArgs} args - Arguments to filter Farm_users to delete.
     * @example
     * // Delete a few Farm_users
     * const { count } = await prisma.farm_users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends farm_usersDeleteManyArgs>(args?: Prisma.SelectSubset<T, farm_usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Farm_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Farm_users
     * const farm_users = await prisma.farm_users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends farm_usersUpdateManyArgs>(args: Prisma.SelectSubset<T, farm_usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Farm_users and returns the data updated in the database.
     * @param {farm_usersUpdateManyAndReturnArgs} args - Arguments to update many Farm_users.
     * @example
     * // Update many Farm_users
     * const farm_users = await prisma.farm_users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Farm_users and only return the `id`
     * const farm_usersWithIdOnly = await prisma.farm_users.updateManyAndReturn({
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
    updateManyAndReturn<T extends farm_usersUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, farm_usersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Farm_users.
     * @param {farm_usersUpsertArgs} args - Arguments to update or create a Farm_users.
     * @example
     * // Update or create a Farm_users
     * const farm_users = await prisma.farm_users.upsert({
     *   create: {
     *     // ... data to create a Farm_users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Farm_users we want to update
     *   }
     * })
     */
    upsert<T extends farm_usersUpsertArgs>(args: Prisma.SelectSubset<T, farm_usersUpsertArgs<ExtArgs>>): Prisma.Prisma__farm_usersClient<runtime.Types.Result.GetResult<Prisma.$farm_usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Farm_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_usersCountArgs} args - Arguments to filter Farm_users to count.
     * @example
     * // Count the number of Farm_users
     * const count = await prisma.farm_users.count({
     *   where: {
     *     // ... the filter for the Farm_users we want to count
     *   }
     * })
    **/
    count<T extends farm_usersCountArgs>(args?: Prisma.Subset<T, farm_usersCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Farm_usersCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Farm_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Farm_usersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Farm_usersAggregateArgs>(args: Prisma.Subset<T, Farm_usersAggregateArgs>): Prisma.PrismaPromise<GetFarm_usersAggregateType<T>>;
    /**
     * Group by Farm_users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_usersGroupByArgs} args - Group by arguments.
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
    groupBy<T extends farm_usersGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: farm_usersGroupByArgs['orderBy'];
    } : {
        orderBy?: farm_usersGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, farm_usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFarm_usersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the farm_users model
     */
    readonly fields: farm_usersFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for farm_users.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__farm_usersClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farms<T extends Prisma.farm_users$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farm_users$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    tenants<T extends Prisma.farm_users$tenantsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farm_users$tenantsArgs<ExtArgs>>): Prisma.Prisma__tenantsClient<runtime.Types.Result.GetResult<Prisma.$tenantsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the farm_users model
 */
export interface farm_usersFieldRefs {
    readonly id: Prisma.FieldRef<"farm_users", 'String'>;
    readonly tenant_id: Prisma.FieldRef<"farm_users", 'String'>;
    readonly farm_id: Prisma.FieldRef<"farm_users", 'String'>;
    readonly clerk_user_id: Prisma.FieldRef<"farm_users", 'String'>;
    readonly role: Prisma.FieldRef<"farm_users", 'String'>;
    readonly first_name: Prisma.FieldRef<"farm_users", 'String'>;
    readonly last_name: Prisma.FieldRef<"farm_users", 'String'>;
    readonly email: Prisma.FieldRef<"farm_users", 'String'>;
    readonly is_active: Prisma.FieldRef<"farm_users", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"farm_users", 'DateTime'>;
}
/**
 * farm_users findUnique
 */
export type farm_usersFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which farm_users to fetch.
     */
    where: Prisma.farm_usersWhereUniqueInput;
};
/**
 * farm_users findUniqueOrThrow
 */
export type farm_usersFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which farm_users to fetch.
     */
    where: Prisma.farm_usersWhereUniqueInput;
};
/**
 * farm_users findFirst
 */
export type farm_usersFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which farm_users to fetch.
     */
    where?: Prisma.farm_usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farm_users to fetch.
     */
    orderBy?: Prisma.farm_usersOrderByWithRelationInput | Prisma.farm_usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for farm_users.
     */
    cursor?: Prisma.farm_usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farm_users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farm_users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of farm_users.
     */
    distinct?: Prisma.Farm_usersScalarFieldEnum | Prisma.Farm_usersScalarFieldEnum[];
};
/**
 * farm_users findFirstOrThrow
 */
export type farm_usersFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which farm_users to fetch.
     */
    where?: Prisma.farm_usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farm_users to fetch.
     */
    orderBy?: Prisma.farm_usersOrderByWithRelationInput | Prisma.farm_usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for farm_users.
     */
    cursor?: Prisma.farm_usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farm_users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farm_users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of farm_users.
     */
    distinct?: Prisma.Farm_usersScalarFieldEnum | Prisma.Farm_usersScalarFieldEnum[];
};
/**
 * farm_users findMany
 */
export type farm_usersFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which farm_users to fetch.
     */
    where?: Prisma.farm_usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farm_users to fetch.
     */
    orderBy?: Prisma.farm_usersOrderByWithRelationInput | Prisma.farm_usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing farm_users.
     */
    cursor?: Prisma.farm_usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farm_users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farm_users.
     */
    skip?: number;
    distinct?: Prisma.Farm_usersScalarFieldEnum | Prisma.Farm_usersScalarFieldEnum[];
};
/**
 * farm_users create
 */
export type farm_usersCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a farm_users.
     */
    data: Prisma.XOR<Prisma.farm_usersCreateInput, Prisma.farm_usersUncheckedCreateInput>;
};
/**
 * farm_users createMany
 */
export type farm_usersCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many farm_users.
     */
    data: Prisma.farm_usersCreateManyInput | Prisma.farm_usersCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * farm_users createManyAndReturn
 */
export type farm_usersCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_users
     */
    select?: Prisma.farm_usersSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_users
     */
    omit?: Prisma.farm_usersOmit<ExtArgs> | null;
    /**
     * The data used to create many farm_users.
     */
    data: Prisma.farm_usersCreateManyInput | Prisma.farm_usersCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_usersIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * farm_users update
 */
export type farm_usersUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a farm_users.
     */
    data: Prisma.XOR<Prisma.farm_usersUpdateInput, Prisma.farm_usersUncheckedUpdateInput>;
    /**
     * Choose, which farm_users to update.
     */
    where: Prisma.farm_usersWhereUniqueInput;
};
/**
 * farm_users updateMany
 */
export type farm_usersUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update farm_users.
     */
    data: Prisma.XOR<Prisma.farm_usersUpdateManyMutationInput, Prisma.farm_usersUncheckedUpdateManyInput>;
    /**
     * Filter which farm_users to update
     */
    where?: Prisma.farm_usersWhereInput;
    /**
     * Limit how many farm_users to update.
     */
    limit?: number;
};
/**
 * farm_users updateManyAndReturn
 */
export type farm_usersUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_users
     */
    select?: Prisma.farm_usersSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_users
     */
    omit?: Prisma.farm_usersOmit<ExtArgs> | null;
    /**
     * The data used to update farm_users.
     */
    data: Prisma.XOR<Prisma.farm_usersUpdateManyMutationInput, Prisma.farm_usersUncheckedUpdateManyInput>;
    /**
     * Filter which farm_users to update
     */
    where?: Prisma.farm_usersWhereInput;
    /**
     * Limit how many farm_users to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_usersIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * farm_users upsert
 */
export type farm_usersUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the farm_users to update in case it exists.
     */
    where: Prisma.farm_usersWhereUniqueInput;
    /**
     * In case the farm_users found by the `where` argument doesn't exist, create a new farm_users with this data.
     */
    create: Prisma.XOR<Prisma.farm_usersCreateInput, Prisma.farm_usersUncheckedCreateInput>;
    /**
     * In case the farm_users was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.farm_usersUpdateInput, Prisma.farm_usersUncheckedUpdateInput>;
};
/**
 * farm_users delete
 */
export type farm_usersDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which farm_users to delete.
     */
    where: Prisma.farm_usersWhereUniqueInput;
};
/**
 * farm_users deleteMany
 */
export type farm_usersDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which farm_users to delete
     */
    where?: Prisma.farm_usersWhereInput;
    /**
     * Limit how many farm_users to delete.
     */
    limit?: number;
};
/**
 * farm_users.farms
 */
export type farm_users$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * farm_users.tenants
 */
export type farm_users$tenantsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * farm_users without action
 */
export type farm_usersDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=farm_users.d.ts.map