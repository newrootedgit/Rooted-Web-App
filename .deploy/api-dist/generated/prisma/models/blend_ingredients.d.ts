import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model blend_ingredients
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type blend_ingredientsModel = runtime.Types.Result.DefaultSelection<Prisma.$blend_ingredientsPayload>;
export type AggregateBlend_ingredients = {
    _count: Blend_ingredientsCountAggregateOutputType | null;
    _avg: Blend_ingredientsAvgAggregateOutputType | null;
    _sum: Blend_ingredientsSumAggregateOutputType | null;
    _min: Blend_ingredientsMinAggregateOutputType | null;
    _max: Blend_ingredientsMaxAggregateOutputType | null;
};
export type Blend_ingredientsAvgAggregateOutputType = {
    percentage: runtime.Decimal | null;
};
export type Blend_ingredientsSumAggregateOutputType = {
    percentage: runtime.Decimal | null;
};
export type Blend_ingredientsMinAggregateOutputType = {
    id: string | null;
    blend_id: string | null;
    product_id: string | null;
    percentage: runtime.Decimal | null;
};
export type Blend_ingredientsMaxAggregateOutputType = {
    id: string | null;
    blend_id: string | null;
    product_id: string | null;
    percentage: runtime.Decimal | null;
};
export type Blend_ingredientsCountAggregateOutputType = {
    id: number;
    blend_id: number;
    product_id: number;
    percentage: number;
    timing_override: number;
    _all: number;
};
export type Blend_ingredientsAvgAggregateInputType = {
    percentage?: true;
};
export type Blend_ingredientsSumAggregateInputType = {
    percentage?: true;
};
export type Blend_ingredientsMinAggregateInputType = {
    id?: true;
    blend_id?: true;
    product_id?: true;
    percentage?: true;
};
export type Blend_ingredientsMaxAggregateInputType = {
    id?: true;
    blend_id?: true;
    product_id?: true;
    percentage?: true;
};
export type Blend_ingredientsCountAggregateInputType = {
    id?: true;
    blend_id?: true;
    product_id?: true;
    percentage?: true;
    timing_override?: true;
    _all?: true;
};
export type Blend_ingredientsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which blend_ingredients to aggregate.
     */
    where?: Prisma.blend_ingredientsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of blend_ingredients to fetch.
     */
    orderBy?: Prisma.blend_ingredientsOrderByWithRelationInput | Prisma.blend_ingredientsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.blend_ingredientsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` blend_ingredients from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` blend_ingredients.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned blend_ingredients
    **/
    _count?: true | Blend_ingredientsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Blend_ingredientsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Blend_ingredientsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Blend_ingredientsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Blend_ingredientsMaxAggregateInputType;
};
export type GetBlend_ingredientsAggregateType<T extends Blend_ingredientsAggregateArgs> = {
    [P in keyof T & keyof AggregateBlend_ingredients]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBlend_ingredients[P]> : Prisma.GetScalarType<T[P], AggregateBlend_ingredients[P]>;
};
export type blend_ingredientsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.blend_ingredientsWhereInput;
    orderBy?: Prisma.blend_ingredientsOrderByWithAggregationInput | Prisma.blend_ingredientsOrderByWithAggregationInput[];
    by: Prisma.Blend_ingredientsScalarFieldEnum[] | Prisma.Blend_ingredientsScalarFieldEnum;
    having?: Prisma.blend_ingredientsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Blend_ingredientsCountAggregateInputType | true;
    _avg?: Blend_ingredientsAvgAggregateInputType;
    _sum?: Blend_ingredientsSumAggregateInputType;
    _min?: Blend_ingredientsMinAggregateInputType;
    _max?: Blend_ingredientsMaxAggregateInputType;
};
export type Blend_ingredientsGroupByOutputType = {
    id: string;
    blend_id: string | null;
    product_id: string | null;
    percentage: runtime.Decimal;
    timing_override: runtime.JsonValue | null;
    _count: Blend_ingredientsCountAggregateOutputType | null;
    _avg: Blend_ingredientsAvgAggregateOutputType | null;
    _sum: Blend_ingredientsSumAggregateOutputType | null;
    _min: Blend_ingredientsMinAggregateOutputType | null;
    _max: Blend_ingredientsMaxAggregateOutputType | null;
};
type GetBlend_ingredientsGroupByPayload<T extends blend_ingredientsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Blend_ingredientsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Blend_ingredientsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Blend_ingredientsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Blend_ingredientsGroupByOutputType[P]>;
}>>;
export type blend_ingredientsWhereInput = {
    AND?: Prisma.blend_ingredientsWhereInput | Prisma.blend_ingredientsWhereInput[];
    OR?: Prisma.blend_ingredientsWhereInput[];
    NOT?: Prisma.blend_ingredientsWhereInput | Prisma.blend_ingredientsWhereInput[];
    id?: Prisma.UuidFilter<"blend_ingredients"> | string;
    blend_id?: Prisma.UuidNullableFilter<"blend_ingredients"> | string | null;
    product_id?: Prisma.UuidNullableFilter<"blend_ingredients"> | string | null;
    percentage?: Prisma.DecimalFilter<"blend_ingredients"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.JsonNullableFilter<"blend_ingredients">;
    blends?: Prisma.XOR<Prisma.BlendsNullableScalarRelationFilter, Prisma.blendsWhereInput> | null;
    products?: Prisma.XOR<Prisma.ProductsNullableScalarRelationFilter, Prisma.productsWhereInput> | null;
};
export type blend_ingredientsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    blend_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    product_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
    timing_override?: Prisma.SortOrderInput | Prisma.SortOrder;
    blends?: Prisma.blendsOrderByWithRelationInput;
    products?: Prisma.productsOrderByWithRelationInput;
};
export type blend_ingredientsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.blend_ingredientsWhereInput | Prisma.blend_ingredientsWhereInput[];
    OR?: Prisma.blend_ingredientsWhereInput[];
    NOT?: Prisma.blend_ingredientsWhereInput | Prisma.blend_ingredientsWhereInput[];
    blend_id?: Prisma.UuidNullableFilter<"blend_ingredients"> | string | null;
    product_id?: Prisma.UuidNullableFilter<"blend_ingredients"> | string | null;
    percentage?: Prisma.DecimalFilter<"blend_ingredients"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.JsonNullableFilter<"blend_ingredients">;
    blends?: Prisma.XOR<Prisma.BlendsNullableScalarRelationFilter, Prisma.blendsWhereInput> | null;
    products?: Prisma.XOR<Prisma.ProductsNullableScalarRelationFilter, Prisma.productsWhereInput> | null;
}, "id">;
export type blend_ingredientsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    blend_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    product_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
    timing_override?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.blend_ingredientsCountOrderByAggregateInput;
    _avg?: Prisma.blend_ingredientsAvgOrderByAggregateInput;
    _max?: Prisma.blend_ingredientsMaxOrderByAggregateInput;
    _min?: Prisma.blend_ingredientsMinOrderByAggregateInput;
    _sum?: Prisma.blend_ingredientsSumOrderByAggregateInput;
};
export type blend_ingredientsScalarWhereWithAggregatesInput = {
    AND?: Prisma.blend_ingredientsScalarWhereWithAggregatesInput | Prisma.blend_ingredientsScalarWhereWithAggregatesInput[];
    OR?: Prisma.blend_ingredientsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.blend_ingredientsScalarWhereWithAggregatesInput | Prisma.blend_ingredientsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"blend_ingredients"> | string;
    blend_id?: Prisma.UuidNullableWithAggregatesFilter<"blend_ingredients"> | string | null;
    product_id?: Prisma.UuidNullableWithAggregatesFilter<"blend_ingredients"> | string | null;
    percentage?: Prisma.DecimalWithAggregatesFilter<"blend_ingredients"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.JsonNullableWithAggregatesFilter<"blend_ingredients">;
};
export type blend_ingredientsCreateInput = {
    id?: string;
    percentage: runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    blends?: Prisma.blendsCreateNestedOneWithoutBlend_ingredientsInput;
    products?: Prisma.productsCreateNestedOneWithoutBlend_ingredientsInput;
};
export type blend_ingredientsUncheckedCreateInput = {
    id?: string;
    blend_id?: string | null;
    product_id?: string | null;
    percentage: runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    blends?: Prisma.blendsUpdateOneWithoutBlend_ingredientsNestedInput;
    products?: Prisma.productsUpdateOneWithoutBlend_ingredientsNestedInput;
};
export type blend_ingredientsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsCreateManyInput = {
    id?: string;
    blend_id?: string | null;
    product_id?: string | null;
    percentage: runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blend_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
    timing_override?: Prisma.SortOrder;
};
export type blend_ingredientsAvgOrderByAggregateInput = {
    percentage?: Prisma.SortOrder;
};
export type blend_ingredientsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blend_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
};
export type blend_ingredientsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    blend_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
};
export type blend_ingredientsSumOrderByAggregateInput = {
    percentage?: Prisma.SortOrder;
};
export type Blend_ingredientsListRelationFilter = {
    every?: Prisma.blend_ingredientsWhereInput;
    some?: Prisma.blend_ingredientsWhereInput;
    none?: Prisma.blend_ingredientsWhereInput;
};
export type blend_ingredientsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type blend_ingredientsCreateNestedManyWithoutBlendsInput = {
    create?: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutBlendsInput, Prisma.blend_ingredientsUncheckedCreateWithoutBlendsInput> | Prisma.blend_ingredientsCreateWithoutBlendsInput[] | Prisma.blend_ingredientsUncheckedCreateWithoutBlendsInput[];
    connectOrCreate?: Prisma.blend_ingredientsCreateOrConnectWithoutBlendsInput | Prisma.blend_ingredientsCreateOrConnectWithoutBlendsInput[];
    createMany?: Prisma.blend_ingredientsCreateManyBlendsInputEnvelope;
    connect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
};
export type blend_ingredientsUncheckedCreateNestedManyWithoutBlendsInput = {
    create?: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutBlendsInput, Prisma.blend_ingredientsUncheckedCreateWithoutBlendsInput> | Prisma.blend_ingredientsCreateWithoutBlendsInput[] | Prisma.blend_ingredientsUncheckedCreateWithoutBlendsInput[];
    connectOrCreate?: Prisma.blend_ingredientsCreateOrConnectWithoutBlendsInput | Prisma.blend_ingredientsCreateOrConnectWithoutBlendsInput[];
    createMany?: Prisma.blend_ingredientsCreateManyBlendsInputEnvelope;
    connect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
};
export type blend_ingredientsUpdateManyWithoutBlendsNestedInput = {
    create?: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutBlendsInput, Prisma.blend_ingredientsUncheckedCreateWithoutBlendsInput> | Prisma.blend_ingredientsCreateWithoutBlendsInput[] | Prisma.blend_ingredientsUncheckedCreateWithoutBlendsInput[];
    connectOrCreate?: Prisma.blend_ingredientsCreateOrConnectWithoutBlendsInput | Prisma.blend_ingredientsCreateOrConnectWithoutBlendsInput[];
    upsert?: Prisma.blend_ingredientsUpsertWithWhereUniqueWithoutBlendsInput | Prisma.blend_ingredientsUpsertWithWhereUniqueWithoutBlendsInput[];
    createMany?: Prisma.blend_ingredientsCreateManyBlendsInputEnvelope;
    set?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    disconnect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    delete?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    connect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    update?: Prisma.blend_ingredientsUpdateWithWhereUniqueWithoutBlendsInput | Prisma.blend_ingredientsUpdateWithWhereUniqueWithoutBlendsInput[];
    updateMany?: Prisma.blend_ingredientsUpdateManyWithWhereWithoutBlendsInput | Prisma.blend_ingredientsUpdateManyWithWhereWithoutBlendsInput[];
    deleteMany?: Prisma.blend_ingredientsScalarWhereInput | Prisma.blend_ingredientsScalarWhereInput[];
};
export type blend_ingredientsUncheckedUpdateManyWithoutBlendsNestedInput = {
    create?: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutBlendsInput, Prisma.blend_ingredientsUncheckedCreateWithoutBlendsInput> | Prisma.blend_ingredientsCreateWithoutBlendsInput[] | Prisma.blend_ingredientsUncheckedCreateWithoutBlendsInput[];
    connectOrCreate?: Prisma.blend_ingredientsCreateOrConnectWithoutBlendsInput | Prisma.blend_ingredientsCreateOrConnectWithoutBlendsInput[];
    upsert?: Prisma.blend_ingredientsUpsertWithWhereUniqueWithoutBlendsInput | Prisma.blend_ingredientsUpsertWithWhereUniqueWithoutBlendsInput[];
    createMany?: Prisma.blend_ingredientsCreateManyBlendsInputEnvelope;
    set?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    disconnect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    delete?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    connect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    update?: Prisma.blend_ingredientsUpdateWithWhereUniqueWithoutBlendsInput | Prisma.blend_ingredientsUpdateWithWhereUniqueWithoutBlendsInput[];
    updateMany?: Prisma.blend_ingredientsUpdateManyWithWhereWithoutBlendsInput | Prisma.blend_ingredientsUpdateManyWithWhereWithoutBlendsInput[];
    deleteMany?: Prisma.blend_ingredientsScalarWhereInput | Prisma.blend_ingredientsScalarWhereInput[];
};
export type blend_ingredientsCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutProductsInput, Prisma.blend_ingredientsUncheckedCreateWithoutProductsInput> | Prisma.blend_ingredientsCreateWithoutProductsInput[] | Prisma.blend_ingredientsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.blend_ingredientsCreateOrConnectWithoutProductsInput | Prisma.blend_ingredientsCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.blend_ingredientsCreateManyProductsInputEnvelope;
    connect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
};
export type blend_ingredientsUncheckedCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutProductsInput, Prisma.blend_ingredientsUncheckedCreateWithoutProductsInput> | Prisma.blend_ingredientsCreateWithoutProductsInput[] | Prisma.blend_ingredientsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.blend_ingredientsCreateOrConnectWithoutProductsInput | Prisma.blend_ingredientsCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.blend_ingredientsCreateManyProductsInputEnvelope;
    connect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
};
export type blend_ingredientsUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutProductsInput, Prisma.blend_ingredientsUncheckedCreateWithoutProductsInput> | Prisma.blend_ingredientsCreateWithoutProductsInput[] | Prisma.blend_ingredientsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.blend_ingredientsCreateOrConnectWithoutProductsInput | Prisma.blend_ingredientsCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.blend_ingredientsUpsertWithWhereUniqueWithoutProductsInput | Prisma.blend_ingredientsUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.blend_ingredientsCreateManyProductsInputEnvelope;
    set?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    disconnect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    delete?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    connect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    update?: Prisma.blend_ingredientsUpdateWithWhereUniqueWithoutProductsInput | Prisma.blend_ingredientsUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.blend_ingredientsUpdateManyWithWhereWithoutProductsInput | Prisma.blend_ingredientsUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.blend_ingredientsScalarWhereInput | Prisma.blend_ingredientsScalarWhereInput[];
};
export type blend_ingredientsUncheckedUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutProductsInput, Prisma.blend_ingredientsUncheckedCreateWithoutProductsInput> | Prisma.blend_ingredientsCreateWithoutProductsInput[] | Prisma.blend_ingredientsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.blend_ingredientsCreateOrConnectWithoutProductsInput | Prisma.blend_ingredientsCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.blend_ingredientsUpsertWithWhereUniqueWithoutProductsInput | Prisma.blend_ingredientsUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.blend_ingredientsCreateManyProductsInputEnvelope;
    set?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    disconnect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    delete?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    connect?: Prisma.blend_ingredientsWhereUniqueInput | Prisma.blend_ingredientsWhereUniqueInput[];
    update?: Prisma.blend_ingredientsUpdateWithWhereUniqueWithoutProductsInput | Prisma.blend_ingredientsUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.blend_ingredientsUpdateManyWithWhereWithoutProductsInput | Prisma.blend_ingredientsUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.blend_ingredientsScalarWhereInput | Prisma.blend_ingredientsScalarWhereInput[];
};
export type blend_ingredientsCreateWithoutBlendsInput = {
    id?: string;
    percentage: runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    products?: Prisma.productsCreateNestedOneWithoutBlend_ingredientsInput;
};
export type blend_ingredientsUncheckedCreateWithoutBlendsInput = {
    id?: string;
    product_id?: string | null;
    percentage: runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsCreateOrConnectWithoutBlendsInput = {
    where: Prisma.blend_ingredientsWhereUniqueInput;
    create: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutBlendsInput, Prisma.blend_ingredientsUncheckedCreateWithoutBlendsInput>;
};
export type blend_ingredientsCreateManyBlendsInputEnvelope = {
    data: Prisma.blend_ingredientsCreateManyBlendsInput | Prisma.blend_ingredientsCreateManyBlendsInput[];
    skipDuplicates?: boolean;
};
export type blend_ingredientsUpsertWithWhereUniqueWithoutBlendsInput = {
    where: Prisma.blend_ingredientsWhereUniqueInput;
    update: Prisma.XOR<Prisma.blend_ingredientsUpdateWithoutBlendsInput, Prisma.blend_ingredientsUncheckedUpdateWithoutBlendsInput>;
    create: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutBlendsInput, Prisma.blend_ingredientsUncheckedCreateWithoutBlendsInput>;
};
export type blend_ingredientsUpdateWithWhereUniqueWithoutBlendsInput = {
    where: Prisma.blend_ingredientsWhereUniqueInput;
    data: Prisma.XOR<Prisma.blend_ingredientsUpdateWithoutBlendsInput, Prisma.blend_ingredientsUncheckedUpdateWithoutBlendsInput>;
};
export type blend_ingredientsUpdateManyWithWhereWithoutBlendsInput = {
    where: Prisma.blend_ingredientsScalarWhereInput;
    data: Prisma.XOR<Prisma.blend_ingredientsUpdateManyMutationInput, Prisma.blend_ingredientsUncheckedUpdateManyWithoutBlendsInput>;
};
export type blend_ingredientsScalarWhereInput = {
    AND?: Prisma.blend_ingredientsScalarWhereInput | Prisma.blend_ingredientsScalarWhereInput[];
    OR?: Prisma.blend_ingredientsScalarWhereInput[];
    NOT?: Prisma.blend_ingredientsScalarWhereInput | Prisma.blend_ingredientsScalarWhereInput[];
    id?: Prisma.UuidFilter<"blend_ingredients"> | string;
    blend_id?: Prisma.UuidNullableFilter<"blend_ingredients"> | string | null;
    product_id?: Prisma.UuidNullableFilter<"blend_ingredients"> | string | null;
    percentage?: Prisma.DecimalFilter<"blend_ingredients"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.JsonNullableFilter<"blend_ingredients">;
};
export type blend_ingredientsCreateWithoutProductsInput = {
    id?: string;
    percentage: runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    blends?: Prisma.blendsCreateNestedOneWithoutBlend_ingredientsInput;
};
export type blend_ingredientsUncheckedCreateWithoutProductsInput = {
    id?: string;
    blend_id?: string | null;
    percentage: runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsCreateOrConnectWithoutProductsInput = {
    where: Prisma.blend_ingredientsWhereUniqueInput;
    create: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutProductsInput, Prisma.blend_ingredientsUncheckedCreateWithoutProductsInput>;
};
export type blend_ingredientsCreateManyProductsInputEnvelope = {
    data: Prisma.blend_ingredientsCreateManyProductsInput | Prisma.blend_ingredientsCreateManyProductsInput[];
    skipDuplicates?: boolean;
};
export type blend_ingredientsUpsertWithWhereUniqueWithoutProductsInput = {
    where: Prisma.blend_ingredientsWhereUniqueInput;
    update: Prisma.XOR<Prisma.blend_ingredientsUpdateWithoutProductsInput, Prisma.blend_ingredientsUncheckedUpdateWithoutProductsInput>;
    create: Prisma.XOR<Prisma.blend_ingredientsCreateWithoutProductsInput, Prisma.blend_ingredientsUncheckedCreateWithoutProductsInput>;
};
export type blend_ingredientsUpdateWithWhereUniqueWithoutProductsInput = {
    where: Prisma.blend_ingredientsWhereUniqueInput;
    data: Prisma.XOR<Prisma.blend_ingredientsUpdateWithoutProductsInput, Prisma.blend_ingredientsUncheckedUpdateWithoutProductsInput>;
};
export type blend_ingredientsUpdateManyWithWhereWithoutProductsInput = {
    where: Prisma.blend_ingredientsScalarWhereInput;
    data: Prisma.XOR<Prisma.blend_ingredientsUpdateManyMutationInput, Prisma.blend_ingredientsUncheckedUpdateManyWithoutProductsInput>;
};
export type blend_ingredientsCreateManyBlendsInput = {
    id?: string;
    product_id?: string | null;
    percentage: runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsUpdateWithoutBlendsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    products?: Prisma.productsUpdateOneWithoutBlend_ingredientsNestedInput;
};
export type blend_ingredientsUncheckedUpdateWithoutBlendsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsUncheckedUpdateManyWithoutBlendsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsCreateManyProductsInput = {
    id?: string;
    blend_id?: string | null;
    percentage: runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    blends?: Prisma.blendsUpdateOneWithoutBlend_ingredientsNestedInput;
};
export type blend_ingredientsUncheckedUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsUncheckedUpdateManyWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    percentage?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    timing_override?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
};
export type blend_ingredientsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blend_id?: boolean;
    product_id?: boolean;
    percentage?: boolean;
    timing_override?: boolean;
    blends?: boolean | Prisma.blend_ingredients$blendsArgs<ExtArgs>;
    products?: boolean | Prisma.blend_ingredients$productsArgs<ExtArgs>;
}, ExtArgs["result"]["blend_ingredients"]>;
export type blend_ingredientsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blend_id?: boolean;
    product_id?: boolean;
    percentage?: boolean;
    timing_override?: boolean;
    blends?: boolean | Prisma.blend_ingredients$blendsArgs<ExtArgs>;
    products?: boolean | Prisma.blend_ingredients$productsArgs<ExtArgs>;
}, ExtArgs["result"]["blend_ingredients"]>;
export type blend_ingredientsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    blend_id?: boolean;
    product_id?: boolean;
    percentage?: boolean;
    timing_override?: boolean;
    blends?: boolean | Prisma.blend_ingredients$blendsArgs<ExtArgs>;
    products?: boolean | Prisma.blend_ingredients$productsArgs<ExtArgs>;
}, ExtArgs["result"]["blend_ingredients"]>;
export type blend_ingredientsSelectScalar = {
    id?: boolean;
    blend_id?: boolean;
    product_id?: boolean;
    percentage?: boolean;
    timing_override?: boolean;
};
export type blend_ingredientsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "blend_id" | "product_id" | "percentage" | "timing_override", ExtArgs["result"]["blend_ingredients"]>;
export type blend_ingredientsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blends?: boolean | Prisma.blend_ingredients$blendsArgs<ExtArgs>;
    products?: boolean | Prisma.blend_ingredients$productsArgs<ExtArgs>;
};
export type blend_ingredientsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blends?: boolean | Prisma.blend_ingredients$blendsArgs<ExtArgs>;
    products?: boolean | Prisma.blend_ingredients$productsArgs<ExtArgs>;
};
export type blend_ingredientsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blends?: boolean | Prisma.blend_ingredients$blendsArgs<ExtArgs>;
    products?: boolean | Prisma.blend_ingredients$productsArgs<ExtArgs>;
};
export type $blend_ingredientsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "blend_ingredients";
    objects: {
        blends: Prisma.$blendsPayload<ExtArgs> | null;
        products: Prisma.$productsPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        blend_id: string | null;
        product_id: string | null;
        percentage: runtime.Decimal;
        timing_override: runtime.JsonValue | null;
    }, ExtArgs["result"]["blend_ingredients"]>;
    composites: {};
};
export type blend_ingredientsGetPayload<S extends boolean | null | undefined | blend_ingredientsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload, S>;
export type blend_ingredientsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<blend_ingredientsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Blend_ingredientsCountAggregateInputType | true;
};
export interface blend_ingredientsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['blend_ingredients'];
        meta: {
            name: 'blend_ingredients';
        };
    };
    /**
     * Find zero or one Blend_ingredients that matches the filter.
     * @param {blend_ingredientsFindUniqueArgs} args - Arguments to find a Blend_ingredients
     * @example
     * // Get one Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends blend_ingredientsFindUniqueArgs>(args: Prisma.SelectSubset<T, blend_ingredientsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__blend_ingredientsClient<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Blend_ingredients that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {blend_ingredientsFindUniqueOrThrowArgs} args - Arguments to find a Blend_ingredients
     * @example
     * // Get one Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends blend_ingredientsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, blend_ingredientsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__blend_ingredientsClient<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Blend_ingredients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blend_ingredientsFindFirstArgs} args - Arguments to find a Blend_ingredients
     * @example
     * // Get one Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends blend_ingredientsFindFirstArgs>(args?: Prisma.SelectSubset<T, blend_ingredientsFindFirstArgs<ExtArgs>>): Prisma.Prisma__blend_ingredientsClient<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Blend_ingredients that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blend_ingredientsFindFirstOrThrowArgs} args - Arguments to find a Blend_ingredients
     * @example
     * // Get one Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends blend_ingredientsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, blend_ingredientsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__blend_ingredientsClient<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Blend_ingredients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blend_ingredientsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.findMany()
     *
     * // Get first 10 Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const blend_ingredientsWithIdOnly = await prisma.blend_ingredients.findMany({ select: { id: true } })
     *
     */
    findMany<T extends blend_ingredientsFindManyArgs>(args?: Prisma.SelectSubset<T, blend_ingredientsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Blend_ingredients.
     * @param {blend_ingredientsCreateArgs} args - Arguments to create a Blend_ingredients.
     * @example
     * // Create one Blend_ingredients
     * const Blend_ingredients = await prisma.blend_ingredients.create({
     *   data: {
     *     // ... data to create a Blend_ingredients
     *   }
     * })
     *
     */
    create<T extends blend_ingredientsCreateArgs>(args: Prisma.SelectSubset<T, blend_ingredientsCreateArgs<ExtArgs>>): Prisma.Prisma__blend_ingredientsClient<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Blend_ingredients.
     * @param {blend_ingredientsCreateManyArgs} args - Arguments to create many Blend_ingredients.
     * @example
     * // Create many Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends blend_ingredientsCreateManyArgs>(args?: Prisma.SelectSubset<T, blend_ingredientsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Blend_ingredients and returns the data saved in the database.
     * @param {blend_ingredientsCreateManyAndReturnArgs} args - Arguments to create many Blend_ingredients.
     * @example
     * // Create many Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Blend_ingredients and only return the `id`
     * const blend_ingredientsWithIdOnly = await prisma.blend_ingredients.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends blend_ingredientsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, blend_ingredientsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Blend_ingredients.
     * @param {blend_ingredientsDeleteArgs} args - Arguments to delete one Blend_ingredients.
     * @example
     * // Delete one Blend_ingredients
     * const Blend_ingredients = await prisma.blend_ingredients.delete({
     *   where: {
     *     // ... filter to delete one Blend_ingredients
     *   }
     * })
     *
     */
    delete<T extends blend_ingredientsDeleteArgs>(args: Prisma.SelectSubset<T, blend_ingredientsDeleteArgs<ExtArgs>>): Prisma.Prisma__blend_ingredientsClient<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Blend_ingredients.
     * @param {blend_ingredientsUpdateArgs} args - Arguments to update one Blend_ingredients.
     * @example
     * // Update one Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends blend_ingredientsUpdateArgs>(args: Prisma.SelectSubset<T, blend_ingredientsUpdateArgs<ExtArgs>>): Prisma.Prisma__blend_ingredientsClient<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Blend_ingredients.
     * @param {blend_ingredientsDeleteManyArgs} args - Arguments to filter Blend_ingredients to delete.
     * @example
     * // Delete a few Blend_ingredients
     * const { count } = await prisma.blend_ingredients.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends blend_ingredientsDeleteManyArgs>(args?: Prisma.SelectSubset<T, blend_ingredientsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Blend_ingredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blend_ingredientsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends blend_ingredientsUpdateManyArgs>(args: Prisma.SelectSubset<T, blend_ingredientsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Blend_ingredients and returns the data updated in the database.
     * @param {blend_ingredientsUpdateManyAndReturnArgs} args - Arguments to update many Blend_ingredients.
     * @example
     * // Update many Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Blend_ingredients and only return the `id`
     * const blend_ingredientsWithIdOnly = await prisma.blend_ingredients.updateManyAndReturn({
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
    updateManyAndReturn<T extends blend_ingredientsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, blend_ingredientsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Blend_ingredients.
     * @param {blend_ingredientsUpsertArgs} args - Arguments to update or create a Blend_ingredients.
     * @example
     * // Update or create a Blend_ingredients
     * const blend_ingredients = await prisma.blend_ingredients.upsert({
     *   create: {
     *     // ... data to create a Blend_ingredients
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Blend_ingredients we want to update
     *   }
     * })
     */
    upsert<T extends blend_ingredientsUpsertArgs>(args: Prisma.SelectSubset<T, blend_ingredientsUpsertArgs<ExtArgs>>): Prisma.Prisma__blend_ingredientsClient<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Blend_ingredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blend_ingredientsCountArgs} args - Arguments to filter Blend_ingredients to count.
     * @example
     * // Count the number of Blend_ingredients
     * const count = await prisma.blend_ingredients.count({
     *   where: {
     *     // ... the filter for the Blend_ingredients we want to count
     *   }
     * })
    **/
    count<T extends blend_ingredientsCountArgs>(args?: Prisma.Subset<T, blend_ingredientsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Blend_ingredientsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Blend_ingredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Blend_ingredientsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Blend_ingredientsAggregateArgs>(args: Prisma.Subset<T, Blend_ingredientsAggregateArgs>): Prisma.PrismaPromise<GetBlend_ingredientsAggregateType<T>>;
    /**
     * Group by Blend_ingredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {blend_ingredientsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends blend_ingredientsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: blend_ingredientsGroupByArgs['orderBy'];
    } : {
        orderBy?: blend_ingredientsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, blend_ingredientsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBlend_ingredientsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the blend_ingredients model
     */
    readonly fields: blend_ingredientsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for blend_ingredients.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__blend_ingredientsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    blends<T extends Prisma.blend_ingredients$blendsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.blend_ingredients$blendsArgs<ExtArgs>>): Prisma.Prisma__blendsClient<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    products<T extends Prisma.blend_ingredients$productsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.blend_ingredients$productsArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the blend_ingredients model
 */
export interface blend_ingredientsFieldRefs {
    readonly id: Prisma.FieldRef<"blend_ingredients", 'String'>;
    readonly blend_id: Prisma.FieldRef<"blend_ingredients", 'String'>;
    readonly product_id: Prisma.FieldRef<"blend_ingredients", 'String'>;
    readonly percentage: Prisma.FieldRef<"blend_ingredients", 'Decimal'>;
    readonly timing_override: Prisma.FieldRef<"blend_ingredients", 'Json'>;
}
/**
 * blend_ingredients findUnique
 */
export type blend_ingredientsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which blend_ingredients to fetch.
     */
    where: Prisma.blend_ingredientsWhereUniqueInput;
};
/**
 * blend_ingredients findUniqueOrThrow
 */
export type blend_ingredientsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which blend_ingredients to fetch.
     */
    where: Prisma.blend_ingredientsWhereUniqueInput;
};
/**
 * blend_ingredients findFirst
 */
export type blend_ingredientsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which blend_ingredients to fetch.
     */
    where?: Prisma.blend_ingredientsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of blend_ingredients to fetch.
     */
    orderBy?: Prisma.blend_ingredientsOrderByWithRelationInput | Prisma.blend_ingredientsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for blend_ingredients.
     */
    cursor?: Prisma.blend_ingredientsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` blend_ingredients from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` blend_ingredients.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of blend_ingredients.
     */
    distinct?: Prisma.Blend_ingredientsScalarFieldEnum | Prisma.Blend_ingredientsScalarFieldEnum[];
};
/**
 * blend_ingredients findFirstOrThrow
 */
export type blend_ingredientsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which blend_ingredients to fetch.
     */
    where?: Prisma.blend_ingredientsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of blend_ingredients to fetch.
     */
    orderBy?: Prisma.blend_ingredientsOrderByWithRelationInput | Prisma.blend_ingredientsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for blend_ingredients.
     */
    cursor?: Prisma.blend_ingredientsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` blend_ingredients from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` blend_ingredients.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of blend_ingredients.
     */
    distinct?: Prisma.Blend_ingredientsScalarFieldEnum | Prisma.Blend_ingredientsScalarFieldEnum[];
};
/**
 * blend_ingredients findMany
 */
