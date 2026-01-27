import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model blends
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type blendsModel = runtime.Types.Result.DefaultSelection<Prisma.$blendsPayload>;
export type AggregateBlends = {
    _count: BlendsCountAggregateOutputType | null;
    _min: BlendsMinAggregateOutputType | null;
    _max: BlendsMaxAggregateOutputType | null;
};
export type BlendsMinAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    name: string | null;
    description: string | null;
    created_at: Date | null;
};
export type BlendsMaxAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    name: string | null;
    description: string | null;
    created_at: Date | null;
};
export type BlendsCountAggregateOutputType = {
    id: number;
    farm_id: number;
    name: number;
    description: number;
    created_at: number;
    _all: number;
};
export type BlendsMinAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    description?: true;
    created_at?: true;
};
export type BlendsMaxAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    description?: true;
    created_at?: true;
};
export type BlendsCountAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    description?: true;
    created_at?: true;
    _all?: true;
};
export type BlendsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which blends to aggregate.
     */
    where?: Prisma.blendsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of blends to fetch.
     */
    orderBy?: Prisma.blendsOrderByWithRelationInput | Prisma.blendsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.blendsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` blends from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` blends.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned blends
    **/
    _count?: true | BlendsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: BlendsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: BlendsMaxAggregateInputType;
};
export type GetBlendsAggregateType<T extends BlendsAggregateArgs> = {
    [P in keyof T & keyof AggregateBlends]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBlends[P]> : Prisma.GetScalarType<T[P], AggregateBlends[P]>;
};
export type blendsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.blendsWhereInput;
    orderBy?: Prisma.blendsOrderByWithAggregationInput | Prisma.blendsOrderByWithAggregationInput[];
    by: Prisma.BlendsScalarFieldEnum[] | Prisma.BlendsScalarFieldEnum;
    having?: Prisma.blendsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BlendsCountAggregateInputType | true;
    _min?: BlendsMinAggregateInputType;
    _max?: BlendsMaxAggregateInputType;
};
export type BlendsGroupByOutputType = {
    id: string;
    farm_id: string | null;
    name: string;
    description: string | null;
    created_at: Date | null;
    _count: BlendsCountAggregateOutputType | null;
    _min: BlendsMinAggregateOutputType | null;
    _max: BlendsMaxAggregateOutputType | null;
};
type GetBlendsGroupByPayload<T extends blendsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BlendsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BlendsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BlendsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BlendsGroupByOutputType[P]>;
}>>;
export type blendsWhereInput = {
    AND?: Prisma.blendsWhereInput | Prisma.blendsWhereInput[];
    OR?: Prisma.blendsWhereInput[];
    NOT?: Prisma.blendsWhereInput | Prisma.blendsWhereInput[];
    id?: Prisma.UuidFilter<"blends"> | string;
    farm_id?: Prisma.UuidNullableFilter<"blends"> | string | null;
    name?: Prisma.StringFilter<"blends"> | string;
    description?: Prisma.StringNullableFilter<"blends"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"blends"> | Date | string | null;
    blend_ingredients?: Prisma.Blend_ingredientsListRelationFilter;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    order_items?: Prisma.Order_itemsListRelationFilter;
};
export type blendsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    blend_ingredients?: Prisma.blend_ingredientsOrderByRelationAggregateInput;
    farms?: Prisma.farmsOrderByWithRelationInput;
    order_items?: Prisma.order_itemsOrderByRelationAggregateInput;
};
export type blendsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.blendsWhereInput | Prisma.blendsWhereInput[];
    OR?: Prisma.blendsWhereInput[];
    NOT?: Prisma.blendsWhereInput | Prisma.blendsWhereInput[];
    farm_id?: Prisma.UuidNullableFilter<"blends"> | string | null;
    name?: Prisma.StringFilter<"blends"> | string;
    description?: Prisma.StringNullableFilter<"blends"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"blends"> | Date | string | null;
    blend_ingredients?: Prisma.Blend_ingredientsListRelationFilter;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    order_items?: Prisma.Order_itemsListRelationFilter;
}, "id">;
export type blendsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.blendsCountOrderByAggregateInput;
    _max?: Prisma.blendsMaxOrderByAggregateInput;
    _min?: Prisma.blendsMinOrderByAggregateInput;
};
export type blendsScalarWhereWithAggregatesInput = {
    AND?: Prisma.blendsScalarWhereWithAggregatesInput | Prisma.blendsScalarWhereWithAggregatesInput[];
    OR?: Prisma.blendsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.blendsScalarWhereWithAggregatesInput | Prisma.blendsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"blends"> | string;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"blends"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"blends"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"blends"> | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"blends"> | Date | string | null;
};
export type blendsCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsCreateNestedManyWithoutBlendsInput;
    farms?: Prisma.farmsCreateNestedOneWithoutBlendsInput;
    order_items?: Prisma.order_itemsCreateNestedManyWithoutBlendsInput;
};
export type blendsUncheckedCreateInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedCreateNestedManyWithoutBlendsInput;
    order_items?: Prisma.order_itemsUncheckedCreateNestedManyWithoutBlendsInput;
};
export type blendsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUpdateManyWithoutBlendsNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutBlendsNestedInput;
    order_items?: Prisma.order_itemsUpdateManyWithoutBlendsNestedInput;
};
export type blendsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedUpdateManyWithoutBlendsNestedInput;
    order_items?: Prisma.order_itemsUncheckedUpdateManyWithoutBlendsNestedInput;
};
export type blendsCreateManyInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
};
export type blendsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type blendsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type BlendsNullableScalarRelationFilter = {
    is?: Prisma.blendsWhereInput | null;
    isNot?: Prisma.blendsWhereInput | null;
};
export type blendsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type blendsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type blendsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type BlendsListRelationFilter = {
    every?: Prisma.blendsWhereInput;
    some?: Prisma.blendsWhereInput;
    none?: Prisma.blendsWhereInput;
};
export type blendsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type blendsCreateNestedOneWithoutBlend_ingredientsInput = {
    create?: Prisma.XOR<Prisma.blendsCreateWithoutBlend_ingredientsInput, Prisma.blendsUncheckedCreateWithoutBlend_ingredientsInput>;
    connectOrCreate?: Prisma.blendsCreateOrConnectWithoutBlend_ingredientsInput;
    connect?: Prisma.blendsWhereUniqueInput;
};
export type blendsUpdateOneWithoutBlend_ingredientsNestedInput = {
    create?: Prisma.XOR<Prisma.blendsCreateWithoutBlend_ingredientsInput, Prisma.blendsUncheckedCreateWithoutBlend_ingredientsInput>;
    connectOrCreate?: Prisma.blendsCreateOrConnectWithoutBlend_ingredientsInput;
    upsert?: Prisma.blendsUpsertWithoutBlend_ingredientsInput;
    disconnect?: Prisma.blendsWhereInput | boolean;
    delete?: Prisma.blendsWhereInput | boolean;
    connect?: Prisma.blendsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.blendsUpdateToOneWithWhereWithoutBlend_ingredientsInput, Prisma.blendsUpdateWithoutBlend_ingredientsInput>, Prisma.blendsUncheckedUpdateWithoutBlend_ingredientsInput>;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type blendsCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.blendsCreateWithoutFarmsInput, Prisma.blendsUncheckedCreateWithoutFarmsInput> | Prisma.blendsCreateWithoutFarmsInput[] | Prisma.blendsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.blendsCreateOrConnectWithoutFarmsInput | Prisma.blendsCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.blendsCreateManyFarmsInputEnvelope;
    connect?: Prisma.blendsWhereUniqueInput | Prisma.blendsWhereUniqueInput[];
};
export type blendsUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.blendsCreateWithoutFarmsInput, Prisma.blendsUncheckedCreateWithoutFarmsInput> | Prisma.blendsCreateWithoutFarmsInput[] | Prisma.blendsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.blendsCreateOrConnectWithoutFarmsInput | Prisma.blendsCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.blendsCreateManyFarmsInputEnvelope;
    connect?: Prisma.blendsWhereUniqueInput | Prisma.blendsWhereUniqueInput[];
};
export type blendsUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.blendsCreateWithoutFarmsInput, Prisma.blendsUncheckedCreateWithoutFarmsInput> | Prisma.blendsCreateWithoutFarmsInput[] | Prisma.blendsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.blendsCreateOrConnectWithoutFarmsInput | Prisma.blendsCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.blendsUpsertWithWhereUniqueWithoutFarmsInput | Prisma.blendsUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.blendsCreateManyFarmsInputEnvelope;
    set?: Prisma.blendsWhereUniqueInput | Prisma.blendsWhereUniqueInput[];
    disconnect?: Prisma.blendsWhereUniqueInput | Prisma.blendsWhereUniqueInput[];
    delete?: Prisma.blendsWhereUniqueInput | Prisma.blendsWhereUniqueInput[];
    connect?: Prisma.blendsWhereUniqueInput | Prisma.blendsWhereUniqueInput[];
    update?: Prisma.blendsUpdateWithWhereUniqueWithoutFarmsInput | Prisma.blendsUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.blendsUpdateManyWithWhereWithoutFarmsInput | Prisma.blendsUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.blendsScalarWhereInput | Prisma.blendsScalarWhereInput[];
};
export type blendsUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.blendsCreateWithoutFarmsInput, Prisma.blendsUncheckedCreateWithoutFarmsInput> | Prisma.blendsCreateWithoutFarmsInput[] | Prisma.blendsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.blendsCreateOrConnectWithoutFarmsInput | Prisma.blendsCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.blendsUpsertWithWhereUniqueWithoutFarmsInput | Prisma.blendsUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.blendsCreateManyFarmsInputEnvelope;
    set?: Prisma.blendsWhereUniqueInput | Prisma.blendsWhereUniqueInput[];
    disconnect?: Prisma.blendsWhereUniqueInput | Prisma.blendsWhereUniqueInput[];
    delete?: Prisma.blendsWhereUniqueInput | Prisma.blendsWhereUniqueInput[];
    connect?: Prisma.blendsWhereUniqueInput | Prisma.blendsWhereUniqueInput[];
    update?: Prisma.blendsUpdateWithWhereUniqueWithoutFarmsInput | Prisma.blendsUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.blendsUpdateManyWithWhereWithoutFarmsInput | Prisma.blendsUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.blendsScalarWhereInput | Prisma.blendsScalarWhereInput[];
};
export type blendsCreateNestedOneWithoutOrder_itemsInput = {
    create?: Prisma.XOR<Prisma.blendsCreateWithoutOrder_itemsInput, Prisma.blendsUncheckedCreateWithoutOrder_itemsInput>;
    connectOrCreate?: Prisma.blendsCreateOrConnectWithoutOrder_itemsInput;
    connect?: Prisma.blendsWhereUniqueInput;
};
export type blendsUpdateOneWithoutOrder_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.blendsCreateWithoutOrder_itemsInput, Prisma.blendsUncheckedCreateWithoutOrder_itemsInput>;
    connectOrCreate?: Prisma.blendsCreateOrConnectWithoutOrder_itemsInput;
    upsert?: Prisma.blendsUpsertWithoutOrder_itemsInput;
    disconnect?: Prisma.blendsWhereInput | boolean;
    delete?: Prisma.blendsWhereInput | boolean;
    connect?: Prisma.blendsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.blendsUpdateToOneWithWhereWithoutOrder_itemsInput, Prisma.blendsUpdateWithoutOrder_itemsInput>, Prisma.blendsUncheckedUpdateWithoutOrder_itemsInput>;
};
export type blendsCreateWithoutBlend_ingredientsInput = {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutBlendsInput;
    order_items?: Prisma.order_itemsCreateNestedManyWithoutBlendsInput;
};
export type blendsUncheckedCreateWithoutBlend_ingredientsInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    order_items?: Prisma.order_itemsUncheckedCreateNestedManyWithoutBlendsInput;
};
export type blendsCreateOrConnectWithoutBlend_ingredientsInput = {
    where: Prisma.blendsWhereUniqueInput;
    create: Prisma.XOR<Prisma.blendsCreateWithoutBlend_ingredientsInput, Prisma.blendsUncheckedCreateWithoutBlend_ingredientsInput>;
};
export type blendsUpsertWithoutBlend_ingredientsInput = {
    update: Prisma.XOR<Prisma.blendsUpdateWithoutBlend_ingredientsInput, Prisma.blendsUncheckedUpdateWithoutBlend_ingredientsInput>;
    create: Prisma.XOR<Prisma.blendsCreateWithoutBlend_ingredientsInput, Prisma.blendsUncheckedCreateWithoutBlend_ingredientsInput>;
    where?: Prisma.blendsWhereInput;
};
export type blendsUpdateToOneWithWhereWithoutBlend_ingredientsInput = {
    where?: Prisma.blendsWhereInput;
    data: Prisma.XOR<Prisma.blendsUpdateWithoutBlend_ingredientsInput, Prisma.blendsUncheckedUpdateWithoutBlend_ingredientsInput>;
};
export type blendsUpdateWithoutBlend_ingredientsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutBlendsNestedInput;
    order_items?: Prisma.order_itemsUpdateManyWithoutBlendsNestedInput;
};
export type blendsUncheckedUpdateWithoutBlend_ingredientsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    order_items?: Prisma.order_itemsUncheckedUpdateManyWithoutBlendsNestedInput;
};
export type blendsCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsCreateNestedManyWithoutBlendsInput;
    order_items?: Prisma.order_itemsCreateNestedManyWithoutBlendsInput;
};
export type blendsUncheckedCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedCreateNestedManyWithoutBlendsInput;
    order_items?: Prisma.order_itemsUncheckedCreateNestedManyWithoutBlendsInput;
};
export type blendsCreateOrConnectWithoutFarmsInput = {
    where: Prisma.blendsWhereUniqueInput;
    create: Prisma.XOR<Prisma.blendsCreateWithoutFarmsInput, Prisma.blendsUncheckedCreateWithoutFarmsInput>;
};
export type blendsCreateManyFarmsInputEnvelope = {
    data: Prisma.blendsCreateManyFarmsInput | Prisma.blendsCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type blendsUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.blendsWhereUniqueInput;
    update: Prisma.XOR<Prisma.blendsUpdateWithoutFarmsInput, Prisma.blendsUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.blendsCreateWithoutFarmsInput, Prisma.blendsUncheckedCreateWithoutFarmsInput>;
};
export type blendsUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.blendsWhereUniqueInput;
    data: Prisma.XOR<Prisma.blendsUpdateWithoutFarmsInput, Prisma.blendsUncheckedUpdateWithoutFarmsInput>;
};
export type blendsUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.blendsScalarWhereInput;
    data: Prisma.XOR<Prisma.blendsUpdateManyMutationInput, Prisma.blendsUncheckedUpdateManyWithoutFarmsInput>;
};
export type blendsScalarWhereInput = {
    AND?: Prisma.blendsScalarWhereInput | Prisma.blendsScalarWhereInput[];
    OR?: Prisma.blendsScalarWhereInput[];
    NOT?: Prisma.blendsScalarWhereInput | Prisma.blendsScalarWhereInput[];
    id?: Prisma.UuidFilter<"blends"> | string;
    farm_id?: Prisma.UuidNullableFilter<"blends"> | string | null;
    name?: Prisma.StringFilter<"blends"> | string;
    description?: Prisma.StringNullableFilter<"blends"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"blends"> | Date | string | null;
};
export type blendsCreateWithoutOrder_itemsInput = {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsCreateNestedManyWithoutBlendsInput;
    farms?: Prisma.farmsCreateNestedOneWithoutBlendsInput;
};
export type blendsUncheckedCreateWithoutOrder_itemsInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedCreateNestedManyWithoutBlendsInput;
};
export type blendsCreateOrConnectWithoutOrder_itemsInput = {
    where: Prisma.blendsWhereUniqueInput;
    create: Prisma.XOR<Prisma.blendsCreateWithoutOrder_itemsInput, Prisma.blendsUncheckedCreateWithoutOrder_itemsInput>;
};
export type blendsUpsertWithoutOrder_itemsInput = {
    update: Prisma.XOR<Prisma.blendsUpdateWithoutOrder_itemsInput, Prisma.blendsUncheckedUpdateWithoutOrder_itemsInput>;
    create: Prisma.XOR<Prisma.blendsCreateWithoutOrder_itemsInput, Prisma.blendsUncheckedCreateWithoutOrder_itemsInput>;
    where?: Prisma.blendsWhereInput;
};
export type blendsUpdateToOneWithWhereWithoutOrder_itemsInput = {
    where?: Prisma.blendsWhereInput;
    data: Prisma.XOR<Prisma.blendsUpdateWithoutOrder_itemsInput, Prisma.blendsUncheckedUpdateWithoutOrder_itemsInput>;
};
export type blendsUpdateWithoutOrder_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUpdateManyWithoutBlendsNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutBlendsNestedInput;
};
export type blendsUncheckedUpdateWithoutOrder_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedUpdateManyWithoutBlendsNestedInput;
};
export type blendsCreateManyFarmsInput = {
    id?: string;
    name: string;
    description?: string | null;
    created_at?: Date | string | null;
};
export type blendsUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUpdateManyWithoutBlendsNestedInput;
    order_items?: Prisma.order_itemsUpdateManyWithoutBlendsNestedInput;
};
export type blendsUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedUpdateManyWithoutBlendsNestedInput;
    order_items?: Prisma.order_itemsUncheckedUpdateManyWithoutBlendsNestedInput;
};
export type blendsUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type BlendsCountOutputType
 */
