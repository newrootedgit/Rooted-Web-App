import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model supplies
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type suppliesModel = runtime.Types.Result.DefaultSelection<Prisma.$suppliesPayload>;
export type AggregateSupplies = {
    _count: SuppliesCountAggregateOutputType | null;
    _avg: SuppliesAvgAggregateOutputType | null;
    _sum: SuppliesSumAggregateOutputType | null;
    _min: SuppliesMinAggregateOutputType | null;
    _max: SuppliesMaxAggregateOutputType | null;
};
export type SuppliesAvgAggregateOutputType = {
    current_stock: runtime.Decimal | null;
    reorder_level: runtime.Decimal | null;
};
export type SuppliesSumAggregateOutputType = {
    current_stock: runtime.Decimal | null;
    reorder_level: runtime.Decimal | null;
};
export type SuppliesMinAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    category_id: string | null;
    product_id: string | null;
    name: string | null;
    sku: string | null;
    current_stock: runtime.Decimal | null;
    unit: string | null;
    reorder_level: runtime.Decimal | null;
    created_at: Date | null;
};
export type SuppliesMaxAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    category_id: string | null;
    product_id: string | null;
    name: string | null;
    sku: string | null;
    current_stock: runtime.Decimal | null;
    unit: string | null;
    reorder_level: runtime.Decimal | null;
    created_at: Date | null;
};
export type SuppliesCountAggregateOutputType = {
    id: number;
    farm_id: number;
    category_id: number;
    product_id: number;
    name: number;
    sku: number;
    current_stock: number;
    unit: number;
    reorder_level: number;
    created_at: number;
    _all: number;
};
export type SuppliesAvgAggregateInputType = {
    current_stock?: true;
    reorder_level?: true;
};
export type SuppliesSumAggregateInputType = {
    current_stock?: true;
    reorder_level?: true;
};
export type SuppliesMinAggregateInputType = {
    id?: true;
    farm_id?: true;
    category_id?: true;
    product_id?: true;
    name?: true;
    sku?: true;
    current_stock?: true;
    unit?: true;
    reorder_level?: true;
    created_at?: true;
};
export type SuppliesMaxAggregateInputType = {
    id?: true;
    farm_id?: true;
    category_id?: true;
    product_id?: true;
    name?: true;
    sku?: true;
    current_stock?: true;
    unit?: true;
    reorder_level?: true;
    created_at?: true;
};
export type SuppliesCountAggregateInputType = {
    id?: true;
    farm_id?: true;
    category_id?: true;
    product_id?: true;
    name?: true;
    sku?: true;
    current_stock?: true;
    unit?: true;
    reorder_level?: true;
    created_at?: true;
    _all?: true;
};
export type SuppliesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which supplies to aggregate.
     */
    where?: Prisma.suppliesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supplies to fetch.
     */
    orderBy?: Prisma.suppliesOrderByWithRelationInput | Prisma.suppliesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.suppliesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supplies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supplies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned supplies
    **/
    _count?: true | SuppliesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: SuppliesAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: SuppliesSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: SuppliesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: SuppliesMaxAggregateInputType;
};
export type GetSuppliesAggregateType<T extends SuppliesAggregateArgs> = {
    [P in keyof T & keyof AggregateSupplies]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSupplies[P]> : Prisma.GetScalarType<T[P], AggregateSupplies[P]>;
};
export type suppliesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.suppliesWhereInput;
    orderBy?: Prisma.suppliesOrderByWithAggregationInput | Prisma.suppliesOrderByWithAggregationInput[];
    by: Prisma.SuppliesScalarFieldEnum[] | Prisma.SuppliesScalarFieldEnum;
    having?: Prisma.suppliesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SuppliesCountAggregateInputType | true;
    _avg?: SuppliesAvgAggregateInputType;
    _sum?: SuppliesSumAggregateInputType;
    _min?: SuppliesMinAggregateInputType;
    _max?: SuppliesMaxAggregateInputType;
};
export type SuppliesGroupByOutputType = {
    id: string;
    farm_id: string | null;
    category_id: string | null;
    product_id: string | null;
    name: string;
    sku: string | null;
    current_stock: runtime.Decimal | null;
    unit: string | null;
    reorder_level: runtime.Decimal | null;
    created_at: Date | null;
    _count: SuppliesCountAggregateOutputType | null;
    _avg: SuppliesAvgAggregateOutputType | null;
    _sum: SuppliesSumAggregateOutputType | null;
    _min: SuppliesMinAggregateOutputType | null;
    _max: SuppliesMaxAggregateOutputType | null;
};
type GetSuppliesGroupByPayload<T extends suppliesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SuppliesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SuppliesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SuppliesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SuppliesGroupByOutputType[P]>;
}>>;
export type suppliesWhereInput = {
    AND?: Prisma.suppliesWhereInput | Prisma.suppliesWhereInput[];
    OR?: Prisma.suppliesWhereInput[];
    NOT?: Prisma.suppliesWhereInput | Prisma.suppliesWhereInput[];
    id?: Prisma.UuidFilter<"supplies"> | string;
    farm_id?: Prisma.UuidNullableFilter<"supplies"> | string | null;
    category_id?: Prisma.UuidNullableFilter<"supplies"> | string | null;
    product_id?: Prisma.UuidNullableFilter<"supplies"> | string | null;
    name?: Prisma.StringFilter<"supplies"> | string;
    sku?: Prisma.StringNullableFilter<"supplies"> | string | null;
    current_stock?: Prisma.DecimalNullableFilter<"supplies"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.StringNullableFilter<"supplies"> | string | null;
    reorder_level?: Prisma.DecimalNullableFilter<"supplies"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supplies"> | Date | string | null;
    supply_categories?: Prisma.XOR<Prisma.Supply_categoriesNullableScalarRelationFilter, Prisma.supply_categoriesWhereInput> | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    products?: Prisma.XOR<Prisma.ProductsNullableScalarRelationFilter, Prisma.productsWhereInput> | null;
    supply_purchases?: Prisma.Supply_purchasesListRelationFilter;
    supply_usage?: Prisma.Supply_usageListRelationFilter;
};
export type suppliesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    category_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    product_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrderInput | Prisma.SortOrder;
    current_stock?: Prisma.SortOrderInput | Prisma.SortOrder;
    unit?: Prisma.SortOrderInput | Prisma.SortOrder;
    reorder_level?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    supply_categories?: Prisma.supply_categoriesOrderByWithRelationInput;
    farms?: Prisma.farmsOrderByWithRelationInput;
    products?: Prisma.productsOrderByWithRelationInput;
    supply_purchases?: Prisma.supply_purchasesOrderByRelationAggregateInput;
    supply_usage?: Prisma.supply_usageOrderByRelationAggregateInput;
};
export type suppliesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.suppliesWhereInput | Prisma.suppliesWhereInput[];
    OR?: Prisma.suppliesWhereInput[];
    NOT?: Prisma.suppliesWhereInput | Prisma.suppliesWhereInput[];
    farm_id?: Prisma.UuidNullableFilter<"supplies"> | string | null;
    category_id?: Prisma.UuidNullableFilter<"supplies"> | string | null;
    product_id?: Prisma.UuidNullableFilter<"supplies"> | string | null;
    name?: Prisma.StringFilter<"supplies"> | string;
    sku?: Prisma.StringNullableFilter<"supplies"> | string | null;
    current_stock?: Prisma.DecimalNullableFilter<"supplies"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.StringNullableFilter<"supplies"> | string | null;
    reorder_level?: Prisma.DecimalNullableFilter<"supplies"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supplies"> | Date | string | null;
    supply_categories?: Prisma.XOR<Prisma.Supply_categoriesNullableScalarRelationFilter, Prisma.supply_categoriesWhereInput> | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    products?: Prisma.XOR<Prisma.ProductsNullableScalarRelationFilter, Prisma.productsWhereInput> | null;
    supply_purchases?: Prisma.Supply_purchasesListRelationFilter;
    supply_usage?: Prisma.Supply_usageListRelationFilter;
}, "id">;
export type suppliesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    category_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    product_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrderInput | Prisma.SortOrder;
    current_stock?: Prisma.SortOrderInput | Prisma.SortOrder;
    unit?: Prisma.SortOrderInput | Prisma.SortOrder;
    reorder_level?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.suppliesCountOrderByAggregateInput;
    _avg?: Prisma.suppliesAvgOrderByAggregateInput;
    _max?: Prisma.suppliesMaxOrderByAggregateInput;
    _min?: Prisma.suppliesMinOrderByAggregateInput;
    _sum?: Prisma.suppliesSumOrderByAggregateInput;
};
export type suppliesScalarWhereWithAggregatesInput = {
    AND?: Prisma.suppliesScalarWhereWithAggregatesInput | Prisma.suppliesScalarWhereWithAggregatesInput[];
    OR?: Prisma.suppliesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.suppliesScalarWhereWithAggregatesInput | Prisma.suppliesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"supplies"> | string;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"supplies"> | string | null;
    category_id?: Prisma.UuidNullableWithAggregatesFilter<"supplies"> | string | null;
    product_id?: Prisma.UuidNullableWithAggregatesFilter<"supplies"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"supplies"> | string;
    sku?: Prisma.StringNullableWithAggregatesFilter<"supplies"> | string | null;
    current_stock?: Prisma.DecimalNullableWithAggregatesFilter<"supplies"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.StringNullableWithAggregatesFilter<"supplies"> | string | null;
    reorder_level?: Prisma.DecimalNullableWithAggregatesFilter<"supplies"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"supplies"> | Date | string | null;
};
export type suppliesCreateInput = {
    id?: string;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    supply_categories?: Prisma.supply_categoriesCreateNestedOneWithoutSuppliesInput;
    farms?: Prisma.farmsCreateNestedOneWithoutSuppliesInput;
    products?: Prisma.productsCreateNestedOneWithoutSuppliesInput;
    supply_purchases?: Prisma.supply_purchasesCreateNestedManyWithoutSuppliesInput;
    supply_usage?: Prisma.supply_usageCreateNestedManyWithoutSuppliesInput;
};
export type suppliesUncheckedCreateInput = {
    id?: string;
    farm_id?: string | null;
    category_id?: string | null;
    product_id?: string | null;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    supply_purchases?: Prisma.supply_purchasesUncheckedCreateNestedManyWithoutSuppliesInput;
    supply_usage?: Prisma.supply_usageUncheckedCreateNestedManyWithoutSuppliesInput;
};
export type suppliesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_categories?: Prisma.supply_categoriesUpdateOneWithoutSuppliesNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutSuppliesNestedInput;
    products?: Prisma.productsUpdateOneWithoutSuppliesNestedInput;
    supply_purchases?: Prisma.supply_purchasesUpdateManyWithoutSuppliesNestedInput;
    supply_usage?: Prisma.supply_usageUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_purchases?: Prisma.supply_purchasesUncheckedUpdateManyWithoutSuppliesNestedInput;
    supply_usage?: Prisma.supply_usageUncheckedUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesCreateManyInput = {
    id?: string;
    farm_id?: string | null;
    category_id?: string | null;
    product_id?: string | null;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
};
export type suppliesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type suppliesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type SuppliesListRelationFilter = {
    every?: Prisma.suppliesWhereInput;
    some?: Prisma.suppliesWhereInput;
    none?: Prisma.suppliesWhereInput;
};
export type suppliesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type suppliesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    category_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    current_stock?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    reorder_level?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type suppliesAvgOrderByAggregateInput = {
    current_stock?: Prisma.SortOrder;
    reorder_level?: Prisma.SortOrder;
};
export type suppliesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    category_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    current_stock?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    reorder_level?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type suppliesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    category_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    current_stock?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    reorder_level?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type suppliesSumOrderByAggregateInput = {
    current_stock?: Prisma.SortOrder;
    reorder_level?: Prisma.SortOrder;
};
export type SuppliesNullableScalarRelationFilter = {
    is?: Prisma.suppliesWhereInput | null;
    isNot?: Prisma.suppliesWhereInput | null;
};
export type suppliesCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutFarmsInput, Prisma.suppliesUncheckedCreateWithoutFarmsInput> | Prisma.suppliesCreateWithoutFarmsInput[] | Prisma.suppliesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutFarmsInput | Prisma.suppliesCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.suppliesCreateManyFarmsInputEnvelope;
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
};
export type suppliesUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutFarmsInput, Prisma.suppliesUncheckedCreateWithoutFarmsInput> | Prisma.suppliesCreateWithoutFarmsInput[] | Prisma.suppliesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutFarmsInput | Prisma.suppliesCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.suppliesCreateManyFarmsInputEnvelope;
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
};
export type suppliesUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutFarmsInput, Prisma.suppliesUncheckedCreateWithoutFarmsInput> | Prisma.suppliesCreateWithoutFarmsInput[] | Prisma.suppliesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutFarmsInput | Prisma.suppliesCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.suppliesUpsertWithWhereUniqueWithoutFarmsInput | Prisma.suppliesUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.suppliesCreateManyFarmsInputEnvelope;
    set?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    disconnect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    delete?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    update?: Prisma.suppliesUpdateWithWhereUniqueWithoutFarmsInput | Prisma.suppliesUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.suppliesUpdateManyWithWhereWithoutFarmsInput | Prisma.suppliesUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.suppliesScalarWhereInput | Prisma.suppliesScalarWhereInput[];
};
export type suppliesUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutFarmsInput, Prisma.suppliesUncheckedCreateWithoutFarmsInput> | Prisma.suppliesCreateWithoutFarmsInput[] | Prisma.suppliesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutFarmsInput | Prisma.suppliesCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.suppliesUpsertWithWhereUniqueWithoutFarmsInput | Prisma.suppliesUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.suppliesCreateManyFarmsInputEnvelope;
    set?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    disconnect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    delete?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    update?: Prisma.suppliesUpdateWithWhereUniqueWithoutFarmsInput | Prisma.suppliesUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.suppliesUpdateManyWithWhereWithoutFarmsInput | Prisma.suppliesUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.suppliesScalarWhereInput | Prisma.suppliesScalarWhereInput[];
};
export type suppliesCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutProductsInput, Prisma.suppliesUncheckedCreateWithoutProductsInput> | Prisma.suppliesCreateWithoutProductsInput[] | Prisma.suppliesUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutProductsInput | Prisma.suppliesCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.suppliesCreateManyProductsInputEnvelope;
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
};
export type suppliesUncheckedCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutProductsInput, Prisma.suppliesUncheckedCreateWithoutProductsInput> | Prisma.suppliesCreateWithoutProductsInput[] | Prisma.suppliesUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutProductsInput | Prisma.suppliesCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.suppliesCreateManyProductsInputEnvelope;
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
};
export type suppliesUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutProductsInput, Prisma.suppliesUncheckedCreateWithoutProductsInput> | Prisma.suppliesCreateWithoutProductsInput[] | Prisma.suppliesUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutProductsInput | Prisma.suppliesCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.suppliesUpsertWithWhereUniqueWithoutProductsInput | Prisma.suppliesUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.suppliesCreateManyProductsInputEnvelope;
    set?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    disconnect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    delete?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    update?: Prisma.suppliesUpdateWithWhereUniqueWithoutProductsInput | Prisma.suppliesUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.suppliesUpdateManyWithWhereWithoutProductsInput | Prisma.suppliesUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.suppliesScalarWhereInput | Prisma.suppliesScalarWhereInput[];
};
export type suppliesUncheckedUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutProductsInput, Prisma.suppliesUncheckedCreateWithoutProductsInput> | Prisma.suppliesCreateWithoutProductsInput[] | Prisma.suppliesUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutProductsInput | Prisma.suppliesCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.suppliesUpsertWithWhereUniqueWithoutProductsInput | Prisma.suppliesUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.suppliesCreateManyProductsInputEnvelope;
    set?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    disconnect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    delete?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    update?: Prisma.suppliesUpdateWithWhereUniqueWithoutProductsInput | Prisma.suppliesUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.suppliesUpdateManyWithWhereWithoutProductsInput | Prisma.suppliesUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.suppliesScalarWhereInput | Prisma.suppliesScalarWhereInput[];
};
export type suppliesCreateNestedManyWithoutSupply_categoriesInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_categoriesInput, Prisma.suppliesUncheckedCreateWithoutSupply_categoriesInput> | Prisma.suppliesCreateWithoutSupply_categoriesInput[] | Prisma.suppliesUncheckedCreateWithoutSupply_categoriesInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutSupply_categoriesInput | Prisma.suppliesCreateOrConnectWithoutSupply_categoriesInput[];
    createMany?: Prisma.suppliesCreateManySupply_categoriesInputEnvelope;
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
};
export type suppliesUncheckedCreateNestedManyWithoutSupply_categoriesInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_categoriesInput, Prisma.suppliesUncheckedCreateWithoutSupply_categoriesInput> | Prisma.suppliesCreateWithoutSupply_categoriesInput[] | Prisma.suppliesUncheckedCreateWithoutSupply_categoriesInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutSupply_categoriesInput | Prisma.suppliesCreateOrConnectWithoutSupply_categoriesInput[];
    createMany?: Prisma.suppliesCreateManySupply_categoriesInputEnvelope;
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
};
export type suppliesUpdateManyWithoutSupply_categoriesNestedInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_categoriesInput, Prisma.suppliesUncheckedCreateWithoutSupply_categoriesInput> | Prisma.suppliesCreateWithoutSupply_categoriesInput[] | Prisma.suppliesUncheckedCreateWithoutSupply_categoriesInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutSupply_categoriesInput | Prisma.suppliesCreateOrConnectWithoutSupply_categoriesInput[];
    upsert?: Prisma.suppliesUpsertWithWhereUniqueWithoutSupply_categoriesInput | Prisma.suppliesUpsertWithWhereUniqueWithoutSupply_categoriesInput[];
    createMany?: Prisma.suppliesCreateManySupply_categoriesInputEnvelope;
    set?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    disconnect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    delete?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    update?: Prisma.suppliesUpdateWithWhereUniqueWithoutSupply_categoriesInput | Prisma.suppliesUpdateWithWhereUniqueWithoutSupply_categoriesInput[];
    updateMany?: Prisma.suppliesUpdateManyWithWhereWithoutSupply_categoriesInput | Prisma.suppliesUpdateManyWithWhereWithoutSupply_categoriesInput[];
    deleteMany?: Prisma.suppliesScalarWhereInput | Prisma.suppliesScalarWhereInput[];
};
export type suppliesUncheckedUpdateManyWithoutSupply_categoriesNestedInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_categoriesInput, Prisma.suppliesUncheckedCreateWithoutSupply_categoriesInput> | Prisma.suppliesCreateWithoutSupply_categoriesInput[] | Prisma.suppliesUncheckedCreateWithoutSupply_categoriesInput[];
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutSupply_categoriesInput | Prisma.suppliesCreateOrConnectWithoutSupply_categoriesInput[];
    upsert?: Prisma.suppliesUpsertWithWhereUniqueWithoutSupply_categoriesInput | Prisma.suppliesUpsertWithWhereUniqueWithoutSupply_categoriesInput[];
    createMany?: Prisma.suppliesCreateManySupply_categoriesInputEnvelope;
    set?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    disconnect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    delete?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    connect?: Prisma.suppliesWhereUniqueInput | Prisma.suppliesWhereUniqueInput[];
    update?: Prisma.suppliesUpdateWithWhereUniqueWithoutSupply_categoriesInput | Prisma.suppliesUpdateWithWhereUniqueWithoutSupply_categoriesInput[];
    updateMany?: Prisma.suppliesUpdateManyWithWhereWithoutSupply_categoriesInput | Prisma.suppliesUpdateManyWithWhereWithoutSupply_categoriesInput[];
    deleteMany?: Prisma.suppliesScalarWhereInput | Prisma.suppliesScalarWhereInput[];
};
export type suppliesCreateNestedOneWithoutSupply_purchasesInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_purchasesInput, Prisma.suppliesUncheckedCreateWithoutSupply_purchasesInput>;
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutSupply_purchasesInput;
    connect?: Prisma.suppliesWhereUniqueInput;
};
export type suppliesUpdateOneWithoutSupply_purchasesNestedInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_purchasesInput, Prisma.suppliesUncheckedCreateWithoutSupply_purchasesInput>;
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutSupply_purchasesInput;
    upsert?: Prisma.suppliesUpsertWithoutSupply_purchasesInput;
    disconnect?: Prisma.suppliesWhereInput | boolean;
    delete?: Prisma.suppliesWhereInput | boolean;
    connect?: Prisma.suppliesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.suppliesUpdateToOneWithWhereWithoutSupply_purchasesInput, Prisma.suppliesUpdateWithoutSupply_purchasesInput>, Prisma.suppliesUncheckedUpdateWithoutSupply_purchasesInput>;
};
export type suppliesCreateNestedOneWithoutSupply_usageInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_usageInput, Prisma.suppliesUncheckedCreateWithoutSupply_usageInput>;
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutSupply_usageInput;
    connect?: Prisma.suppliesWhereUniqueInput;
};
export type suppliesUpdateOneWithoutSupply_usageNestedInput = {
    create?: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_usageInput, Prisma.suppliesUncheckedCreateWithoutSupply_usageInput>;
    connectOrCreate?: Prisma.suppliesCreateOrConnectWithoutSupply_usageInput;
    upsert?: Prisma.suppliesUpsertWithoutSupply_usageInput;
    disconnect?: Prisma.suppliesWhereInput | boolean;
    delete?: Prisma.suppliesWhereInput | boolean;
    connect?: Prisma.suppliesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.suppliesUpdateToOneWithWhereWithoutSupply_usageInput, Prisma.suppliesUpdateWithoutSupply_usageInput>, Prisma.suppliesUncheckedUpdateWithoutSupply_usageInput>;
};
export type suppliesCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    supply_categories?: Prisma.supply_categoriesCreateNestedOneWithoutSuppliesInput;
    products?: Prisma.productsCreateNestedOneWithoutSuppliesInput;
    supply_purchases?: Prisma.supply_purchasesCreateNestedManyWithoutSuppliesInput;
    supply_usage?: Prisma.supply_usageCreateNestedManyWithoutSuppliesInput;
};
export type suppliesUncheckedCreateWithoutFarmsInput = {
    id?: string;
    category_id?: string | null;
    product_id?: string | null;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    supply_purchases?: Prisma.supply_purchasesUncheckedCreateNestedManyWithoutSuppliesInput;
    supply_usage?: Prisma.supply_usageUncheckedCreateNestedManyWithoutSuppliesInput;
};
export type suppliesCreateOrConnectWithoutFarmsInput = {
    where: Prisma.suppliesWhereUniqueInput;
    create: Prisma.XOR<Prisma.suppliesCreateWithoutFarmsInput, Prisma.suppliesUncheckedCreateWithoutFarmsInput>;
};
export type suppliesCreateManyFarmsInputEnvelope = {
    data: Prisma.suppliesCreateManyFarmsInput | Prisma.suppliesCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type suppliesUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.suppliesWhereUniqueInput;
    update: Prisma.XOR<Prisma.suppliesUpdateWithoutFarmsInput, Prisma.suppliesUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.suppliesCreateWithoutFarmsInput, Prisma.suppliesUncheckedCreateWithoutFarmsInput>;
};
export type suppliesUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.suppliesWhereUniqueInput;
    data: Prisma.XOR<Prisma.suppliesUpdateWithoutFarmsInput, Prisma.suppliesUncheckedUpdateWithoutFarmsInput>;
};
export type suppliesUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.suppliesScalarWhereInput;
    data: Prisma.XOR<Prisma.suppliesUpdateManyMutationInput, Prisma.suppliesUncheckedUpdateManyWithoutFarmsInput>;
};
export type suppliesScalarWhereInput = {
    AND?: Prisma.suppliesScalarWhereInput | Prisma.suppliesScalarWhereInput[];
    OR?: Prisma.suppliesScalarWhereInput[];
    NOT?: Prisma.suppliesScalarWhereInput | Prisma.suppliesScalarWhereInput[];
    id?: Prisma.UuidFilter<"supplies"> | string;
    farm_id?: Prisma.UuidNullableFilter<"supplies"> | string | null;
    category_id?: Prisma.UuidNullableFilter<"supplies"> | string | null;
    product_id?: Prisma.UuidNullableFilter<"supplies"> | string | null;
    name?: Prisma.StringFilter<"supplies"> | string;
    sku?: Prisma.StringNullableFilter<"supplies"> | string | null;
    current_stock?: Prisma.DecimalNullableFilter<"supplies"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.StringNullableFilter<"supplies"> | string | null;
    reorder_level?: Prisma.DecimalNullableFilter<"supplies"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supplies"> | Date | string | null;
};
export type suppliesCreateWithoutProductsInput = {
    id?: string;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    supply_categories?: Prisma.supply_categoriesCreateNestedOneWithoutSuppliesInput;
    farms?: Prisma.farmsCreateNestedOneWithoutSuppliesInput;
    supply_purchases?: Prisma.supply_purchasesCreateNestedManyWithoutSuppliesInput;
    supply_usage?: Prisma.supply_usageCreateNestedManyWithoutSuppliesInput;
};
export type suppliesUncheckedCreateWithoutProductsInput = {
    id?: string;
    farm_id?: string | null;
    category_id?: string | null;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    supply_purchases?: Prisma.supply_purchasesUncheckedCreateNestedManyWithoutSuppliesInput;
    supply_usage?: Prisma.supply_usageUncheckedCreateNestedManyWithoutSuppliesInput;
};
export type suppliesCreateOrConnectWithoutProductsInput = {
    where: Prisma.suppliesWhereUniqueInput;
    create: Prisma.XOR<Prisma.suppliesCreateWithoutProductsInput, Prisma.suppliesUncheckedCreateWithoutProductsInput>;
};
export type suppliesCreateManyProductsInputEnvelope = {
    data: Prisma.suppliesCreateManyProductsInput | Prisma.suppliesCreateManyProductsInput[];
    skipDuplicates?: boolean;
};
export type suppliesUpsertWithWhereUniqueWithoutProductsInput = {
    where: Prisma.suppliesWhereUniqueInput;
    update: Prisma.XOR<Prisma.suppliesUpdateWithoutProductsInput, Prisma.suppliesUncheckedUpdateWithoutProductsInput>;
    create: Prisma.XOR<Prisma.suppliesCreateWithoutProductsInput, Prisma.suppliesUncheckedCreateWithoutProductsInput>;
};
export type suppliesUpdateWithWhereUniqueWithoutProductsInput = {
    where: Prisma.suppliesWhereUniqueInput;
    data: Prisma.XOR<Prisma.suppliesUpdateWithoutProductsInput, Prisma.suppliesUncheckedUpdateWithoutProductsInput>;
};
export type suppliesUpdateManyWithWhereWithoutProductsInput = {
    where: Prisma.suppliesScalarWhereInput;
    data: Prisma.XOR<Prisma.suppliesUpdateManyMutationInput, Prisma.suppliesUncheckedUpdateManyWithoutProductsInput>;
};
export type suppliesCreateWithoutSupply_categoriesInput = {
    id?: string;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutSuppliesInput;
    products?: Prisma.productsCreateNestedOneWithoutSuppliesInput;
    supply_purchases?: Prisma.supply_purchasesCreateNestedManyWithoutSuppliesInput;
    supply_usage?: Prisma.supply_usageCreateNestedManyWithoutSuppliesInput;
};
export type suppliesUncheckedCreateWithoutSupply_categoriesInput = {
    id?: string;
    farm_id?: string | null;
    product_id?: string | null;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    supply_purchases?: Prisma.supply_purchasesUncheckedCreateNestedManyWithoutSuppliesInput;
    supply_usage?: Prisma.supply_usageUncheckedCreateNestedManyWithoutSuppliesInput;
};
export type suppliesCreateOrConnectWithoutSupply_categoriesInput = {
    where: Prisma.suppliesWhereUniqueInput;
    create: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_categoriesInput, Prisma.suppliesUncheckedCreateWithoutSupply_categoriesInput>;
};
export type suppliesCreateManySupply_categoriesInputEnvelope = {
    data: Prisma.suppliesCreateManySupply_categoriesInput | Prisma.suppliesCreateManySupply_categoriesInput[];
    skipDuplicates?: boolean;
};
export type suppliesUpsertWithWhereUniqueWithoutSupply_categoriesInput = {
    where: Prisma.suppliesWhereUniqueInput;
    update: Prisma.XOR<Prisma.suppliesUpdateWithoutSupply_categoriesInput, Prisma.suppliesUncheckedUpdateWithoutSupply_categoriesInput>;
    create: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_categoriesInput, Prisma.suppliesUncheckedCreateWithoutSupply_categoriesInput>;
};
export type suppliesUpdateWithWhereUniqueWithoutSupply_categoriesInput = {
    where: Prisma.suppliesWhereUniqueInput;
    data: Prisma.XOR<Prisma.suppliesUpdateWithoutSupply_categoriesInput, Prisma.suppliesUncheckedUpdateWithoutSupply_categoriesInput>;
};
export type suppliesUpdateManyWithWhereWithoutSupply_categoriesInput = {
    where: Prisma.suppliesScalarWhereInput;
    data: Prisma.XOR<Prisma.suppliesUpdateManyMutationInput, Prisma.suppliesUncheckedUpdateManyWithoutSupply_categoriesInput>;
};
export type suppliesCreateWithoutSupply_purchasesInput = {
    id?: string;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    supply_categories?: Prisma.supply_categoriesCreateNestedOneWithoutSuppliesInput;
    farms?: Prisma.farmsCreateNestedOneWithoutSuppliesInput;
    products?: Prisma.productsCreateNestedOneWithoutSuppliesInput;
    supply_usage?: Prisma.supply_usageCreateNestedManyWithoutSuppliesInput;
};
export type suppliesUncheckedCreateWithoutSupply_purchasesInput = {
    id?: string;
    farm_id?: string | null;
    category_id?: string | null;
    product_id?: string | null;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    supply_usage?: Prisma.supply_usageUncheckedCreateNestedManyWithoutSuppliesInput;
};
export type suppliesCreateOrConnectWithoutSupply_purchasesInput = {
    where: Prisma.suppliesWhereUniqueInput;
    create: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_purchasesInput, Prisma.suppliesUncheckedCreateWithoutSupply_purchasesInput>;
};
export type suppliesUpsertWithoutSupply_purchasesInput = {
    update: Prisma.XOR<Prisma.suppliesUpdateWithoutSupply_purchasesInput, Prisma.suppliesUncheckedUpdateWithoutSupply_purchasesInput>;
    create: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_purchasesInput, Prisma.suppliesUncheckedCreateWithoutSupply_purchasesInput>;
    where?: Prisma.suppliesWhereInput;
};
export type suppliesUpdateToOneWithWhereWithoutSupply_purchasesInput = {
    where?: Prisma.suppliesWhereInput;
    data: Prisma.XOR<Prisma.suppliesUpdateWithoutSupply_purchasesInput, Prisma.suppliesUncheckedUpdateWithoutSupply_purchasesInput>;
};
export type suppliesUpdateWithoutSupply_purchasesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_categories?: Prisma.supply_categoriesUpdateOneWithoutSuppliesNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutSuppliesNestedInput;
    products?: Prisma.productsUpdateOneWithoutSuppliesNestedInput;
    supply_usage?: Prisma.supply_usageUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesUncheckedUpdateWithoutSupply_purchasesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_usage?: Prisma.supply_usageUncheckedUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesCreateWithoutSupply_usageInput = {
    id?: string;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    supply_categories?: Prisma.supply_categoriesCreateNestedOneWithoutSuppliesInput;
    farms?: Prisma.farmsCreateNestedOneWithoutSuppliesInput;
    products?: Prisma.productsCreateNestedOneWithoutSuppliesInput;
    supply_purchases?: Prisma.supply_purchasesCreateNestedManyWithoutSuppliesInput;
};
export type suppliesUncheckedCreateWithoutSupply_usageInput = {
    id?: string;
    farm_id?: string | null;
    category_id?: string | null;
    product_id?: string | null;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
    supply_purchases?: Prisma.supply_purchasesUncheckedCreateNestedManyWithoutSuppliesInput;
};
export type suppliesCreateOrConnectWithoutSupply_usageInput = {
    where: Prisma.suppliesWhereUniqueInput;
    create: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_usageInput, Prisma.suppliesUncheckedCreateWithoutSupply_usageInput>;
};
export type suppliesUpsertWithoutSupply_usageInput = {
    update: Prisma.XOR<Prisma.suppliesUpdateWithoutSupply_usageInput, Prisma.suppliesUncheckedUpdateWithoutSupply_usageInput>;
    create: Prisma.XOR<Prisma.suppliesCreateWithoutSupply_usageInput, Prisma.suppliesUncheckedCreateWithoutSupply_usageInput>;
    where?: Prisma.suppliesWhereInput;
};
export type suppliesUpdateToOneWithWhereWithoutSupply_usageInput = {
    where?: Prisma.suppliesWhereInput;
    data: Prisma.XOR<Prisma.suppliesUpdateWithoutSupply_usageInput, Prisma.suppliesUncheckedUpdateWithoutSupply_usageInput>;
};
export type suppliesUpdateWithoutSupply_usageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_categories?: Prisma.supply_categoriesUpdateOneWithoutSuppliesNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutSuppliesNestedInput;
    products?: Prisma.productsUpdateOneWithoutSuppliesNestedInput;
    supply_purchases?: Prisma.supply_purchasesUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesUncheckedUpdateWithoutSupply_usageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_purchases?: Prisma.supply_purchasesUncheckedUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesCreateManyFarmsInput = {
    id?: string;
    category_id?: string | null;
    product_id?: string | null;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
};
export type suppliesUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_categories?: Prisma.supply_categoriesUpdateOneWithoutSuppliesNestedInput;
    products?: Prisma.productsUpdateOneWithoutSuppliesNestedInput;
    supply_purchases?: Prisma.supply_purchasesUpdateManyWithoutSuppliesNestedInput;
    supply_usage?: Prisma.supply_usageUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_purchases?: Prisma.supply_purchasesUncheckedUpdateManyWithoutSuppliesNestedInput;
    supply_usage?: Prisma.supply_usageUncheckedUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type suppliesCreateManyProductsInput = {
    id?: string;
    farm_id?: string | null;
    category_id?: string | null;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
};
export type suppliesUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_categories?: Prisma.supply_categoriesUpdateOneWithoutSuppliesNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutSuppliesNestedInput;
    supply_purchases?: Prisma.supply_purchasesUpdateManyWithoutSuppliesNestedInput;
    supply_usage?: Prisma.supply_usageUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesUncheckedUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_purchases?: Prisma.supply_purchasesUncheckedUpdateManyWithoutSuppliesNestedInput;
    supply_usage?: Prisma.supply_usageUncheckedUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesUncheckedUpdateManyWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type suppliesCreateManySupply_categoriesInput = {
    id?: string;
    farm_id?: string | null;
    product_id?: string | null;
    name: string;
    sku?: string | null;
    current_stock?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: string | null;
    reorder_level?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Date | string | null;
};
export type suppliesUpdateWithoutSupply_categoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutSuppliesNestedInput;
    products?: Prisma.productsUpdateOneWithoutSuppliesNestedInput;
    supply_purchases?: Prisma.supply_purchasesUpdateManyWithoutSuppliesNestedInput;
    supply_usage?: Prisma.supply_usageUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesUncheckedUpdateWithoutSupply_categoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_purchases?: Prisma.supply_purchasesUncheckedUpdateManyWithoutSuppliesNestedInput;
    supply_usage?: Prisma.supply_usageUncheckedUpdateManyWithoutSuppliesNestedInput;
};
export type suppliesUncheckedUpdateManyWithoutSupply_categoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    current_stock?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reorder_level?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type SuppliesCountOutputType
 */
