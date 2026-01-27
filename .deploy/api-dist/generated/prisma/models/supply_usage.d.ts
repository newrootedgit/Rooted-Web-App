import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model supply_usage
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type supply_usageModel = runtime.Types.Result.DefaultSelection<Prisma.$supply_usagePayload>;
export type AggregateSupply_usage = {
    _count: Supply_usageCountAggregateOutputType | null;
    _avg: Supply_usageAvgAggregateOutputType | null;
    _sum: Supply_usageSumAggregateOutputType | null;
    _min: Supply_usageMinAggregateOutputType | null;
    _max: Supply_usageMaxAggregateOutputType | null;
};
export type Supply_usageAvgAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type Supply_usageSumAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type Supply_usageMinAggregateOutputType = {
    id: string | null;
    supply_id: string | null;
    task_id: string | null;
    quantity: runtime.Decimal | null;
    usage_type: string | null;
    notes: string | null;
    created_at: Date | null;
};
export type Supply_usageMaxAggregateOutputType = {
    id: string | null;
    supply_id: string | null;
    task_id: string | null;
    quantity: runtime.Decimal | null;
    usage_type: string | null;
    notes: string | null;
    created_at: Date | null;
};
export type Supply_usageCountAggregateOutputType = {
    id: number;
    supply_id: number;
    task_id: number;
    quantity: number;
    usage_type: number;
    notes: number;
    created_at: number;
    _all: number;
};
export type Supply_usageAvgAggregateInputType = {
    quantity?: true;
};
export type Supply_usageSumAggregateInputType = {
    quantity?: true;
};
export type Supply_usageMinAggregateInputType = {
    id?: true;
    supply_id?: true;
    task_id?: true;
    quantity?: true;
    usage_type?: true;
    notes?: true;
    created_at?: true;
};
export type Supply_usageMaxAggregateInputType = {
    id?: true;
    supply_id?: true;
    task_id?: true;
    quantity?: true;
    usage_type?: true;
    notes?: true;
    created_at?: true;
};
export type Supply_usageCountAggregateInputType = {
    id?: true;
    supply_id?: true;
    task_id?: true;
    quantity?: true;
    usage_type?: true;
    notes?: true;
    created_at?: true;
    _all?: true;
};
export type Supply_usageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which supply_usage to aggregate.
     */
    where?: Prisma.supply_usageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_usages to fetch.
     */
    orderBy?: Prisma.supply_usageOrderByWithRelationInput | Prisma.supply_usageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.supply_usageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_usages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_usages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned supply_usages
    **/
    _count?: true | Supply_usageCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Supply_usageAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Supply_usageSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Supply_usageMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Supply_usageMaxAggregateInputType;
};
export type GetSupply_usageAggregateType<T extends Supply_usageAggregateArgs> = {
    [P in keyof T & keyof AggregateSupply_usage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSupply_usage[P]> : Prisma.GetScalarType<T[P], AggregateSupply_usage[P]>;
};
export type supply_usageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.supply_usageWhereInput;
    orderBy?: Prisma.supply_usageOrderByWithAggregationInput | Prisma.supply_usageOrderByWithAggregationInput[];
    by: Prisma.Supply_usageScalarFieldEnum[] | Prisma.Supply_usageScalarFieldEnum;
    having?: Prisma.supply_usageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Supply_usageCountAggregateInputType | true;
    _avg?: Supply_usageAvgAggregateInputType;
    _sum?: Supply_usageSumAggregateInputType;
    _min?: Supply_usageMinAggregateInputType;
    _max?: Supply_usageMaxAggregateInputType;
};
export type Supply_usageGroupByOutputType = {
    id: string;
    supply_id: string | null;
    task_id: string | null;
    quantity: runtime.Decimal;
    usage_type: string | null;
    notes: string | null;
    created_at: Date | null;
    _count: Supply_usageCountAggregateOutputType | null;
    _avg: Supply_usageAvgAggregateOutputType | null;
    _sum: Supply_usageSumAggregateOutputType | null;
    _min: Supply_usageMinAggregateOutputType | null;
    _max: Supply_usageMaxAggregateOutputType | null;
};
type GetSupply_usageGroupByPayload<T extends supply_usageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Supply_usageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Supply_usageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Supply_usageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Supply_usageGroupByOutputType[P]>;
}>>;
export type supply_usageWhereInput = {
    AND?: Prisma.supply_usageWhereInput | Prisma.supply_usageWhereInput[];
    OR?: Prisma.supply_usageWhereInput[];
    NOT?: Prisma.supply_usageWhereInput | Prisma.supply_usageWhereInput[];
    id?: Prisma.UuidFilter<"supply_usage"> | string;
    supply_id?: Prisma.UuidNullableFilter<"supply_usage"> | string | null;
    task_id?: Prisma.UuidNullableFilter<"supply_usage"> | string | null;
    quantity?: Prisma.DecimalFilter<"supply_usage"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.StringNullableFilter<"supply_usage"> | string | null;
    notes?: Prisma.StringNullableFilter<"supply_usage"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supply_usage"> | Date | string | null;
    supplies?: Prisma.XOR<Prisma.SuppliesNullableScalarRelationFilter, Prisma.suppliesWhereInput> | null;
    tasks?: Prisma.XOR<Prisma.TasksNullableScalarRelationFilter, Prisma.tasksWhereInput> | null;
};
export type supply_usageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    supply_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    task_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    usage_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    supplies?: Prisma.suppliesOrderByWithRelationInput;
    tasks?: Prisma.tasksOrderByWithRelationInput;
};
export type supply_usageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.supply_usageWhereInput | Prisma.supply_usageWhereInput[];
    OR?: Prisma.supply_usageWhereInput[];
    NOT?: Prisma.supply_usageWhereInput | Prisma.supply_usageWhereInput[];
    supply_id?: Prisma.UuidNullableFilter<"supply_usage"> | string | null;
    task_id?: Prisma.UuidNullableFilter<"supply_usage"> | string | null;
    quantity?: Prisma.DecimalFilter<"supply_usage"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.StringNullableFilter<"supply_usage"> | string | null;
    notes?: Prisma.StringNullableFilter<"supply_usage"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supply_usage"> | Date | string | null;
    supplies?: Prisma.XOR<Prisma.SuppliesNullableScalarRelationFilter, Prisma.suppliesWhereInput> | null;
    tasks?: Prisma.XOR<Prisma.TasksNullableScalarRelationFilter, Prisma.tasksWhereInput> | null;
}, "id">;
export type supply_usageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    supply_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    task_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    usage_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.supply_usageCountOrderByAggregateInput;
    _avg?: Prisma.supply_usageAvgOrderByAggregateInput;
    _max?: Prisma.supply_usageMaxOrderByAggregateInput;
    _min?: Prisma.supply_usageMinOrderByAggregateInput;
    _sum?: Prisma.supply_usageSumOrderByAggregateInput;
};
export type supply_usageScalarWhereWithAggregatesInput = {
    AND?: Prisma.supply_usageScalarWhereWithAggregatesInput | Prisma.supply_usageScalarWhereWithAggregatesInput[];
    OR?: Prisma.supply_usageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.supply_usageScalarWhereWithAggregatesInput | Prisma.supply_usageScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"supply_usage"> | string;
    supply_id?: Prisma.UuidNullableWithAggregatesFilter<"supply_usage"> | string | null;
    task_id?: Prisma.UuidNullableWithAggregatesFilter<"supply_usage"> | string | null;
    quantity?: Prisma.DecimalWithAggregatesFilter<"supply_usage"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.StringNullableWithAggregatesFilter<"supply_usage"> | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"supply_usage"> | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"supply_usage"> | Date | string | null;
};
export type supply_usageCreateInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: string | null;
    notes?: string | null;
    created_at?: Date | string | null;
    supplies?: Prisma.suppliesCreateNestedOneWithoutSupply_usageInput;
    tasks?: Prisma.tasksCreateNestedOneWithoutSupply_usageInput;
};
export type supply_usageUncheckedCreateInput = {
    id?: string;
    supply_id?: string | null;
    task_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: string | null;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type supply_usageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supplies?: Prisma.suppliesUpdateOneWithoutSupply_usageNestedInput;
    tasks?: Prisma.tasksUpdateOneWithoutSupply_usageNestedInput;
};
export type supply_usageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supply_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    task_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_usageCreateManyInput = {
    id?: string;
    supply_id?: string | null;
    task_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: string | null;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type supply_usageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_usageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supply_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    task_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type Supply_usageListRelationFilter = {
    every?: Prisma.supply_usageWhereInput;
    some?: Prisma.supply_usageWhereInput;
    none?: Prisma.supply_usageWhereInput;
};
export type supply_usageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type supply_usageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    supply_id?: Prisma.SortOrder;
    task_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    usage_type?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type supply_usageAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type supply_usageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    supply_id?: Prisma.SortOrder;
    task_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    usage_type?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type supply_usageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    supply_id?: Prisma.SortOrder;
    task_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    usage_type?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type supply_usageSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type supply_usageCreateNestedManyWithoutSuppliesInput = {
    create?: Prisma.XOR<Prisma.supply_usageCreateWithoutSuppliesInput, Prisma.supply_usageUncheckedCreateWithoutSuppliesInput> | Prisma.supply_usageCreateWithoutSuppliesInput[] | Prisma.supply_usageUncheckedCreateWithoutSuppliesInput[];
    connectOrCreate?: Prisma.supply_usageCreateOrConnectWithoutSuppliesInput | Prisma.supply_usageCreateOrConnectWithoutSuppliesInput[];
    createMany?: Prisma.supply_usageCreateManySuppliesInputEnvelope;
    connect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
};
export type supply_usageUncheckedCreateNestedManyWithoutSuppliesInput = {
    create?: Prisma.XOR<Prisma.supply_usageCreateWithoutSuppliesInput, Prisma.supply_usageUncheckedCreateWithoutSuppliesInput> | Prisma.supply_usageCreateWithoutSuppliesInput[] | Prisma.supply_usageUncheckedCreateWithoutSuppliesInput[];
    connectOrCreate?: Prisma.supply_usageCreateOrConnectWithoutSuppliesInput | Prisma.supply_usageCreateOrConnectWithoutSuppliesInput[];
    createMany?: Prisma.supply_usageCreateManySuppliesInputEnvelope;
    connect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
};
export type supply_usageUpdateManyWithoutSuppliesNestedInput = {
    create?: Prisma.XOR<Prisma.supply_usageCreateWithoutSuppliesInput, Prisma.supply_usageUncheckedCreateWithoutSuppliesInput> | Prisma.supply_usageCreateWithoutSuppliesInput[] | Prisma.supply_usageUncheckedCreateWithoutSuppliesInput[];
    connectOrCreate?: Prisma.supply_usageCreateOrConnectWithoutSuppliesInput | Prisma.supply_usageCreateOrConnectWithoutSuppliesInput[];
    upsert?: Prisma.supply_usageUpsertWithWhereUniqueWithoutSuppliesInput | Prisma.supply_usageUpsertWithWhereUniqueWithoutSuppliesInput[];
    createMany?: Prisma.supply_usageCreateManySuppliesInputEnvelope;
    set?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    disconnect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    delete?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    connect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    update?: Prisma.supply_usageUpdateWithWhereUniqueWithoutSuppliesInput | Prisma.supply_usageUpdateWithWhereUniqueWithoutSuppliesInput[];
    updateMany?: Prisma.supply_usageUpdateManyWithWhereWithoutSuppliesInput | Prisma.supply_usageUpdateManyWithWhereWithoutSuppliesInput[];
    deleteMany?: Prisma.supply_usageScalarWhereInput | Prisma.supply_usageScalarWhereInput[];
};
export type supply_usageUncheckedUpdateManyWithoutSuppliesNestedInput = {
    create?: Prisma.XOR<Prisma.supply_usageCreateWithoutSuppliesInput, Prisma.supply_usageUncheckedCreateWithoutSuppliesInput> | Prisma.supply_usageCreateWithoutSuppliesInput[] | Prisma.supply_usageUncheckedCreateWithoutSuppliesInput[];
    connectOrCreate?: Prisma.supply_usageCreateOrConnectWithoutSuppliesInput | Prisma.supply_usageCreateOrConnectWithoutSuppliesInput[];
    upsert?: Prisma.supply_usageUpsertWithWhereUniqueWithoutSuppliesInput | Prisma.supply_usageUpsertWithWhereUniqueWithoutSuppliesInput[];
    createMany?: Prisma.supply_usageCreateManySuppliesInputEnvelope;
    set?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    disconnect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    delete?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    connect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    update?: Prisma.supply_usageUpdateWithWhereUniqueWithoutSuppliesInput | Prisma.supply_usageUpdateWithWhereUniqueWithoutSuppliesInput[];
    updateMany?: Prisma.supply_usageUpdateManyWithWhereWithoutSuppliesInput | Prisma.supply_usageUpdateManyWithWhereWithoutSuppliesInput[];
    deleteMany?: Prisma.supply_usageScalarWhereInput | Prisma.supply_usageScalarWhereInput[];
};
export type supply_usageCreateNestedManyWithoutTasksInput = {
    create?: Prisma.XOR<Prisma.supply_usageCreateWithoutTasksInput, Prisma.supply_usageUncheckedCreateWithoutTasksInput> | Prisma.supply_usageCreateWithoutTasksInput[] | Prisma.supply_usageUncheckedCreateWithoutTasksInput[];
    connectOrCreate?: Prisma.supply_usageCreateOrConnectWithoutTasksInput | Prisma.supply_usageCreateOrConnectWithoutTasksInput[];
    createMany?: Prisma.supply_usageCreateManyTasksInputEnvelope;
    connect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
};
export type supply_usageUncheckedCreateNestedManyWithoutTasksInput = {
    create?: Prisma.XOR<Prisma.supply_usageCreateWithoutTasksInput, Prisma.supply_usageUncheckedCreateWithoutTasksInput> | Prisma.supply_usageCreateWithoutTasksInput[] | Prisma.supply_usageUncheckedCreateWithoutTasksInput[];
    connectOrCreate?: Prisma.supply_usageCreateOrConnectWithoutTasksInput | Prisma.supply_usageCreateOrConnectWithoutTasksInput[];
    createMany?: Prisma.supply_usageCreateManyTasksInputEnvelope;
    connect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
};
export type supply_usageUpdateManyWithoutTasksNestedInput = {
    create?: Prisma.XOR<Prisma.supply_usageCreateWithoutTasksInput, Prisma.supply_usageUncheckedCreateWithoutTasksInput> | Prisma.supply_usageCreateWithoutTasksInput[] | Prisma.supply_usageUncheckedCreateWithoutTasksInput[];
    connectOrCreate?: Prisma.supply_usageCreateOrConnectWithoutTasksInput | Prisma.supply_usageCreateOrConnectWithoutTasksInput[];
    upsert?: Prisma.supply_usageUpsertWithWhereUniqueWithoutTasksInput | Prisma.supply_usageUpsertWithWhereUniqueWithoutTasksInput[];
    createMany?: Prisma.supply_usageCreateManyTasksInputEnvelope;
    set?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    disconnect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    delete?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    connect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    update?: Prisma.supply_usageUpdateWithWhereUniqueWithoutTasksInput | Prisma.supply_usageUpdateWithWhereUniqueWithoutTasksInput[];
    updateMany?: Prisma.supply_usageUpdateManyWithWhereWithoutTasksInput | Prisma.supply_usageUpdateManyWithWhereWithoutTasksInput[];
    deleteMany?: Prisma.supply_usageScalarWhereInput | Prisma.supply_usageScalarWhereInput[];
};
export type supply_usageUncheckedUpdateManyWithoutTasksNestedInput = {
    create?: Prisma.XOR<Prisma.supply_usageCreateWithoutTasksInput, Prisma.supply_usageUncheckedCreateWithoutTasksInput> | Prisma.supply_usageCreateWithoutTasksInput[] | Prisma.supply_usageUncheckedCreateWithoutTasksInput[];
    connectOrCreate?: Prisma.supply_usageCreateOrConnectWithoutTasksInput | Prisma.supply_usageCreateOrConnectWithoutTasksInput[];
    upsert?: Prisma.supply_usageUpsertWithWhereUniqueWithoutTasksInput | Prisma.supply_usageUpsertWithWhereUniqueWithoutTasksInput[];
    createMany?: Prisma.supply_usageCreateManyTasksInputEnvelope;
    set?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    disconnect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    delete?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    connect?: Prisma.supply_usageWhereUniqueInput | Prisma.supply_usageWhereUniqueInput[];
    update?: Prisma.supply_usageUpdateWithWhereUniqueWithoutTasksInput | Prisma.supply_usageUpdateWithWhereUniqueWithoutTasksInput[];
    updateMany?: Prisma.supply_usageUpdateManyWithWhereWithoutTasksInput | Prisma.supply_usageUpdateManyWithWhereWithoutTasksInput[];
    deleteMany?: Prisma.supply_usageScalarWhereInput | Prisma.supply_usageScalarWhereInput[];
};
export type supply_usageCreateWithoutSuppliesInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: string | null;
    notes?: string | null;
    created_at?: Date | string | null;
    tasks?: Prisma.tasksCreateNestedOneWithoutSupply_usageInput;
};
export type supply_usageUncheckedCreateWithoutSuppliesInput = {
    id?: string;
    task_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: string | null;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type supply_usageCreateOrConnectWithoutSuppliesInput = {
    where: Prisma.supply_usageWhereUniqueInput;
    create: Prisma.XOR<Prisma.supply_usageCreateWithoutSuppliesInput, Prisma.supply_usageUncheckedCreateWithoutSuppliesInput>;
};
export type supply_usageCreateManySuppliesInputEnvelope = {
    data: Prisma.supply_usageCreateManySuppliesInput | Prisma.supply_usageCreateManySuppliesInput[];
    skipDuplicates?: boolean;
};
export type supply_usageUpsertWithWhereUniqueWithoutSuppliesInput = {
    where: Prisma.supply_usageWhereUniqueInput;
    update: Prisma.XOR<Prisma.supply_usageUpdateWithoutSuppliesInput, Prisma.supply_usageUncheckedUpdateWithoutSuppliesInput>;
    create: Prisma.XOR<Prisma.supply_usageCreateWithoutSuppliesInput, Prisma.supply_usageUncheckedCreateWithoutSuppliesInput>;
};
export type supply_usageUpdateWithWhereUniqueWithoutSuppliesInput = {
    where: Prisma.supply_usageWhereUniqueInput;
    data: Prisma.XOR<Prisma.supply_usageUpdateWithoutSuppliesInput, Prisma.supply_usageUncheckedUpdateWithoutSuppliesInput>;
};
export type supply_usageUpdateManyWithWhereWithoutSuppliesInput = {
    where: Prisma.supply_usageScalarWhereInput;
    data: Prisma.XOR<Prisma.supply_usageUpdateManyMutationInput, Prisma.supply_usageUncheckedUpdateManyWithoutSuppliesInput>;
};
export type supply_usageScalarWhereInput = {
    AND?: Prisma.supply_usageScalarWhereInput | Prisma.supply_usageScalarWhereInput[];
    OR?: Prisma.supply_usageScalarWhereInput[];
    NOT?: Prisma.supply_usageScalarWhereInput | Prisma.supply_usageScalarWhereInput[];
    id?: Prisma.UuidFilter<"supply_usage"> | string;
    supply_id?: Prisma.UuidNullableFilter<"supply_usage"> | string | null;
    task_id?: Prisma.UuidNullableFilter<"supply_usage"> | string | null;
    quantity?: Prisma.DecimalFilter<"supply_usage"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.StringNullableFilter<"supply_usage"> | string | null;
    notes?: Prisma.StringNullableFilter<"supply_usage"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supply_usage"> | Date | string | null;
};
export type supply_usageCreateWithoutTasksInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: string | null;
    notes?: string | null;
    created_at?: Date | string | null;
    supplies?: Prisma.suppliesCreateNestedOneWithoutSupply_usageInput;
};
export type supply_usageUncheckedCreateWithoutTasksInput = {
    id?: string;
    supply_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: string | null;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type supply_usageCreateOrConnectWithoutTasksInput = {
    where: Prisma.supply_usageWhereUniqueInput;
    create: Prisma.XOR<Prisma.supply_usageCreateWithoutTasksInput, Prisma.supply_usageUncheckedCreateWithoutTasksInput>;
};
export type supply_usageCreateManyTasksInputEnvelope = {
    data: Prisma.supply_usageCreateManyTasksInput | Prisma.supply_usageCreateManyTasksInput[];
    skipDuplicates?: boolean;
};
export type supply_usageUpsertWithWhereUniqueWithoutTasksInput = {
    where: Prisma.supply_usageWhereUniqueInput;
    update: Prisma.XOR<Prisma.supply_usageUpdateWithoutTasksInput, Prisma.supply_usageUncheckedUpdateWithoutTasksInput>;
    create: Prisma.XOR<Prisma.supply_usageCreateWithoutTasksInput, Prisma.supply_usageUncheckedCreateWithoutTasksInput>;
};
export type supply_usageUpdateWithWhereUniqueWithoutTasksInput = {
    where: Prisma.supply_usageWhereUniqueInput;
    data: Prisma.XOR<Prisma.supply_usageUpdateWithoutTasksInput, Prisma.supply_usageUncheckedUpdateWithoutTasksInput>;
};
export type supply_usageUpdateManyWithWhereWithoutTasksInput = {
    where: Prisma.supply_usageScalarWhereInput;
    data: Prisma.XOR<Prisma.supply_usageUpdateManyMutationInput, Prisma.supply_usageUncheckedUpdateManyWithoutTasksInput>;
};
export type supply_usageCreateManySuppliesInput = {
    id?: string;
    task_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: string | null;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type supply_usageUpdateWithoutSuppliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tasks?: Prisma.tasksUpdateOneWithoutSupply_usageNestedInput;
};
export type supply_usageUncheckedUpdateWithoutSuppliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    task_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_usageUncheckedUpdateManyWithoutSuppliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    task_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_usageCreateManyTasksInput = {
    id?: string;
    supply_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: string | null;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type supply_usageUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supplies?: Prisma.suppliesUpdateOneWithoutSupply_usageNestedInput;
};
export type supply_usageUncheckedUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supply_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_usageUncheckedUpdateManyWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supply_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    usage_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_usageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    supply_id?: boolean;
    task_id?: boolean;
    quantity?: boolean;
    usage_type?: boolean;
    notes?: boolean;
    created_at?: boolean;
    supplies?: boolean | Prisma.supply_usage$suppliesArgs<ExtArgs>;
    tasks?: boolean | Prisma.supply_usage$tasksArgs<ExtArgs>;
}, ExtArgs["result"]["supply_usage"]>;
export type supply_usageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    supply_id?: boolean;
    task_id?: boolean;
    quantity?: boolean;
    usage_type?: boolean;
    notes?: boolean;
    created_at?: boolean;
    supplies?: boolean | Prisma.supply_usage$suppliesArgs<ExtArgs>;
    tasks?: boolean | Prisma.supply_usage$tasksArgs<ExtArgs>;
}, ExtArgs["result"]["supply_usage"]>;
export type supply_usageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    supply_id?: boolean;
    task_id?: boolean;
    quantity?: boolean;
    usage_type?: boolean;
    notes?: boolean;
    created_at?: boolean;
    supplies?: boolean | Prisma.supply_usage$suppliesArgs<ExtArgs>;
    tasks?: boolean | Prisma.supply_usage$tasksArgs<ExtArgs>;
}, ExtArgs["result"]["supply_usage"]>;
export type supply_usageSelectScalar = {
    id?: boolean;
    supply_id?: boolean;
    task_id?: boolean;
    quantity?: boolean;
    usage_type?: boolean;
    notes?: boolean;
    created_at?: boolean;
};
export type supply_usageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "supply_id" | "task_id" | "quantity" | "usage_type" | "notes" | "created_at", ExtArgs["result"]["supply_usage"]>;
export type supply_usageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplies?: boolean | Prisma.supply_usage$suppliesArgs<ExtArgs>;
    tasks?: boolean | Prisma.supply_usage$tasksArgs<ExtArgs>;
};
export type supply_usageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplies?: boolean | Prisma.supply_usage$suppliesArgs<ExtArgs>;
    tasks?: boolean | Prisma.supply_usage$tasksArgs<ExtArgs>;
};
export type supply_usageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplies?: boolean | Prisma.supply_usage$suppliesArgs<ExtArgs>;
    tasks?: boolean | Prisma.supply_usage$tasksArgs<ExtArgs>;
};
export type $supply_usagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "supply_usage";
    objects: {
        supplies: Prisma.$suppliesPayload<ExtArgs> | null;
        tasks: Prisma.$tasksPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        supply_id: string | null;
        task_id: string | null;
        quantity: runtime.Decimal;
        usage_type: string | null;
        notes: string | null;
        created_at: Date | null;
    }, ExtArgs["result"]["supply_usage"]>;
    composites: {};
};
export type supply_usageGetPayload<S extends boolean | null | undefined | supply_usageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$supply_usagePayload, S>;
export type supply_usageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<supply_usageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Supply_usageCountAggregateInputType | true;
};
export interface supply_usageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['supply_usage'];
        meta: {
            name: 'supply_usage';
        };
    };
    /**
     * Find zero or one Supply_usage that matches the filter.
     * @param {supply_usageFindUniqueArgs} args - Arguments to find a Supply_usage
     * @example
     * // Get one Supply_usage
     * const supply_usage = await prisma.supply_usage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends supply_usageFindUniqueArgs>(args: Prisma.SelectSubset<T, supply_usageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__supply_usageClient<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Supply_usage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {supply_usageFindUniqueOrThrowArgs} args - Arguments to find a Supply_usage
     * @example
     * // Get one Supply_usage
     * const supply_usage = await prisma.supply_usage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends supply_usageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, supply_usageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__supply_usageClient<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Supply_usage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_usageFindFirstArgs} args - Arguments to find a Supply_usage
     * @example
     * // Get one Supply_usage
     * const supply_usage = await prisma.supply_usage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends supply_usageFindFirstArgs>(args?: Prisma.SelectSubset<T, supply_usageFindFirstArgs<ExtArgs>>): Prisma.Prisma__supply_usageClient<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Supply_usage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_usageFindFirstOrThrowArgs} args - Arguments to find a Supply_usage
     * @example
     * // Get one Supply_usage
     * const supply_usage = await prisma.supply_usage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends supply_usageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, supply_usageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__supply_usageClient<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Supply_usages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_usageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Supply_usages
     * const supply_usages = await prisma.supply_usage.findMany()
     *
     * // Get first 10 Supply_usages
     * const supply_usages = await prisma.supply_usage.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const supply_usageWithIdOnly = await prisma.supply_usage.findMany({ select: { id: true } })
     *
     */
    findMany<T extends supply_usageFindManyArgs>(args?: Prisma.SelectSubset<T, supply_usageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Supply_usage.
     * @param {supply_usageCreateArgs} args - Arguments to create a Supply_usage.
     * @example
     * // Create one Supply_usage
     * const Supply_usage = await prisma.supply_usage.create({
     *   data: {
     *     // ... data to create a Supply_usage
     *   }
     * })
     *
     */
    create<T extends supply_usageCreateArgs>(args: Prisma.SelectSubset<T, supply_usageCreateArgs<ExtArgs>>): Prisma.Prisma__supply_usageClient<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Supply_usages.
     * @param {supply_usageCreateManyArgs} args - Arguments to create many Supply_usages.
     * @example
     * // Create many Supply_usages
     * const supply_usage = await prisma.supply_usage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends supply_usageCreateManyArgs>(args?: Prisma.SelectSubset<T, supply_usageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Supply_usages and returns the data saved in the database.
     * @param {supply_usageCreateManyAndReturnArgs} args - Arguments to create many Supply_usages.
     * @example
     * // Create many Supply_usages
     * const supply_usage = await prisma.supply_usage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Supply_usages and only return the `id`
     * const supply_usageWithIdOnly = await prisma.supply_usage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends supply_usageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, supply_usageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Supply_usage.
     * @param {supply_usageDeleteArgs} args - Arguments to delete one Supply_usage.
     * @example
     * // Delete one Supply_usage
     * const Supply_usage = await prisma.supply_usage.delete({
     *   where: {
     *     // ... filter to delete one Supply_usage
     *   }
     * })
     *
     */
    delete<T extends supply_usageDeleteArgs>(args: Prisma.SelectSubset<T, supply_usageDeleteArgs<ExtArgs>>): Prisma.Prisma__supply_usageClient<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Supply_usage.
     * @param {supply_usageUpdateArgs} args - Arguments to update one Supply_usage.
     * @example
     * // Update one Supply_usage
     * const supply_usage = await prisma.supply_usage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends supply_usageUpdateArgs>(args: Prisma.SelectSubset<T, supply_usageUpdateArgs<ExtArgs>>): Prisma.Prisma__supply_usageClient<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Supply_usages.
     * @param {supply_usageDeleteManyArgs} args - Arguments to filter Supply_usages to delete.
     * @example
     * // Delete a few Supply_usages
     * const { count } = await prisma.supply_usage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends supply_usageDeleteManyArgs>(args?: Prisma.SelectSubset<T, supply_usageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Supply_usages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_usageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Supply_usages
     * const supply_usage = await prisma.supply_usage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends supply_usageUpdateManyArgs>(args: Prisma.SelectSubset<T, supply_usageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Supply_usages and returns the data updated in the database.
     * @param {supply_usageUpdateManyAndReturnArgs} args - Arguments to update many Supply_usages.
     * @example
     * // Update many Supply_usages
     * const supply_usage = await prisma.supply_usage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Supply_usages and only return the `id`
     * const supply_usageWithIdOnly = await prisma.supply_usage.updateManyAndReturn({
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
    updateManyAndReturn<T extends supply_usageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, supply_usageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Supply_usage.
     * @param {supply_usageUpsertArgs} args - Arguments to update or create a Supply_usage.
     * @example
     * // Update or create a Supply_usage
     * const supply_usage = await prisma.supply_usage.upsert({
     *   create: {
     *     // ... data to create a Supply_usage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Supply_usage we want to update
     *   }
     * })
     */
    upsert<T extends supply_usageUpsertArgs>(args: Prisma.SelectSubset<T, supply_usageUpsertArgs<ExtArgs>>): Prisma.Prisma__supply_usageClient<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Supply_usages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_usageCountArgs} args - Arguments to filter Supply_usages to count.
     * @example
     * // Count the number of Supply_usages
     * const count = await prisma.supply_usage.count({
     *   where: {
     *     // ... the filter for the Supply_usages we want to count
     *   }
     * })
    **/
    count<T extends supply_usageCountArgs>(args?: Prisma.Subset<T, supply_usageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Supply_usageCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Supply_usage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Supply_usageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Supply_usageAggregateArgs>(args: Prisma.Subset<T, Supply_usageAggregateArgs>): Prisma.PrismaPromise<GetSupply_usageAggregateType<T>>;
    /**
     * Group by Supply_usage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_usageGroupByArgs} args - Group by arguments.
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
    groupBy<T extends supply_usageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: supply_usageGroupByArgs['orderBy'];
    } : {
        orderBy?: supply_usageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, supply_usageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupply_usageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the supply_usage model
     */
    readonly fields: supply_usageFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for supply_usage.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__supply_usageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    supplies<T extends Prisma.supply_usage$suppliesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.supply_usage$suppliesArgs<ExtArgs>>): Prisma.Prisma__suppliesClient<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    tasks<T extends Prisma.supply_usage$tasksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.supply_usage$tasksArgs<ExtArgs>>): Prisma.Prisma__tasksClient<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the supply_usage model
 */
export interface supply_usageFieldRefs {
    readonly id: Prisma.FieldRef<"supply_usage", 'String'>;
    readonly supply_id: Prisma.FieldRef<"supply_usage", 'String'>;
    readonly task_id: Prisma.FieldRef<"supply_usage", 'String'>;
    readonly quantity: Prisma.FieldRef<"supply_usage", 'Decimal'>;
    readonly usage_type: Prisma.FieldRef<"supply_usage", 'String'>;
    readonly notes: Prisma.FieldRef<"supply_usage", 'String'>;
    readonly created_at: Prisma.FieldRef<"supply_usage", 'DateTime'>;
}
/**
 * supply_usage findUnique
 */
export type supply_usageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageInclude<ExtArgs> | null;
    /**
     * Filter, which supply_usage to fetch.
     */
    where: Prisma.supply_usageWhereUniqueInput;
};
/**
 * supply_usage findUniqueOrThrow
 */
export type supply_usageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageInclude<ExtArgs> | null;
    /**
     * Filter, which supply_usage to fetch.
     */
    where: Prisma.supply_usageWhereUniqueInput;
};
/**
 * supply_usage findFirst
 */
export type supply_usageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageInclude<ExtArgs> | null;
    /**
     * Filter, which supply_usage to fetch.
     */
    where?: Prisma.supply_usageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_usages to fetch.
     */
    orderBy?: Prisma.supply_usageOrderByWithRelationInput | Prisma.supply_usageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for supply_usages.
     */
    cursor?: Prisma.supply_usageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_usages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_usages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of supply_usages.
     */
    distinct?: Prisma.Supply_usageScalarFieldEnum | Prisma.Supply_usageScalarFieldEnum[];
};
/**
 * supply_usage findFirstOrThrow
 */
export type supply_usageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageInclude<ExtArgs> | null;
    /**
     * Filter, which supply_usage to fetch.
     */
    where?: Prisma.supply_usageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_usages to fetch.
     */
    orderBy?: Prisma.supply_usageOrderByWithRelationInput | Prisma.supply_usageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for supply_usages.
     */
    cursor?: Prisma.supply_usageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_usages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_usages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of supply_usages.
     */
    distinct?: Prisma.Supply_usageScalarFieldEnum | Prisma.Supply_usageScalarFieldEnum[];
};
/**
 * supply_usage findMany
 */
