import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model machines
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type machinesModel = runtime.Types.Result.DefaultSelection<Prisma.$machinesPayload>;
export type AggregateMachines = {
    _count: MachinesCountAggregateOutputType | null;
    _min: MachinesMinAggregateOutputType | null;
    _max: MachinesMaxAggregateOutputType | null;
};
export type MachinesMinAggregateOutputType = {
    id: string | null;
    tenant_id: string | null;
    farm_id: string | null;
    name: string | null;
    display_name: string | null;
    device_id: string | null;
    created_at: Date | null;
    aws_iot_thing_name: string | null;
    status: string | null;
    last_seen_at: Date | null;
    current_wifi_ssid: string | null;
};
export type MachinesMaxAggregateOutputType = {
    id: string | null;
    tenant_id: string | null;
    farm_id: string | null;
    name: string | null;
    display_name: string | null;
    device_id: string | null;
    created_at: Date | null;
    aws_iot_thing_name: string | null;
    status: string | null;
    last_seen_at: Date | null;
    current_wifi_ssid: string | null;
};
export type MachinesCountAggregateOutputType = {
    id: number;
    tenant_id: number;
    farm_id: number;
    name: number;
    display_name: number;
    device_id: number;
    created_at: number;
    aws_iot_thing_name: number;
    status: number;
    last_seen_at: number;
    current_wifi_ssid: number;
    _all: number;
};
export type MachinesMinAggregateInputType = {
    id?: true;
    tenant_id?: true;
    farm_id?: true;
    name?: true;
    display_name?: true;
    device_id?: true;
    created_at?: true;
    aws_iot_thing_name?: true;
    status?: true;
    last_seen_at?: true;
    current_wifi_ssid?: true;
};
export type MachinesMaxAggregateInputType = {
    id?: true;
    tenant_id?: true;
    farm_id?: true;
    name?: true;
    display_name?: true;
    device_id?: true;
    created_at?: true;
    aws_iot_thing_name?: true;
    status?: true;
    last_seen_at?: true;
    current_wifi_ssid?: true;
};
export type MachinesCountAggregateInputType = {
    id?: true;
    tenant_id?: true;
    farm_id?: true;
    name?: true;
    display_name?: true;
    device_id?: true;
    created_at?: true;
    aws_iot_thing_name?: true;
    status?: true;
    last_seen_at?: true;
    current_wifi_ssid?: true;
    _all?: true;
};
export type MachinesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which machines to aggregate.
     */
    where?: Prisma.machinesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of machines to fetch.
     */
    orderBy?: Prisma.machinesOrderByWithRelationInput | Prisma.machinesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.machinesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` machines from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` machines.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned machines
    **/
    _count?: true | MachinesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MachinesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MachinesMaxAggregateInputType;
};
export type GetMachinesAggregateType<T extends MachinesAggregateArgs> = {
    [P in keyof T & keyof AggregateMachines]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMachines[P]> : Prisma.GetScalarType<T[P], AggregateMachines[P]>;
};
export type machinesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.machinesWhereInput;
    orderBy?: Prisma.machinesOrderByWithAggregationInput | Prisma.machinesOrderByWithAggregationInput[];
    by: Prisma.MachinesScalarFieldEnum[] | Prisma.MachinesScalarFieldEnum;
    having?: Prisma.machinesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MachinesCountAggregateInputType | true;
    _min?: MachinesMinAggregateInputType;
    _max?: MachinesMaxAggregateInputType;
};
export type MachinesGroupByOutputType = {
    id: string;
    tenant_id: string | null;
    farm_id: string | null;
    name: string;
    display_name: string | null;
    device_id: string;
    created_at: Date | null;
    aws_iot_thing_name: string | null;
    status: string | null;
    last_seen_at: Date | null;
    current_wifi_ssid: string | null;
    _count: MachinesCountAggregateOutputType | null;
    _min: MachinesMinAggregateOutputType | null;
    _max: MachinesMaxAggregateOutputType | null;
};
type GetMachinesGroupByPayload<T extends machinesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MachinesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MachinesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MachinesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MachinesGroupByOutputType[P]>;
}>>;
export type machinesWhereInput = {
    AND?: Prisma.machinesWhereInput | Prisma.machinesWhereInput[];
    OR?: Prisma.machinesWhereInput[];
    NOT?: Prisma.machinesWhereInput | Prisma.machinesWhereInput[];
    id?: Prisma.UuidFilter<"machines"> | string;
    tenant_id?: Prisma.UuidNullableFilter<"machines"> | string | null;
    farm_id?: Prisma.UuidNullableFilter<"machines"> | string | null;
    name?: Prisma.StringFilter<"machines"> | string;
    display_name?: Prisma.StringNullableFilter<"machines"> | string | null;
    device_id?: Prisma.StringFilter<"machines"> | string;
    created_at?: Prisma.DateTimeNullableFilter<"machines"> | Date | string | null;
    aws_iot_thing_name?: Prisma.StringNullableFilter<"machines"> | string | null;
    status?: Prisma.StringNullableFilter<"machines"> | string | null;
    last_seen_at?: Prisma.DateTimeNullableFilter<"machines"> | Date | string | null;
    current_wifi_ssid?: Prisma.StringNullableFilter<"machines"> | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    tenants?: Prisma.XOR<Prisma.TenantsNullableScalarRelationFilter, Prisma.tenantsWhereInput> | null;
};
export type machinesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tenant_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    display_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    device_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    aws_iot_thing_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    last_seen_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    current_wifi_ssid?: Prisma.SortOrderInput | Prisma.SortOrder;
    farms?: Prisma.farmsOrderByWithRelationInput;
    tenants?: Prisma.tenantsOrderByWithRelationInput;
};
export type machinesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    aws_iot_thing_name?: string;
    AND?: Prisma.machinesWhereInput | Prisma.machinesWhereInput[];
    OR?: Prisma.machinesWhereInput[];
    NOT?: Prisma.machinesWhereInput | Prisma.machinesWhereInput[];
    tenant_id?: Prisma.UuidNullableFilter<"machines"> | string | null;
    farm_id?: Prisma.UuidNullableFilter<"machines"> | string | null;
    name?: Prisma.StringFilter<"machines"> | string;
    display_name?: Prisma.StringNullableFilter<"machines"> | string | null;
    device_id?: Prisma.StringFilter<"machines"> | string;
    created_at?: Prisma.DateTimeNullableFilter<"machines"> | Date | string | null;
    status?: Prisma.StringNullableFilter<"machines"> | string | null;
    last_seen_at?: Prisma.DateTimeNullableFilter<"machines"> | Date | string | null;
    current_wifi_ssid?: Prisma.StringNullableFilter<"machines"> | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    tenants?: Prisma.XOR<Prisma.TenantsNullableScalarRelationFilter, Prisma.tenantsWhereInput> | null;
}, "id" | "aws_iot_thing_name">;
export type machinesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tenant_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    display_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    device_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    aws_iot_thing_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    last_seen_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    current_wifi_ssid?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.machinesCountOrderByAggregateInput;
    _max?: Prisma.machinesMaxOrderByAggregateInput;
    _min?: Prisma.machinesMinOrderByAggregateInput;
};
export type machinesScalarWhereWithAggregatesInput = {
    AND?: Prisma.machinesScalarWhereWithAggregatesInput | Prisma.machinesScalarWhereWithAggregatesInput[];
    OR?: Prisma.machinesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.machinesScalarWhereWithAggregatesInput | Prisma.machinesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"machines"> | string;
    tenant_id?: Prisma.UuidNullableWithAggregatesFilter<"machines"> | string | null;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"machines"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"machines"> | string;
    display_name?: Prisma.StringNullableWithAggregatesFilter<"machines"> | string | null;
    device_id?: Prisma.StringWithAggregatesFilter<"machines"> | string;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"machines"> | Date | string | null;
    aws_iot_thing_name?: Prisma.StringNullableWithAggregatesFilter<"machines"> | string | null;
    status?: Prisma.StringNullableWithAggregatesFilter<"machines"> | string | null;
    last_seen_at?: Prisma.DateTimeNullableWithAggregatesFilter<"machines"> | Date | string | null;
    current_wifi_ssid?: Prisma.StringNullableWithAggregatesFilter<"machines"> | string | null;
};
export type machinesCreateInput = {
    id?: string;
    name: string;
    display_name?: string | null;
    device_id: string;
    created_at?: Date | string | null;
    aws_iot_thing_name?: string | null;
    status?: string | null;
    last_seen_at?: Date | string | null;
    current_wifi_ssid?: string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutMachinesInput;
    tenants?: Prisma.tenantsCreateNestedOneWithoutMachinesInput;
};
export type machinesUncheckedCreateInput = {
    id?: string;
    tenant_id?: string | null;
    farm_id?: string | null;
    name: string;
    display_name?: string | null;
    device_id: string;
    created_at?: Date | string | null;
    aws_iot_thing_name?: string | null;
    status?: string | null;
    last_seen_at?: Date | string | null;
    current_wifi_ssid?: string | null;
};
export type machinesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    display_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    device_id?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    aws_iot_thing_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_seen_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    current_wifi_ssid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    farms?: Prisma.farmsUpdateOneWithoutMachinesNestedInput;
    tenants?: Prisma.tenantsUpdateOneWithoutMachinesNestedInput;
};
export type machinesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    display_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    device_id?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    aws_iot_thing_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_seen_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    current_wifi_ssid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type machinesCreateManyInput = {
    id?: string;
    tenant_id?: string | null;
    farm_id?: string | null;
    name: string;
    display_name?: string | null;
    device_id: string;
    created_at?: Date | string | null;
    aws_iot_thing_name?: string | null;
    status?: string | null;
    last_seen_at?: Date | string | null;
    current_wifi_ssid?: string | null;
};
export type machinesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    display_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    device_id?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    aws_iot_thing_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_seen_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    current_wifi_ssid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type machinesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    display_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    device_id?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    aws_iot_thing_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_seen_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    current_wifi_ssid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MachinesListRelationFilter = {
    every?: Prisma.machinesWhereInput;
    some?: Prisma.machinesWhereInput;
    none?: Prisma.machinesWhereInput;
};
export type machinesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type machinesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenant_id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    display_name?: Prisma.SortOrder;
    device_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    aws_iot_thing_name?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    last_seen_at?: Prisma.SortOrder;
    current_wifi_ssid?: Prisma.SortOrder;
};
export type machinesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenant_id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    display_name?: Prisma.SortOrder;
    device_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    aws_iot_thing_name?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    last_seen_at?: Prisma.SortOrder;
    current_wifi_ssid?: Prisma.SortOrder;
};
export type machinesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tenant_id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    display_name?: Prisma.SortOrder;
    device_id?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    aws_iot_thing_name?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    last_seen_at?: Prisma.SortOrder;
    current_wifi_ssid?: Prisma.SortOrder;
};
export type machinesCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.machinesCreateWithoutFarmsInput, Prisma.machinesUncheckedCreateWithoutFarmsInput> | Prisma.machinesCreateWithoutFarmsInput[] | Prisma.machinesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.machinesCreateOrConnectWithoutFarmsInput | Prisma.machinesCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.machinesCreateManyFarmsInputEnvelope;
    connect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
};
export type machinesUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.machinesCreateWithoutFarmsInput, Prisma.machinesUncheckedCreateWithoutFarmsInput> | Prisma.machinesCreateWithoutFarmsInput[] | Prisma.machinesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.machinesCreateOrConnectWithoutFarmsInput | Prisma.machinesCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.machinesCreateManyFarmsInputEnvelope;
    connect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
};
export type machinesUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.machinesCreateWithoutFarmsInput, Prisma.machinesUncheckedCreateWithoutFarmsInput> | Prisma.machinesCreateWithoutFarmsInput[] | Prisma.machinesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.machinesCreateOrConnectWithoutFarmsInput | Prisma.machinesCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.machinesUpsertWithWhereUniqueWithoutFarmsInput | Prisma.machinesUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.machinesCreateManyFarmsInputEnvelope;
    set?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    disconnect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    delete?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    connect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    update?: Prisma.machinesUpdateWithWhereUniqueWithoutFarmsInput | Prisma.machinesUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.machinesUpdateManyWithWhereWithoutFarmsInput | Prisma.machinesUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.machinesScalarWhereInput | Prisma.machinesScalarWhereInput[];
};
export type machinesUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.machinesCreateWithoutFarmsInput, Prisma.machinesUncheckedCreateWithoutFarmsInput> | Prisma.machinesCreateWithoutFarmsInput[] | Prisma.machinesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.machinesCreateOrConnectWithoutFarmsInput | Prisma.machinesCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.machinesUpsertWithWhereUniqueWithoutFarmsInput | Prisma.machinesUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.machinesCreateManyFarmsInputEnvelope;
    set?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    disconnect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    delete?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    connect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    update?: Prisma.machinesUpdateWithWhereUniqueWithoutFarmsInput | Prisma.machinesUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.machinesUpdateManyWithWhereWithoutFarmsInput | Prisma.machinesUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.machinesScalarWhereInput | Prisma.machinesScalarWhereInput[];
};
export type machinesCreateNestedManyWithoutTenantsInput = {
    create?: Prisma.XOR<Prisma.machinesCreateWithoutTenantsInput, Prisma.machinesUncheckedCreateWithoutTenantsInput> | Prisma.machinesCreateWithoutTenantsInput[] | Prisma.machinesUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.machinesCreateOrConnectWithoutTenantsInput | Prisma.machinesCreateOrConnectWithoutTenantsInput[];
    createMany?: Prisma.machinesCreateManyTenantsInputEnvelope;
    connect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
};
export type machinesUncheckedCreateNestedManyWithoutTenantsInput = {
    create?: Prisma.XOR<Prisma.machinesCreateWithoutTenantsInput, Prisma.machinesUncheckedCreateWithoutTenantsInput> | Prisma.machinesCreateWithoutTenantsInput[] | Prisma.machinesUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.machinesCreateOrConnectWithoutTenantsInput | Prisma.machinesCreateOrConnectWithoutTenantsInput[];
    createMany?: Prisma.machinesCreateManyTenantsInputEnvelope;
    connect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
};
export type machinesUpdateManyWithoutTenantsNestedInput = {
    create?: Prisma.XOR<Prisma.machinesCreateWithoutTenantsInput, Prisma.machinesUncheckedCreateWithoutTenantsInput> | Prisma.machinesCreateWithoutTenantsInput[] | Prisma.machinesUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.machinesCreateOrConnectWithoutTenantsInput | Prisma.machinesCreateOrConnectWithoutTenantsInput[];
    upsert?: Prisma.machinesUpsertWithWhereUniqueWithoutTenantsInput | Prisma.machinesUpsertWithWhereUniqueWithoutTenantsInput[];
    createMany?: Prisma.machinesCreateManyTenantsInputEnvelope;
    set?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    disconnect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    delete?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    connect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    update?: Prisma.machinesUpdateWithWhereUniqueWithoutTenantsInput | Prisma.machinesUpdateWithWhereUniqueWithoutTenantsInput[];
    updateMany?: Prisma.machinesUpdateManyWithWhereWithoutTenantsInput | Prisma.machinesUpdateManyWithWhereWithoutTenantsInput[];
    deleteMany?: Prisma.machinesScalarWhereInput | Prisma.machinesScalarWhereInput[];
};
export type machinesUncheckedUpdateManyWithoutTenantsNestedInput = {
    create?: Prisma.XOR<Prisma.machinesCreateWithoutTenantsInput, Prisma.machinesUncheckedCreateWithoutTenantsInput> | Prisma.machinesCreateWithoutTenantsInput[] | Prisma.machinesUncheckedCreateWithoutTenantsInput[];
    connectOrCreate?: Prisma.machinesCreateOrConnectWithoutTenantsInput | Prisma.machinesCreateOrConnectWithoutTenantsInput[];
    upsert?: Prisma.machinesUpsertWithWhereUniqueWithoutTenantsInput | Prisma.machinesUpsertWithWhereUniqueWithoutTenantsInput[];
    createMany?: Prisma.machinesCreateManyTenantsInputEnvelope;
    set?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    disconnect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    delete?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    connect?: Prisma.machinesWhereUniqueInput | Prisma.machinesWhereUniqueInput[];
    update?: Prisma.machinesUpdateWithWhereUniqueWithoutTenantsInput | Prisma.machinesUpdateWithWhereUniqueWithoutTenantsInput[];
    updateMany?: Prisma.machinesUpdateManyWithWhereWithoutTenantsInput | Prisma.machinesUpdateManyWithWhereWithoutTenantsInput[];
    deleteMany?: Prisma.machinesScalarWhereInput | Prisma.machinesScalarWhereInput[];
};
export type machinesCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    display_name?: string | null;
    device_id: string;
    created_at?: Date | string | null;
    aws_iot_thing_name?: string | null;
    status?: string | null;
    last_seen_at?: Date | string | null;
    current_wifi_ssid?: string | null;
    tenants?: Prisma.tenantsCreateNestedOneWithoutMachinesInput;
};
export type machinesUncheckedCreateWithoutFarmsInput = {
    id?: string;
    tenant_id?: string | null;
    name: string;
    display_name?: string | null;
    device_id: string;
    created_at?: Date | string | null;
    aws_iot_thing_name?: string | null;
    status?: string | null;
    last_seen_at?: Date | string | null;
    current_wifi_ssid?: string | null;
};
export type machinesCreateOrConnectWithoutFarmsInput = {
    where: Prisma.machinesWhereUniqueInput;
    create: Prisma.XOR<Prisma.machinesCreateWithoutFarmsInput, Prisma.machinesUncheckedCreateWithoutFarmsInput>;
};
export type machinesCreateManyFarmsInputEnvelope = {
    data: Prisma.machinesCreateManyFarmsInput | Prisma.machinesCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type machinesUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.machinesWhereUniqueInput;
    update: Prisma.XOR<Prisma.machinesUpdateWithoutFarmsInput, Prisma.machinesUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.machinesCreateWithoutFarmsInput, Prisma.machinesUncheckedCreateWithoutFarmsInput>;
};
export type machinesUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.machinesWhereUniqueInput;
    data: Prisma.XOR<Prisma.machinesUpdateWithoutFarmsInput, Prisma.machinesUncheckedUpdateWithoutFarmsInput>;
};
export type machinesUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.machinesScalarWhereInput;
    data: Prisma.XOR<Prisma.machinesUpdateManyMutationInput, Prisma.machinesUncheckedUpdateManyWithoutFarmsInput>;
};
export type machinesScalarWhereInput = {
    AND?: Prisma.machinesScalarWhereInput | Prisma.machinesScalarWhereInput[];
    OR?: Prisma.machinesScalarWhereInput[];
    NOT?: Prisma.machinesScalarWhereInput | Prisma.machinesScalarWhereInput[];
    id?: Prisma.UuidFilter<"machines"> | string;
    tenant_id?: Prisma.UuidNullableFilter<"machines"> | string | null;
    farm_id?: Prisma.UuidNullableFilter<"machines"> | string | null;
    name?: Prisma.StringFilter<"machines"> | string;
    display_name?: Prisma.StringNullableFilter<"machines"> | string | null;
    device_id?: Prisma.StringFilter<"machines"> | string;
    created_at?: Prisma.DateTimeNullableFilter<"machines"> | Date | string | null;
    aws_iot_thing_name?: Prisma.StringNullableFilter<"machines"> | string | null;
    status?: Prisma.StringNullableFilter<"machines"> | string | null;
    last_seen_at?: Prisma.DateTimeNullableFilter<"machines"> | Date | string | null;
    current_wifi_ssid?: Prisma.StringNullableFilter<"machines"> | string | null;
};
export type machinesCreateWithoutTenantsInput = {
    id?: string;
    name: string;
    display_name?: string | null;
    device_id: string;
    created_at?: Date | string | null;
    aws_iot_thing_name?: string | null;
    status?: string | null;
    last_seen_at?: Date | string | null;
    current_wifi_ssid?: string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutMachinesInput;
};
export type machinesUncheckedCreateWithoutTenantsInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    display_name?: string | null;
    device_id: string;
    created_at?: Date | string | null;
    aws_iot_thing_name?: string | null;
    status?: string | null;
    last_seen_at?: Date | string | null;
    current_wifi_ssid?: string | null;
};
export type machinesCreateOrConnectWithoutTenantsInput = {
    where: Prisma.machinesWhereUniqueInput;
    create: Prisma.XOR<Prisma.machinesCreateWithoutTenantsInput, Prisma.machinesUncheckedCreateWithoutTenantsInput>;
};
export type machinesCreateManyTenantsInputEnvelope = {
    data: Prisma.machinesCreateManyTenantsInput | Prisma.machinesCreateManyTenantsInput[];
    skipDuplicates?: boolean;
};
export type machinesUpsertWithWhereUniqueWithoutTenantsInput = {
    where: Prisma.machinesWhereUniqueInput;
    update: Prisma.XOR<Prisma.machinesUpdateWithoutTenantsInput, Prisma.machinesUncheckedUpdateWithoutTenantsInput>;
    create: Prisma.XOR<Prisma.machinesCreateWithoutTenantsInput, Prisma.machinesUncheckedCreateWithoutTenantsInput>;
};
export type machinesUpdateWithWhereUniqueWithoutTenantsInput = {
    where: Prisma.machinesWhereUniqueInput;
    data: Prisma.XOR<Prisma.machinesUpdateWithoutTenantsInput, Prisma.machinesUncheckedUpdateWithoutTenantsInput>;
};
export type machinesUpdateManyWithWhereWithoutTenantsInput = {
    where: Prisma.machinesScalarWhereInput;
    data: Prisma.XOR<Prisma.machinesUpdateManyMutationInput, Prisma.machinesUncheckedUpdateManyWithoutTenantsInput>;
};
export type machinesCreateManyFarmsInput = {
    id?: string;
    tenant_id?: string | null;
    name: string;
    display_name?: string | null;
    device_id: string;
    created_at?: Date | string | null;
    aws_iot_thing_name?: string | null;
    status?: string | null;
    last_seen_at?: Date | string | null;
    current_wifi_ssid?: string | null;
};
export type machinesUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    display_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    device_id?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    aws_iot_thing_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_seen_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    current_wifi_ssid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tenants?: Prisma.tenantsUpdateOneWithoutMachinesNestedInput;
};
export type machinesUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    display_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    device_id?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    aws_iot_thing_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_seen_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    current_wifi_ssid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type machinesUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tenant_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    display_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    device_id?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    aws_iot_thing_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_seen_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    current_wifi_ssid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type machinesCreateManyTenantsInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    display_name?: string | null;
    device_id: string;
    created_at?: Date | string | null;
    aws_iot_thing_name?: string | null;
    status?: string | null;
    last_seen_at?: Date | string | null;
    current_wifi_ssid?: string | null;
};
export type machinesUpdateWithoutTenantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    display_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    device_id?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    aws_iot_thing_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_seen_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    current_wifi_ssid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    farms?: Prisma.farmsUpdateOneWithoutMachinesNestedInput;
};
export type machinesUncheckedUpdateWithoutTenantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    display_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    device_id?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    aws_iot_thing_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_seen_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    current_wifi_ssid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type machinesUncheckedUpdateManyWithoutTenantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    display_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    device_id?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    aws_iot_thing_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    last_seen_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    current_wifi_ssid?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type machinesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenant_id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    display_name?: boolean;
    device_id?: boolean;
    created_at?: boolean;
    aws_iot_thing_name?: boolean;
    status?: boolean;
    last_seen_at?: boolean;
    current_wifi_ssid?: boolean;
    farms?: boolean | Prisma.machines$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.machines$tenantsArgs<ExtArgs>;
}, ExtArgs["result"]["machines"]>;
export type machinesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenant_id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    display_name?: boolean;
    device_id?: boolean;
    created_at?: boolean;
    aws_iot_thing_name?: boolean;
    status?: boolean;
    last_seen_at?: boolean;
    current_wifi_ssid?: boolean;
    farms?: boolean | Prisma.machines$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.machines$tenantsArgs<ExtArgs>;
}, ExtArgs["result"]["machines"]>;
export type machinesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tenant_id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    display_name?: boolean;
    device_id?: boolean;
    created_at?: boolean;
    aws_iot_thing_name?: boolean;
    status?: boolean;
    last_seen_at?: boolean;
    current_wifi_ssid?: boolean;
    farms?: boolean | Prisma.machines$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.machines$tenantsArgs<ExtArgs>;
}, ExtArgs["result"]["machines"]>;
export type machinesSelectScalar = {
    id?: boolean;
    tenant_id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    display_name?: boolean;
    device_id?: boolean;
    created_at?: boolean;
    aws_iot_thing_name?: boolean;
    status?: boolean;
    last_seen_at?: boolean;
    current_wifi_ssid?: boolean;
};
export type machinesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tenant_id" | "farm_id" | "name" | "display_name" | "device_id" | "created_at" | "aws_iot_thing_name" | "status" | "last_seen_at" | "current_wifi_ssid", ExtArgs["result"]["machines"]>;
export type machinesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.machines$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.machines$tenantsArgs<ExtArgs>;
};
export type machinesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.machines$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.machines$tenantsArgs<ExtArgs>;
};
export type machinesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.machines$farmsArgs<ExtArgs>;
    tenants?: boolean | Prisma.machines$tenantsArgs<ExtArgs>;
};
export type $machinesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "machines";
    objects: {
        farms: Prisma.$farmsPayload<ExtArgs> | null;
        tenants: Prisma.$tenantsPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tenant_id: string | null;
        farm_id: string | null;
        name: string;
        display_name: string | null;
        device_id: string;
        created_at: Date | null;
        aws_iot_thing_name: string | null;
        status: string | null;
        last_seen_at: Date | null;
        current_wifi_ssid: string | null;
    }, ExtArgs["result"]["machines"]>;
    composites: {};
};
export type machinesGetPayload<S extends boolean | null | undefined | machinesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$machinesPayload, S>;
export type machinesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<machinesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MachinesCountAggregateInputType | true;
};
export interface machinesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['machines'];
        meta: {
            name: 'machines';
        };
    };
    /**
     * Find zero or one Machines that matches the filter.
     * @param {machinesFindUniqueArgs} args - Arguments to find a Machines
     * @example
     * // Get one Machines
     * const machines = await prisma.machines.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends machinesFindUniqueArgs>(args: Prisma.SelectSubset<T, machinesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__machinesClient<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Machines that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {machinesFindUniqueOrThrowArgs} args - Arguments to find a Machines
     * @example
     * // Get one Machines
     * const machines = await prisma.machines.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends machinesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, machinesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__machinesClient<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Machines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {machinesFindFirstArgs} args - Arguments to find a Machines
     * @example
     * // Get one Machines
     * const machines = await prisma.machines.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends machinesFindFirstArgs>(args?: Prisma.SelectSubset<T, machinesFindFirstArgs<ExtArgs>>): Prisma.Prisma__machinesClient<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Machines that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {machinesFindFirstOrThrowArgs} args - Arguments to find a Machines
     * @example
     * // Get one Machines
     * const machines = await prisma.machines.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends machinesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, machinesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__machinesClient<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Machines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {machinesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Machines
     * const machines = await prisma.machines.findMany()
     *
     * // Get first 10 Machines
     * const machines = await prisma.machines.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const machinesWithIdOnly = await prisma.machines.findMany({ select: { id: true } })
     *
     */
    findMany<T extends machinesFindManyArgs>(args?: Prisma.SelectSubset<T, machinesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Machines.
     * @param {machinesCreateArgs} args - Arguments to create a Machines.
     * @example
     * // Create one Machines
     * const Machines = await prisma.machines.create({
     *   data: {
     *     // ... data to create a Machines
     *   }
     * })
     *
     */
    create<T extends machinesCreateArgs>(args: Prisma.SelectSubset<T, machinesCreateArgs<ExtArgs>>): Prisma.Prisma__machinesClient<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Machines.
     * @param {machinesCreateManyArgs} args - Arguments to create many Machines.
     * @example
     * // Create many Machines
     * const machines = await prisma.machines.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends machinesCreateManyArgs>(args?: Prisma.SelectSubset<T, machinesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Machines and returns the data saved in the database.
     * @param {machinesCreateManyAndReturnArgs} args - Arguments to create many Machines.
     * @example
     * // Create many Machines
     * const machines = await prisma.machines.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Machines and only return the `id`
     * const machinesWithIdOnly = await prisma.machines.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends machinesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, machinesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Machines.
     * @param {machinesDeleteArgs} args - Arguments to delete one Machines.
     * @example
     * // Delete one Machines
     * const Machines = await prisma.machines.delete({
     *   where: {
     *     // ... filter to delete one Machines
     *   }
     * })
     *
     */
    delete<T extends machinesDeleteArgs>(args: Prisma.SelectSubset<T, machinesDeleteArgs<ExtArgs>>): Prisma.Prisma__machinesClient<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Machines.
     * @param {machinesUpdateArgs} args - Arguments to update one Machines.
     * @example
     * // Update one Machines
     * const machines = await prisma.machines.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends machinesUpdateArgs>(args: Prisma.SelectSubset<T, machinesUpdateArgs<ExtArgs>>): Prisma.Prisma__machinesClient<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Machines.
     * @param {machinesDeleteManyArgs} args - Arguments to filter Machines to delete.
     * @example
     * // Delete a few Machines
     * const { count } = await prisma.machines.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends machinesDeleteManyArgs>(args?: Prisma.SelectSubset<T, machinesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Machines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {machinesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Machines
     * const machines = await prisma.machines.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends machinesUpdateManyArgs>(args: Prisma.SelectSubset<T, machinesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Machines and returns the data updated in the database.
     * @param {machinesUpdateManyAndReturnArgs} args - Arguments to update many Machines.
     * @example
     * // Update many Machines
     * const machines = await prisma.machines.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Machines and only return the `id`
     * const machinesWithIdOnly = await prisma.machines.updateManyAndReturn({
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
    updateManyAndReturn<T extends machinesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, machinesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Machines.
     * @param {machinesUpsertArgs} args - Arguments to update or create a Machines.
     * @example
     * // Update or create a Machines
     * const machines = await prisma.machines.upsert({
     *   create: {
     *     // ... data to create a Machines
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Machines we want to update
     *   }
     * })
     */
    upsert<T extends machinesUpsertArgs>(args: Prisma.SelectSubset<T, machinesUpsertArgs<ExtArgs>>): Prisma.Prisma__machinesClient<runtime.Types.Result.GetResult<Prisma.$machinesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Machines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {machinesCountArgs} args - Arguments to filter Machines to count.
     * @example
     * // Count the number of Machines
     * const count = await prisma.machines.count({
     *   where: {
     *     // ... the filter for the Machines we want to count
     *   }
     * })
    **/
    count<T extends machinesCountArgs>(args?: Prisma.Subset<T, machinesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MachinesCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Machines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MachinesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MachinesAggregateArgs>(args: Prisma.Subset<T, MachinesAggregateArgs>): Prisma.PrismaPromise<GetMachinesAggregateType<T>>;
    /**
     * Group by Machines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {machinesGroupByArgs} args - Group by arguments.
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
    groupBy<T extends machinesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: machinesGroupByArgs['orderBy'];
    } : {
        orderBy?: machinesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, machinesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMachinesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the machines model
     */
    readonly fields: machinesFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for machines.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__machinesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farms<T extends Prisma.machines$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.machines$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    tenants<T extends Prisma.machines$tenantsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.machines$tenantsArgs<ExtArgs>>): Prisma.Prisma__tenantsClient<runtime.Types.Result.GetResult<Prisma.$tenantsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the machines model
 */
export interface machinesFieldRefs {
    readonly id: Prisma.FieldRef<"machines", 'String'>;
    readonly tenant_id: Prisma.FieldRef<"machines", 'String'>;
    readonly farm_id: Prisma.FieldRef<"machines", 'String'>;
    readonly name: Prisma.FieldRef<"machines", 'String'>;
    readonly display_name: Prisma.FieldRef<"machines", 'String'>;
    readonly device_id: Prisma.FieldRef<"machines", 'String'>;
    readonly created_at: Prisma.FieldRef<"machines", 'DateTime'>;
    readonly aws_iot_thing_name: Prisma.FieldRef<"machines", 'String'>;
    readonly status: Prisma.FieldRef<"machines", 'String'>;
    readonly last_seen_at: Prisma.FieldRef<"machines", 'DateTime'>;
    readonly current_wifi_ssid: Prisma.FieldRef<"machines", 'String'>;
}
/**
 * machines findUnique
 */
export type machinesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which machines to fetch.
     */
    where: Prisma.machinesWhereUniqueInput;
};
/**
 * machines findUniqueOrThrow
 */
export type machinesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which machines to fetch.
     */
    where: Prisma.machinesWhereUniqueInput;
};
/**
 * machines findFirst
 */
export type machinesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which machines to fetch.
     */
    where?: Prisma.machinesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of machines to fetch.
     */
    orderBy?: Prisma.machinesOrderByWithRelationInput | Prisma.machinesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for machines.
     */
    cursor?: Prisma.machinesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` machines from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` machines.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of machines.
     */
    distinct?: Prisma.MachinesScalarFieldEnum | Prisma.MachinesScalarFieldEnum[];
};
/**
 * machines findFirstOrThrow
 */
export type machinesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which machines to fetch.
     */
    where?: Prisma.machinesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of machines to fetch.
     */
    orderBy?: Prisma.machinesOrderByWithRelationInput | Prisma.machinesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for machines.
     */
    cursor?: Prisma.machinesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` machines from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` machines.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of machines.
     */
    distinct?: Prisma.MachinesScalarFieldEnum | Prisma.MachinesScalarFieldEnum[];
};
/**
 * machines findMany
 */
export type machinesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which machines to fetch.
     */
    where?: Prisma.machinesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of machines to fetch.
     */
    orderBy?: Prisma.machinesOrderByWithRelationInput | Prisma.machinesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing machines.
     */
    cursor?: Prisma.machinesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` machines from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` machines.
     */
    skip?: number;
    distinct?: Prisma.MachinesScalarFieldEnum | Prisma.MachinesScalarFieldEnum[];
};
/**
 * machines create
 */
export type machinesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a machines.
     */
    data: Prisma.XOR<Prisma.machinesCreateInput, Prisma.machinesUncheckedCreateInput>;
};
/**
 * machines createMany
 */
export type machinesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many machines.
     */
    data: Prisma.machinesCreateManyInput | Prisma.machinesCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * machines createManyAndReturn
 */
export type machinesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the machines
     */
    select?: Prisma.machinesSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the machines
     */
    omit?: Prisma.machinesOmit<ExtArgs> | null;
    /**
     * The data used to create many machines.
     */
    data: Prisma.machinesCreateManyInput | Prisma.machinesCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.machinesIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * machines update
 */
export type machinesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a machines.
     */
    data: Prisma.XOR<Prisma.machinesUpdateInput, Prisma.machinesUncheckedUpdateInput>;
    /**
     * Choose, which machines to update.
     */
    where: Prisma.machinesWhereUniqueInput;
};
/**
 * machines updateMany
 */
