import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model products
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type productsModel = runtime.Types.Result.DefaultSelection<Prisma.$productsPayload>;
export type AggregateProducts = {
    _count: ProductsCountAggregateOutputType | null;
    _avg: ProductsAvgAggregateOutputType | null;
    _sum: ProductsSumAggregateOutputType | null;
    _min: ProductsMinAggregateOutputType | null;
    _max: ProductsMaxAggregateOutputType | null;
};
export type ProductsAvgAggregateOutputType = {
    days_soaking: number | null;
    days_germination: number | null;
    days_light: number | null;
    avg_yield_per_tray: runtime.Decimal | null;
    seed_weight: runtime.Decimal | null;
    unit_cost: runtime.Decimal | null;
    unit_price: runtime.Decimal | null;
};
export type ProductsSumAggregateOutputType = {
    days_soaking: number | null;
    days_germination: number | null;
    days_light: number | null;
    avg_yield_per_tray: runtime.Decimal | null;
    seed_weight: runtime.Decimal | null;
    unit_cost: runtime.Decimal | null;
    unit_price: runtime.Decimal | null;
};
export type ProductsMinAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    category_id: string | null;
    name: string | null;
    sku: string | null;
    days_soaking: number | null;
    days_germination: number | null;
    days_light: number | null;
    avg_yield_per_tray: runtime.Decimal | null;
    seed_weight: runtime.Decimal | null;
    seed_unit: string | null;
    unit_cost: runtime.Decimal | null;
    unit_price: runtime.Decimal | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type ProductsMaxAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    category_id: string | null;
    name: string | null;
    sku: string | null;
    days_soaking: number | null;
    days_germination: number | null;
    days_light: number | null;
    avg_yield_per_tray: runtime.Decimal | null;
    seed_weight: runtime.Decimal | null;
    seed_unit: string | null;
    unit_cost: runtime.Decimal | null;
    unit_price: runtime.Decimal | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type ProductsCountAggregateOutputType = {
    id: number;
    farm_id: number;
    category_id: number;
    name: number;
    sku: number;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray: number;
    seed_weight: number;
    seed_unit: number;
    unit_cost: number;
    unit_price: number;
    is_active: number;
    created_at: number;
    _all: number;
};
export type ProductsAvgAggregateInputType = {
    days_soaking?: true;
    days_germination?: true;
    days_light?: true;
    avg_yield_per_tray?: true;
    seed_weight?: true;
    unit_cost?: true;
    unit_price?: true;
};
export type ProductsSumAggregateInputType = {
    days_soaking?: true;
    days_germination?: true;
    days_light?: true;
    avg_yield_per_tray?: true;
    seed_weight?: true;
    unit_cost?: true;
    unit_price?: true;
};
export type ProductsMinAggregateInputType = {
    id?: true;
    farm_id?: true;
    category_id?: true;
    name?: true;
    sku?: true;
    days_soaking?: true;
    days_germination?: true;
    days_light?: true;
    avg_yield_per_tray?: true;
    seed_weight?: true;
    seed_unit?: true;
    unit_cost?: true;
    unit_price?: true;
    is_active?: true;
    created_at?: true;
};
export type ProductsMaxAggregateInputType = {
    id?: true;
    farm_id?: true;
    category_id?: true;
    name?: true;
    sku?: true;
    days_soaking?: true;
    days_germination?: true;
    days_light?: true;
    avg_yield_per_tray?: true;
    seed_weight?: true;
    seed_unit?: true;
    unit_cost?: true;
    unit_price?: true;
    is_active?: true;
    created_at?: true;
};
export type ProductsCountAggregateInputType = {
    id?: true;
    farm_id?: true;
    category_id?: true;
    name?: true;
    sku?: true;
    days_soaking?: true;
    days_germination?: true;
    days_light?: true;
    avg_yield_per_tray?: true;
    seed_weight?: true;
    seed_unit?: true;
    unit_cost?: true;
    unit_price?: true;
    is_active?: true;
    created_at?: true;
    _all?: true;
};
export type ProductsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which products to aggregate.
     */
    where?: Prisma.productsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of products to fetch.
     */
    orderBy?: Prisma.productsOrderByWithRelationInput | Prisma.productsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.productsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` products from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` products.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned products
    **/
    _count?: true | ProductsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ProductsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ProductsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ProductsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ProductsMaxAggregateInputType;
};
export type GetProductsAggregateType<T extends ProductsAggregateArgs> = {
    [P in keyof T & keyof AggregateProducts]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProducts[P]> : Prisma.GetScalarType<T[P], AggregateProducts[P]>;
};
export type productsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.productsWhereInput;
    orderBy?: Prisma.productsOrderByWithAggregationInput | Prisma.productsOrderByWithAggregationInput[];
    by: Prisma.ProductsScalarFieldEnum[] | Prisma.ProductsScalarFieldEnum;
    having?: Prisma.productsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductsCountAggregateInputType | true;
    _avg?: ProductsAvgAggregateInputType;
    _sum?: ProductsSumAggregateInputType;
    _min?: ProductsMinAggregateInputType;
    _max?: ProductsMaxAggregateInputType;
};
export type ProductsGroupByOutputType = {
    id: string;
    farm_id: string | null;
    category_id: string | null;
    name: string;
    sku: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray: runtime.Decimal | null;
    seed_weight: runtime.Decimal | null;
    seed_unit: string | null;
    unit_cost: runtime.Decimal | null;
    unit_price: runtime.Decimal | null;
    is_active: boolean | null;
    created_at: Date | null;
    _count: ProductsCountAggregateOutputType | null;
    _avg: ProductsAvgAggregateOutputType | null;
    _sum: ProductsSumAggregateOutputType | null;
    _min: ProductsMinAggregateOutputType | null;
    _max: ProductsMaxAggregateOutputType | null;
};
type GetProductsGroupByPayload<T extends productsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProductsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProductsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProductsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProductsGroupByOutputType[P]>;
}>>;
export type productsWhereInput = {
    AND?: Prisma.productsWhereInput | Prisma.productsWhereInput[];
    OR?: Prisma.productsWhereInput[];
    NOT?: Prisma.productsWhereInput | Prisma.productsWhereInput[];
    id?: Prisma.UuidFilter<"products"> | string;
    farm_id?: Prisma.UuidNullableFilter<"products"> | string | null;
    category_id?: Prisma.UuidNullableFilter<"products"> | string | null;
    name?: Prisma.StringFilter<"products"> | string;
    sku?: Prisma.StringNullableFilter<"products"> | string | null;
    days_soaking?: Prisma.IntFilter<"products"> | number;
    days_germination?: Prisma.IntFilter<"products"> | number;
    days_light?: Prisma.IntFilter<"products"> | number;
    avg_yield_per_tray?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.StringNullableFilter<"products"> | string | null;
    unit_cost?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.BoolNullableFilter<"products"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"products"> | Date | string | null;
    blend_ingredients?: Prisma.Blend_ingredientsListRelationFilter;
    order_items?: Prisma.Order_itemsListRelationFilter;
    product_categories?: Prisma.XOR<Prisma.Product_categoriesNullableScalarRelationFilter, Prisma.product_categoriesWhereInput> | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    supplies?: Prisma.SuppliesListRelationFilter;
};
export type productsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    category_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrderInput | Prisma.SortOrder;
    days_soaking?: Prisma.SortOrder;
    days_germination?: Prisma.SortOrder;
    days_light?: Prisma.SortOrder;
    avg_yield_per_tray?: Prisma.SortOrderInput | Prisma.SortOrder;
    seed_weight?: Prisma.SortOrderInput | Prisma.SortOrder;
    seed_unit?: Prisma.SortOrderInput | Prisma.SortOrder;
    unit_cost?: Prisma.SortOrderInput | Prisma.SortOrder;
    unit_price?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    blend_ingredients?: Prisma.blend_ingredientsOrderByRelationAggregateInput;
    order_items?: Prisma.order_itemsOrderByRelationAggregateInput;
    product_categories?: Prisma.product_categoriesOrderByWithRelationInput;
    farms?: Prisma.farmsOrderByWithRelationInput;
    supplies?: Prisma.suppliesOrderByRelationAggregateInput;
};
export type productsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.productsWhereInput | Prisma.productsWhereInput[];
    OR?: Prisma.productsWhereInput[];
    NOT?: Prisma.productsWhereInput | Prisma.productsWhereInput[];
    farm_id?: Prisma.UuidNullableFilter<"products"> | string | null;
    category_id?: Prisma.UuidNullableFilter<"products"> | string | null;
    name?: Prisma.StringFilter<"products"> | string;
    sku?: Prisma.StringNullableFilter<"products"> | string | null;
    days_soaking?: Prisma.IntFilter<"products"> | number;
    days_germination?: Prisma.IntFilter<"products"> | number;
    days_light?: Prisma.IntFilter<"products"> | number;
    avg_yield_per_tray?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.StringNullableFilter<"products"> | string | null;
    unit_cost?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.BoolNullableFilter<"products"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"products"> | Date | string | null;
    blend_ingredients?: Prisma.Blend_ingredientsListRelationFilter;
    order_items?: Prisma.Order_itemsListRelationFilter;
    product_categories?: Prisma.XOR<Prisma.Product_categoriesNullableScalarRelationFilter, Prisma.product_categoriesWhereInput> | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    supplies?: Prisma.SuppliesListRelationFilter;
}, "id">;
export type productsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    category_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrderInput | Prisma.SortOrder;
    days_soaking?: Prisma.SortOrder;
    days_germination?: Prisma.SortOrder;
    days_light?: Prisma.SortOrder;
    avg_yield_per_tray?: Prisma.SortOrderInput | Prisma.SortOrder;
    seed_weight?: Prisma.SortOrderInput | Prisma.SortOrder;
    seed_unit?: Prisma.SortOrderInput | Prisma.SortOrder;
    unit_cost?: Prisma.SortOrderInput | Prisma.SortOrder;
    unit_price?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.productsCountOrderByAggregateInput;
    _avg?: Prisma.productsAvgOrderByAggregateInput;
    _max?: Prisma.productsMaxOrderByAggregateInput;
    _min?: Prisma.productsMinOrderByAggregateInput;
    _sum?: Prisma.productsSumOrderByAggregateInput;
};
export type productsScalarWhereWithAggregatesInput = {
    AND?: Prisma.productsScalarWhereWithAggregatesInput | Prisma.productsScalarWhereWithAggregatesInput[];
    OR?: Prisma.productsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.productsScalarWhereWithAggregatesInput | Prisma.productsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"products"> | string;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"products"> | string | null;
    category_id?: Prisma.UuidNullableWithAggregatesFilter<"products"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"products"> | string;
    sku?: Prisma.StringNullableWithAggregatesFilter<"products"> | string | null;
    days_soaking?: Prisma.IntWithAggregatesFilter<"products"> | number;
    days_germination?: Prisma.IntWithAggregatesFilter<"products"> | number;
    days_light?: Prisma.IntWithAggregatesFilter<"products"> | number;
    avg_yield_per_tray?: Prisma.DecimalNullableWithAggregatesFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.DecimalNullableWithAggregatesFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.StringNullableWithAggregatesFilter<"products"> | string | null;
    unit_cost?: Prisma.DecimalNullableWithAggregatesFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.DecimalNullableWithAggregatesFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.BoolNullableWithAggregatesFilter<"products"> | boolean | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"products"> | Date | string | null;
};
export type productsCreateInput = {
    id?: string;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsCreateNestedManyWithoutProductsInput;
    order_items?: Prisma.order_itemsCreateNestedManyWithoutProductsInput;
    product_categories?: Prisma.product_categoriesCreateNestedOneWithoutProductsInput;
    farms?: Prisma.farmsCreateNestedOneWithoutProductsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutProductsInput;
};
export type productsUncheckedCreateInput = {
    id?: string;
    farm_id?: string | null;
    category_id?: string | null;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedCreateNestedManyWithoutProductsInput;
    order_items?: Prisma.order_itemsUncheckedCreateNestedManyWithoutProductsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUpdateManyWithoutProductsNestedInput;
    order_items?: Prisma.order_itemsUpdateManyWithoutProductsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateOneWithoutProductsNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutProductsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedUpdateManyWithoutProductsNestedInput;
    order_items?: Prisma.order_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutProductsNestedInput;
};
export type productsCreateManyInput = {
    id?: string;
    farm_id?: string | null;
    category_id?: string | null;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type productsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type productsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type ProductsNullableScalarRelationFilter = {
    is?: Prisma.productsWhereInput | null;
    isNot?: Prisma.productsWhereInput | null;
};
export type ProductsListRelationFilter = {
    every?: Prisma.productsWhereInput;
    some?: Prisma.productsWhereInput;
    none?: Prisma.productsWhereInput;
};
export type productsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type productsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    category_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    days_soaking?: Prisma.SortOrder;
    days_germination?: Prisma.SortOrder;
    days_light?: Prisma.SortOrder;
    avg_yield_per_tray?: Prisma.SortOrder;
    seed_weight?: Prisma.SortOrder;
    seed_unit?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type productsAvgOrderByAggregateInput = {
    days_soaking?: Prisma.SortOrder;
    days_germination?: Prisma.SortOrder;
    days_light?: Prisma.SortOrder;
    avg_yield_per_tray?: Prisma.SortOrder;
    seed_weight?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
};
export type productsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    category_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    days_soaking?: Prisma.SortOrder;
    days_germination?: Prisma.SortOrder;
    days_light?: Prisma.SortOrder;
    avg_yield_per_tray?: Prisma.SortOrder;
    seed_weight?: Prisma.SortOrder;
    seed_unit?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type productsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    category_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    days_soaking?: Prisma.SortOrder;
    days_germination?: Prisma.SortOrder;
    days_light?: Prisma.SortOrder;
    avg_yield_per_tray?: Prisma.SortOrder;
    seed_weight?: Prisma.SortOrder;
    seed_unit?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type productsSumOrderByAggregateInput = {
    days_soaking?: Prisma.SortOrder;
    days_germination?: Prisma.SortOrder;
    days_light?: Prisma.SortOrder;
    avg_yield_per_tray?: Prisma.SortOrder;
    seed_weight?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
};
export type productsCreateNestedOneWithoutBlend_ingredientsInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutBlend_ingredientsInput, Prisma.productsUncheckedCreateWithoutBlend_ingredientsInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutBlend_ingredientsInput;
    connect?: Prisma.productsWhereUniqueInput;
};
export type productsUpdateOneWithoutBlend_ingredientsNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutBlend_ingredientsInput, Prisma.productsUncheckedCreateWithoutBlend_ingredientsInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutBlend_ingredientsInput;
    upsert?: Prisma.productsUpsertWithoutBlend_ingredientsInput;
    disconnect?: Prisma.productsWhereInput | boolean;
    delete?: Prisma.productsWhereInput | boolean;
    connect?: Prisma.productsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.productsUpdateToOneWithWhereWithoutBlend_ingredientsInput, Prisma.productsUpdateWithoutBlend_ingredientsInput>, Prisma.productsUncheckedUpdateWithoutBlend_ingredientsInput>;
};
export type productsCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutFarmsInput, Prisma.productsUncheckedCreateWithoutFarmsInput> | Prisma.productsCreateWithoutFarmsInput[] | Prisma.productsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutFarmsInput | Prisma.productsCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.productsCreateManyFarmsInputEnvelope;
    connect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
};
export type productsUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutFarmsInput, Prisma.productsUncheckedCreateWithoutFarmsInput> | Prisma.productsCreateWithoutFarmsInput[] | Prisma.productsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutFarmsInput | Prisma.productsCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.productsCreateManyFarmsInputEnvelope;
    connect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
};
export type productsUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutFarmsInput, Prisma.productsUncheckedCreateWithoutFarmsInput> | Prisma.productsCreateWithoutFarmsInput[] | Prisma.productsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutFarmsInput | Prisma.productsCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.productsUpsertWithWhereUniqueWithoutFarmsInput | Prisma.productsUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.productsCreateManyFarmsInputEnvelope;
    set?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    disconnect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    delete?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    connect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    update?: Prisma.productsUpdateWithWhereUniqueWithoutFarmsInput | Prisma.productsUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.productsUpdateManyWithWhereWithoutFarmsInput | Prisma.productsUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.productsScalarWhereInput | Prisma.productsScalarWhereInput[];
};
export type productsUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutFarmsInput, Prisma.productsUncheckedCreateWithoutFarmsInput> | Prisma.productsCreateWithoutFarmsInput[] | Prisma.productsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutFarmsInput | Prisma.productsCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.productsUpsertWithWhereUniqueWithoutFarmsInput | Prisma.productsUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.productsCreateManyFarmsInputEnvelope;
    set?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    disconnect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    delete?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    connect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    update?: Prisma.productsUpdateWithWhereUniqueWithoutFarmsInput | Prisma.productsUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.productsUpdateManyWithWhereWithoutFarmsInput | Prisma.productsUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.productsScalarWhereInput | Prisma.productsScalarWhereInput[];
};
export type productsCreateNestedOneWithoutOrder_itemsInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutOrder_itemsInput, Prisma.productsUncheckedCreateWithoutOrder_itemsInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutOrder_itemsInput;
    connect?: Prisma.productsWhereUniqueInput;
};
export type productsUpdateOneWithoutOrder_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutOrder_itemsInput, Prisma.productsUncheckedCreateWithoutOrder_itemsInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutOrder_itemsInput;
    upsert?: Prisma.productsUpsertWithoutOrder_itemsInput;
    disconnect?: Prisma.productsWhereInput | boolean;
    delete?: Prisma.productsWhereInput | boolean;
    connect?: Prisma.productsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.productsUpdateToOneWithWhereWithoutOrder_itemsInput, Prisma.productsUpdateWithoutOrder_itemsInput>, Prisma.productsUncheckedUpdateWithoutOrder_itemsInput>;
};
export type productsCreateNestedManyWithoutProduct_categoriesInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutProduct_categoriesInput, Prisma.productsUncheckedCreateWithoutProduct_categoriesInput> | Prisma.productsCreateWithoutProduct_categoriesInput[] | Prisma.productsUncheckedCreateWithoutProduct_categoriesInput[];
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutProduct_categoriesInput | Prisma.productsCreateOrConnectWithoutProduct_categoriesInput[];
    createMany?: Prisma.productsCreateManyProduct_categoriesInputEnvelope;
    connect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
};
export type productsUncheckedCreateNestedManyWithoutProduct_categoriesInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutProduct_categoriesInput, Prisma.productsUncheckedCreateWithoutProduct_categoriesInput> | Prisma.productsCreateWithoutProduct_categoriesInput[] | Prisma.productsUncheckedCreateWithoutProduct_categoriesInput[];
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutProduct_categoriesInput | Prisma.productsCreateOrConnectWithoutProduct_categoriesInput[];
    createMany?: Prisma.productsCreateManyProduct_categoriesInputEnvelope;
    connect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
};
export type productsUpdateManyWithoutProduct_categoriesNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutProduct_categoriesInput, Prisma.productsUncheckedCreateWithoutProduct_categoriesInput> | Prisma.productsCreateWithoutProduct_categoriesInput[] | Prisma.productsUncheckedCreateWithoutProduct_categoriesInput[];
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutProduct_categoriesInput | Prisma.productsCreateOrConnectWithoutProduct_categoriesInput[];
    upsert?: Prisma.productsUpsertWithWhereUniqueWithoutProduct_categoriesInput | Prisma.productsUpsertWithWhereUniqueWithoutProduct_categoriesInput[];
    createMany?: Prisma.productsCreateManyProduct_categoriesInputEnvelope;
    set?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    disconnect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    delete?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    connect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    update?: Prisma.productsUpdateWithWhereUniqueWithoutProduct_categoriesInput | Prisma.productsUpdateWithWhereUniqueWithoutProduct_categoriesInput[];
    updateMany?: Prisma.productsUpdateManyWithWhereWithoutProduct_categoriesInput | Prisma.productsUpdateManyWithWhereWithoutProduct_categoriesInput[];
    deleteMany?: Prisma.productsScalarWhereInput | Prisma.productsScalarWhereInput[];
};
export type productsUncheckedUpdateManyWithoutProduct_categoriesNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutProduct_categoriesInput, Prisma.productsUncheckedCreateWithoutProduct_categoriesInput> | Prisma.productsCreateWithoutProduct_categoriesInput[] | Prisma.productsUncheckedCreateWithoutProduct_categoriesInput[];
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutProduct_categoriesInput | Prisma.productsCreateOrConnectWithoutProduct_categoriesInput[];
    upsert?: Prisma.productsUpsertWithWhereUniqueWithoutProduct_categoriesInput | Prisma.productsUpsertWithWhereUniqueWithoutProduct_categoriesInput[];
    createMany?: Prisma.productsCreateManyProduct_categoriesInputEnvelope;
    set?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    disconnect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    delete?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    connect?: Prisma.productsWhereUniqueInput | Prisma.productsWhereUniqueInput[];
    update?: Prisma.productsUpdateWithWhereUniqueWithoutProduct_categoriesInput | Prisma.productsUpdateWithWhereUniqueWithoutProduct_categoriesInput[];
    updateMany?: Prisma.productsUpdateManyWithWhereWithoutProduct_categoriesInput | Prisma.productsUpdateManyWithWhereWithoutProduct_categoriesInput[];
    deleteMany?: Prisma.productsScalarWhereInput | Prisma.productsScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type productsCreateNestedOneWithoutSuppliesInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutSuppliesInput, Prisma.productsUncheckedCreateWithoutSuppliesInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutSuppliesInput;
    connect?: Prisma.productsWhereUniqueInput;
};
export type productsUpdateOneWithoutSuppliesNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutSuppliesInput, Prisma.productsUncheckedCreateWithoutSuppliesInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutSuppliesInput;
    upsert?: Prisma.productsUpsertWithoutSuppliesInput;
    disconnect?: Prisma.productsWhereInput | boolean;
    delete?: Prisma.productsWhereInput | boolean;
    connect?: Prisma.productsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.productsUpdateToOneWithWhereWithoutSuppliesInput, Prisma.productsUpdateWithoutSuppliesInput>, Prisma.productsUncheckedUpdateWithoutSuppliesInput>;
};
export type productsCreateWithoutBlend_ingredientsInput = {
    id?: string;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    order_items?: Prisma.order_itemsCreateNestedManyWithoutProductsInput;
    product_categories?: Prisma.product_categoriesCreateNestedOneWithoutProductsInput;
    farms?: Prisma.farmsCreateNestedOneWithoutProductsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutProductsInput;
};
export type productsUncheckedCreateWithoutBlend_ingredientsInput = {
    id?: string;
    farm_id?: string | null;
    category_id?: string | null;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    order_items?: Prisma.order_itemsUncheckedCreateNestedManyWithoutProductsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsCreateOrConnectWithoutBlend_ingredientsInput = {
    where: Prisma.productsWhereUniqueInput;
    create: Prisma.XOR<Prisma.productsCreateWithoutBlend_ingredientsInput, Prisma.productsUncheckedCreateWithoutBlend_ingredientsInput>;
};
export type productsUpsertWithoutBlend_ingredientsInput = {
    update: Prisma.XOR<Prisma.productsUpdateWithoutBlend_ingredientsInput, Prisma.productsUncheckedUpdateWithoutBlend_ingredientsInput>;
    create: Prisma.XOR<Prisma.productsCreateWithoutBlend_ingredientsInput, Prisma.productsUncheckedCreateWithoutBlend_ingredientsInput>;
    where?: Prisma.productsWhereInput;
};
export type productsUpdateToOneWithWhereWithoutBlend_ingredientsInput = {
    where?: Prisma.productsWhereInput;
    data: Prisma.XOR<Prisma.productsUpdateWithoutBlend_ingredientsInput, Prisma.productsUncheckedUpdateWithoutBlend_ingredientsInput>;
};
export type productsUpdateWithoutBlend_ingredientsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    order_items?: Prisma.order_itemsUpdateManyWithoutProductsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateOneWithoutProductsNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutProductsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateWithoutBlend_ingredientsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    order_items?: Prisma.order_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutProductsNestedInput;
};
export type productsCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsCreateNestedManyWithoutProductsInput;
    order_items?: Prisma.order_itemsCreateNestedManyWithoutProductsInput;
    product_categories?: Prisma.product_categoriesCreateNestedOneWithoutProductsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutProductsInput;
};
export type productsUncheckedCreateWithoutFarmsInput = {
    id?: string;
    category_id?: string | null;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedCreateNestedManyWithoutProductsInput;
    order_items?: Prisma.order_itemsUncheckedCreateNestedManyWithoutProductsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsCreateOrConnectWithoutFarmsInput = {
    where: Prisma.productsWhereUniqueInput;
    create: Prisma.XOR<Prisma.productsCreateWithoutFarmsInput, Prisma.productsUncheckedCreateWithoutFarmsInput>;
};
export type productsCreateManyFarmsInputEnvelope = {
    data: Prisma.productsCreateManyFarmsInput | Prisma.productsCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type productsUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.productsWhereUniqueInput;
    update: Prisma.XOR<Prisma.productsUpdateWithoutFarmsInput, Prisma.productsUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.productsCreateWithoutFarmsInput, Prisma.productsUncheckedCreateWithoutFarmsInput>;
};
export type productsUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.productsWhereUniqueInput;
    data: Prisma.XOR<Prisma.productsUpdateWithoutFarmsInput, Prisma.productsUncheckedUpdateWithoutFarmsInput>;
};
export type productsUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.productsScalarWhereInput;
    data: Prisma.XOR<Prisma.productsUpdateManyMutationInput, Prisma.productsUncheckedUpdateManyWithoutFarmsInput>;
};
export type productsScalarWhereInput = {
    AND?: Prisma.productsScalarWhereInput | Prisma.productsScalarWhereInput[];
    OR?: Prisma.productsScalarWhereInput[];
    NOT?: Prisma.productsScalarWhereInput | Prisma.productsScalarWhereInput[];
    id?: Prisma.UuidFilter<"products"> | string;
    farm_id?: Prisma.UuidNullableFilter<"products"> | string | null;
    category_id?: Prisma.UuidNullableFilter<"products"> | string | null;
    name?: Prisma.StringFilter<"products"> | string;
    sku?: Prisma.StringNullableFilter<"products"> | string | null;
    days_soaking?: Prisma.IntFilter<"products"> | number;
    days_germination?: Prisma.IntFilter<"products"> | number;
    days_light?: Prisma.IntFilter<"products"> | number;
    avg_yield_per_tray?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.StringNullableFilter<"products"> | string | null;
    unit_cost?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.DecimalNullableFilter<"products"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.BoolNullableFilter<"products"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"products"> | Date | string | null;
};
export type productsCreateWithoutOrder_itemsInput = {
    id?: string;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsCreateNestedManyWithoutProductsInput;
    product_categories?: Prisma.product_categoriesCreateNestedOneWithoutProductsInput;
    farms?: Prisma.farmsCreateNestedOneWithoutProductsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutProductsInput;
};
export type productsUncheckedCreateWithoutOrder_itemsInput = {
    id?: string;
    farm_id?: string | null;
    category_id?: string | null;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedCreateNestedManyWithoutProductsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsCreateOrConnectWithoutOrder_itemsInput = {
    where: Prisma.productsWhereUniqueInput;
    create: Prisma.XOR<Prisma.productsCreateWithoutOrder_itemsInput, Prisma.productsUncheckedCreateWithoutOrder_itemsInput>;
};
export type productsUpsertWithoutOrder_itemsInput = {
    update: Prisma.XOR<Prisma.productsUpdateWithoutOrder_itemsInput, Prisma.productsUncheckedUpdateWithoutOrder_itemsInput>;
    create: Prisma.XOR<Prisma.productsCreateWithoutOrder_itemsInput, Prisma.productsUncheckedCreateWithoutOrder_itemsInput>;
    where?: Prisma.productsWhereInput;
};
export type productsUpdateToOneWithWhereWithoutOrder_itemsInput = {
    where?: Prisma.productsWhereInput;
    data: Prisma.XOR<Prisma.productsUpdateWithoutOrder_itemsInput, Prisma.productsUncheckedUpdateWithoutOrder_itemsInput>;
};
export type productsUpdateWithoutOrder_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUpdateManyWithoutProductsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateOneWithoutProductsNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutProductsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateWithoutOrder_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedUpdateManyWithoutProductsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutProductsNestedInput;
};
export type productsCreateWithoutProduct_categoriesInput = {
    id?: string;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsCreateNestedManyWithoutProductsInput;
    order_items?: Prisma.order_itemsCreateNestedManyWithoutProductsInput;
    farms?: Prisma.farmsCreateNestedOneWithoutProductsInput;
    supplies?: Prisma.suppliesCreateNestedManyWithoutProductsInput;
};
export type productsUncheckedCreateWithoutProduct_categoriesInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedCreateNestedManyWithoutProductsInput;
    order_items?: Prisma.order_itemsUncheckedCreateNestedManyWithoutProductsInput;
    supplies?: Prisma.suppliesUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsCreateOrConnectWithoutProduct_categoriesInput = {
    where: Prisma.productsWhereUniqueInput;
    create: Prisma.XOR<Prisma.productsCreateWithoutProduct_categoriesInput, Prisma.productsUncheckedCreateWithoutProduct_categoriesInput>;
};
export type productsCreateManyProduct_categoriesInputEnvelope = {
    data: Prisma.productsCreateManyProduct_categoriesInput | Prisma.productsCreateManyProduct_categoriesInput[];
    skipDuplicates?: boolean;
};
export type productsUpsertWithWhereUniqueWithoutProduct_categoriesInput = {
    where: Prisma.productsWhereUniqueInput;
    update: Prisma.XOR<Prisma.productsUpdateWithoutProduct_categoriesInput, Prisma.productsUncheckedUpdateWithoutProduct_categoriesInput>;
    create: Prisma.XOR<Prisma.productsCreateWithoutProduct_categoriesInput, Prisma.productsUncheckedCreateWithoutProduct_categoriesInput>;
};
export type productsUpdateWithWhereUniqueWithoutProduct_categoriesInput = {
    where: Prisma.productsWhereUniqueInput;
    data: Prisma.XOR<Prisma.productsUpdateWithoutProduct_categoriesInput, Prisma.productsUncheckedUpdateWithoutProduct_categoriesInput>;
};
export type productsUpdateManyWithWhereWithoutProduct_categoriesInput = {
    where: Prisma.productsScalarWhereInput;
    data: Prisma.XOR<Prisma.productsUpdateManyMutationInput, Prisma.productsUncheckedUpdateManyWithoutProduct_categoriesInput>;
};
export type productsCreateWithoutSuppliesInput = {
    id?: string;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsCreateNestedManyWithoutProductsInput;
    order_items?: Prisma.order_itemsCreateNestedManyWithoutProductsInput;
    product_categories?: Prisma.product_categoriesCreateNestedOneWithoutProductsInput;
    farms?: Prisma.farmsCreateNestedOneWithoutProductsInput;
};
export type productsUncheckedCreateWithoutSuppliesInput = {
    id?: string;
    farm_id?: string | null;
    category_id?: string | null;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedCreateNestedManyWithoutProductsInput;
    order_items?: Prisma.order_itemsUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsCreateOrConnectWithoutSuppliesInput = {
    where: Prisma.productsWhereUniqueInput;
    create: Prisma.XOR<Prisma.productsCreateWithoutSuppliesInput, Prisma.productsUncheckedCreateWithoutSuppliesInput>;
};
export type productsUpsertWithoutSuppliesInput = {
    update: Prisma.XOR<Prisma.productsUpdateWithoutSuppliesInput, Prisma.productsUncheckedUpdateWithoutSuppliesInput>;
    create: Prisma.XOR<Prisma.productsCreateWithoutSuppliesInput, Prisma.productsUncheckedCreateWithoutSuppliesInput>;
    where?: Prisma.productsWhereInput;
};
export type productsUpdateToOneWithWhereWithoutSuppliesInput = {
    where?: Prisma.productsWhereInput;
    data: Prisma.XOR<Prisma.productsUpdateWithoutSuppliesInput, Prisma.productsUncheckedUpdateWithoutSuppliesInput>;
};
export type productsUpdateWithoutSuppliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUpdateManyWithoutProductsNestedInput;
    order_items?: Prisma.order_itemsUpdateManyWithoutProductsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateOneWithoutProductsNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutProductsNestedInput;
};
export type productsUncheckedUpdateWithoutSuppliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedUpdateManyWithoutProductsNestedInput;
    order_items?: Prisma.order_itemsUncheckedUpdateManyWithoutProductsNestedInput;
};
export type productsCreateManyFarmsInput = {
    id?: string;
    category_id?: string | null;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type productsUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUpdateManyWithoutProductsNestedInput;
    order_items?: Prisma.order_itemsUpdateManyWithoutProductsNestedInput;
    product_categories?: Prisma.product_categoriesUpdateOneWithoutProductsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedUpdateManyWithoutProductsNestedInput;
    order_items?: Prisma.order_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    category_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type productsCreateManyProduct_categoriesInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    sku?: string | null;
    days_soaking: number;
    days_germination: number;
    days_light: number;
    avg_yield_per_tray?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: string | null;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type productsUpdateWithoutProduct_categoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUpdateManyWithoutProductsNestedInput;
    order_items?: Prisma.order_itemsUpdateManyWithoutProductsNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutProductsNestedInput;
    supplies?: Prisma.suppliesUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateWithoutProduct_categoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blend_ingredients?: Prisma.blend_ingredientsUncheckedUpdateManyWithoutProductsNestedInput;
    order_items?: Prisma.order_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    supplies?: Prisma.suppliesUncheckedUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateManyWithoutProduct_categoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    days_soaking?: Prisma.IntFieldUpdateOperationsInput | number;
    days_germination?: Prisma.IntFieldUpdateOperationsInput | number;
    days_light?: Prisma.IntFieldUpdateOperationsInput | number;
    avg_yield_per_tray?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    seed_unit?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    unit_price?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type ProductsCountOutputType
 */
export type ProductsCountOutputType = {
    blend_ingredients: number;
    order_items: number;
    supplies: number;
};
export type ProductsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blend_ingredients?: boolean | ProductsCountOutputTypeCountBlend_ingredientsArgs;
    order_items?: boolean | ProductsCountOutputTypeCountOrder_itemsArgs;
    supplies?: boolean | ProductsCountOutputTypeCountSuppliesArgs;
};
/**
 * ProductsCountOutputType without action
 */
