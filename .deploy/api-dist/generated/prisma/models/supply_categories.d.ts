import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model supply_categories
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type supply_categoriesModel = runtime.Types.Result.DefaultSelection<Prisma.$supply_categoriesPayload>;
export type AggregateSupply_categories = {
    _count: Supply_categoriesCountAggregateOutputType | null;
    _min: Supply_categoriesMinAggregateOutputType | null;
    _max: Supply_categoriesMaxAggregateOutputType | null;
};
export type Supply_categoriesMinAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    name: string | null;
    description: string | null;
    created_at: Date | null;
};
export type Supply_categoriesMaxAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    name: string | null;
    description: string | null;
    created_at: Date | null;
};
export type Supply_categoriesCountAggregateOutputType = {
    id: number;
    farm_id: number;
    name: number;
    description: number;
    created_at: number;
    _all: number;
};
export type Supply_categoriesMinAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    description?: true;
    created_at?: true;
};
export type Supply_categoriesMaxAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    description?: true;
    created_at?: true;
};
export type Supply_categoriesCountAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    description?: true;
    created_at?: true;
    _all?: true;
};
export type Supply_categoriesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which supply_categories to aggregate.
     */
    where?: Prisma.supply_categoriesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_categories to fetch.
     */
    orderBy?: Prisma.supply_categoriesOrderByWithRelationInput | Prisma.supply_categoriesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.supply_categoriesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned supply_categories
    **/
    _count?: true | Supply_categoriesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Supply_categoriesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Supply_categoriesMaxAggregateInputType;
};
export type GetSupply_categoriesAggregateType<T extends Supply_categoriesAggregateArgs> = {
    [P in keyof T & keyof AggregateSupply_categories]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSupply_categories[P]> : Prisma.GetScalarType<T[P], AggregateSupply_categories[P]>;
};
export type supply_categoriesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.supply_categoriesWhereInput;
    orderBy?: Prisma.supply_categoriesOrderByWithAggregationInput | Prisma.supply_categoriesOrderByWithAggregationInput[];
    by: Prisma.Supply_categoriesScalarFieldEnum[] | Prisma.Supply_categoriesScalarFieldEnum;
    having?: Prisma.supply_categoriesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Supply_categoriesCountAggregateInputType | true;
    _min?: Supply_categoriesMinAggregateInputType;
    _max?: Supply_categoriesMaxAggregateInputType;
};
export type Supply_categoriesGroupByOutputType = {
    id: string;
    farm_id: string | null;
    name: string;
    description: string | null;
    created_at: Date | null;
    _count: Supply_categoriesCountAggregateOutputType | null;
    _min: Supply_categoriesMinAggregateOutputType | null;
    _max: Supply_categoriesMaxAggregateOutputType | null;
};
type GetSupply_categoriesGroupByPayload<T extends supply_categoriesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Supply_categoriesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Supply_categoriesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Supply_categoriesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Supply_categoriesGroupByOutputType[P]>;
}>>;
export type supply_categoriesWhereInput = {
    AND?: Prisma.supply_categoriesWhereInput | Prisma.supply_categoriesWhereInput[];
    OR?: Prisma.supply_categoriesWhereInput[];
    NOT?: Prisma.supply_categoriesWhereInput | Prisma.supply_categoriesWhereInput[];
    id?: Prisma.UuidFilter<"supply_categories"> | string;
    farm_id?: Prisma.UuidNullableFilter<"supply_categories"> | string | null;
    name?: Prisma.StringFilter<"supply_categories"> | string;
    description?: Prisma.StringNullableFilter<"supply_categories"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supply_categories"> | Date | string | null;
    supplies?: Prisma.SuppliesListRelationFilter;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
};
export type supply_categoriesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    supplies?: Prisma.suppliesOrderByRelationAggregateInput;
    farms?: Prisma.farmsOrderByWithRelationInput;
};
export type supply_categoriesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.supply_categoriesWhereInput | Prisma.supply_categoriesWhereInput[];
    OR?: Prisma.supply_categoriesWhereInput[];
    NOT?: Prisma.supply_categoriesWhereInput | Prisma.supply_categoriesWhereInput[];
    farm_id?: Prisma.UuidNullableFilter<"supply_categories"> | string | null;
    name?: Prisma.StringFilter<"supply_categories"> | string;
    description?: Prisma.StringNullableFilter<"supply_categories"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supply_categories"> | Date | string | null;
    supplies?: Prisma.SuppliesListRelationFilter;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
}, "id">;
export type supply_categoriesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.supply_categoriesCountOrderByAggregateInput;
    _max?: Prisma.supply_categoriesMaxOrderByAggregateInput;
    _min?: Prisma.supply_categoriesMinOrderByAggregateInput;
};
export type supply_categoriesScalarWhereWithAggregatesInput = {
    AND?: Prisma.supply_categoriesScalarWhereWithAggregatesInput | Prisma.supply_categoriesScalarWhereWithAggregatesInput[];
    OR?: Prisma.supply_categoriesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.supply_categoriesScalarWhereWithAggregatesInput | Prisma.supply_categoriesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"supply_categories"> | string;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"supply_categories"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"supply_categories"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"supply_categories"> | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"supply_categories"> | Date | string | null;
};
export type supply_categoriesCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    supplies?: Prisma.suppliesCreateNestedManyWithoutSupply_categoriesInput;
    farms?: Prisma.farmsCreateNestedOneWithoutSupply_categoriesInput;
};
export type supply_categoriesUncheckedCreateInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutSupply_categoriesInput;
};
export type supply_categoriesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supplies?: Prisma.suppliesUpdateManyWithoutSupply_categoriesNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutSupply_categoriesNestedInput;
};
export type supply_categoriesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutSupply_categoriesNestedInput;
};
export type supply_categoriesCreateManyInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
};
export type supply_categoriesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_categoriesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type Supply_categoriesListRelationFilter = {
    every?: Prisma.supply_categoriesWhereInput;
    some?: Prisma.supply_categoriesWhereInput;
    none?: Prisma.supply_categoriesWhereInput;
};
export type supply_categoriesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type Supply_categoriesNullableScalarRelationFilter = {
    is?: Prisma.supply_categoriesWhereInput | null;
    isNot?: Prisma.supply_categoriesWhereInput | null;
};
export type supply_categoriesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type supply_categoriesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type supply_categoriesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type supply_categoriesCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.supply_categoriesCreateWithoutFarmsInput, Prisma.supply_categoriesUncheckedCreateWithoutFarmsInput> | Prisma.supply_categoriesCreateWithoutFarmsInput[] | Prisma.supply_categoriesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.supply_categoriesCreateOrConnectWithoutFarmsInput | Prisma.supply_categoriesCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.supply_categoriesCreateManyFarmsInputEnvelope;
    connect?: Prisma.supply_categoriesWhereUniqueInput | Prisma.supply_categoriesWhereUniqueInput[];
};
export type supply_categoriesUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.supply_categoriesCreateWithoutFarmsInput, Prisma.supply_categoriesUncheckedCreateWithoutFarmsInput> | Prisma.supply_categoriesCreateWithoutFarmsInput[] | Prisma.supply_categoriesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.supply_categoriesCreateOrConnectWithoutFarmsInput | Prisma.supply_categoriesCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.supply_categoriesCreateManyFarmsInputEnvelope;
    connect?: Prisma.supply_categoriesWhereUniqueInput | Prisma.supply_categoriesWhereUniqueInput[];
};
export type supply_categoriesUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.supply_categoriesCreateWithoutFarmsInput, Prisma.supply_categoriesUncheckedCreateWithoutFarmsInput> | Prisma.supply_categoriesCreateWithoutFarmsInput[] | Prisma.supply_categoriesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.supply_categoriesCreateOrConnectWithoutFarmsInput | Prisma.supply_categoriesCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.supply_categoriesUpsertWithWhereUniqueWithoutFarmsInput | Prisma.supply_categoriesUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.supply_categoriesCreateManyFarmsInputEnvelope;
    set?: Prisma.supply_categoriesWhereUniqueInput | Prisma.supply_categoriesWhereUniqueInput[];
    disconnect?: Prisma.supply_categoriesWhereUniqueInput | Prisma.supply_categoriesWhereUniqueInput[];
    delete?: Prisma.supply_categoriesWhereUniqueInput | Prisma.supply_categoriesWhereUniqueInput[];
    connect?: Prisma.supply_categoriesWhereUniqueInput | Prisma.supply_categoriesWhereUniqueInput[];
    update?: Prisma.supply_categoriesUpdateWithWhereUniqueWithoutFarmsInput | Prisma.supply_categoriesUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.supply_categoriesUpdateManyWithWhereWithoutFarmsInput | Prisma.supply_categoriesUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.supply_categoriesScalarWhereInput | Prisma.supply_categoriesScalarWhereInput[];
};
export type supply_categoriesUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.supply_categoriesCreateWithoutFarmsInput, Prisma.supply_categoriesUncheckedCreateWithoutFarmsInput> | Prisma.supply_categoriesCreateWithoutFarmsInput[] | Prisma.supply_categoriesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.supply_categoriesCreateOrConnectWithoutFarmsInput | Prisma.supply_categoriesCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.supply_categoriesUpsertWithWhereUniqueWithoutFarmsInput | Prisma.supply_categoriesUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.supply_categoriesCreateManyFarmsInputEnvelope;
    set?: Prisma.supply_categoriesWhereUniqueInput | Prisma.supply_categoriesWhereUniqueInput[];
    disconnect?: Prisma.supply_categoriesWhereUniqueInput | Prisma.supply_categoriesWhereUniqueInput[];
    delete?: Prisma.supply_categoriesWhereUniqueInput | Prisma.supply_categoriesWhereUniqueInput[];
    connect?: Prisma.supply_categoriesWhereUniqueInput | Prisma.supply_categoriesWhereUniqueInput[];
    update?: Prisma.supply_categoriesUpdateWithWhereUniqueWithoutFarmsInput | Prisma.supply_categoriesUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.supply_categoriesUpdateManyWithWhereWithoutFarmsInput | Prisma.supply_categoriesUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.supply_categoriesScalarWhereInput | Prisma.supply_categoriesScalarWhereInput[];
};
export type supply_categoriesCreateNestedOneWithoutSuppliesInput = {
    create?: Prisma.XOR<Prisma.supply_categoriesCreateWithoutSuppliesInput, Prisma.supply_categoriesUncheckedCreateWithoutSuppliesInput>;
    connectOrCreate?: Prisma.supply_categoriesCreateOrConnectWithoutSuppliesInput;
    connect?: Prisma.supply_categoriesWhereUniqueInput;
};
export type supply_categoriesUpdateOneWithoutSuppliesNestedInput = {
    create?: Prisma.XOR<Prisma.supply_categoriesCreateWithoutSuppliesInput, Prisma.supply_categoriesUncheckedCreateWithoutSuppliesInput>;
    connectOrCreate?: Prisma.supply_categoriesCreateOrConnectWithoutSuppliesInput;
    upsert?: Prisma.supply_categoriesUpsertWithoutSuppliesInput;
    disconnect?: Prisma.supply_categoriesWhereInput | boolean;
    delete?: Prisma.supply_categoriesWhereInput | boolean;
    connect?: Prisma.supply_categoriesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.supply_categoriesUpdateToOneWithWhereWithoutSuppliesInput, Prisma.supply_categoriesUpdateWithoutSuppliesInput>, Prisma.supply_categoriesUncheckedUpdateWithoutSuppliesInput>;
};
export type supply_categoriesCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    supplies?: Prisma.suppliesCreateNestedManyWithoutSupply_categoriesInput;
};
export type supply_categoriesUncheckedCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutSupply_categoriesInput;
};
export type supply_categoriesCreateOrConnectWithoutFarmsInput = {
    where: Prisma.supply_categoriesWhereUniqueInput;
    create: Prisma.XOR<Prisma.supply_categoriesCreateWithoutFarmsInput, Prisma.supply_categoriesUncheckedCreateWithoutFarmsInput>;
};
export type supply_categoriesCreateManyFarmsInputEnvelope = {
    data: Prisma.supply_categoriesCreateManyFarmsInput | Prisma.supply_categoriesCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type supply_categoriesUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.supply_categoriesWhereUniqueInput;
    update: Prisma.XOR<Prisma.supply_categoriesUpdateWithoutFarmsInput, Prisma.supply_categoriesUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.supply_categoriesCreateWithoutFarmsInput, Prisma.supply_categoriesUncheckedCreateWithoutFarmsInput>;
};
export type supply_categoriesUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.supply_categoriesWhereUniqueInput;
    data: Prisma.XOR<Prisma.supply_categoriesUpdateWithoutFarmsInput, Prisma.supply_categoriesUncheckedUpdateWithoutFarmsInput>;
};
export type supply_categoriesUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.supply_categoriesScalarWhereInput;
    data: Prisma.XOR<Prisma.supply_categoriesUpdateManyMutationInput, Prisma.supply_categoriesUncheckedUpdateManyWithoutFarmsInput>;
};
export type supply_categoriesScalarWhereInput = {
    AND?: Prisma.supply_categoriesScalarWhereInput | Prisma.supply_categoriesScalarWhereInput[];
    OR?: Prisma.supply_categoriesScalarWhereInput[];
    NOT?: Prisma.supply_categoriesScalarWhereInput | Prisma.supply_categoriesScalarWhereInput[];
    id?: Prisma.UuidFilter<"supply_categories"> | string;
    farm_id?: Prisma.UuidNullableFilter<"supply_categories"> | string | null;
    name?: Prisma.StringFilter<"supply_categories"> | string;
    description?: Prisma.StringNullableFilter<"supply_categories"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supply_categories"> | Date | string | null;
};
export type supply_categoriesCreateWithoutSuppliesInput = {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutSupply_categoriesInput;
};
export type supply_categoriesUncheckedCreateWithoutSuppliesInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
};
export type supply_categoriesCreateOrConnectWithoutSuppliesInput = {
    where: Prisma.supply_categoriesWhereUniqueInput;
    create: Prisma.XOR<Prisma.supply_categoriesCreateWithoutSuppliesInput, Prisma.supply_categoriesUncheckedCreateWithoutSuppliesInput>;
};
export type supply_categoriesUpsertWithoutSuppliesInput = {
    update: Prisma.XOR<Prisma.supply_categoriesUpdateWithoutSuppliesInput, Prisma.supply_categoriesUncheckedUpdateWithoutSuppliesInput>;
    create: Prisma.XOR<Prisma.supply_categoriesCreateWithoutSuppliesInput, Prisma.supply_categoriesUncheckedCreateWithoutSuppliesInput>;
    where?: Prisma.supply_categoriesWhereInput;
};
export type supply_categoriesUpdateToOneWithWhereWithoutSuppliesInput = {
    where?: Prisma.supply_categoriesWhereInput;
    data: Prisma.XOR<Prisma.supply_categoriesUpdateWithoutSuppliesInput, Prisma.supply_categoriesUncheckedUpdateWithoutSuppliesInput>;
};
export type supply_categoriesUpdateWithoutSuppliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutSupply_categoriesNestedInput;
};
export type supply_categoriesUncheckedUpdateWithoutSuppliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_categoriesCreateManyFarmsInput = {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
};
export type supply_categoriesUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supplies?: Prisma.suppliesUpdateManyWithoutSupply_categoriesNestedInput;
};
export type supply_categoriesUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutSupply_categoriesNestedInput;
};
export type supply_categoriesUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type Supply_categoriesCountOutputType
 */