export type SuppliesCountOutputType = {
    supply_purchases: number;
    supply_usage: number;
};
export type SuppliesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supply_purchases?: boolean | SuppliesCountOutputTypeCountSupply_purchasesArgs;
    supply_usage?: boolean | SuppliesCountOutputTypeCountSupply_usageArgs;
};
/**
 * SuppliesCountOutputType without action
 */
export type SuppliesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuppliesCountOutputType
     */
    select?: Prisma.SuppliesCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * SuppliesCountOutputType without action
 */
export type SuppliesCountOutputTypeCountSupply_purchasesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.supply_purchasesWhereInput;
};
/**
 * SuppliesCountOutputType without action
 */
export type SuppliesCountOutputTypeCountSupply_usageArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.supply_usageWhereInput;
};
export type suppliesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    category_id?: boolean;
    product_id?: boolean;
    name?: boolean;
    sku?: boolean;
    current_stock?: boolean;
    unit?: boolean;
    reorder_level?: boolean;
    created_at?: boolean;
    supply_categories?: boolean | Prisma.supplies$supply_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.supplies$farmsArgs<ExtArgs>;
    products?: boolean | Prisma.supplies$productsArgs<ExtArgs>;
    supply_purchases?: boolean | Prisma.supplies$supply_purchasesArgs<ExtArgs>;
    supply_usage?: boolean | Prisma.supplies$supply_usageArgs<ExtArgs>;
    _count?: boolean | Prisma.SuppliesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["supplies"]>;