export type BlendsCountOutputType = {
    blend_ingredients: number;
    order_items: number;
};
export type BlendsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blend_ingredients?: boolean | BlendsCountOutputTypeCountBlend_ingredientsArgs;
    order_items?: boolean | BlendsCountOutputTypeCountOrder_itemsArgs;
};
/**
 * BlendsCountOutputType without action
 */
export type BlendsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BlendsCountOutputType
     */
    select?: Prisma.BlendsCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * BlendsCountOutputType without action
 */
export type BlendsCountOutputTypeCountBlend_ingredientsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.blend_ingredientsWhereInput;
};
/**
 * BlendsCountOutputType without action
 */
export type BlendsCountOutputTypeCountOrder_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.order_itemsWhereInput;
};
export type blendsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    description?: boolean;
    created_at?: boolean;
    blend_ingredients?: boolean | Prisma.blends$blend_ingredientsArgs<ExtArgs>;
    farms?: boolean | Prisma.blends$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.blends$order_itemsArgs<ExtArgs>;
    _count?: boolean | Prisma.BlendsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["blends"]>;
export type blendsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    description?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.blends$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["blends"]>;
export type blendsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    description?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.blends$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["blends"]>;
export type blendsSelectScalar = {
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    description?: boolean;
    created_at?: boolean;
};
export type blendsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farm_id" | "name" | "description" | "created_at", ExtArgs["result"]["blends"]>;
export type blendsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blend_ingredients?: boolean | Prisma.blends$blend_ingredientsArgs<ExtArgs>;
    farms?: boolean | Prisma.blends$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.blends$order_itemsArgs<ExtArgs>;
    _count?: boolean | Prisma.BlendsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type blendsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.blends$farmsArgs<ExtArgs>;
};
export type blendsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.blends$farmsArgs<ExtArgs>;
};
export type $blendsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "blends";
    objects: {
        blend_ingredients: Prisma.$blend_ingredientsPayload<ExtArgs>[];
        farms: Prisma.$farmsPayload<ExtArgs> | null;
        order_items: Prisma.$order_itemsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farm_id: string | null;
        name: string;
        description: string | null;
        created_at: Date | null;
    }, ExtArgs["result"]["blends"]>;
    composites: {};
};
export type blendsGetPayload<S extends boolean | null | undefined | blendsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$blendsPayload, S>;
export type blendsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<blendsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BlendsCountAggregateInputType | true;
};
export interface blendsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['blends'];
        meta: {
            name: 'blends';
        };
    };
    /**
     * Find zero or one Blends that matches the filter.
     * @param {blendsFindUniqueArgs} args - Arguments to find a Blends
     * @example
     * // Get one Blends
     * const blends = await prisma.blends.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends blendsFindUniqueArgs>(args: Prisma.SelectSubset<T, blendsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__blendsClient<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Blends that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {blendsFindUniqueOrThrowArgs} args - Arguments to find a Blends
     * @example
     * // Get one Blends
     * const blends = await prisma.blends.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends blendsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, blendsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__blendsClient<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Blends that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blendsFindFirstArgs} args - Arguments to find a Blends
     * @example
     * // Get one Blends
     * const blends = await prisma.blends.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends blendsFindFirstArgs>(args?: Prisma.SelectSubset<T, blendsFindFirstArgs<ExtArgs>>): Prisma.Prisma__blendsClient<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Blends that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blendsFindFirstOrThrowArgs} args - Arguments to find a Blends
     * @example
     * // Get one Blends
     * const blends = await prisma.blends.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends blendsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, blendsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__blendsClient<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Blends that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blendsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Blends
     * const blends = await prisma.blends.findMany()
     *
     * // Get first 10 Blends
     * const blends = await prisma.blends.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const blendsWithIdOnly = await prisma.blends.findMany({ select: { id: true } })
     *
     */
    findMany<T extends blendsFindManyArgs>(args?: Prisma.SelectSubset<T, blendsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Blends.
     * @param {blendsCreateArgs} args - Arguments to create a Blends.
     * @example
     * // Create one Blends
     * const Blends = await prisma.blends.create({
     *   data: {
     *     // ... data to create a Blends
     *   }
     * })
     *
     */
    create<T extends blendsCreateArgs>(args: Prisma.SelectSubset<T, blendsCreateArgs<ExtArgs>>): Prisma.Prisma__blendsClient<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Blends.
     * @param {blendsCreateManyArgs} args - Arguments to create many Blends.
     * @example
     * // Create many Blends
     * const blends = await prisma.blends.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends blendsCreateManyArgs>(args?: Prisma.SelectSubset<T, blendsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Blends and returns the data saved in the database.
     * @param {blendsCreateManyAndReturnArgs} args - Arguments to create many Blends.
     * @example
     * // Create many Blends
     * const blends = await prisma.blends.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Blends and only return the `id`
     * const blendsWithIdOnly = await prisma.blends.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends blendsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, blendsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Blends.
     * @param {blendsDeleteArgs} args - Arguments to delete one Blends.
     * @example
     * // Delete one Blends
     * const Blends = await prisma.blends.delete({
     *   where: {
     *     // ... filter to delete one Blends
     *   }
     * })
     *
     */
    delete<T extends blendsDeleteArgs>(args: Prisma.SelectSubset<T, blendsDeleteArgs<ExtArgs>>): Prisma.Prisma__blendsClient<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Blends.
     * @param {blendsUpdateArgs} args - Arguments to update one Blends.
     * @example
     * // Update one Blends
     * const blends = await prisma.blends.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends blendsUpdateArgs>(args: Prisma.SelectSubset<T, blendsUpdateArgs<ExtArgs>>): Prisma.Prisma__blendsClient<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Blends.
     * @param {blendsDeleteManyArgs} args - Arguments to filter Blends to delete.
     * @example
     * // Delete a few Blends
     * const { count } = await prisma.blends.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends blendsDeleteManyArgs>(args?: Prisma.SelectSubset<T, blendsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Blends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blendsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Blends
     * const blends = await prisma.blends.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends blendsUpdateManyArgs>(args: Prisma.SelectSubset<T, blendsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Blends and returns the data updated in the database.
     * @param {blendsUpdateManyAndReturnArgs} args - Arguments to update many Blends.
     * @example
     * // Update many Blends
     * const blends = await prisma.blends.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Blends and only return the `id`
     * const blendsWithIdOnly = await prisma.blends.updateManyAndReturn({
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
    updateManyAndReturn<T extends blendsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, blendsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Blends.
     * @param {blendsUpsertArgs} args - Arguments to update or create a Blends.
     * @example
     * // Update or create a Blends
     * const blends = await prisma.blends.upsert({
     *   create: {
     *     // ... data to create a Blends
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Blends we want to update
     *   }
     * })
     */
    upsert<T extends blendsUpsertArgs>(args: Prisma.SelectSubset<T, blendsUpsertArgs<ExtArgs>>): Prisma.Prisma__blendsClient<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Blends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blendsCountArgs} args - Arguments to filter Blends to count.
     * @example
     * // Count the number of Blends
     * const count = await prisma.blends.count({
     *   where: {
     *     // ... the filter for the Blends we want to count
     *   }
     * })
    **/
    count<T extends blendsCountArgs>(args?: Prisma.Subset<T, blendsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BlendsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Blends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BlendsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BlendsAggregateArgs>(args: Prisma.Subset<T, BlendsAggregateArgs>): Prisma.PrismaPromise<GetBlendsAggregateType<T>>;
    /**
     * Group by Blends.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blendsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends blendsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: blendsGroupByArgs['orderBy'];
    } : {
        orderBy?: blendsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, blendsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlendsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the blends model
     */
    readonly fields: blendsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for blends.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__blendsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    blend_ingredients<T extends Prisma.blends$blend_ingredientsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.blends$blend_ingredientsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    farms<T extends Prisma.blends$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.blends$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    order_items<T extends Prisma.blends$order_itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.blends$order_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the blends model
 */
export interface blendsFieldRefs {
    readonly id: Prisma.FieldRef<"blends", 'String'>;
    readonly farm_id: Prisma.FieldRef<"blends", 'String'>;
    readonly name: Prisma.FieldRef<"blends", 'String'>;
    readonly description: Prisma.FieldRef<"blends", 'String'>;
    readonly created_at: Prisma.FieldRef<"blends", 'DateTime'>;
}
/**
 * blends findUnique
 */
export type blendsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which blends to fetch.
     */
    where: Prisma.blendsWhereUniqueInput;
};
/**
 * blends findUniqueOrThrow
 */
export type blendsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which blends to fetch.
     */
    where: Prisma.blendsWhereUniqueInput;
};
/**
 * blends findFirst
 */
export type blendsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which blends to fetch.
     */
    where?: Prisma.blendsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of blends to fetch.
     */
    orderBy?: Prisma.blendsOrderByWithRelationInput | Prisma.blendsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for blends.
     */
    cursor?: Prisma.blendsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` blends from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` blends.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of blends.
     */
    distinct?: Prisma.BlendsScalarFieldEnum | Prisma.BlendsScalarFieldEnum[];
};
/**
 * blends findFirstOrThrow
 */
export type blendsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which blends to fetch.
     */
    where?: Prisma.blendsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of blends to fetch.
     */
    orderBy?: Prisma.blendsOrderByWithRelationInput | Prisma.blendsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for blends.
     */
    cursor?: Prisma.blendsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` blends from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` blends.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of blends.
     */
    distinct?: Prisma.BlendsScalarFieldEnum | Prisma.BlendsScalarFieldEnum[];
};
/**
 * blends findMany
 */
export type blendsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which blends to fetch.
     */
    where?: Prisma.blendsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of blends to fetch.
     */
    orderBy?: Prisma.blendsOrderByWithRelationInput | Prisma.blendsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing blends.
     */
    cursor?: Prisma.blendsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` blends from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` blends.
     */
    skip?: number;
    distinct?: Prisma.BlendsScalarFieldEnum | Prisma.BlendsScalarFieldEnum[];
};
/**
 * blends create
 */
export type blendsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a blends.
     */
    data: Prisma.XOR<Prisma.blendsCreateInput, Prisma.blendsUncheckedCreateInput>;
};
/**
 * blends createMany
 */