export type machinesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update machines.
     */
    data: Prisma.XOR<Prisma.machinesUpdateManyMutationInput, Prisma.machinesUncheckedUpdateManyInput>;
    /**
     * Filter which machines to update
     */
    where?: Prisma.machinesWhereInput;
    /**
     * Limit how many machines to update.
     */
    limit?: number;
};
/**
 * machines updateManyAndReturn
 */
export type machinesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the machines
     */
    select?: Prisma.machinesSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the machines
     */
    omit?: Prisma.machinesOmit<ExtArgs> | null;
    /**
     * The data used to update machines.
     */
    data: Prisma.XOR<Prisma.machinesUpdateManyMutationInput, Prisma.machinesUncheckedUpdateManyInput>;
    /**
     * Filter which machines to update
     */
    where?: Prisma.machinesWhereInput;
    /**
     * Limit how many machines to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.machinesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * machines upsert
 */
export type machinesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the machines to update in case it exists.
     */
    where: Prisma.machinesWhereUniqueInput;
    /**
     * In case the machines found by the `where` argument doesn't exist, create a new machines with this data.
     */
    create: Prisma.XOR<Prisma.machinesCreateInput, Prisma.machinesUncheckedCreateInput>;
    /**
     * In case the machines was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.machinesUpdateInput, Prisma.machinesUncheckedUpdateInput>;
};
/**
 * machines delete
 */
export type machinesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which machines to delete.
     */
    where: Prisma.machinesWhereUniqueInput;
};
/**
 * machines deleteMany
 */
export type machinesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which machines to delete
     */
    where?: Prisma.machinesWhereInput;
    /**
     * Limit how many machines to delete.
     */
    limit?: number;
};
/**
 * machines.farms
 */
export type machines$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * machines.tenants
 */
export type machines$tenantsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * machines without action
 */
export type machinesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=machines.d.ts.map