export type supply_usageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageInclude<ExtArgs> | null;
    /**
     * Filter, which supply_usages to fetch.
     */
    where?: Prisma.supply_usageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_usages to fetch.
     */
    orderBy?: Prisma.supply_usageOrderByWithRelationInput | Prisma.supply_usageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing supply_usages.
     */
    cursor?: Prisma.supply_usageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_usages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_usages.
     */
    skip?: number;
    distinct?: Prisma.Supply_usageScalarFieldEnum | Prisma.Supply_usageScalarFieldEnum[];
};
/**
 * supply_usage create
 */
export type supply_usageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageInclude<ExtArgs> | null;
    /**
     * The data needed to create a supply_usage.
     */
    data: Prisma.XOR<Prisma.supply_usageCreateInput, Prisma.supply_usageUncheckedCreateInput>;
};
/**
 * supply_usage createMany
 */
export type supply_usageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many supply_usages.
     */
    data: Prisma.supply_usageCreateManyInput | Prisma.supply_usageCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * supply_usage createManyAndReturn
 */
export type supply_usageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * The data used to create many supply_usages.
     */
    data: Prisma.supply_usageCreateManyInput | Prisma.supply_usageCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * supply_usage update
 */
export type supply_usageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageInclude<ExtArgs> | null;
    /**
     * The data needed to update a supply_usage.
     */
    data: Prisma.XOR<Prisma.supply_usageUpdateInput, Prisma.supply_usageUncheckedUpdateInput>;
    /**
     * Choose, which supply_usage to update.
     */
    where: Prisma.supply_usageWhereUniqueInput;
};
/**
 * supply_usage updateMany
 */