export type blendsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many blends.
     */
    data: Prisma.blendsCreateManyInput | Prisma.blendsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * blends createManyAndReturn
 */
export type blendsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blends
     */
    select?: Prisma.blendsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the blends
     */
    omit?: Prisma.blendsOmit<ExtArgs> | null;
    /**
     * The data used to create many blends.
     */
    data: Prisma.blendsCreateManyInput | Prisma.blendsCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.blendsIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * blends update
 */
export type blendsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a blends.
     */
    data: Prisma.XOR<Prisma.blendsUpdateInput, Prisma.blendsUncheckedUpdateInput>;
    /**
     * Choose, which blends to update.
     */
    where: Prisma.blendsWhereUniqueInput;
};
/**
 * blends updateMany
 */
export type blendsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update blends.
     */
    data: Prisma.XOR<Prisma.blendsUpdateManyMutationInput, Prisma.blendsUncheckedUpdateManyInput>;
    /**
     * Filter which blends to update
     */
    where?: Prisma.blendsWhereInput;
    /**
     * Limit how many blends to update.
     */
    limit?: number;
};
/**
 * blends updateManyAndReturn
 */
export type blendsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blends
     */
    select?: Prisma.blendsSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the blends
     */
    omit?: Prisma.blendsOmit<ExtArgs> | null;
    /**
     * The data used to update blends.
     */
    data: Prisma.XOR<Prisma.blendsUpdateManyMutationInput, Prisma.blendsUncheckedUpdateManyInput>;
    /**
     * Filter which blends to update
     */
    where?: Prisma.blendsWhereInput;
    /**
     * Limit how many blends to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.blendsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * blends upsert
 */