export type blend_ingredientsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which blend_ingredients to fetch.
     */
    where?: Prisma.blend_ingredientsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of blend_ingredients to fetch.
     */
    orderBy?: Prisma.blend_ingredientsOrderByWithRelationInput | Prisma.blend_ingredientsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing blend_ingredients.
     */
    cursor?: Prisma.blend_ingredientsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` blend_ingredients from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` blend_ingredients.
     */
    skip?: number;
    distinct?: Prisma.Blend_ingredientsScalarFieldEnum | Prisma.Blend_ingredientsScalarFieldEnum[];
};
/**
 * blend_ingredients create
 */
export type blend_ingredientsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a blend_ingredients.
     */
    data: Prisma.XOR<Prisma.blend_ingredientsCreateInput, Prisma.blend_ingredientsUncheckedCreateInput>;
};
/**
 * blend_ingredients createMany
 */
export type blend_ingredientsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many blend_ingredients.
     */
    data: Prisma.blend_ingredientsCreateManyInput | Prisma.blend_ingredientsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * blend_ingredients createManyAndReturn
 */
export type blend_ingredientsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blend_ingredients
     */
    select?: Prisma.blend_ingredientsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the blend_ingredients
     */
    omit?: Prisma.blend_ingredientsOmit<ExtArgs> | null;
    /**
     * The data used to create many blend_ingredients.
     */
    data: Prisma.blend_ingredientsCreateManyInput | Prisma.blend_ingredientsCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.blend_ingredientsIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * blend_ingredients update
 */