export type Supply_categoriesCountOutputType = {
    supplies: number;
};
export type Supply_categoriesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplies?: boolean | Supply_categoriesCountOutputTypeCountSuppliesArgs;
};
/**
 * Supply_categoriesCountOutputType without action
 */
export type Supply_categoriesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supply_categoriesCountOutputType
     */
    select?: Prisma.Supply_categoriesCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * Supply_categoriesCountOutputType without action
 */
export type Supply_categoriesCountOutputTypeCountSuppliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.suppliesWhereInput;
};
export type supply_categoriesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    description?: boolean;
    created_at?: boolean;
    supplies?: boolean | Prisma.supply_categories$suppliesArgs<ExtArgs>;
    farms?: boolean | Prisma.supply_categories$farmsArgs<ExtArgs>;
    _count?: boolean | Prisma.Supply_categoriesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["supply_categories"]>;
export type supply_categoriesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    description?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.supply_categories$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["supply_categories"]>;
export type supply_categoriesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    description?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.supply_categories$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["supply_categories"]>;
export type supply_categoriesSelectScalar = {
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    description?: boolean;
    created_at?: boolean;
};
export type supply_categoriesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farm_id" | "name" | "description" | "created_at", ExtArgs["result"]["supply_categories"]>;
export type supply_categoriesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplies?: boolean | Prisma.supply_categories$suppliesArgs<ExtArgs>;
    farms?: boolean | Prisma.supply_categories$farmsArgs<ExtArgs>;
    _count?: boolean | Prisma.Supply_categoriesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type supply_categoriesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.supply_categories$farmsArgs<ExtArgs>;
};
export type supply_categoriesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.supply_categories$farmsArgs<ExtArgs>;
};
export type $supply_categoriesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "supply_categories";
    objects: {
        supplies: Prisma.$suppliesPayload<ExtArgs>[];
        farms: Prisma.$farmsPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farm_id: string | null;
        name: string;
        description: string | null;
        created_at: Date | null;
    }, ExtArgs["result"]["supply_categories"]>;
    composites: {};
};
export type supply_categoriesGetPayload<S extends boolean | null | undefined | supply_categoriesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload, S>;
export type supply_categoriesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<supply_categoriesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Supply_categoriesCountAggregateInputType | true;
};
export interface supply_categoriesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['supply_categories'];
        meta: {
            name: 'supply_categories';
        };
    };
    /**
     * Find zero or one Supply_categories that matches the filter.
     * @param {supply_categoriesFindUniqueArgs} args - Arguments to find a Supply_categories
     * @example
     * // Get one Supply_categories
     * const supply_categories = await prisma.supply_categories.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends supply_categoriesFindUniqueArgs>(args: Prisma.SelectSubset<T, supply_categoriesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__supply_categoriesClient<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Supply_categories that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {supply_categoriesFindUniqueOrThrowArgs} args - Arguments to find a Supply_categories
     * @example
     * // Get one Supply_categories
     * const supply_categories = await prisma.supply_categories.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends supply_categoriesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, supply_categoriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__supply_categoriesClient<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Supply_categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_categoriesFindFirstArgs} args - Arguments to find a Supply_categories
     * @example
     * // Get one Supply_categories
     * const supply_categories = await prisma.supply_categories.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends supply_categoriesFindFirstArgs>(args?: Prisma.SelectSubset<T, supply_categoriesFindFirstArgs<ExtArgs>>): Prisma.Prisma__supply_categoriesClient<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Supply_categories that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_categoriesFindFirstOrThrowArgs} args - Arguments to find a Supply_categories
     * @example
     * // Get one Supply_categories
     * const supply_categories = await prisma.supply_categories.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends supply_categoriesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, supply_categoriesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__supply_categoriesClient<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Supply_categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_categoriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Supply_categories
     * const supply_categories = await prisma.supply_categories.findMany()
     *
     * // Get first 10 Supply_categories
     * const supply_categories = await prisma.supply_categories.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const supply_categoriesWithIdOnly = await prisma.supply_categories.findMany({ select: { id: true } })
     *
     */
    findMany<T extends supply_categoriesFindManyArgs>(args?: Prisma.SelectSubset<T, supply_categoriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Supply_categories.
     * @param {supply_categoriesCreateArgs} args - Arguments to create a Supply_categories.
     * @example
     * // Create one Supply_categories
     * const Supply_categories = await prisma.supply_categories.create({
     *   data: {
     *     // ... data to create a Supply_categories
     *   }
     * })
     *
     */
    create<T extends supply_categoriesCreateArgs>(args: Prisma.SelectSubset<T, supply_categoriesCreateArgs<ExtArgs>>): Prisma.Prisma__supply_categoriesClient<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Supply_categories.
     * @param {supply_categoriesCreateManyArgs} args - Arguments to create many Supply_categories.
     * @example
     * // Create many Supply_categories
     * const supply_categories = await prisma.supply_categories.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends supply_categoriesCreateManyArgs>(args?: Prisma.SelectSubset<T, supply_categoriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Supply_categories and returns the data saved in the database.
     * @param {supply_categoriesCreateManyAndReturnArgs} args - Arguments to create many Supply_categories.
     * @example
     * // Create many Supply_categories
     * const supply_categories = await prisma.supply_categories.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Supply_categories and only return the `id`
     * const supply_categoriesWithIdOnly = await prisma.supply_categories.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends supply_categoriesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, supply_categoriesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Supply_categories.
     * @param {supply_categoriesDeleteArgs} args - Arguments to delete one Supply_categories.
     * @example
     * // Delete one Supply_categories
     * const Supply_categories = await prisma.supply_categories.delete({
     *   where: {
     *     // ... filter to delete one Supply_categories
     *   }
     * })
     *
     */
    delete<T extends supply_categoriesDeleteArgs>(args: Prisma.SelectSubset<T, supply_categoriesDeleteArgs<ExtArgs>>): Prisma.Prisma__supply_categoriesClient<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Supply_categories.
     * @param {supply_categoriesUpdateArgs} args - Arguments to update one Supply_categories.
     * @example
     * // Update one Supply_categories
     * const supply_categories = await prisma.supply_categories.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends supply_categoriesUpdateArgs>(args: Prisma.SelectSubset<T, supply_categoriesUpdateArgs<ExtArgs>>): Prisma.Prisma__supply_categoriesClient<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Supply_categories.
     * @param {supply_categoriesDeleteManyArgs} args - Arguments to filter Supply_categories to delete.
     * @example
     * // Delete a few Supply_categories
     * const { count } = await prisma.supply_categories.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends supply_categoriesDeleteManyArgs>(args?: Prisma.SelectSubset<T, supply_categoriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Supply_categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_categoriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Supply_categories
     * const supply_categories = await prisma.supply_categories.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends supply_categoriesUpdateManyArgs>(args: Prisma.SelectSubset<T, supply_categoriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Supply_categories and returns the data updated in the database.
     * @param {supply_categoriesUpdateManyAndReturnArgs} args - Arguments to update many Supply_categories.
     * @example
     * // Update many Supply_categories
     * const supply_categories = await prisma.supply_categories.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Supply_categories and only return the `id`
     * const supply_categoriesWithIdOnly = await prisma.supply_categories.updateManyAndReturn({
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
    updateManyAndReturn<T extends supply_categoriesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, supply_categoriesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Supply_categories.
     * @param {supply_categoriesUpsertArgs} args - Arguments to update or create a Supply_categories.
     * @example
     * // Update or create a Supply_categories
     * const supply_categories = await prisma.supply_categories.upsert({
     *   create: {
     *     // ... data to create a Supply_categories
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Supply_categories we want to update
     *   }
     * })
     */
    upsert<T extends supply_categoriesUpsertArgs>(args: Prisma.SelectSubset<T, supply_categoriesUpsertArgs<ExtArgs>>): Prisma.Prisma__supply_categoriesClient<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Supply_categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_categoriesCountArgs} args - Arguments to filter Supply_categories to count.
     * @example
     * // Count the number of Supply_categories
     * const count = await prisma.supply_categories.count({
     *   where: {
     *     // ... the filter for the Supply_categories we want to count
     *   }
     * })
    **/
    count<T extends supply_categoriesCountArgs>(args?: Prisma.Subset<T, supply_categoriesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Supply_categoriesCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Supply_categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Supply_categoriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Supply_categoriesAggregateArgs>(args: Prisma.Subset<T, Supply_categoriesAggregateArgs>): Prisma.PrismaPromise<GetSupply_categoriesAggregateType<T>>;
    /**
     * Group by Supply_categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_categoriesGroupByArgs} args - Group by arguments.
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
    groupBy<T extends supply_categoriesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: supply_categoriesGroupByArgs['orderBy'];
    } : {
        orderBy?: supply_categoriesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, supply_categoriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupply_categoriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the supply_categories model
     */
    readonly fields: supply_categoriesFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for supply_categories.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__supply_categoriesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    supplies<T extends Prisma.supply_categories$suppliesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.supply_categories$suppliesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    farms<T extends Prisma.supply_categories$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.supply_categories$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the supply_categories model
 */
export interface supply_categoriesFieldRefs {
    readonly id: Prisma.FieldRef<"supply_categories", 'String'>;
    readonly farm_id: Prisma.FieldRef<"supply_categories", 'String'>;
    readonly name: Prisma.FieldRef<"supply_categories", 'String'>;
    readonly description: Prisma.FieldRef<"supply_categories", 'String'>;
    readonly created_at: Prisma.FieldRef<"supply_categories", 'DateTime'>;
}
/**
 * supply_categories findUnique
 */
export type supply_categoriesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supply_categories to fetch.
     */
    where: Prisma.supply_categoriesWhereUniqueInput;
};
/**
 * supply_categories findUniqueOrThrow
 */
export type supply_categoriesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supply_categories to fetch.
     */
    where: Prisma.supply_categoriesWhereUniqueInput;
};
/**
 * supply_categories findFirst
 */
export type supply_categoriesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supply_categories to fetch.
     */
    where?: Prisma.supply_categoriesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_categories to fetch.
     */
    orderBy?: Prisma.supply_categoriesOrderByWithRelationInput | Prisma.supply_categoriesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for supply_categories.
     */
    cursor?: Prisma.supply_categoriesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of supply_categories.
     */
    distinct?: Prisma.Supply_categoriesScalarFieldEnum | Prisma.Supply_categoriesScalarFieldEnum[];
};
/**
 * supply_categories findFirstOrThrow
 */
export type supply_categoriesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supply_categories to fetch.
     */
    where?: Prisma.supply_categoriesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_categories to fetch.
     */
    orderBy?: Prisma.supply_categoriesOrderByWithRelationInput | Prisma.supply_categoriesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for supply_categories.
     */
    cursor?: Prisma.supply_categoriesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of supply_categories.
     */
    distinct?: Prisma.Supply_categoriesScalarFieldEnum | Prisma.Supply_categoriesScalarFieldEnum[];
};
/**
 * supply_categories findMany
 */
export type supply_categoriesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supply_categories to fetch.
     */
    where?: Prisma.supply_categoriesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_categories to fetch.
     */
    orderBy?: Prisma.supply_categoriesOrderByWithRelationInput | Prisma.supply_categoriesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing supply_categories.
     */
    cursor?: Prisma.supply_categoriesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_categories.
     */
    skip?: number;
    distinct?: Prisma.Supply_categoriesScalarFieldEnum | Prisma.Supply_categoriesScalarFieldEnum[];
};
/**
 * supply_categories create
 */
export type supply_categoriesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a supply_categories.
     */
    data: Prisma.XOR<Prisma.supply_categoriesCreateInput, Prisma.supply_categoriesUncheckedCreateInput>;
};
/**
 * supply_categories createMany
 */