export type supply_usageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update supply_usages.
     */
    data: Prisma.XOR<Prisma.supply_usageUpdateManyMutationInput, Prisma.supply_usageUncheckedUpdateManyInput>;
    /**
     * Filter which supply_usages to update
     */
    where?: Prisma.supply_usageWhereInput;
    /**
     * Limit how many supply_usages to update.
     */
    limit?: number;
};
/**
 * supply_usage updateManyAndReturn
 */
export type supply_usageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * The data used to update supply_usages.
     */
    data: Prisma.XOR<Prisma.supply_usageUpdateManyMutationInput, Prisma.supply_usageUncheckedUpdateManyInput>;
    /**
     * Filter which supply_usages to update
     */
    where?: Prisma.supply_usageWhereInput;
    /**
     * Limit how many supply_usages to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * supply_usage upsert
 */
export type supply_usageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageInclude<ExtArgs> | null;
    /**
     * The filter to search for the supply_usage to update in case it exists.
     */
    where: Prisma.supply_usageWhereUniqueInput;
    /**
     * In case the supply_usage found by the `where` argument doesn't exist, create a new supply_usage with this data.
     */
    create: Prisma.XOR<Prisma.supply_usageCreateInput, Prisma.supply_usageUncheckedCreateInput>;
    /**
     * In case the supply_usage was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.supply_usageUpdateInput, Prisma.supply_usageUncheckedUpdateInput>;
};
/**
 * supply_usage delete
 */
export type supply_usageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageInclude<ExtArgs> | null;
    /**
     * Filter which supply_usage to delete.
     */
    where: Prisma.supply_usageWhereUniqueInput;
};
/**
 * supply_usage deleteMany
 */
export type supply_usageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which supply_usages to delete
     */
    where?: Prisma.supply_usageWhereInput;
    /**
     * Limit how many supply_usages to delete.
     */
    limit?: number;
};
/**
 * supply_usage.supplies
 */
export type supply_usage$suppliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * supply_usage.tasks
 */
export type supply_usage$tasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * supply_usage without action
 */
export type supply_usageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_usage
     */
    select?: Prisma.supply_usageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_usage
     */
    omit?: Prisma.supply_usageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_usageInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=supply_usage.d.ts.map