export type ProductsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductsCountOutputType
     */
    select?: Prisma.ProductsCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * ProductsCountOutputType without action
 */
export type ProductsCountOutputTypeCountBlend_ingredientsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.blend_ingredientsWhereInput;
};
/**
 * ProductsCountOutputType without action
 */
export type ProductsCountOutputTypeCountOrder_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.order_itemsWhereInput;
};
/**
 * ProductsCountOutputType without action
 */
export type ProductsCountOutputTypeCountSuppliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.suppliesWhereInput;
};
export type productsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    category_id?: boolean;
    name?: boolean;
    sku?: boolean;
    days_soaking?: boolean;
    days_germination?: boolean;
    days_light?: boolean;
    avg_yield_per_tray?: boolean;
    seed_weight?: boolean;
    seed_unit?: boolean;
    unit_cost?: boolean;
    unit_price?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    blend_ingredients?: boolean | Prisma.products$blend_ingredientsArgs<ExtArgs>;
    order_items?: boolean | Prisma.products$order_itemsArgs<ExtArgs>;
    product_categories?: boolean | Prisma.products$product_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.products$farmsArgs<ExtArgs>;
    supplies?: boolean | Prisma.products$suppliesArgs<ExtArgs>;
    _count?: boolean | Prisma.ProductsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["products"]>;