export type suppliesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    category_id?: boolean;
    product_id?: boolean;
    name?: boolean;
    sku?: boolean;
    current_stock?: boolean;
    unit?: boolean;
    reorder_level?: boolean;
    created_at?: boolean;
    supply_categories?: boolean | Prisma.supplies$supply_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.supplies$farmsArgs<ExtArgs>;
    products?: boolean | Prisma.supplies$productsArgs<ExtArgs>;
}, ExtArgs["result"]["supplies"]>;
export type suppliesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    category_id?: boolean;
    product_id?: boolean;
    name?: boolean;
    sku?: boolean;
    current_stock?: boolean;
    unit?: boolean;
    reorder_level?: boolean;
    created_at?: boolean;
    supply_categories?: boolean | Prisma.supplies$supply_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.supplies$farmsArgs<ExtArgs>;
    products?: boolean | Prisma.supplies$productsArgs<ExtArgs>;
}, ExtArgs["result"]["supplies"]>;
export type suppliesSelectScalar = {
    id?: boolean;
    farm_id?: boolean;
    category_id?: boolean;
    product_id?: boolean;
    name?: boolean;
    sku?: boolean;
    current_stock?: boolean;
    unit?: boolean;
    reorder_level?: boolean;
    created_at?: boolean;
};
export type suppliesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farm_id" | "category_id" | "product_id" | "name" | "sku" | "current_stock" | "unit" | "reorder_level" | "created_at", ExtArgs["result"]["supplies"]>;
export type suppliesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supply_categories?: boolean | Prisma.supplies$supply_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.supplies$farmsArgs<ExtArgs>;
    products?: boolean | Prisma.supplies$productsArgs<ExtArgs>;
    supply_purchases?: boolean | Prisma.supplies$supply_purchasesArgs<ExtArgs>;
    supply_usage?: boolean | Prisma.supplies$supply_usageArgs<ExtArgs>;
    _count?: boolean | Prisma.SuppliesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type suppliesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supply_categories?: boolean | Prisma.supplies$supply_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.supplies$farmsArgs<ExtArgs>;
    products?: boolean | Prisma.supplies$productsArgs<ExtArgs>;
};
export type suppliesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supply_categories?: boolean | Prisma.supplies$supply_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.supplies$farmsArgs<ExtArgs>;
    products?: boolean | Prisma.supplies$productsArgs<ExtArgs>;
};
export type $suppliesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "supplies";
    objects: {
        supply_categories: Prisma.$supply_categoriesPayload<ExtArgs> | null;
        farms: Prisma.$farmsPayload<ExtArgs> | null;
        products: Prisma.$productsPayload<ExtArgs> | null;
        supply_purchases: Prisma.$supply_purchasesPayload<ExtArgs>[];
        supply_usage: Prisma.$supply_usagePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farm_id: string | null;
        category_id: string | null;
        product_id: string | null;
        name: string;
        sku: string | null;
        current_stock: runtime.Decimal | null;
        unit: string | null;
        reorder_level: runtime.Decimal | null;
        created_at: Date | null;
    }, ExtArgs["result"]["supplies"]>;
    composites: {};
};
export type suppliesGetPayload<S extends boolean | null | undefined | suppliesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$suppliesPayload, S>;
export type suppliesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<suppliesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SuppliesCountAggregateInputType | true;
};
export interface suppliesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['supplies'];
        meta: {
            name: 'supplies';
        };
    };
    /**
     * Find zero or one Supplies that matches the filter.
     * @param {suppliesFindUniqueArgs} args - Arguments to find a Supplies
     * @example
     * // Get one Supplies
     * const supplies = await prisma.supplies.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends suppliesFindUniqueArgs>(args: Prisma.SelectSubset<T, suppliesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__suppliesClient<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Supplies that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {suppliesFindUniqueOrThrowArgs} args - Arguments to find a Supplies
     * @example
     * // Get one Supplies
     * const supplies = await prisma.supplies.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends suppliesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, suppliesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__suppliesClient<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Supplies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {suppliesFindFirstArgs} args - Arguments to find a Supplies
     * @example
     * // Get one Supplies
     * const supplies = await prisma.supplies.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends suppliesFindFirstArgs>(args?: Prisma.SelectSubset<T, suppliesFindFirstArgs<ExtArgs>>): Prisma.Prisma__suppliesClient<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Supplies that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {suppliesFindFirstOrThrowArgs} args - Arguments to find a Supplies
     * @example
     * // Get one Supplies
     * const supplies = await prisma.supplies.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends suppliesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, suppliesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__suppliesClient<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Supplies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {suppliesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Supplies
     * const supplies = await prisma.supplies.findMany()
     *
     * // Get first 10 Supplies
     * const supplies = await prisma.supplies.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const suppliesWithIdOnly = await prisma.supplies.findMany({ select: { id: true } })
     *
     */
    findMany<T extends suppliesFindManyArgs>(args?: Prisma.SelectSubset<T, suppliesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Supplies.
     * @param {suppliesCreateArgs} args - Arguments to create a Supplies.
     * @example
     * // Create one Supplies
     * const Supplies = await prisma.supplies.create({
     *   data: {
     *     // ... data to create a Supplies
     *   }
     * })
     *
     */
    create<T extends suppliesCreateArgs>(args: Prisma.SelectSubset<T, suppliesCreateArgs<ExtArgs>>): Prisma.Prisma__suppliesClient<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Supplies.
     * @param {suppliesCreateManyArgs} args - Arguments to create many Supplies.
     * @example
     * // Create many Supplies
     * const supplies = await prisma.supplies.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends suppliesCreateManyArgs>(args?: Prisma.SelectSubset<T, suppliesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Supplies and returns the data saved in the database.
     * @param {suppliesCreateManyAndReturnArgs} args - Arguments to create many Supplies.
     * @example
     * // Create many Supplies
     * const supplies = await prisma.supplies.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Supplies and only return the `id`
     * const suppliesWithIdOnly = await prisma.supplies.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends suppliesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, suppliesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Supplies.
     * @param {suppliesDeleteArgs} args - Arguments to delete one Supplies.
     * @example
     * // Delete one Supplies
     * const Supplies = await prisma.supplies.delete({
     *   where: {
     *     // ... filter to delete one Supplies
     *   }
     * })
     *
     */
    delete<T extends suppliesDeleteArgs>(args: Prisma.SelectSubset<T, suppliesDeleteArgs<ExtArgs>>): Prisma.Prisma__suppliesClient<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Supplies.
     * @param {suppliesUpdateArgs} args - Arguments to update one Supplies.
     * @example
     * // Update one Supplies
     * const supplies = await prisma.supplies.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends suppliesUpdateArgs>(args: Prisma.SelectSubset<T, suppliesUpdateArgs<ExtArgs>>): Prisma.Prisma__suppliesClient<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Supplies.
     * @param {suppliesDeleteManyArgs} args - Arguments to filter Supplies to delete.
     * @example
     * // Delete a few Supplies
     * const { count } = await prisma.supplies.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends suppliesDeleteManyArgs>(args?: Prisma.SelectSubset<T, suppliesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Supplies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {suppliesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Supplies
     * const supplies = await prisma.supplies.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends suppliesUpdateManyArgs>(args: Prisma.SelectSubset<T, suppliesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Supplies and returns the data updated in the database.
     * @param {suppliesUpdateManyAndReturnArgs} args - Arguments to update many Supplies.
     * @example
     * // Update many Supplies
     * const supplies = await prisma.supplies.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Supplies and only return the `id`
     * const suppliesWithIdOnly = await prisma.supplies.updateManyAndReturn({
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
    updateManyAndReturn<T extends suppliesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, suppliesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Supplies.
     * @param {suppliesUpsertArgs} args - Arguments to update or create a Supplies.
     * @example
     * // Update or create a Supplies
     * const supplies = await prisma.supplies.upsert({
     *   create: {
     *     // ... data to create a Supplies
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Supplies we want to update
     *   }
     * })
     */
    upsert<T extends suppliesUpsertArgs>(args: Prisma.SelectSubset<T, suppliesUpsertArgs<ExtArgs>>): Prisma.Prisma__suppliesClient<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Supplies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {suppliesCountArgs} args - Arguments to filter Supplies to count.
     * @example
     * // Count the number of Supplies
     * const count = await prisma.supplies.count({
     *   where: {
     *     // ... the filter for the Supplies we want to count
     *   }
     * })
    **/
    count<T extends suppliesCountArgs>(args?: Prisma.Subset<T, suppliesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SuppliesCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Supplies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuppliesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SuppliesAggregateArgs>(args: Prisma.Subset<T, SuppliesAggregateArgs>): Prisma.PrismaPromise<GetSuppliesAggregateType<T>>;
    /**
     * Group by Supplies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {suppliesGroupByArgs} args - Group by arguments.
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
    groupBy<T extends suppliesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: suppliesGroupByArgs['orderBy'];
    } : {
        orderBy?: suppliesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, suppliesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSuppliesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the supplies model
     */
    readonly fields: suppliesFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for supplies.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__suppliesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    supply_categories<T extends Prisma.supplies$supply_categoriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.supplies$supply_categoriesArgs<ExtArgs>>): Prisma.Prisma__supply_categoriesClient<runtime.Types.Result.GetResult<Prisma.$supply_categoriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    farms<T extends Prisma.supplies$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.supplies$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    products<T extends Prisma.supplies$productsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.supplies$productsArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    supply_purchases<T extends Prisma.supplies$supply_purchasesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.supplies$supply_purchasesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    supply_usage<T extends Prisma.supplies$supply_usageArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.supplies$supply_usageArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the supplies model
 */
export interface suppliesFieldRefs {
    readonly id: Prisma.FieldRef<"supplies", 'String'>;
    readonly farm_id: Prisma.FieldRef<"supplies", 'String'>;
    readonly category_id: Prisma.FieldRef<"supplies", 'String'>;
    readonly product_id: Prisma.FieldRef<"supplies", 'String'>;
    readonly name: Prisma.FieldRef<"supplies", 'String'>;
    readonly sku: Prisma.FieldRef<"supplies", 'String'>;
    readonly current_stock: Prisma.FieldRef<"supplies", 'Decimal'>;
    readonly unit: Prisma.FieldRef<"supplies", 'String'>;
    readonly reorder_level: Prisma.FieldRef<"supplies", 'Decimal'>;
    readonly created_at: Prisma.FieldRef<"supplies", 'DateTime'>;
}
/**
 * supplies findUnique
 */
export type suppliesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supplies to fetch.
     */
    where: Prisma.suppliesWhereUniqueInput;
};
/**
 * supplies findUniqueOrThrow
 */
export type suppliesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supplies to fetch.
     */
    where: Prisma.suppliesWhereUniqueInput;
};
/**
 * supplies findFirst
 */
export type suppliesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supplies to fetch.
     */
    where?: Prisma.suppliesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supplies to fetch.
     */
    orderBy?: Prisma.suppliesOrderByWithRelationInput | Prisma.suppliesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for supplies.
     */
    cursor?: Prisma.suppliesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supplies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supplies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of supplies.
     */
    distinct?: Prisma.SuppliesScalarFieldEnum | Prisma.SuppliesScalarFieldEnum[];
};
/**
 * supplies findFirstOrThrow
 */
export type suppliesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supplies to fetch.
     */
    where?: Prisma.suppliesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supplies to fetch.
     */
    orderBy?: Prisma.suppliesOrderByWithRelationInput | Prisma.suppliesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for supplies.
     */
    cursor?: Prisma.suppliesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supplies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supplies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of supplies.
     */
    distinct?: Prisma.SuppliesScalarFieldEnum | Prisma.SuppliesScalarFieldEnum[];
};
/**
 * supplies findMany
 */
export type suppliesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supplies to fetch.
     */
    where?: Prisma.suppliesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supplies to fetch.
     */
    orderBy?: Prisma.suppliesOrderByWithRelationInput | Prisma.suppliesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing supplies.
     */
    cursor?: Prisma.suppliesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supplies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supplies.
     */
    skip?: number;
    distinct?: Prisma.SuppliesScalarFieldEnum | Prisma.SuppliesScalarFieldEnum[];
};
/**
 * supplies create
 */
export type suppliesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a supplies.
     */
    data: Prisma.XOR<Prisma.suppliesCreateInput, Prisma.suppliesUncheckedCreateInput>;
};
/**
 * supplies createMany
 */
export type suppliesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many supplies.
     */
    data: Prisma.suppliesCreateManyInput | Prisma.suppliesCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * supplies createManyAndReturn
 */
export type suppliesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supplies
     */
    select?: Prisma.suppliesSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the supplies
     */
    omit?: Prisma.suppliesOmit<ExtArgs> | null;
    /**
     * The data used to create many supplies.
     */
    data: Prisma.suppliesCreateManyInput | Prisma.suppliesCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.suppliesIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * supplies update
 */
export type suppliesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a supplies.
     */
    data: Prisma.XOR<Prisma.suppliesUpdateInput, Prisma.suppliesUncheckedUpdateInput>;
    /**
     * Choose, which supplies to update.
     */
    where: Prisma.suppliesWhereUniqueInput;
};
/**
 * supplies updateMany
 */