export type supply_categoriesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many supply_categories.
     */
    data: Prisma.supply_categoriesCreateManyInput | Prisma.supply_categoriesCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * supply_categories createManyAndReturn
 */
export type supply_categoriesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_categories
     */
    select?: Prisma.supply_categoriesSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_categories
     */
    omit?: Prisma.supply_categoriesOmit<ExtArgs> | null;
    /**
     * The data used to create many supply_categories.
     */
    data: Prisma.supply_categoriesCreateManyInput | Prisma.supply_categoriesCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_categoriesIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * supply_categories update
 */
export type supply_categoriesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a supply_categories.
     */
    data: Prisma.XOR<Prisma.supply_categoriesUpdateInput, Prisma.supply_categoriesUncheckedUpdateInput>;
    /**
     * Choose, which supply_categories to update.
     */
    where: Prisma.supply_categoriesWhereUniqueInput;
};
/**
 * supply_categories updateMany
 */
export type supply_categoriesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update supply_categories.
     */
    data: Prisma.XOR<Prisma.supply_categoriesUpdateManyMutationInput, Prisma.supply_categoriesUncheckedUpdateManyInput>;
    /**
     * Filter which supply_categories to update
     */
    where?: Prisma.supply_categoriesWhereInput;
    /**
     * Limit how many supply_categories to update.
     */
    limit?: number;
};
/**
 * supply_categories updateManyAndReturn
 */