export type blendsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the blends to update in case it exists.
     */
    where: Prisma.blendsWhereUniqueInput;
    /**
     * In case the blends found by the `where` argument doesn't exist, create a new blends with this data.
     */
    create: Prisma.XOR<Prisma.blendsCreateInput, Prisma.blendsUncheckedCreateInput>;
    /**
     * In case the blends was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.blendsUpdateInput, Prisma.blendsUncheckedUpdateInput>;
};
/**
 * blends delete
 */
export type blendsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which blends to delete.
     */
    where: Prisma.blendsWhereUniqueInput;
};
/**
 * blends deleteMany
 */
export type blendsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which blends to delete
     */
    where?: Prisma.blendsWhereInput;
    /**
     * Limit how many blends to delete.
     */
    limit?: number;
};
/**
 * blends.blend_ingredients
 */
export type blends$blend_ingredientsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blend_ingredients
     */
    select?: Prisma.blend_ingredientsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the blend_ingredients
     */
    omit?: Prisma.blend_ingredientsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.blend_ingredientsInclude<ExtArgs> | null;
    where?: Prisma.blend_ingredientsWhereInput;
    orderBy?: Prisma.blend_ingredientsOrderByWithRelationInput | Prisma.blend_ingredientsOrderByWithRelationInput[];
    cursor?: Prisma.blend_ingredientsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Blend_ingredientsScalarFieldEnum | Prisma.Blend_ingredientsScalarFieldEnum[];
};
/**
 * blends.farms
 */
export type blends$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * blends.order_items
 */
export type blends$order_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order_items
     */
    select?: Prisma.order_itemsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the order_items
     */
    omit?: Prisma.order_itemsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.order_itemsInclude<ExtArgs> | null;
    where?: Prisma.order_itemsWhereInput;
    orderBy?: Prisma.order_itemsOrderByWithRelationInput | Prisma.order_itemsOrderByWithRelationInput[];
    cursor?: Prisma.order_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Order_itemsScalarFieldEnum | Prisma.Order_itemsScalarFieldEnum[];
};
/**
 * blends without action
 */
export type blendsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=blends.d.ts.map