export type suppliesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update supplies.
     */
    data: Prisma.XOR<Prisma.suppliesUpdateManyMutationInput, Prisma.suppliesUncheckedUpdateManyInput>;
    /**
     * Filter which supplies to update
     */
    where?: Prisma.suppliesWhereInput;
    /**
     * Limit how many supplies to update.
     */
    limit?: number;
};
/**
 * supplies updateManyAndReturn
 */
export type suppliesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supplies
     */
    select?: Prisma.suppliesSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the supplies
     */
    omit?: Prisma.suppliesOmit<ExtArgs> | null;
    /**
     * The data used to update supplies.
     */
    data: Prisma.XOR<Prisma.suppliesUpdateManyMutationInput, Prisma.suppliesUncheckedUpdateManyInput>;
    /**
     * Filter which supplies to update
     */
    where?: Prisma.suppliesWhereInput;
    /**
     * Limit how many supplies to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.suppliesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * supplies upsert
 */
export type suppliesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the supplies to update in case it exists.
     */
    where: Prisma.suppliesWhereUniqueInput;
    /**
     * In case the supplies found by the `where` argument doesn't exist, create a new supplies with this data.
     */
    create: Prisma.XOR<Prisma.suppliesCreateInput, Prisma.suppliesUncheckedCreateInput>;
    /**
     * In case the supplies was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.suppliesUpdateInput, Prisma.suppliesUncheckedUpdateInput>;
};
/**
 * supplies delete
 */
