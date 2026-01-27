import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model order_items
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type order_itemsModel = runtime.Types.Result.DefaultSelection<Prisma.$order_itemsPayload>;
export type AggregateOrder_items = {
    _count: Order_itemsCountAggregateOutputType | null;
    _avg: Order_itemsAvgAggregateOutputType | null;
    _sum: Order_itemsSumAggregateOutputType | null;
    _min: Order_itemsMinAggregateOutputType | null;
    _max: Order_itemsMaxAggregateOutputType | null;
};
export type Order_itemsAvgAggregateOutputType = {
    quantity_oz: runtime.Decimal | null;
    overage_percent: runtime.Decimal | null;
    trays_needed: number | null;
};
export type Order_itemsSumAggregateOutputType = {
    quantity_oz: runtime.Decimal | null;
    overage_percent: runtime.Decimal | null;
    trays_needed: number | null;
};
export type Order_itemsMinAggregateOutputType = {
    id: string | null;
    order_id: string | null;
    product_id: string | null;
    blend_id: string | null;
    quantity_oz: runtime.Decimal | null;
    harvest_date: Date | null;
    overage_percent: runtime.Decimal | null;
    trays_needed: number | null;
    soak_date: Date | null;
    seed_date: Date | null;
    move_to_light_date: Date | null;
    created_at: Date | null;
};
export type Order_itemsMaxAggregateOutputType = {
    id: string | null;
    order_id: string | null;
    product_id: string | null;
    blend_id: string | null;
    quantity_oz: runtime.Decimal | null;
    harvest_date: Date | null;
    overage_percent: runtime.Decimal | null;
    trays_needed: number | null;
    soak_date: Date | null;
    seed_date: Date | null;
    move_to_light_date: Date | null;
    created_at: Date | null;
};
export type Order_itemsCountAggregateOutputType = {
    id: number;
    order_id: number;
    product_id: number;
    blend_id: number;
    quantity_oz: number;
    harvest_date: number;
    overage_percent: number;
    trays_needed: number;
    soak_date: number;
    seed_date: number;
    move_to_light_date: number;
    created_at: number;
    _all: number;
};
export type Order_itemsAvgAggregateInputType = {
    quantity_oz?: true;
    overage_percent?: true;
    trays_needed?: true;
};
export type Order_itemsSumAggregateInputType = {
    quantity_oz?: true;
    overage_percent?: true;
    trays_needed?: true;
};
export type Order_itemsMinAggregateInputType = {
    id?: true;
    order_id?: true;
    product_id?: true;
    blend_id?: true;
    quantity_oz?: true;
    harvest_date?: true;
    overage_percent?: true;
    trays_needed?: true;
    soak_date?: true;
    seed_date?: true;
    move_to_light_date?: true;
    created_at?: true;
};
export type Order_itemsMaxAggregateInputType = {
    id?: true;
    order_id?: true;
    product_id?: true;
    blend_id?: true;
    quantity_oz?: true;
    harvest_date?: true;
    overage_percent?: true;
    trays_needed?: true;
    soak_date?: true;
    seed_date?: true;
    move_to_light_date?: true;
    created_at?: true;
};
export type Order_itemsCountAggregateInputType = {
    id?: true;
    order_id?: true;
    product_id?: true;
    blend_id?: true;
    quantity_oz?: true;
    harvest_date?: true;
    overage_percent?: true;
    trays_needed?: true;
    soak_date?: true;
    seed_date?: true;
    move_to_light_date?: true;
    created_at?: true;
    _all?: true;
};
export type Order_itemsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which order_items to aggregate.
     */
    where?: Prisma.order_itemsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of order_items to fetch.
     */
    orderBy?: Prisma.order_itemsOrderByWithRelationInput | Prisma.order_itemsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.order_itemsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` order_items from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` order_items.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned order_items
    **/
    _count?: true | Order_itemsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Order_itemsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Order_itemsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Order_itemsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Order_itemsMaxAggregateInputType;
};
export type GetOrder_itemsAggregateType<T extends Order_itemsAggregateArgs> = {
    [P in keyof T & keyof AggregateOrder_items]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrder_items[P]> : Prisma.GetScalarType<T[P], AggregateOrder_items[P]>;
};
export type order_itemsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.order_itemsWhereInput;
    orderBy?: Prisma.order_itemsOrderByWithAggregationInput | Prisma.order_itemsOrderByWithAggregationInput[];
    by: Prisma.Order_itemsScalarFieldEnum[] | Prisma.Order_itemsScalarFieldEnum;
    having?: Prisma.order_itemsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Order_itemsCountAggregateInputType | true;
    _avg?: Order_itemsAvgAggregateInputType;
    _sum?: Order_itemsSumAggregateInputType;
    _min?: Order_itemsMinAggregateInputType;
    _max?: Order_itemsMaxAggregateInputType;
};
export type Order_itemsGroupByOutputType = {
    id: string;
    order_id: string | null;
    product_id: string | null;
    blend_id: string | null;
    quantity_oz: runtime.Decimal;
    harvest_date: Date;
    overage_percent: runtime.Decimal | null;
    trays_needed: number | null;
    soak_date: Date | null;
    seed_date: Date | null;
    move_to_light_date: Date | null;
    created_at: Date | null;
    _count: Order_itemsCountAggregateOutputType | null;
    _avg: Order_itemsAvgAggregateOutputType | null;
    _sum: Order_itemsSumAggregateOutputType | null;
    _min: Order_itemsMinAggregateOutputType | null;
    _max: Order_itemsMaxAggregateOutputType | null;
};
type GetOrder_itemsGroupByPayload<T extends order_itemsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Order_itemsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Order_itemsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Order_itemsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Order_itemsGroupByOutputType[P]>;
}>>;
export type order_itemsWhereInput = {
    AND?: Prisma.order_itemsWhereInput | Prisma.order_itemsWhereInput[];
    OR?: Prisma.order_itemsWhereInput[];
    NOT?: Prisma.order_itemsWhereInput | Prisma.order_itemsWhereInput[];
    id?: Prisma.UuidFilter<"order_items"> | string;
    order_id?: Prisma.UuidNullableFilter<"order_items"> | string | null;
    product_id?: Prisma.UuidNullableFilter<"order_items"> | string | null;
    blend_id?: Prisma.UuidNullableFilter<"order_items"> | string | null;
    quantity_oz?: Prisma.DecimalFilter<"order_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFilter<"order_items"> | Date | string;
    overage_percent?: Prisma.DecimalNullableFilter<"order_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.IntNullableFilter<"order_items"> | number | null;
    soak_date?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
    seed_date?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
    move_to_light_date?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
    blends?: Prisma.XOR<Prisma.BlendsNullableScalarRelationFilter, Prisma.blendsWhereInput> | null;
    orders?: Prisma.XOR<Prisma.OrdersNullableScalarRelationFilter, Prisma.ordersWhereInput> | null;
    products?: Prisma.XOR<Prisma.ProductsNullableScalarRelationFilter, Prisma.productsWhereInput> | null;
    rack_assignments?: Prisma.Rack_assignmentsListRelationFilter;
    tasks?: Prisma.TasksListRelationFilter;
};
export type order_itemsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    order_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    product_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    blend_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity_oz?: Prisma.SortOrder;
    harvest_date?: Prisma.SortOrder;
    overage_percent?: Prisma.SortOrderInput | Prisma.SortOrder;
    trays_needed?: Prisma.SortOrderInput | Prisma.SortOrder;
    soak_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    seed_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    move_to_light_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    blends?: Prisma.blendsOrderByWithRelationInput;
    orders?: Prisma.ordersOrderByWithRelationInput;
    products?: Prisma.productsOrderByWithRelationInput;
    rack_assignments?: Prisma.rack_assignmentsOrderByRelationAggregateInput;
    tasks?: Prisma.tasksOrderByRelationAggregateInput;
};
export type order_itemsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.order_itemsWhereInput | Prisma.order_itemsWhereInput[];
    OR?: Prisma.order_itemsWhereInput[];
    NOT?: Prisma.order_itemsWhereInput | Prisma.order_itemsWhereInput[];
    order_id?: Prisma.UuidNullableFilter<"order_items"> | string | null;
    product_id?: Prisma.UuidNullableFilter<"order_items"> | string | null;
    blend_id?: Prisma.UuidNullableFilter<"order_items"> | string | null;
    quantity_oz?: Prisma.DecimalFilter<"order_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFilter<"order_items"> | Date | string;
    overage_percent?: Prisma.DecimalNullableFilter<"order_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.IntNullableFilter<"order_items"> | number | null;
    soak_date?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
    seed_date?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
    move_to_light_date?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
    blends?: Prisma.XOR<Prisma.BlendsNullableScalarRelationFilter, Prisma.blendsWhereInput> | null;
    orders?: Prisma.XOR<Prisma.OrdersNullableScalarRelationFilter, Prisma.ordersWhereInput> | null;
    products?: Prisma.XOR<Prisma.ProductsNullableScalarRelationFilter, Prisma.productsWhereInput> | null;
    rack_assignments?: Prisma.Rack_assignmentsListRelationFilter;
    tasks?: Prisma.TasksListRelationFilter;
}, "id">;
export type order_itemsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    order_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    product_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    blend_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity_oz?: Prisma.SortOrder;
    harvest_date?: Prisma.SortOrder;
    overage_percent?: Prisma.SortOrderInput | Prisma.SortOrder;
    trays_needed?: Prisma.SortOrderInput | Prisma.SortOrder;
    soak_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    seed_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    move_to_light_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.order_itemsCountOrderByAggregateInput;
    _avg?: Prisma.order_itemsAvgOrderByAggregateInput;
    _max?: Prisma.order_itemsMaxOrderByAggregateInput;
    _min?: Prisma.order_itemsMinOrderByAggregateInput;
    _sum?: Prisma.order_itemsSumOrderByAggregateInput;
};
export type order_itemsScalarWhereWithAggregatesInput = {
    AND?: Prisma.order_itemsScalarWhereWithAggregatesInput | Prisma.order_itemsScalarWhereWithAggregatesInput[];
    OR?: Prisma.order_itemsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.order_itemsScalarWhereWithAggregatesInput | Prisma.order_itemsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"order_items"> | string;
    order_id?: Prisma.UuidNullableWithAggregatesFilter<"order_items"> | string | null;
    product_id?: Prisma.UuidNullableWithAggregatesFilter<"order_items"> | string | null;
    blend_id?: Prisma.UuidNullableWithAggregatesFilter<"order_items"> | string | null;
    quantity_oz?: Prisma.DecimalWithAggregatesFilter<"order_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeWithAggregatesFilter<"order_items"> | Date | string;
    overage_percent?: Prisma.DecimalNullableWithAggregatesFilter<"order_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.IntNullableWithAggregatesFilter<"order_items"> | number | null;
    soak_date?: Prisma.DateTimeNullableWithAggregatesFilter<"order_items"> | Date | string | null;
    seed_date?: Prisma.DateTimeNullableWithAggregatesFilter<"order_items"> | Date | string | null;
    move_to_light_date?: Prisma.DateTimeNullableWithAggregatesFilter<"order_items"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"order_items"> | Date | string | null;
};
export type order_itemsCreateInput = {
    id?: string;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedOneWithoutOrder_itemsInput;
    orders?: Prisma.ordersCreateNestedOneWithoutOrder_itemsInput;
    products?: Prisma.productsCreateNestedOneWithoutOrder_itemsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutOrder_itemsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsUncheckedCreateInput = {
    id?: string;
    order_id?: string | null;
    product_id?: string | null;
    blend_id?: string | null;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutOrder_itemsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateOneWithoutOrder_itemsNestedInput;
    orders?: Prisma.ordersUpdateOneWithoutOrder_itemsNestedInput;
    products?: Prisma.productsUpdateOneWithoutOrder_itemsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutOrder_itemsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    order_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutOrder_itemsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsCreateManyInput = {
    id?: string;
    order_id?: string | null;
    product_id?: string | null;
    blend_id?: string | null;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type order_itemsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type order_itemsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    order_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type Order_itemsListRelationFilter = {
    every?: Prisma.order_itemsWhereInput;
    some?: Prisma.order_itemsWhereInput;
    none?: Prisma.order_itemsWhereInput;
};
export type order_itemsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type order_itemsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    order_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    blend_id?: Prisma.SortOrder;
    quantity_oz?: Prisma.SortOrder;
    harvest_date?: Prisma.SortOrder;
    overage_percent?: Prisma.SortOrder;
    trays_needed?: Prisma.SortOrder;
    soak_date?: Prisma.SortOrder;
    seed_date?: Prisma.SortOrder;
    move_to_light_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type order_itemsAvgOrderByAggregateInput = {
    quantity_oz?: Prisma.SortOrder;
    overage_percent?: Prisma.SortOrder;
    trays_needed?: Prisma.SortOrder;
};
export type order_itemsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    order_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    blend_id?: Prisma.SortOrder;
    quantity_oz?: Prisma.SortOrder;
    harvest_date?: Prisma.SortOrder;
    overage_percent?: Prisma.SortOrder;
    trays_needed?: Prisma.SortOrder;
    soak_date?: Prisma.SortOrder;
    seed_date?: Prisma.SortOrder;
    move_to_light_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type order_itemsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    order_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    blend_id?: Prisma.SortOrder;
    quantity_oz?: Prisma.SortOrder;
    harvest_date?: Prisma.SortOrder;
    overage_percent?: Prisma.SortOrder;
    trays_needed?: Prisma.SortOrder;
    soak_date?: Prisma.SortOrder;
    seed_date?: Prisma.SortOrder;
    move_to_light_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type order_itemsSumOrderByAggregateInput = {
    quantity_oz?: Prisma.SortOrder;
    overage_percent?: Prisma.SortOrder;
    trays_needed?: Prisma.SortOrder;
};
export type Order_itemsNullableScalarRelationFilter = {
    is?: Prisma.order_itemsWhereInput | null;
    isNot?: Prisma.order_itemsWhereInput | null;
};
export type order_itemsCreateNestedManyWithoutBlendsInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutBlendsInput, Prisma.order_itemsUncheckedCreateWithoutBlendsInput> | Prisma.order_itemsCreateWithoutBlendsInput[] | Prisma.order_itemsUncheckedCreateWithoutBlendsInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutBlendsInput | Prisma.order_itemsCreateOrConnectWithoutBlendsInput[];
    createMany?: Prisma.order_itemsCreateManyBlendsInputEnvelope;
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
};
export type order_itemsUncheckedCreateNestedManyWithoutBlendsInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutBlendsInput, Prisma.order_itemsUncheckedCreateWithoutBlendsInput> | Prisma.order_itemsCreateWithoutBlendsInput[] | Prisma.order_itemsUncheckedCreateWithoutBlendsInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutBlendsInput | Prisma.order_itemsCreateOrConnectWithoutBlendsInput[];
    createMany?: Prisma.order_itemsCreateManyBlendsInputEnvelope;
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
};
export type order_itemsUpdateManyWithoutBlendsNestedInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutBlendsInput, Prisma.order_itemsUncheckedCreateWithoutBlendsInput> | Prisma.order_itemsCreateWithoutBlendsInput[] | Prisma.order_itemsUncheckedCreateWithoutBlendsInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutBlendsInput | Prisma.order_itemsCreateOrConnectWithoutBlendsInput[];
    upsert?: Prisma.order_itemsUpsertWithWhereUniqueWithoutBlendsInput | Prisma.order_itemsUpsertWithWhereUniqueWithoutBlendsInput[];
    createMany?: Prisma.order_itemsCreateManyBlendsInputEnvelope;
    set?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    disconnect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    delete?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    update?: Prisma.order_itemsUpdateWithWhereUniqueWithoutBlendsInput | Prisma.order_itemsUpdateWithWhereUniqueWithoutBlendsInput[];
    updateMany?: Prisma.order_itemsUpdateManyWithWhereWithoutBlendsInput | Prisma.order_itemsUpdateManyWithWhereWithoutBlendsInput[];
    deleteMany?: Prisma.order_itemsScalarWhereInput | Prisma.order_itemsScalarWhereInput[];
};
export type order_itemsUncheckedUpdateManyWithoutBlendsNestedInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutBlendsInput, Prisma.order_itemsUncheckedCreateWithoutBlendsInput> | Prisma.order_itemsCreateWithoutBlendsInput[] | Prisma.order_itemsUncheckedCreateWithoutBlendsInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutBlendsInput | Prisma.order_itemsCreateOrConnectWithoutBlendsInput[];
    upsert?: Prisma.order_itemsUpsertWithWhereUniqueWithoutBlendsInput | Prisma.order_itemsUpsertWithWhereUniqueWithoutBlendsInput[];
    createMany?: Prisma.order_itemsCreateManyBlendsInputEnvelope;
    set?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    disconnect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    delete?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    update?: Prisma.order_itemsUpdateWithWhereUniqueWithoutBlendsInput | Prisma.order_itemsUpdateWithWhereUniqueWithoutBlendsInput[];
    updateMany?: Prisma.order_itemsUpdateManyWithWhereWithoutBlendsInput | Prisma.order_itemsUpdateManyWithWhereWithoutBlendsInput[];
    deleteMany?: Prisma.order_itemsScalarWhereInput | Prisma.order_itemsScalarWhereInput[];
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type order_itemsCreateNestedManyWithoutOrdersInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutOrdersInput, Prisma.order_itemsUncheckedCreateWithoutOrdersInput> | Prisma.order_itemsCreateWithoutOrdersInput[] | Prisma.order_itemsUncheckedCreateWithoutOrdersInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutOrdersInput | Prisma.order_itemsCreateOrConnectWithoutOrdersInput[];
    createMany?: Prisma.order_itemsCreateManyOrdersInputEnvelope;
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
};
export type order_itemsUncheckedCreateNestedManyWithoutOrdersInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutOrdersInput, Prisma.order_itemsUncheckedCreateWithoutOrdersInput> | Prisma.order_itemsCreateWithoutOrdersInput[] | Prisma.order_itemsUncheckedCreateWithoutOrdersInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutOrdersInput | Prisma.order_itemsCreateOrConnectWithoutOrdersInput[];
    createMany?: Prisma.order_itemsCreateManyOrdersInputEnvelope;
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
};
export type order_itemsUpdateManyWithoutOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutOrdersInput, Prisma.order_itemsUncheckedCreateWithoutOrdersInput> | Prisma.order_itemsCreateWithoutOrdersInput[] | Prisma.order_itemsUncheckedCreateWithoutOrdersInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutOrdersInput | Prisma.order_itemsCreateOrConnectWithoutOrdersInput[];
    upsert?: Prisma.order_itemsUpsertWithWhereUniqueWithoutOrdersInput | Prisma.order_itemsUpsertWithWhereUniqueWithoutOrdersInput[];
    createMany?: Prisma.order_itemsCreateManyOrdersInputEnvelope;
    set?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    disconnect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    delete?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    update?: Prisma.order_itemsUpdateWithWhereUniqueWithoutOrdersInput | Prisma.order_itemsUpdateWithWhereUniqueWithoutOrdersInput[];
    updateMany?: Prisma.order_itemsUpdateManyWithWhereWithoutOrdersInput | Prisma.order_itemsUpdateManyWithWhereWithoutOrdersInput[];
    deleteMany?: Prisma.order_itemsScalarWhereInput | Prisma.order_itemsScalarWhereInput[];
};
export type order_itemsUncheckedUpdateManyWithoutOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutOrdersInput, Prisma.order_itemsUncheckedCreateWithoutOrdersInput> | Prisma.order_itemsCreateWithoutOrdersInput[] | Prisma.order_itemsUncheckedCreateWithoutOrdersInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutOrdersInput | Prisma.order_itemsCreateOrConnectWithoutOrdersInput[];
    upsert?: Prisma.order_itemsUpsertWithWhereUniqueWithoutOrdersInput | Prisma.order_itemsUpsertWithWhereUniqueWithoutOrdersInput[];
    createMany?: Prisma.order_itemsCreateManyOrdersInputEnvelope;
    set?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    disconnect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    delete?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    update?: Prisma.order_itemsUpdateWithWhereUniqueWithoutOrdersInput | Prisma.order_itemsUpdateWithWhereUniqueWithoutOrdersInput[];
    updateMany?: Prisma.order_itemsUpdateManyWithWhereWithoutOrdersInput | Prisma.order_itemsUpdateManyWithWhereWithoutOrdersInput[];
    deleteMany?: Prisma.order_itemsScalarWhereInput | Prisma.order_itemsScalarWhereInput[];
};
export type order_itemsCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutProductsInput, Prisma.order_itemsUncheckedCreateWithoutProductsInput> | Prisma.order_itemsCreateWithoutProductsInput[] | Prisma.order_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutProductsInput | Prisma.order_itemsCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.order_itemsCreateManyProductsInputEnvelope;
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
};
export type order_itemsUncheckedCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutProductsInput, Prisma.order_itemsUncheckedCreateWithoutProductsInput> | Prisma.order_itemsCreateWithoutProductsInput[] | Prisma.order_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutProductsInput | Prisma.order_itemsCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.order_itemsCreateManyProductsInputEnvelope;
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
};
export type order_itemsUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutProductsInput, Prisma.order_itemsUncheckedCreateWithoutProductsInput> | Prisma.order_itemsCreateWithoutProductsInput[] | Prisma.order_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutProductsInput | Prisma.order_itemsCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.order_itemsUpsertWithWhereUniqueWithoutProductsInput | Prisma.order_itemsUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.order_itemsCreateManyProductsInputEnvelope;
    set?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    disconnect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    delete?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    update?: Prisma.order_itemsUpdateWithWhereUniqueWithoutProductsInput | Prisma.order_itemsUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.order_itemsUpdateManyWithWhereWithoutProductsInput | Prisma.order_itemsUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.order_itemsScalarWhereInput | Prisma.order_itemsScalarWhereInput[];
};
export type order_itemsUncheckedUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutProductsInput, Prisma.order_itemsUncheckedCreateWithoutProductsInput> | Prisma.order_itemsCreateWithoutProductsInput[] | Prisma.order_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutProductsInput | Prisma.order_itemsCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.order_itemsUpsertWithWhereUniqueWithoutProductsInput | Prisma.order_itemsUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.order_itemsCreateManyProductsInputEnvelope;
    set?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    disconnect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    delete?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    connect?: Prisma.order_itemsWhereUniqueInput | Prisma.order_itemsWhereUniqueInput[];
    update?: Prisma.order_itemsUpdateWithWhereUniqueWithoutProductsInput | Prisma.order_itemsUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.order_itemsUpdateManyWithWhereWithoutProductsInput | Prisma.order_itemsUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.order_itemsScalarWhereInput | Prisma.order_itemsScalarWhereInput[];
};
export type order_itemsCreateNestedOneWithoutRack_assignmentsInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutRack_assignmentsInput, Prisma.order_itemsUncheckedCreateWithoutRack_assignmentsInput>;
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutRack_assignmentsInput;
    connect?: Prisma.order_itemsWhereUniqueInput;
};
export type order_itemsUpdateOneWithoutRack_assignmentsNestedInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutRack_assignmentsInput, Prisma.order_itemsUncheckedCreateWithoutRack_assignmentsInput>;
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutRack_assignmentsInput;
    upsert?: Prisma.order_itemsUpsertWithoutRack_assignmentsInput;
    disconnect?: Prisma.order_itemsWhereInput | boolean;
    delete?: Prisma.order_itemsWhereInput | boolean;
    connect?: Prisma.order_itemsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.order_itemsUpdateToOneWithWhereWithoutRack_assignmentsInput, Prisma.order_itemsUpdateWithoutRack_assignmentsInput>, Prisma.order_itemsUncheckedUpdateWithoutRack_assignmentsInput>;
};
export type order_itemsCreateNestedOneWithoutTasksInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutTasksInput, Prisma.order_itemsUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutTasksInput;
    connect?: Prisma.order_itemsWhereUniqueInput;
};
export type order_itemsUpdateOneWithoutTasksNestedInput = {
    create?: Prisma.XOR<Prisma.order_itemsCreateWithoutTasksInput, Prisma.order_itemsUncheckedCreateWithoutTasksInput>;
    connectOrCreate?: Prisma.order_itemsCreateOrConnectWithoutTasksInput;
    upsert?: Prisma.order_itemsUpsertWithoutTasksInput;
    disconnect?: Prisma.order_itemsWhereInput | boolean;
    delete?: Prisma.order_itemsWhereInput | boolean;
    connect?: Prisma.order_itemsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.order_itemsUpdateToOneWithWhereWithoutTasksInput, Prisma.order_itemsUpdateWithoutTasksInput>, Prisma.order_itemsUncheckedUpdateWithoutTasksInput>;
};
export type order_itemsCreateWithoutBlendsInput = {
    id?: string;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    orders?: Prisma.ordersCreateNestedOneWithoutOrder_itemsInput;
    products?: Prisma.productsCreateNestedOneWithoutOrder_itemsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutOrder_itemsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsUncheckedCreateWithoutBlendsInput = {
    id?: string;
    order_id?: string | null;
    product_id?: string | null;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutOrder_itemsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsCreateOrConnectWithoutBlendsInput = {
    where: Prisma.order_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.order_itemsCreateWithoutBlendsInput, Prisma.order_itemsUncheckedCreateWithoutBlendsInput>;
};
export type order_itemsCreateManyBlendsInputEnvelope = {
    data: Prisma.order_itemsCreateManyBlendsInput | Prisma.order_itemsCreateManyBlendsInput[];
    skipDuplicates?: boolean;
};
export type order_itemsUpsertWithWhereUniqueWithoutBlendsInput = {
    where: Prisma.order_itemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.order_itemsUpdateWithoutBlendsInput, Prisma.order_itemsUncheckedUpdateWithoutBlendsInput>;
    create: Prisma.XOR<Prisma.order_itemsCreateWithoutBlendsInput, Prisma.order_itemsUncheckedCreateWithoutBlendsInput>;
};
export type order_itemsUpdateWithWhereUniqueWithoutBlendsInput = {
    where: Prisma.order_itemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.order_itemsUpdateWithoutBlendsInput, Prisma.order_itemsUncheckedUpdateWithoutBlendsInput>;
};
export type order_itemsUpdateManyWithWhereWithoutBlendsInput = {
    where: Prisma.order_itemsScalarWhereInput;
    data: Prisma.XOR<Prisma.order_itemsUpdateManyMutationInput, Prisma.order_itemsUncheckedUpdateManyWithoutBlendsInput>;
};
export type order_itemsScalarWhereInput = {
    AND?: Prisma.order_itemsScalarWhereInput | Prisma.order_itemsScalarWhereInput[];
    OR?: Prisma.order_itemsScalarWhereInput[];
    NOT?: Prisma.order_itemsScalarWhereInput | Prisma.order_itemsScalarWhereInput[];
    id?: Prisma.UuidFilter<"order_items"> | string;
    order_id?: Prisma.UuidNullableFilter<"order_items"> | string | null;
    product_id?: Prisma.UuidNullableFilter<"order_items"> | string | null;
    blend_id?: Prisma.UuidNullableFilter<"order_items"> | string | null;
    quantity_oz?: Prisma.DecimalFilter<"order_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFilter<"order_items"> | Date | string;
    overage_percent?: Prisma.DecimalNullableFilter<"order_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.IntNullableFilter<"order_items"> | number | null;
    soak_date?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
    seed_date?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
    move_to_light_date?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"order_items"> | Date | string | null;
};
export type order_itemsCreateWithoutOrdersInput = {
    id?: string;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedOneWithoutOrder_itemsInput;
    products?: Prisma.productsCreateNestedOneWithoutOrder_itemsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutOrder_itemsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsUncheckedCreateWithoutOrdersInput = {
    id?: string;
    product_id?: string | null;
    blend_id?: string | null;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutOrder_itemsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsCreateOrConnectWithoutOrdersInput = {
    where: Prisma.order_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.order_itemsCreateWithoutOrdersInput, Prisma.order_itemsUncheckedCreateWithoutOrdersInput>;
};
export type order_itemsCreateManyOrdersInputEnvelope = {
    data: Prisma.order_itemsCreateManyOrdersInput | Prisma.order_itemsCreateManyOrdersInput[];
    skipDuplicates?: boolean;
};
export type order_itemsUpsertWithWhereUniqueWithoutOrdersInput = {
    where: Prisma.order_itemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.order_itemsUpdateWithoutOrdersInput, Prisma.order_itemsUncheckedUpdateWithoutOrdersInput>;
    create: Prisma.XOR<Prisma.order_itemsCreateWithoutOrdersInput, Prisma.order_itemsUncheckedCreateWithoutOrdersInput>;
};
export type order_itemsUpdateWithWhereUniqueWithoutOrdersInput = {
    where: Prisma.order_itemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.order_itemsUpdateWithoutOrdersInput, Prisma.order_itemsUncheckedUpdateWithoutOrdersInput>;
};
export type order_itemsUpdateManyWithWhereWithoutOrdersInput = {
    where: Prisma.order_itemsScalarWhereInput;
    data: Prisma.XOR<Prisma.order_itemsUpdateManyMutationInput, Prisma.order_itemsUncheckedUpdateManyWithoutOrdersInput>;
};
export type order_itemsCreateWithoutProductsInput = {
    id?: string;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedOneWithoutOrder_itemsInput;
    orders?: Prisma.ordersCreateNestedOneWithoutOrder_itemsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutOrder_itemsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsUncheckedCreateWithoutProductsInput = {
    id?: string;
    order_id?: string | null;
    blend_id?: string | null;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutOrder_itemsInput;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsCreateOrConnectWithoutProductsInput = {
    where: Prisma.order_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.order_itemsCreateWithoutProductsInput, Prisma.order_itemsUncheckedCreateWithoutProductsInput>;
};
export type order_itemsCreateManyProductsInputEnvelope = {
    data: Prisma.order_itemsCreateManyProductsInput | Prisma.order_itemsCreateManyProductsInput[];
    skipDuplicates?: boolean;
};
export type order_itemsUpsertWithWhereUniqueWithoutProductsInput = {
    where: Prisma.order_itemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.order_itemsUpdateWithoutProductsInput, Prisma.order_itemsUncheckedUpdateWithoutProductsInput>;
    create: Prisma.XOR<Prisma.order_itemsCreateWithoutProductsInput, Prisma.order_itemsUncheckedCreateWithoutProductsInput>;
};
export type order_itemsUpdateWithWhereUniqueWithoutProductsInput = {
    where: Prisma.order_itemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.order_itemsUpdateWithoutProductsInput, Prisma.order_itemsUncheckedUpdateWithoutProductsInput>;
};
export type order_itemsUpdateManyWithWhereWithoutProductsInput = {
    where: Prisma.order_itemsScalarWhereInput;
    data: Prisma.XOR<Prisma.order_itemsUpdateManyMutationInput, Prisma.order_itemsUncheckedUpdateManyWithoutProductsInput>;
};
export type order_itemsCreateWithoutRack_assignmentsInput = {
    id?: string;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedOneWithoutOrder_itemsInput;
    orders?: Prisma.ordersCreateNestedOneWithoutOrder_itemsInput;
    products?: Prisma.productsCreateNestedOneWithoutOrder_itemsInput;
    tasks?: Prisma.tasksCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsUncheckedCreateWithoutRack_assignmentsInput = {
    id?: string;
    order_id?: string | null;
    product_id?: string | null;
    blend_id?: string | null;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    tasks?: Prisma.tasksUncheckedCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsCreateOrConnectWithoutRack_assignmentsInput = {
    where: Prisma.order_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.order_itemsCreateWithoutRack_assignmentsInput, Prisma.order_itemsUncheckedCreateWithoutRack_assignmentsInput>;
};
export type order_itemsUpsertWithoutRack_assignmentsInput = {
    update: Prisma.XOR<Prisma.order_itemsUpdateWithoutRack_assignmentsInput, Prisma.order_itemsUncheckedUpdateWithoutRack_assignmentsInput>;
    create: Prisma.XOR<Prisma.order_itemsCreateWithoutRack_assignmentsInput, Prisma.order_itemsUncheckedCreateWithoutRack_assignmentsInput>;
    where?: Prisma.order_itemsWhereInput;
};
export type order_itemsUpdateToOneWithWhereWithoutRack_assignmentsInput = {
    where?: Prisma.order_itemsWhereInput;
    data: Prisma.XOR<Prisma.order_itemsUpdateWithoutRack_assignmentsInput, Prisma.order_itemsUncheckedUpdateWithoutRack_assignmentsInput>;
};
export type order_itemsUpdateWithoutRack_assignmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateOneWithoutOrder_itemsNestedInput;
    orders?: Prisma.ordersUpdateOneWithoutOrder_itemsNestedInput;
    products?: Prisma.productsUpdateOneWithoutOrder_itemsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsUncheckedUpdateWithoutRack_assignmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    order_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsCreateWithoutTasksInput = {
    id?: string;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    blends?: Prisma.blendsCreateNestedOneWithoutOrder_itemsInput;
    orders?: Prisma.ordersCreateNestedOneWithoutOrder_itemsInput;
    products?: Prisma.productsCreateNestedOneWithoutOrder_itemsInput;
    rack_assignments?: Prisma.rack_assignmentsCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsUncheckedCreateWithoutTasksInput = {
    id?: string;
    order_id?: string | null;
    product_id?: string | null;
    blend_id?: string | null;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
    rack_assignments?: Prisma.rack_assignmentsUncheckedCreateNestedManyWithoutOrder_itemsInput;
};
export type order_itemsCreateOrConnectWithoutTasksInput = {
    where: Prisma.order_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.order_itemsCreateWithoutTasksInput, Prisma.order_itemsUncheckedCreateWithoutTasksInput>;
};
export type order_itemsUpsertWithoutTasksInput = {
    update: Prisma.XOR<Prisma.order_itemsUpdateWithoutTasksInput, Prisma.order_itemsUncheckedUpdateWithoutTasksInput>;
    create: Prisma.XOR<Prisma.order_itemsCreateWithoutTasksInput, Prisma.order_itemsUncheckedCreateWithoutTasksInput>;
    where?: Prisma.order_itemsWhereInput;
};
export type order_itemsUpdateToOneWithWhereWithoutTasksInput = {
    where?: Prisma.order_itemsWhereInput;
    data: Prisma.XOR<Prisma.order_itemsUpdateWithoutTasksInput, Prisma.order_itemsUncheckedUpdateWithoutTasksInput>;
};
export type order_itemsUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateOneWithoutOrder_itemsNestedInput;
    orders?: Prisma.ordersUpdateOneWithoutOrder_itemsNestedInput;
    products?: Prisma.productsUpdateOneWithoutOrder_itemsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsUncheckedUpdateWithoutTasksInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    order_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsCreateManyBlendsInput = {
    id?: string;
    order_id?: string | null;
    product_id?: string | null;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type order_itemsUpdateWithoutBlendsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    orders?: Prisma.ordersUpdateOneWithoutOrder_itemsNestedInput;
    products?: Prisma.productsUpdateOneWithoutOrder_itemsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutOrder_itemsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsUncheckedUpdateWithoutBlendsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    order_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutOrder_itemsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsUncheckedUpdateManyWithoutBlendsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    order_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type order_itemsCreateManyOrdersInput = {
    id?: string;
    product_id?: string | null;
    blend_id?: string | null;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type order_itemsUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateOneWithoutOrder_itemsNestedInput;
    products?: Prisma.productsUpdateOneWithoutOrder_itemsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutOrder_itemsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsUncheckedUpdateWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutOrder_itemsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsUncheckedUpdateManyWithoutOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type order_itemsCreateManyProductsInput = {
    id?: string;
    order_id?: string | null;
    blend_id?: string | null;
    quantity_oz: runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date: Date | string;
    overage_percent?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: number | null;
    soak_date?: Date | string | null;
    seed_date?: Date | string | null;
    move_to_light_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type order_itemsUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    blends?: Prisma.blendsUpdateOneWithoutOrder_itemsNestedInput;
    orders?: Prisma.ordersUpdateOneWithoutOrder_itemsNestedInput;
    rack_assignments?: Prisma.rack_assignmentsUpdateManyWithoutOrder_itemsNestedInput;
    tasks?: Prisma.tasksUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsUncheckedUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    order_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rack_assignments?: Prisma.rack_assignmentsUncheckedUpdateManyWithoutOrder_itemsNestedInput;
    tasks?: Prisma.tasksUncheckedUpdateManyWithoutOrder_itemsNestedInput;
};
export type order_itemsUncheckedUpdateManyWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    order_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    blend_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity_oz?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    harvest_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    overage_percent?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    trays_needed?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    soak_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    seed_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    move_to_light_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type Order_itemsCountOutputType
 */
export type Order_itemsCountOutputType = {
    rack_assignments: number;
    tasks: number;
};
export type Order_itemsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rack_assignments?: boolean | Order_itemsCountOutputTypeCountRack_assignmentsArgs;
    tasks?: boolean | Order_itemsCountOutputTypeCountTasksArgs;
};
/**
 * Order_itemsCountOutputType without action
 */
export type Order_itemsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order_itemsCountOutputType
     */
    select?: Prisma.Order_itemsCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * Order_itemsCountOutputType without action
 */
export type Order_itemsCountOutputTypeCountRack_assignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.rack_assignmentsWhereInput;
};
/**
 * Order_itemsCountOutputType without action
 */
export type Order_itemsCountOutputTypeCountTasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.tasksWhereInput;
};
export type order_itemsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    order_id?: boolean;
    product_id?: boolean;
    blend_id?: boolean;
    quantity_oz?: boolean;
    harvest_date?: boolean;
    overage_percent?: boolean;
    trays_needed?: boolean;
    soak_date?: boolean;
    seed_date?: boolean;
    move_to_light_date?: boolean;
    created_at?: boolean;
    blends?: boolean | Prisma.order_items$blendsArgs<ExtArgs>;
    orders?: boolean | Prisma.order_items$ordersArgs<ExtArgs>;
    products?: boolean | Prisma.order_items$productsArgs<ExtArgs>;
    rack_assignments?: boolean | Prisma.order_items$rack_assignmentsArgs<ExtArgs>;
    tasks?: boolean | Prisma.order_items$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.Order_itemsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["order_items"]>;
export type order_itemsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    order_id?: boolean;
    product_id?: boolean;
    blend_id?: boolean;
    quantity_oz?: boolean;
    harvest_date?: boolean;
    overage_percent?: boolean;
    trays_needed?: boolean;
    soak_date?: boolean;
    seed_date?: boolean;
    move_to_light_date?: boolean;
    created_at?: boolean;
    blends?: boolean | Prisma.order_items$blendsArgs<ExtArgs>;
    orders?: boolean | Prisma.order_items$ordersArgs<ExtArgs>;
    products?: boolean | Prisma.order_items$productsArgs<ExtArgs>;
}, ExtArgs["result"]["order_items"]>;
export type order_itemsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    order_id?: boolean;
    product_id?: boolean;
    blend_id?: boolean;
    quantity_oz?: boolean;
    harvest_date?: boolean;
    overage_percent?: boolean;
    trays_needed?: boolean;
    soak_date?: boolean;
    seed_date?: boolean;
    move_to_light_date?: boolean;
    created_at?: boolean;
    blends?: boolean | Prisma.order_items$blendsArgs<ExtArgs>;
    orders?: boolean | Prisma.order_items$ordersArgs<ExtArgs>;
    products?: boolean | Prisma.order_items$productsArgs<ExtArgs>;
}, ExtArgs["result"]["order_items"]>;
export type order_itemsSelectScalar = {
    id?: boolean;
    order_id?: boolean;
    product_id?: boolean;
    blend_id?: boolean;
    quantity_oz?: boolean;
    harvest_date?: boolean;
    overage_percent?: boolean;
    trays_needed?: boolean;
    soak_date?: boolean;
    seed_date?: boolean;
    move_to_light_date?: boolean;
    created_at?: boolean;
};
export type order_itemsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "order_id" | "product_id" | "blend_id" | "quantity_oz" | "harvest_date" | "overage_percent" | "trays_needed" | "soak_date" | "seed_date" | "move_to_light_date" | "created_at", ExtArgs["result"]["order_items"]>;
export type order_itemsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blends?: boolean | Prisma.order_items$blendsArgs<ExtArgs>;
    orders?: boolean | Prisma.order_items$ordersArgs<ExtArgs>;
    products?: boolean | Prisma.order_items$productsArgs<ExtArgs>;
    rack_assignments?: boolean | Prisma.order_items$rack_assignmentsArgs<ExtArgs>;
    tasks?: boolean | Prisma.order_items$tasksArgs<ExtArgs>;
    _count?: boolean | Prisma.Order_itemsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type order_itemsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blends?: boolean | Prisma.order_items$blendsArgs<ExtArgs>;
    orders?: boolean | Prisma.order_items$ordersArgs<ExtArgs>;
    products?: boolean | Prisma.order_items$productsArgs<ExtArgs>;
};
export type order_itemsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    blends?: boolean | Prisma.order_items$blendsArgs<ExtArgs>;
    orders?: boolean | Prisma.order_items$ordersArgs<ExtArgs>;
    products?: boolean | Prisma.order_items$productsArgs<ExtArgs>;
};
export type $order_itemsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "order_items";
    objects: {
        blends: Prisma.$blendsPayload<ExtArgs> | null;
        orders: Prisma.$ordersPayload<ExtArgs> | null;
        products: Prisma.$productsPayload<ExtArgs> | null;
        rack_assignments: Prisma.$rack_assignmentsPayload<ExtArgs>[];
        tasks: Prisma.$tasksPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        order_id: string | null;
        product_id: string | null;
        blend_id: string | null;
        quantity_oz: runtime.Decimal;
        harvest_date: Date;
        overage_percent: runtime.Decimal | null;
        trays_needed: number | null;
        soak_date: Date | null;
        seed_date: Date | null;
        move_to_light_date: Date | null;
        created_at: Date | null;
    }, ExtArgs["result"]["order_items"]>;
    composites: {};
};
export type order_itemsGetPayload<S extends boolean | null | undefined | order_itemsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$order_itemsPayload, S>;
export type order_itemsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<order_itemsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Order_itemsCountAggregateInputType | true;
};
export interface order_itemsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['order_items'];
        meta: {
            name: 'order_items';
        };
    };
    /**
     * Find zero or one Order_items that matches the filter.
     * @param {order_itemsFindUniqueArgs} args - Arguments to find a Order_items
     * @example
     * // Get one Order_items
     * const order_items = await prisma.order_items.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends order_itemsFindUniqueArgs>(args: Prisma.SelectSubset<T, order_itemsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__order_itemsClient<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Order_items that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {order_itemsFindUniqueOrThrowArgs} args - Arguments to find a Order_items
     * @example
     * // Get one Order_items
     * const order_items = await prisma.order_items.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends order_itemsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, order_itemsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__order_itemsClient<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Order_items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {order_itemsFindFirstArgs} args - Arguments to find a Order_items
     * @example
     * // Get one Order_items
     * const order_items = await prisma.order_items.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends order_itemsFindFirstArgs>(args?: Prisma.SelectSubset<T, order_itemsFindFirstArgs<ExtArgs>>): Prisma.Prisma__order_itemsClient<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Order_items that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {order_itemsFindFirstOrThrowArgs} args - Arguments to find a Order_items
     * @example
     * // Get one Order_items
     * const order_items = await prisma.order_items.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends order_itemsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, order_itemsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__order_itemsClient<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Order_items that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {order_itemsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Order_items
     * const order_items = await prisma.order_items.findMany()
     *
     * // Get first 10 Order_items
     * const order_items = await prisma.order_items.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const order_itemsWithIdOnly = await prisma.order_items.findMany({ select: { id: true } })
     *
     */
    findMany<T extends order_itemsFindManyArgs>(args?: Prisma.SelectSubset<T, order_itemsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Order_items.
     * @param {order_itemsCreateArgs} args - Arguments to create a Order_items.
     * @example
     * // Create one Order_items
     * const Order_items = await prisma.order_items.create({
     *   data: {
     *     // ... data to create a Order_items
     *   }
     * })
     *
     */
    create<T extends order_itemsCreateArgs>(args: Prisma.SelectSubset<T, order_itemsCreateArgs<ExtArgs>>): Prisma.Prisma__order_itemsClient<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Order_items.
     * @param {order_itemsCreateManyArgs} args - Arguments to create many Order_items.
     * @example
     * // Create many Order_items
     * const order_items = await prisma.order_items.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends order_itemsCreateManyArgs>(args?: Prisma.SelectSubset<T, order_itemsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Order_items and returns the data saved in the database.
     * @param {order_itemsCreateManyAndReturnArgs} args - Arguments to create many Order_items.
     * @example
     * // Create many Order_items
     * const order_items = await prisma.order_items.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Order_items and only return the `id`
     * const order_itemsWithIdOnly = await prisma.order_items.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends order_itemsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, order_itemsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Order_items.
     * @param {order_itemsDeleteArgs} args - Arguments to delete one Order_items.
     * @example
     * // Delete one Order_items
     * const Order_items = await prisma.order_items.delete({
     *   where: {
     *     // ... filter to delete one Order_items
     *   }
     * })
     *
     */
    delete<T extends order_itemsDeleteArgs>(args: Prisma.SelectSubset<T, order_itemsDeleteArgs<ExtArgs>>): Prisma.Prisma__order_itemsClient<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Order_items.
     * @param {order_itemsUpdateArgs} args - Arguments to update one Order_items.
     * @example
     * // Update one Order_items
     * const order_items = await prisma.order_items.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends order_itemsUpdateArgs>(args: Prisma.SelectSubset<T, order_itemsUpdateArgs<ExtArgs>>): Prisma.Prisma__order_itemsClient<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Order_items.
     * @param {order_itemsDeleteManyArgs} args - Arguments to filter Order_items to delete.
     * @example
     * // Delete a few Order_items
     * const { count } = await prisma.order_items.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends order_itemsDeleteManyArgs>(args?: Prisma.SelectSubset<T, order_itemsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Order_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {order_itemsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Order_items
     * const order_items = await prisma.order_items.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends order_itemsUpdateManyArgs>(args: Prisma.SelectSubset<T, order_itemsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Order_items and returns the data updated in the database.
     * @param {order_itemsUpdateManyAndReturnArgs} args - Arguments to update many Order_items.
     * @example
     * // Update many Order_items
     * const order_items = await prisma.order_items.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Order_items and only return the `id`
     * const order_itemsWithIdOnly = await prisma.order_items.updateManyAndReturn({
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
    updateManyAndReturn<T extends order_itemsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, order_itemsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Order_items.
     * @param {order_itemsUpsertArgs} args - Arguments to update or create a Order_items.
     * @example
     * // Update or create a Order_items
     * const order_items = await prisma.order_items.upsert({
     *   create: {
     *     // ... data to create a Order_items
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order_items we want to update
     *   }
     * })
     */
    upsert<T extends order_itemsUpsertArgs>(args: Prisma.SelectSubset<T, order_itemsUpsertArgs<ExtArgs>>): Prisma.Prisma__order_itemsClient<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Order_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {order_itemsCountArgs} args - Arguments to filter Order_items to count.
     * @example
     * // Count the number of Order_items
     * const count = await prisma.order_items.count({
     *   where: {
     *     // ... the filter for the Order_items we want to count
     *   }
     * })
    **/
    count<T extends order_itemsCountArgs>(args?: Prisma.Subset<T, order_itemsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Order_itemsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Order_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Order_itemsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Order_itemsAggregateArgs>(args: Prisma.Subset<T, Order_itemsAggregateArgs>): Prisma.PrismaPromise<GetOrder_itemsAggregateType<T>>;
    /**
     * Group by Order_items.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {order_itemsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends order_itemsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: order_itemsGroupByArgs['orderBy'];
    } : {
        orderBy?: order_itemsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, order_itemsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrder_itemsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the order_items model
     */
    readonly fields: order_itemsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for order_items.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__order_itemsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    blends<T extends Prisma.order_items$blendsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.order_items$blendsArgs<ExtArgs>>): Prisma.Prisma__blendsClient<runtime.Types.Result.GetResult<Prisma.$blendsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    orders<T extends Prisma.order_items$ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.order_items$ordersArgs<ExtArgs>>): Prisma.Prisma__ordersClient<runtime.Types.Result.GetResult<Prisma.$ordersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    products<T extends Prisma.order_items$productsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.order_items$productsArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    rack_assignments<T extends Prisma.order_items$rack_assignmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.order_items$rack_assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    tasks<T extends Prisma.order_items$tasksArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.order_items$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the order_items model
 */
export interface order_itemsFieldRefs {
    readonly id: Prisma.FieldRef<"order_items", 'String'>;
    readonly order_id: Prisma.FieldRef<"order_items", 'String'>;
    readonly product_id: Prisma.FieldRef<"order_items", 'String'>;
    readonly blend_id: Prisma.FieldRef<"order_items", 'String'>;
    readonly quantity_oz: Prisma.FieldRef<"order_items", 'Decimal'>;
    readonly harvest_date: Prisma.FieldRef<"order_items", 'DateTime'>;
    readonly overage_percent: Prisma.FieldRef<"order_items", 'Decimal'>;
    readonly trays_needed: Prisma.FieldRef<"order_items", 'Int'>;
    readonly soak_date: Prisma.FieldRef<"order_items", 'DateTime'>;
    readonly seed_date: Prisma.FieldRef<"order_items", 'DateTime'>;
    readonly move_to_light_date: Prisma.FieldRef<"order_items", 'DateTime'>;
    readonly created_at: Prisma.FieldRef<"order_items", 'DateTime'>;
}
/**
 * order_items findUnique
 */
export type order_itemsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which order_items to fetch.
     */
    where: Prisma.order_itemsWhereUniqueInput;
};
/**
 * order_items findUniqueOrThrow
 */
export type order_itemsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which order_items to fetch.
     */
    where: Prisma.order_itemsWhereUniqueInput;
};
/**
 * order_items findFirst
 */
export type order_itemsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which order_items to fetch.
     */
    where?: Prisma.order_itemsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of order_items to fetch.
     */
    orderBy?: Prisma.order_itemsOrderByWithRelationInput | Prisma.order_itemsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for order_items.
     */
    cursor?: Prisma.order_itemsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` order_items from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` order_items.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of order_items.
     */
    distinct?: Prisma.Order_itemsScalarFieldEnum | Prisma.Order_itemsScalarFieldEnum[];
};
/**
 * order_items findFirstOrThrow
 */
export type order_itemsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which order_items to fetch.
     */
    where?: Prisma.order_itemsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of order_items to fetch.
     */
    orderBy?: Prisma.order_itemsOrderByWithRelationInput | Prisma.order_itemsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for order_items.
     */
    cursor?: Prisma.order_itemsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` order_items from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` order_items.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of order_items.
     */
    distinct?: Prisma.Order_itemsScalarFieldEnum | Prisma.Order_itemsScalarFieldEnum[];
};
/**
 * order_items findMany
 */
export type order_itemsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which order_items to fetch.
     */
    where?: Prisma.order_itemsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of order_items to fetch.
     */
    orderBy?: Prisma.order_itemsOrderByWithRelationInput | Prisma.order_itemsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing order_items.
     */
    cursor?: Prisma.order_itemsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` order_items from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` order_items.
     */
    skip?: number;
    distinct?: Prisma.Order_itemsScalarFieldEnum | Prisma.Order_itemsScalarFieldEnum[];
};
/**
 * order_items create
 */
export type order_itemsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a order_items.
     */
    data: Prisma.XOR<Prisma.order_itemsCreateInput, Prisma.order_itemsUncheckedCreateInput>;
};
/**
 * order_items createMany
 */
export type order_itemsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many order_items.
     */
    data: Prisma.order_itemsCreateManyInput | Prisma.order_itemsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * order_items createManyAndReturn
 */
export type order_itemsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order_items
     */
    select?: Prisma.order_itemsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the order_items
     */
    omit?: Prisma.order_itemsOmit<ExtArgs> | null;
    /**
     * The data used to create many order_items.
     */
    data: Prisma.order_itemsCreateManyInput | Prisma.order_itemsCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.order_itemsIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * order_items update
 */
export type order_itemsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a order_items.
     */
    data: Prisma.XOR<Prisma.order_itemsUpdateInput, Prisma.order_itemsUncheckedUpdateInput>;
    /**
     * Choose, which order_items to update.
     */
    where: Prisma.order_itemsWhereUniqueInput;
};
/**
 * order_items updateMany
 */