export type supply_categoriesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_categories
     */
    select?: Prisma.supply_categoriesSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_categories
     */
    omit?: Prisma.supply_categoriesOmit<ExtArgs> | null;
    /**
     * The data used to update supply_categories.
     */
    data: Prisma.XOR<Prisma.supply_categoriesUpdateManyMutationInput, Prisma.supply_categoriesUncheckedUpdateManyInput>;
    /**
     * Filter which supply_categories to update
     */
    where?: Prisma.supply_categoriesWhereInput;
    /**
     * Limit how many supply_categories to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_categoriesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * supply_categories upsert
 */
export type supply_categoriesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the supply_categories to update in case it exists.
     */
    where: Prisma.supply_categoriesWhereUniqueInput;
    /**
     * In case the supply_categories found by the `where` argument doesn't exist, create a new supply_categories with this data.
     */
    create: Prisma.XOR<Prisma.supply_categoriesCreateInput, Prisma.supply_categoriesUncheckedCreateInput>;
    /**
     * In case the supply_categories was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.supply_categoriesUpdateInput, Prisma.supply_categoriesUncheckedUpdateInput>;
};
/**
 * supply_categories delete
 */
export type supply_categoriesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which supply_categories to delete.
     */
    where: Prisma.supply_categoriesWhereUniqueInput;
};
/**
 * supply_categories deleteMany
 */
export type supply_categoriesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which supply_categories to delete
     */
    where?: Prisma.supply_categoriesWhereInput;
    /**
     * Limit how many supply_categories to delete.
     */
    limit?: number;
};
/**
 * supply_categories.supplies
 */
export type supply_categories$suppliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * supply_categories.farms
 */
export type supply_categories$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * supply_categories without action
 */
export type supply_categoriesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=supply_categories.d.ts.map