export type blend_ingredientsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a blend_ingredients.
     */
    data: Prisma.XOR<Prisma.blend_ingredientsUpdateInput, Prisma.blend_ingredientsUncheckedUpdateInput>;
    /**
     * Choose, which blend_ingredients to update.
     */
    where: Prisma.blend_ingredientsWhereUniqueInput;
};
/**
 * blend_ingredients updateMany
 */
export type blend_ingredientsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update blend_ingredients.
     */
    data: Prisma.XOR<Prisma.blend_ingredientsUpdateManyMutationInput, Prisma.blend_ingredientsUncheckedUpdateManyInput>;
    /**
     * Filter which blend_ingredients to update
     */
    where?: Prisma.blend_ingredientsWhereInput;
    /**
     * Limit how many blend_ingredients to update.
     */
    limit?: number;
};
/**
 * blend_ingredients updateManyAndReturn
 */
export type blend_ingredientsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the blend_ingredients
     */
    select?: Prisma.blend_ingredientsSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the blend_ingredients
     */
    omit?: Prisma.blend_ingredientsOmit<ExtArgs> | null;
    /**
     * The data used to update blend_ingredients.
     */
    data: Prisma.XOR<Prisma.blend_ingredientsUpdateManyMutationInput, Prisma.blend_ingredientsUncheckedUpdateManyInput>;
    /**
     * Filter which blend_ingredients to update
     */
    where?: Prisma.blend_ingredientsWhereInput;
    /**
     * Limit how many blend_ingredients to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.blend_ingredientsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * blend_ingredients upsert
 */
export type blend_ingredientsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the blend_ingredients to update in case it exists.
     */
    where: Prisma.blend_ingredientsWhereUniqueInput;
    /**
     * In case the blend_ingredients found by the `where` argument doesn't exist, create a new blend_ingredients with this data.
     */
    create: Prisma.XOR<Prisma.blend_ingredientsCreateInput, Prisma.blend_ingredientsUncheckedCreateInput>;
    /**
     * In case the blend_ingredients was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.blend_ingredientsUpdateInput, Prisma.blend_ingredientsUncheckedUpdateInput>;
};
/**
 * blend_ingredients delete
 */
export type blend_ingredientsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which blend_ingredients to delete.
     */
    where: Prisma.blend_ingredientsWhereUniqueInput;
};
/**
 * blend_ingredients deleteMany
 */
export type blend_ingredientsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which blend_ingredients to delete
     */
    where?: Prisma.blend_ingredientsWhereInput;
    /**
     * Limit how many blend_ingredients to delete.
     */
    limit?: number;
};
/**
 * blend_ingredients.blends
 */
export type blend_ingredients$blendsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * blend_ingredients.products
 */
export type blend_ingredients$productsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * blend_ingredients without action
 */
export type blend_ingredientsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=blend_ingredients.d.ts.map