export type order_itemsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update order_items.
     */
    data: Prisma.XOR<Prisma.order_itemsUpdateManyMutationInput, Prisma.order_itemsUncheckedUpdateManyInput>;
    /**
     * Filter which order_items to update
     */
    where?: Prisma.order_itemsWhereInput;
    /**
     * Limit how many order_items to update.
     */
    limit?: number;
};
/**
 * order_items updateManyAndReturn
 */
export type order_itemsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the order_items
     */
    select?: Prisma.order_itemsSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the order_items
     */
    omit?: Prisma.order_itemsOmit<ExtArgs> | null;
    /**
     * The data used to update order_items.
     */
    data: Prisma.XOR<Prisma.order_itemsUpdateManyMutationInput, Prisma.order_itemsUncheckedUpdateManyInput>;
    /**
     * Filter which order_items to update
     */
    where?: Prisma.order_itemsWhereInput;
    /**
     * Limit how many order_items to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.order_itemsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * order_items upsert
 */
export type order_itemsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the order_items to update in case it exists.
     */
    where: Prisma.order_itemsWhereUniqueInput;
    /**
     * In case the order_items found by the `where` argument doesn't exist, create a new order_items with this data.
     */
    create: Prisma.XOR<Prisma.order_itemsCreateInput, Prisma.order_itemsUncheckedCreateInput>;
    /**
     * In case the order_items was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.order_itemsUpdateInput, Prisma.order_itemsUncheckedUpdateInput>;
};
/**
 * order_items delete
 */
export type order_itemsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which order_items to delete.
     */
    where: Prisma.order_itemsWhereUniqueInput;
};
/**
 * order_items deleteMany
 */
export type order_itemsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which order_items to delete
     */
    where?: Prisma.order_itemsWhereInput;
    /**
     * Limit how many order_items to delete.
     */
    limit?: number;
};
/**
 * order_items.blends
 */
export type order_items$blendsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * order_items.orders
 */
export type order_items$ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * order_items.products
 */
export type order_items$productsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * order_items.rack_assignments
 */
export type order_items$rack_assignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * order_items.tasks
 */
export type order_items$tasksArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * order_items without action
 */
export type order_itemsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=order_items.d.ts.map