export type productsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    category_id?: boolean;
    name?: boolean;
    sku?: boolean;
    days_soaking?: boolean;
    days_germination?: boolean;
    days_light?: boolean;
    avg_yield_per_tray?: boolean;
    seed_weight?: boolean;
    seed_unit?: boolean;
    unit_cost?: boolean;
    unit_price?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    product_categories?: boolean | Prisma.products$product_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.products$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["products"]>;
export type productsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    category_id?: boolean;
    name?: boolean;
    sku?: boolean;
    days_soaking?: boolean;
    days_germination?: boolean;
    days_light?: boolean;
    avg_yield_per_tray?: boolean;
    seed_weight?: boolean;
    seed_unit?: boolean;
    unit_cost?: boolean;
    unit_price?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    product_categories?: boolean | Prisma.products$product_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.products$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["products"]>;
export type productsSelectScalar = {
    id?: boolean;
    farm_id?: boolean;
    category_id?: boolean;
    name?: boolean;
    sku?: boolean;
    days_soaking?: boolean;
    days_germination?: boolean;
    days_light?: boolean;
    avg_yield_per_tray?: boolean;
    seed_weight?: boolean;
    seed_unit?: boolean;
    unit_cost?: boolean;
    unit_price?: boolean;
    is_active?: boolean;
    created_at?: boolean;
};
export type productsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farm_id" | "category_id" | "name" | "sku" | "days_soaking" | "days_germination" | "days_light" | "avg_yield_per_tray" | "seed_weight" | "seed_unit" | "unit_cost" | "unit_price" | "is_active" | "created_at", ExtArgs["result"]["products"]>;
export type productsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blend_ingredients?: boolean | Prisma.products$blend_ingredientsArgs<ExtArgs>;
    order_items?: boolean | Prisma.products$order_itemsArgs<ExtArgs>;
    product_categories?: boolean | Prisma.products$product_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.products$farmsArgs<ExtArgs>;
    supplies?: boolean | Prisma.products$suppliesArgs<ExtArgs>;
    _count?: boolean | Prisma.ProductsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type productsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product_categories?: boolean | Prisma.products$product_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.products$farmsArgs<ExtArgs>;
};
export type productsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    product_categories?: boolean | Prisma.products$product_categoriesArgs<ExtArgs>;
    farms?: boolean | Prisma.products$farmsArgs<ExtArgs>;
};
export type $productsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "products";
    objects: {
        blend_ingredients: Prisma.$blend_ingredientsPayload<ExtArgs>[];
        order_items: Prisma.$order_itemsPayload<ExtArgs>[];
        product_categories: Prisma.$product_categoriesPayload<ExtArgs> | null;
        farms: Prisma.$farmsPayload<ExtArgs> | null;
        supplies: Prisma.$suppliesPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farm_id: string | null;
        category_id: string | null;
        name: string;
        sku: string | null;
        days_soaking: number;
        days_germination: number;
        days_light: number;
        avg_yield_per_tray: runtime.Decimal | null;
        seed_weight: runtime.Decimal | null;
        seed_unit: string | null;
        unit_cost: runtime.Decimal | null;
        unit_price: runtime.Decimal | null;
        is_active: boolean | null;
        created_at: Date | null;
    }, ExtArgs["result"]["products"]>;
    composites: {};
};
export type productsGetPayload<S extends boolean | null | undefined | productsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$productsPayload, S>;
export type productsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<productsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProductsCountAggregateInputType | true;
};
export interface productsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['products'];
        meta: {
            name: 'products';
        };
    };
    /**
     * Find zero or one Products that matches the filter.
     * @param {productsFindUniqueArgs} args - Arguments to find a Products
     * @example
     * // Get one Products
     * const products = await prisma.products.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends productsFindUniqueArgs>(args: Prisma.SelectSubset<T, productsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Products that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {productsFindUniqueOrThrowArgs} args - Arguments to find a Products
     * @example
     * // Get one Products
     * const products = await prisma.products.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends productsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, productsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsFindFirstArgs} args - Arguments to find a Products
     * @example
     * // Get one Products
     * const products = await prisma.products.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends productsFindFirstArgs>(args?: Prisma.SelectSubset<T, productsFindFirstArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Products that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsFindFirstOrThrowArgs} args - Arguments to find a Products
     * @example
     * // Get one Products
     * const products = await prisma.products.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends productsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, productsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.products.findMany()
     *
     * // Get first 10 Products
     * const products = await prisma.products.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const productsWithIdOnly = await prisma.products.findMany({ select: { id: true } })
     *
     */
    findMany<T extends productsFindManyArgs>(args?: Prisma.SelectSubset<T, productsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Products.
     * @param {productsCreateArgs} args - Arguments to create a Products.
     * @example
     * // Create one Products
     * const Products = await prisma.products.create({
     *   data: {
     *     // ... data to create a Products
     *   }
     * })
     *
     */
    create<T extends productsCreateArgs>(args: Prisma.SelectSubset<T, productsCreateArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Products.
     * @param {productsCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const products = await prisma.products.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends productsCreateManyArgs>(args?: Prisma.SelectSubset<T, productsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Products and returns the data saved in the database.
     * @param {productsCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const products = await prisma.products.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Products and only return the `id`
     * const productsWithIdOnly = await prisma.products.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends productsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, productsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Products.
     * @param {productsDeleteArgs} args - Arguments to delete one Products.
     * @example
     * // Delete one Products
     * const Products = await prisma.products.delete({
     *   where: {
     *     // ... filter to delete one Products
     *   }
     * })
     *
     */
    delete<T extends productsDeleteArgs>(args: Prisma.SelectSubset<T, productsDeleteArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Products.
     * @param {productsUpdateArgs} args - Arguments to update one Products.
     * @example
     * // Update one Products
     * const products = await prisma.products.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends productsUpdateArgs>(args: Prisma.SelectSubset<T, productsUpdateArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Products.
     * @param {productsDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.products.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends productsDeleteManyArgs>(args?: Prisma.SelectSubset<T, productsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const products = await prisma.products.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends productsUpdateManyArgs>(args: Prisma.SelectSubset<T, productsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {productsUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const products = await prisma.products.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Products and only return the `id`
     * const productsWithIdOnly = await prisma.products.updateManyAndReturn({
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
    updateManyAndReturn<T extends productsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, productsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Products.
     * @param {productsUpsertArgs} args - Arguments to update or create a Products.
     * @example
     * // Update or create a Products
     * const products = await prisma.products.upsert({
     *   create: {
     *     // ... data to create a Products
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Products we want to update
     *   }
     * })
     */
    upsert<T extends productsUpsertArgs>(args: Prisma.SelectSubset<T, productsUpsertArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.products.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends productsCountArgs>(args?: Prisma.Subset<T, productsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProductsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductsAggregateArgs>(args: Prisma.Subset<T, ProductsAggregateArgs>): Prisma.PrismaPromise<GetProductsAggregateType<T>>;
    /**
     * Group by Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {productsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends productsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: productsGroupByArgs['orderBy'];
    } : {
        orderBy?: productsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, productsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the products model
     */
    readonly fields: productsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for products.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__productsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    blend_ingredients<T extends Prisma.products$blend_ingredientsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.products$blend_ingredientsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$blend_ingredientsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    order_items<T extends Prisma.products$order_itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.products$order_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    product_categories<T extends Prisma.products$product_categoriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.products$product_categoriesArgs<ExtArgs>>): Prisma.Prisma__product_categoriesClient<runtime.Types.Result.GetResult<Prisma.$product_categoriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    farms<T extends Prisma.products$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.products$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    supplies<T extends Prisma.products$suppliesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.products$suppliesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the products model
 */
export interface productsFieldRefs {
    readonly id: Prisma.FieldRef<"products", 'String'>;
    readonly farm_id: Prisma.FieldRef<"products", 'String'>;
    readonly category_id: Prisma.FieldRef<"products", 'String'>;
    readonly name: Prisma.FieldRef<"products", 'String'>;
    readonly sku: Prisma.FieldRef<"products", 'String'>;
    readonly days_soaking: Prisma.FieldRef<"products", 'Int'>;
    readonly days_germination: Prisma.FieldRef<"products", 'Int'>;
    readonly days_light: Prisma.FieldRef<"products", 'Int'>;
    readonly avg_yield_per_tray: Prisma.FieldRef<"products", 'Decimal'>;
    readonly seed_weight: Prisma.FieldRef<"products", 'Decimal'>;
    readonly seed_unit: Prisma.FieldRef<"products", 'String'>;
    readonly unit_cost: Prisma.FieldRef<"products", 'Decimal'>;
    readonly unit_price: Prisma.FieldRef<"products", 'Decimal'>;
    readonly is_active: Prisma.FieldRef<"products", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"products", 'DateTime'>;
}
/**
 * products findUnique
 */
export type productsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which products to fetch.
     */
    where: Prisma.productsWhereUniqueInput;
};
/**
 * products findUniqueOrThrow
 */
export type productsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which products to fetch.
     */
    where: Prisma.productsWhereUniqueInput;
};
/**
 * products findFirst
 */
export type productsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which products to fetch.
     */
    where?: Prisma.productsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of products to fetch.
     */
    orderBy?: Prisma.productsOrderByWithRelationInput | Prisma.productsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for products.
     */
    cursor?: Prisma.productsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` products from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` products.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of products.
     */
    distinct?: Prisma.ProductsScalarFieldEnum | Prisma.ProductsScalarFieldEnum[];
};
/**
 * products findFirstOrThrow
 */
export type productsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which products to fetch.
     */
    where?: Prisma.productsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of products to fetch.
     */
    orderBy?: Prisma.productsOrderByWithRelationInput | Prisma.productsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for products.
     */
    cursor?: Prisma.productsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` products from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` products.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of products.
     */
    distinct?: Prisma.ProductsScalarFieldEnum | Prisma.ProductsScalarFieldEnum[];
};
/**
 * products findMany
 */
export type productsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which products to fetch.
     */
    where?: Prisma.productsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of products to fetch.
     */
    orderBy?: Prisma.productsOrderByWithRelationInput | Prisma.productsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing products.
     */
    cursor?: Prisma.productsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` products from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` products.
     */
    skip?: number;
    distinct?: Prisma.ProductsScalarFieldEnum | Prisma.ProductsScalarFieldEnum[];
};
/**
 * products create
 */
export type productsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a products.
     */
    data: Prisma.XOR<Prisma.productsCreateInput, Prisma.productsUncheckedCreateInput>;
};
/**
 * products createMany
 */
export type productsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many products.
     */
    data: Prisma.productsCreateManyInput | Prisma.productsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * products createManyAndReturn
 */
export type productsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: Prisma.productsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the products
     */
    omit?: Prisma.productsOmit<ExtArgs> | null;
    /**
     * The data used to create many products.
     */
    data: Prisma.productsCreateManyInput | Prisma.productsCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.productsIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * products update
 */
export type productsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a products.
     */
    data: Prisma.XOR<Prisma.productsUpdateInput, Prisma.productsUncheckedUpdateInput>;
    /**
     * Choose, which products to update.
     */
    where: Prisma.productsWhereUniqueInput;
};
/**
 * products updateMany
 */
export type productsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update products.
     */
    data: Prisma.XOR<Prisma.productsUpdateManyMutationInput, Prisma.productsUncheckedUpdateManyInput>;
    /**
     * Filter which products to update
     */
    where?: Prisma.productsWhereInput;
    /**
     * Limit how many products to update.
     */
    limit?: number;
};
/**
 * products updateManyAndReturn
 */
export type productsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the products
     */
    select?: Prisma.productsSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the products
     */
    omit?: Prisma.productsOmit<ExtArgs> | null;
    /**
     * The data used to update products.
     */
    data: Prisma.XOR<Prisma.productsUpdateManyMutationInput, Prisma.productsUncheckedUpdateManyInput>;
    /**
     * Filter which products to update
     */
    where?: Prisma.productsWhereInput;
    /**
     * Limit how many products to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.productsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * products upsert
 */
export type productsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the products to update in case it exists.
     */
    where: Prisma.productsWhereUniqueInput;
    /**
     * In case the products found by the `where` argument doesn't exist, create a new products with this data.
     */
    create: Prisma.XOR<Prisma.productsCreateInput, Prisma.productsUncheckedCreateInput>;
    /**
     * In case the products was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.productsUpdateInput, Prisma.productsUncheckedUpdateInput>;
};
/**
 * products delete
 */
export type productsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which products to delete.
     */
    where: Prisma.productsWhereUniqueInput;
};
/**
 * products deleteMany
 */
export type productsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which products to delete
     */
    where?: Prisma.productsWhereInput;
    /**
     * Limit how many products to delete.
     */
    limit?: number;
};
/**
 * products.blend_ingredients
 */
export type products$blend_ingredientsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * products.order_items
 */
export type products$order_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * products.product_categories
 */
export type products$product_categoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * products.farms
 */
export type products$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * products.supplies
 */
export type products$suppliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * products without action
 */
export type productsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=products.d.ts.map