export type suppliesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which supplies to delete.
     */
    where: Prisma.suppliesWhereUniqueInput;
};
/**
 * supplies deleteMany
 */
export type suppliesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which supplies to delete
     */
    where?: Prisma.suppliesWhereInput;
    /**
     * Limit how many supplies to delete.
     */
    limit?: number;
};
/**
 * supplies.supply_categories
 */
export type supplies$supply_categoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * supplies.farms
 */
export type supplies$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * supplies.products
 */
export type supplies$productsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * supplies.supply_purchases
 */
export type supplies$supply_purchasesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_purchases
     */
    select?: Prisma.supply_purchasesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_purchases
     */
    omit?: Prisma.supply_purchasesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_purchasesInclude<ExtArgs> | null;
    where?: Prisma.supply_purchasesWhereInput;
    orderBy?: Prisma.supply_purchasesOrderByWithRelationInput | Prisma.supply_purchasesOrderByWithRelationInput[];
    cursor?: Prisma.supply_purchasesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Supply_purchasesScalarFieldEnum | Prisma.Supply_purchasesScalarFieldEnum[];
};
/**
 * supplies.supply_usage
 */
export type supplies$supply_usageArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.supply_usageWhereInput;
    orderBy?: Prisma.supply_usageOrderByWithRelationInput | Prisma.supply_usageOrderByWithRelationInput[];
    cursor?: Prisma.supply_usageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Supply_usageScalarFieldEnum | Prisma.Supply_usageScalarFieldEnum[];
};
/**
 * supplies without action
 */
export type suppliesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=supplies.d.ts.map