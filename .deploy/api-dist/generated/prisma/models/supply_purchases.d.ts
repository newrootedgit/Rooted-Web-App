import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model supply_purchases
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type supply_purchasesModel = runtime.Types.Result.DefaultSelection<Prisma.$supply_purchasesPayload>;
export type AggregateSupply_purchases = {
    _count: Supply_purchasesCountAggregateOutputType | null;
    _avg: Supply_purchasesAvgAggregateOutputType | null;
    _sum: Supply_purchasesSumAggregateOutputType | null;
    _min: Supply_purchasesMinAggregateOutputType | null;
    _max: Supply_purchasesMaxAggregateOutputType | null;
};
export type Supply_purchasesAvgAggregateOutputType = {
    quantity: runtime.Decimal | null;
    unit_cost: runtime.Decimal | null;
    total_cost: runtime.Decimal | null;
};
export type Supply_purchasesSumAggregateOutputType = {
    quantity: runtime.Decimal | null;
    unit_cost: runtime.Decimal | null;
    total_cost: runtime.Decimal | null;
};
export type Supply_purchasesMinAggregateOutputType = {
    id: string | null;
    supply_id: string | null;
    quantity: runtime.Decimal | null;
    unit_cost: runtime.Decimal | null;
    total_cost: runtime.Decimal | null;
    supplier: string | null;
    lot_number: string | null;
    expiry_date: Date | null;
    purchase_date: Date | null;
    notes: string | null;
    created_at: Date | null;
};
export type Supply_purchasesMaxAggregateOutputType = {
    id: string | null;
    supply_id: string | null;
    quantity: runtime.Decimal | null;
    unit_cost: runtime.Decimal | null;
    total_cost: runtime.Decimal | null;
    supplier: string | null;
    lot_number: string | null;
    expiry_date: Date | null;
    purchase_date: Date | null;
    notes: string | null;
    created_at: Date | null;
};
export type Supply_purchasesCountAggregateOutputType = {
    id: number;
    supply_id: number;
    quantity: number;
    unit_cost: number;
    total_cost: number;
    supplier: number;
    lot_number: number;
    expiry_date: number;
    purchase_date: number;
    notes: number;
    created_at: number;
    _all: number;
};
export type Supply_purchasesAvgAggregateInputType = {
    quantity?: true;
    unit_cost?: true;
    total_cost?: true;
};
export type Supply_purchasesSumAggregateInputType = {
    quantity?: true;
    unit_cost?: true;
    total_cost?: true;
};
export type Supply_purchasesMinAggregateInputType = {
    id?: true;
    supply_id?: true;
    quantity?: true;
    unit_cost?: true;
    total_cost?: true;
    supplier?: true;
    lot_number?: true;
    expiry_date?: true;
    purchase_date?: true;
    notes?: true;
    created_at?: true;
};
export type Supply_purchasesMaxAggregateInputType = {
    id?: true;
    supply_id?: true;
    quantity?: true;
    unit_cost?: true;
    total_cost?: true;
    supplier?: true;
    lot_number?: true;
    expiry_date?: true;
    purchase_date?: true;
    notes?: true;
    created_at?: true;
};
export type Supply_purchasesCountAggregateInputType = {
    id?: true;
    supply_id?: true;
    quantity?: true;
    unit_cost?: true;
    total_cost?: true;
    supplier?: true;
    lot_number?: true;
    expiry_date?: true;
    purchase_date?: true;
    notes?: true;
    created_at?: true;
    _all?: true;
};
export type Supply_purchasesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which supply_purchases to aggregate.
     */
    where?: Prisma.supply_purchasesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_purchases to fetch.
     */
    orderBy?: Prisma.supply_purchasesOrderByWithRelationInput | Prisma.supply_purchasesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.supply_purchasesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_purchases from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_purchases.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned supply_purchases
    **/
    _count?: true | Supply_purchasesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Supply_purchasesAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Supply_purchasesSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Supply_purchasesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Supply_purchasesMaxAggregateInputType;
};
export type GetSupply_purchasesAggregateType<T extends Supply_purchasesAggregateArgs> = {
    [P in keyof T & keyof AggregateSupply_purchases]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSupply_purchases[P]> : Prisma.GetScalarType<T[P], AggregateSupply_purchases[P]>;
};
export type supply_purchasesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.supply_purchasesWhereInput;
    orderBy?: Prisma.supply_purchasesOrderByWithAggregationInput | Prisma.supply_purchasesOrderByWithAggregationInput[];
    by: Prisma.Supply_purchasesScalarFieldEnum[] | Prisma.Supply_purchasesScalarFieldEnum;
    having?: Prisma.supply_purchasesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Supply_purchasesCountAggregateInputType | true;
    _avg?: Supply_purchasesAvgAggregateInputType;
    _sum?: Supply_purchasesSumAggregateInputType;
    _min?: Supply_purchasesMinAggregateInputType;
    _max?: Supply_purchasesMaxAggregateInputType;
};
export type Supply_purchasesGroupByOutputType = {
    id: string;
    supply_id: string | null;
    quantity: runtime.Decimal;
    unit_cost: runtime.Decimal | null;
    total_cost: runtime.Decimal | null;
    supplier: string | null;
    lot_number: string | null;
    expiry_date: Date | null;
    purchase_date: Date;
    notes: string | null;
    created_at: Date | null;
    _count: Supply_purchasesCountAggregateOutputType | null;
    _avg: Supply_purchasesAvgAggregateOutputType | null;
    _sum: Supply_purchasesSumAggregateOutputType | null;
    _min: Supply_purchasesMinAggregateOutputType | null;
    _max: Supply_purchasesMaxAggregateOutputType | null;
};
type GetSupply_purchasesGroupByPayload<T extends supply_purchasesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Supply_purchasesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Supply_purchasesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Supply_purchasesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Supply_purchasesGroupByOutputType[P]>;
}>>;
export type supply_purchasesWhereInput = {
    AND?: Prisma.supply_purchasesWhereInput | Prisma.supply_purchasesWhereInput[];
    OR?: Prisma.supply_purchasesWhereInput[];
    NOT?: Prisma.supply_purchasesWhereInput | Prisma.supply_purchasesWhereInput[];
    id?: Prisma.UuidFilter<"supply_purchases"> | string;
    supply_id?: Prisma.UuidNullableFilter<"supply_purchases"> | string | null;
    quantity?: Prisma.DecimalFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: Prisma.DecimalNullableFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: Prisma.DecimalNullableFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: Prisma.StringNullableFilter<"supply_purchases"> | string | null;
    lot_number?: Prisma.StringNullableFilter<"supply_purchases"> | string | null;
    expiry_date?: Prisma.DateTimeNullableFilter<"supply_purchases"> | Date | string | null;
    purchase_date?: Prisma.DateTimeFilter<"supply_purchases"> | Date | string;
    notes?: Prisma.StringNullableFilter<"supply_purchases"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supply_purchases"> | Date | string | null;
    supplies?: Prisma.XOR<Prisma.SuppliesNullableScalarRelationFilter, Prisma.suppliesWhereInput> | null;
};
export type supply_purchasesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    supply_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrderInput | Prisma.SortOrder;
    total_cost?: Prisma.SortOrderInput | Prisma.SortOrder;
    supplier?: Prisma.SortOrderInput | Prisma.SortOrder;
    lot_number?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiry_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    purchase_date?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    supplies?: Prisma.suppliesOrderByWithRelationInput;
};
export type supply_purchasesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.supply_purchasesWhereInput | Prisma.supply_purchasesWhereInput[];
    OR?: Prisma.supply_purchasesWhereInput[];
    NOT?: Prisma.supply_purchasesWhereInput | Prisma.supply_purchasesWhereInput[];
    supply_id?: Prisma.UuidNullableFilter<"supply_purchases"> | string | null;
    quantity?: Prisma.DecimalFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: Prisma.DecimalNullableFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: Prisma.DecimalNullableFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: Prisma.StringNullableFilter<"supply_purchases"> | string | null;
    lot_number?: Prisma.StringNullableFilter<"supply_purchases"> | string | null;
    expiry_date?: Prisma.DateTimeNullableFilter<"supply_purchases"> | Date | string | null;
    purchase_date?: Prisma.DateTimeFilter<"supply_purchases"> | Date | string;
    notes?: Prisma.StringNullableFilter<"supply_purchases"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supply_purchases"> | Date | string | null;
    supplies?: Prisma.XOR<Prisma.SuppliesNullableScalarRelationFilter, Prisma.suppliesWhereInput> | null;
}, "id">;
export type supply_purchasesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    supply_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrderInput | Prisma.SortOrder;
    total_cost?: Prisma.SortOrderInput | Prisma.SortOrder;
    supplier?: Prisma.SortOrderInput | Prisma.SortOrder;
    lot_number?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiry_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    purchase_date?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.supply_purchasesCountOrderByAggregateInput;
    _avg?: Prisma.supply_purchasesAvgOrderByAggregateInput;
    _max?: Prisma.supply_purchasesMaxOrderByAggregateInput;
    _min?: Prisma.supply_purchasesMinOrderByAggregateInput;
    _sum?: Prisma.supply_purchasesSumOrderByAggregateInput;
};
export type supply_purchasesScalarWhereWithAggregatesInput = {
    AND?: Prisma.supply_purchasesScalarWhereWithAggregatesInput | Prisma.supply_purchasesScalarWhereWithAggregatesInput[];
    OR?: Prisma.supply_purchasesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.supply_purchasesScalarWhereWithAggregatesInput | Prisma.supply_purchasesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"supply_purchases"> | string;
    supply_id?: Prisma.UuidNullableWithAggregatesFilter<"supply_purchases"> | string | null;
    quantity?: Prisma.DecimalWithAggregatesFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: Prisma.DecimalNullableWithAggregatesFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: Prisma.DecimalNullableWithAggregatesFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: Prisma.StringNullableWithAggregatesFilter<"supply_purchases"> | string | null;
    lot_number?: Prisma.StringNullableWithAggregatesFilter<"supply_purchases"> | string | null;
    expiry_date?: Prisma.DateTimeNullableWithAggregatesFilter<"supply_purchases"> | Date | string | null;
    purchase_date?: Prisma.DateTimeWithAggregatesFilter<"supply_purchases"> | Date | string;
    notes?: Prisma.StringNullableWithAggregatesFilter<"supply_purchases"> | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"supply_purchases"> | Date | string | null;
};
export type supply_purchasesCreateInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: string | null;
    lot_number?: string | null;
    expiry_date?: Date | string | null;
    purchase_date: Date | string;
    notes?: string | null;
    created_at?: Date | string | null;
    supplies?: Prisma.suppliesCreateNestedOneWithoutSupply_purchasesInput;
};
export type supply_purchasesUncheckedCreateInput = {
    id?: string;
    supply_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: string | null;
    lot_number?: string | null;
    expiry_date?: Date | string | null;
    purchase_date: Date | string;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type supply_purchasesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lot_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiry_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    purchase_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supplies?: Prisma.suppliesUpdateOneWithoutSupply_purchasesNestedInput;
};
export type supply_purchasesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supply_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lot_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiry_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    purchase_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_purchasesCreateManyInput = {
    id?: string;
    supply_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: string | null;
    lot_number?: string | null;
    expiry_date?: Date | string | null;
    purchase_date: Date | string;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type supply_purchasesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lot_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiry_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    purchase_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_purchasesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    supply_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lot_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiry_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    purchase_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type Supply_purchasesListRelationFilter = {
    every?: Prisma.supply_purchasesWhereInput;
    some?: Prisma.supply_purchasesWhereInput;
    none?: Prisma.supply_purchasesWhereInput;
};
export type supply_purchasesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type supply_purchasesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    supply_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrder;
    total_cost?: Prisma.SortOrder;
    supplier?: Prisma.SortOrder;
    lot_number?: Prisma.SortOrder;
    expiry_date?: Prisma.SortOrder;
    purchase_date?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type supply_purchasesAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrder;
    total_cost?: Prisma.SortOrder;
};
export type supply_purchasesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    supply_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrder;
    total_cost?: Prisma.SortOrder;
    supplier?: Prisma.SortOrder;
    lot_number?: Prisma.SortOrder;
    expiry_date?: Prisma.SortOrder;
    purchase_date?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type supply_purchasesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    supply_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrder;
    total_cost?: Prisma.SortOrder;
    supplier?: Prisma.SortOrder;
    lot_number?: Prisma.SortOrder;
    expiry_date?: Prisma.SortOrder;
    purchase_date?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type supply_purchasesSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    unit_cost?: Prisma.SortOrder;
    total_cost?: Prisma.SortOrder;
};
export type supply_purchasesCreateNestedManyWithoutSuppliesInput = {
    create?: Prisma.XOR<Prisma.supply_purchasesCreateWithoutSuppliesInput, Prisma.supply_purchasesUncheckedCreateWithoutSuppliesInput> | Prisma.supply_purchasesCreateWithoutSuppliesInput[] | Prisma.supply_purchasesUncheckedCreateWithoutSuppliesInput[];
    connectOrCreate?: Prisma.supply_purchasesCreateOrConnectWithoutSuppliesInput | Prisma.supply_purchasesCreateOrConnectWithoutSuppliesInput[];
    createMany?: Prisma.supply_purchasesCreateManySuppliesInputEnvelope;
    connect?: Prisma.supply_purchasesWhereUniqueInput | Prisma.supply_purchasesWhereUniqueInput[];
};
export type supply_purchasesUncheckedCreateNestedManyWithoutSuppliesInput = {
    create?: Prisma.XOR<Prisma.supply_purchasesCreateWithoutSuppliesInput, Prisma.supply_purchasesUncheckedCreateWithoutSuppliesInput> | Prisma.supply_purchasesCreateWithoutSuppliesInput[] | Prisma.supply_purchasesUncheckedCreateWithoutSuppliesInput[];
    connectOrCreate?: Prisma.supply_purchasesCreateOrConnectWithoutSuppliesInput | Prisma.supply_purchasesCreateOrConnectWithoutSuppliesInput[];
    createMany?: Prisma.supply_purchasesCreateManySuppliesInputEnvelope;
    connect?: Prisma.supply_purchasesWhereUniqueInput | Prisma.supply_purchasesWhereUniqueInput[];
};
export type supply_purchasesUpdateManyWithoutSuppliesNestedInput = {
    create?: Prisma.XOR<Prisma.supply_purchasesCreateWithoutSuppliesInput, Prisma.supply_purchasesUncheckedCreateWithoutSuppliesInput> | Prisma.supply_purchasesCreateWithoutSuppliesInput[] | Prisma.supply_purchasesUncheckedCreateWithoutSuppliesInput[];
    connectOrCreate?: Prisma.supply_purchasesCreateOrConnectWithoutSuppliesInput | Prisma.supply_purchasesCreateOrConnectWithoutSuppliesInput[];
    upsert?: Prisma.supply_purchasesUpsertWithWhereUniqueWithoutSuppliesInput | Prisma.supply_purchasesUpsertWithWhereUniqueWithoutSuppliesInput[];
    createMany?: Prisma.supply_purchasesCreateManySuppliesInputEnvelope;
    set?: Prisma.supply_purchasesWhereUniqueInput | Prisma.supply_purchasesWhereUniqueInput[];
    disconnect?: Prisma.supply_purchasesWhereUniqueInput | Prisma.supply_purchasesWhereUniqueInput[];
    delete?: Prisma.supply_purchasesWhereUniqueInput | Prisma.supply_purchasesWhereUniqueInput[];
    connect?: Prisma.supply_purchasesWhereUniqueInput | Prisma.supply_purchasesWhereUniqueInput[];
    update?: Prisma.supply_purchasesUpdateWithWhereUniqueWithoutSuppliesInput | Prisma.supply_purchasesUpdateWithWhereUniqueWithoutSuppliesInput[];
    updateMany?: Prisma.supply_purchasesUpdateManyWithWhereWithoutSuppliesInput | Prisma.supply_purchasesUpdateManyWithWhereWithoutSuppliesInput[];
    deleteMany?: Prisma.supply_purchasesScalarWhereInput | Prisma.supply_purchasesScalarWhereInput[];
};
export type supply_purchasesUncheckedUpdateManyWithoutSuppliesNestedInput = {
    create?: Prisma.XOR<Prisma.supply_purchasesCreateWithoutSuppliesInput, Prisma.supply_purchasesUncheckedCreateWithoutSuppliesInput> | Prisma.supply_purchasesCreateWithoutSuppliesInput[] | Prisma.supply_purchasesUncheckedCreateWithoutSuppliesInput[];
    connectOrCreate?: Prisma.supply_purchasesCreateOrConnectWithoutSuppliesInput | Prisma.supply_purchasesCreateOrConnectWithoutSuppliesInput[];
    upsert?: Prisma.supply_purchasesUpsertWithWhereUniqueWithoutSuppliesInput | Prisma.supply_purchasesUpsertWithWhereUniqueWithoutSuppliesInput[];
    createMany?: Prisma.supply_purchasesCreateManySuppliesInputEnvelope;
    set?: Prisma.supply_purchasesWhereUniqueInput | Prisma.supply_purchasesWhereUniqueInput[];
    disconnect?: Prisma.supply_purchasesWhereUniqueInput | Prisma.supply_purchasesWhereUniqueInput[];
    delete?: Prisma.supply_purchasesWhereUniqueInput | Prisma.supply_purchasesWhereUniqueInput[];
    connect?: Prisma.supply_purchasesWhereUniqueInput | Prisma.supply_purchasesWhereUniqueInput[];
    update?: Prisma.supply_purchasesUpdateWithWhereUniqueWithoutSuppliesInput | Prisma.supply_purchasesUpdateWithWhereUniqueWithoutSuppliesInput[];
    updateMany?: Prisma.supply_purchasesUpdateManyWithWhereWithoutSuppliesInput | Prisma.supply_purchasesUpdateManyWithWhereWithoutSuppliesInput[];
    deleteMany?: Prisma.supply_purchasesScalarWhereInput | Prisma.supply_purchasesScalarWhereInput[];
};
export type supply_purchasesCreateWithoutSuppliesInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: string | null;
    lot_number?: string | null;
    expiry_date?: Date | string | null;
    purchase_date: Date | string;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type supply_purchasesUncheckedCreateWithoutSuppliesInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: string | null;
    lot_number?: string | null;
    expiry_date?: Date | string | null;
    purchase_date: Date | string;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type supply_purchasesCreateOrConnectWithoutSuppliesInput = {
    where: Prisma.supply_purchasesWhereUniqueInput;
    create: Prisma.XOR<Prisma.supply_purchasesCreateWithoutSuppliesInput, Prisma.supply_purchasesUncheckedCreateWithoutSuppliesInput>;
};
export type supply_purchasesCreateManySuppliesInputEnvelope = {
    data: Prisma.supply_purchasesCreateManySuppliesInput | Prisma.supply_purchasesCreateManySuppliesInput[];
    skipDuplicates?: boolean;
};
export type supply_purchasesUpsertWithWhereUniqueWithoutSuppliesInput = {
    where: Prisma.supply_purchasesWhereUniqueInput;
    update: Prisma.XOR<Prisma.supply_purchasesUpdateWithoutSuppliesInput, Prisma.supply_purchasesUncheckedUpdateWithoutSuppliesInput>;
    create: Prisma.XOR<Prisma.supply_purchasesCreateWithoutSuppliesInput, Prisma.supply_purchasesUncheckedCreateWithoutSuppliesInput>;
};
export type supply_purchasesUpdateWithWhereUniqueWithoutSuppliesInput = {
    where: Prisma.supply_purchasesWhereUniqueInput;
    data: Prisma.XOR<Prisma.supply_purchasesUpdateWithoutSuppliesInput, Prisma.supply_purchasesUncheckedUpdateWithoutSuppliesInput>;
};
export type supply_purchasesUpdateManyWithWhereWithoutSuppliesInput = {
    where: Prisma.supply_purchasesScalarWhereInput;
    data: Prisma.XOR<Prisma.supply_purchasesUpdateManyMutationInput, Prisma.supply_purchasesUncheckedUpdateManyWithoutSuppliesInput>;
};
export type supply_purchasesScalarWhereInput = {
    AND?: Prisma.supply_purchasesScalarWhereInput | Prisma.supply_purchasesScalarWhereInput[];
    OR?: Prisma.supply_purchasesScalarWhereInput[];
    NOT?: Prisma.supply_purchasesScalarWhereInput | Prisma.supply_purchasesScalarWhereInput[];
    id?: Prisma.UuidFilter<"supply_purchases"> | string;
    supply_id?: Prisma.UuidNullableFilter<"supply_purchases"> | string | null;
    quantity?: Prisma.DecimalFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: Prisma.DecimalNullableFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: Prisma.DecimalNullableFilter<"supply_purchases"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: Prisma.StringNullableFilter<"supply_purchases"> | string | null;
    lot_number?: Prisma.StringNullableFilter<"supply_purchases"> | string | null;
    expiry_date?: Prisma.DateTimeNullableFilter<"supply_purchases"> | Date | string | null;
    purchase_date?: Prisma.DateTimeFilter<"supply_purchases"> | Date | string;
    notes?: Prisma.StringNullableFilter<"supply_purchases"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"supply_purchases"> | Date | string | null;
};
export type supply_purchasesCreateManySuppliesInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: string | null;
    lot_number?: string | null;
    expiry_date?: Date | string | null;
    purchase_date: Date | string;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type supply_purchasesUpdateWithoutSuppliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lot_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiry_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    purchase_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_purchasesUncheckedUpdateWithoutSuppliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lot_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiry_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    purchase_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_purchasesUncheckedUpdateManyWithoutSuppliesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    total_cost?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    supplier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lot_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    expiry_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    purchase_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type supply_purchasesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    supply_id?: boolean;
    quantity?: boolean;
    unit_cost?: boolean;
    total_cost?: boolean;
    supplier?: boolean;
    lot_number?: boolean;
    expiry_date?: boolean;
    purchase_date?: boolean;
    notes?: boolean;
    created_at?: boolean;
    supplies?: boolean | Prisma.supply_purchases$suppliesArgs<ExtArgs>;
}, ExtArgs["result"]["supply_purchases"]>;
export type supply_purchasesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    supply_id?: boolean;
    quantity?: boolean;
    unit_cost?: boolean;
    total_cost?: boolean;
    supplier?: boolean;
    lot_number?: boolean;
    expiry_date?: boolean;
    purchase_date?: boolean;
    notes?: boolean;
    created_at?: boolean;
    supplies?: boolean | Prisma.supply_purchases$suppliesArgs<ExtArgs>;
}, ExtArgs["result"]["supply_purchases"]>;
export type supply_purchasesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    supply_id?: boolean;
    quantity?: boolean;
    unit_cost?: boolean;
    total_cost?: boolean;
    supplier?: boolean;
    lot_number?: boolean;
    expiry_date?: boolean;
    purchase_date?: boolean;
    notes?: boolean;
    created_at?: boolean;
    supplies?: boolean | Prisma.supply_purchases$suppliesArgs<ExtArgs>;
}, ExtArgs["result"]["supply_purchases"]>;
export type supply_purchasesSelectScalar = {
    id?: boolean;
    supply_id?: boolean;
    quantity?: boolean;
    unit_cost?: boolean;
    total_cost?: boolean;
    supplier?: boolean;
    lot_number?: boolean;
    expiry_date?: boolean;
    purchase_date?: boolean;
    notes?: boolean;
    created_at?: boolean;
};
export type supply_purchasesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "supply_id" | "quantity" | "unit_cost" | "total_cost" | "supplier" | "lot_number" | "expiry_date" | "purchase_date" | "notes" | "created_at", ExtArgs["result"]["supply_purchases"]>;
export type supply_purchasesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplies?: boolean | Prisma.supply_purchases$suppliesArgs<ExtArgs>;
};
export type supply_purchasesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplies?: boolean | Prisma.supply_purchases$suppliesArgs<ExtArgs>;
};
export type supply_purchasesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supplies?: boolean | Prisma.supply_purchases$suppliesArgs<ExtArgs>;
};
export type $supply_purchasesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "supply_purchases";
    objects: {
        supplies: Prisma.$suppliesPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        supply_id: string | null;
        quantity: runtime.Decimal;
        unit_cost: runtime.Decimal | null;
        total_cost: runtime.Decimal | null;
        supplier: string | null;
        lot_number: string | null;
        expiry_date: Date | null;
        purchase_date: Date;
        notes: string | null;
        created_at: Date | null;
    }, ExtArgs["result"]["supply_purchases"]>;
    composites: {};
};
export type supply_purchasesGetPayload<S extends boolean | null | undefined | supply_purchasesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload, S>;
export type supply_purchasesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<supply_purchasesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Supply_purchasesCountAggregateInputType | true;
};
export interface supply_purchasesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['supply_purchases'];
        meta: {
            name: 'supply_purchases';
        };
    };
    /**
     * Find zero or one Supply_purchases that matches the filter.
     * @param {supply_purchasesFindUniqueArgs} args - Arguments to find a Supply_purchases
     * @example
     * // Get one Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends supply_purchasesFindUniqueArgs>(args: Prisma.SelectSubset<T, supply_purchasesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__supply_purchasesClient<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Supply_purchases that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {supply_purchasesFindUniqueOrThrowArgs} args - Arguments to find a Supply_purchases
     * @example
     * // Get one Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends supply_purchasesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, supply_purchasesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__supply_purchasesClient<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Supply_purchases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_purchasesFindFirstArgs} args - Arguments to find a Supply_purchases
     * @example
     * // Get one Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends supply_purchasesFindFirstArgs>(args?: Prisma.SelectSubset<T, supply_purchasesFindFirstArgs<ExtArgs>>): Prisma.Prisma__supply_purchasesClient<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Supply_purchases that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_purchasesFindFirstOrThrowArgs} args - Arguments to find a Supply_purchases
     * @example
     * // Get one Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends supply_purchasesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, supply_purchasesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__supply_purchasesClient<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Supply_purchases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_purchasesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.findMany()
     *
     * // Get first 10 Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const supply_purchasesWithIdOnly = await prisma.supply_purchases.findMany({ select: { id: true } })
     *
     */
    findMany<T extends supply_purchasesFindManyArgs>(args?: Prisma.SelectSubset<T, supply_purchasesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Supply_purchases.
     * @param {supply_purchasesCreateArgs} args - Arguments to create a Supply_purchases.
     * @example
     * // Create one Supply_purchases
     * const Supply_purchases = await prisma.supply_purchases.create({
     *   data: {
     *     // ... data to create a Supply_purchases
     *   }
     * })
     *
     */
    create<T extends supply_purchasesCreateArgs>(args: Prisma.SelectSubset<T, supply_purchasesCreateArgs<ExtArgs>>): Prisma.Prisma__supply_purchasesClient<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Supply_purchases.
     * @param {supply_purchasesCreateManyArgs} args - Arguments to create many Supply_purchases.
     * @example
     * // Create many Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends supply_purchasesCreateManyArgs>(args?: Prisma.SelectSubset<T, supply_purchasesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Supply_purchases and returns the data saved in the database.
     * @param {supply_purchasesCreateManyAndReturnArgs} args - Arguments to create many Supply_purchases.
     * @example
     * // Create many Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Supply_purchases and only return the `id`
     * const supply_purchasesWithIdOnly = await prisma.supply_purchases.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends supply_purchasesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, supply_purchasesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Supply_purchases.
     * @param {supply_purchasesDeleteArgs} args - Arguments to delete one Supply_purchases.
     * @example
     * // Delete one Supply_purchases
     * const Supply_purchases = await prisma.supply_purchases.delete({
     *   where: {
     *     // ... filter to delete one Supply_purchases
     *   }
     * })
     *
     */
    delete<T extends supply_purchasesDeleteArgs>(args: Prisma.SelectSubset<T, supply_purchasesDeleteArgs<ExtArgs>>): Prisma.Prisma__supply_purchasesClient<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Supply_purchases.
     * @param {supply_purchasesUpdateArgs} args - Arguments to update one Supply_purchases.
     * @example
     * // Update one Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends supply_purchasesUpdateArgs>(args: Prisma.SelectSubset<T, supply_purchasesUpdateArgs<ExtArgs>>): Prisma.Prisma__supply_purchasesClient<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Supply_purchases.
     * @param {supply_purchasesDeleteManyArgs} args - Arguments to filter Supply_purchases to delete.
     * @example
     * // Delete a few Supply_purchases
     * const { count } = await prisma.supply_purchases.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends supply_purchasesDeleteManyArgs>(args?: Prisma.SelectSubset<T, supply_purchasesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Supply_purchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_purchasesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends supply_purchasesUpdateManyArgs>(args: Prisma.SelectSubset<T, supply_purchasesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Supply_purchases and returns the data updated in the database.
     * @param {supply_purchasesUpdateManyAndReturnArgs} args - Arguments to update many Supply_purchases.
     * @example
     * // Update many Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Supply_purchases and only return the `id`
     * const supply_purchasesWithIdOnly = await prisma.supply_purchases.updateManyAndReturn({
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
    updateManyAndReturn<T extends supply_purchasesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, supply_purchasesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Supply_purchases.
     * @param {supply_purchasesUpsertArgs} args - Arguments to update or create a Supply_purchases.
     * @example
     * // Update or create a Supply_purchases
     * const supply_purchases = await prisma.supply_purchases.upsert({
     *   create: {
     *     // ... data to create a Supply_purchases
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Supply_purchases we want to update
     *   }
     * })
     */
    upsert<T extends supply_purchasesUpsertArgs>(args: Prisma.SelectSubset<T, supply_purchasesUpsertArgs<ExtArgs>>): Prisma.Prisma__supply_purchasesClient<runtime.Types.Result.GetResult<Prisma.$supply_purchasesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Supply_purchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_purchasesCountArgs} args - Arguments to filter Supply_purchases to count.
     * @example
     * // Count the number of Supply_purchases
     * const count = await prisma.supply_purchases.count({
     *   where: {
     *     // ... the filter for the Supply_purchases we want to count
     *   }
     * })
    **/
    count<T extends supply_purchasesCountArgs>(args?: Prisma.Subset<T, supply_purchasesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Supply_purchasesCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Supply_purchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Supply_purchasesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Supply_purchasesAggregateArgs>(args: Prisma.Subset<T, Supply_purchasesAggregateArgs>): Prisma.PrismaPromise<GetSupply_purchasesAggregateType<T>>;
    /**
     * Group by Supply_purchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {supply_purchasesGroupByArgs} args - Group by arguments.
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
    groupBy<T extends supply_purchasesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: supply_purchasesGroupByArgs['orderBy'];
    } : {
        orderBy?: supply_purchasesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, supply_purchasesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupply_purchasesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the supply_purchases model
     */
    readonly fields: supply_purchasesFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for supply_purchases.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__supply_purchasesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    supplies<T extends Prisma.supply_purchases$suppliesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.supply_purchases$suppliesArgs<ExtArgs>>): Prisma.Prisma__suppliesClient<runtime.Types.Result.GetResult<Prisma.$suppliesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the supply_purchases model
 */
export interface supply_purchasesFieldRefs {
    readonly id: Prisma.FieldRef<"supply_purchases", 'String'>;
    readonly supply_id: Prisma.FieldRef<"supply_purchases", 'String'>;
    readonly quantity: Prisma.FieldRef<"supply_purchases", 'Decimal'>;
    readonly unit_cost: Prisma.FieldRef<"supply_purchases", 'Decimal'>;
    readonly total_cost: Prisma.FieldRef<"supply_purchases", 'Decimal'>;
    readonly supplier: Prisma.FieldRef<"supply_purchases", 'String'>;
    readonly lot_number: Prisma.FieldRef<"supply_purchases", 'String'>;
    readonly expiry_date: Prisma.FieldRef<"supply_purchases", 'DateTime'>;
    readonly purchase_date: Prisma.FieldRef<"supply_purchases", 'DateTime'>;
    readonly notes: Prisma.FieldRef<"supply_purchases", 'String'>;
    readonly created_at: Prisma.FieldRef<"supply_purchases", 'DateTime'>;
}
/**
 * supply_purchases findUnique
 */
export type supply_purchasesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supply_purchases to fetch.
     */
    where: Prisma.supply_purchasesWhereUniqueInput;
};
/**
 * supply_purchases findUniqueOrThrow
 */
export type supply_purchasesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supply_purchases to fetch.
     */
    where: Prisma.supply_purchasesWhereUniqueInput;
};
/**
 * supply_purchases findFirst
 */
export type supply_purchasesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supply_purchases to fetch.
     */
    where?: Prisma.supply_purchasesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_purchases to fetch.
     */
    orderBy?: Prisma.supply_purchasesOrderByWithRelationInput | Prisma.supply_purchasesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for supply_purchases.
     */
    cursor?: Prisma.supply_purchasesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_purchases from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_purchases.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of supply_purchases.
     */
    distinct?: Prisma.Supply_purchasesScalarFieldEnum | Prisma.Supply_purchasesScalarFieldEnum[];
};
/**
 * supply_purchases findFirstOrThrow
 */
export type supply_purchasesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supply_purchases to fetch.
     */
    where?: Prisma.supply_purchasesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_purchases to fetch.
     */
    orderBy?: Prisma.supply_purchasesOrderByWithRelationInput | Prisma.supply_purchasesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for supply_purchases.
     */
    cursor?: Prisma.supply_purchasesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_purchases from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_purchases.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of supply_purchases.
     */
    distinct?: Prisma.Supply_purchasesScalarFieldEnum | Prisma.Supply_purchasesScalarFieldEnum[];
};
/**
 * supply_purchases findMany
 */
export type supply_purchasesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which supply_purchases to fetch.
     */
    where?: Prisma.supply_purchasesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of supply_purchases to fetch.
     */
    orderBy?: Prisma.supply_purchasesOrderByWithRelationInput | Prisma.supply_purchasesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing supply_purchases.
     */
    cursor?: Prisma.supply_purchasesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` supply_purchases from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` supply_purchases.
     */
    skip?: number;
    distinct?: Prisma.Supply_purchasesScalarFieldEnum | Prisma.Supply_purchasesScalarFieldEnum[];
};
/**
 * supply_purchases create
 */
export type supply_purchasesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a supply_purchases.
     */
    data: Prisma.XOR<Prisma.supply_purchasesCreateInput, Prisma.supply_purchasesUncheckedCreateInput>;
};
/**
 * supply_purchases createMany
 */
export type supply_purchasesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many supply_purchases.
     */
    data: Prisma.supply_purchasesCreateManyInput | Prisma.supply_purchasesCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * supply_purchases createManyAndReturn
 */
export type supply_purchasesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_purchases
     */
    select?: Prisma.supply_purchasesSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_purchases
     */
    omit?: Prisma.supply_purchasesOmit<ExtArgs> | null;
    /**
     * The data used to create many supply_purchases.
     */
    data: Prisma.supply_purchasesCreateManyInput | Prisma.supply_purchasesCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_purchasesIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * supply_purchases update
 */
export type supply_purchasesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a supply_purchases.
     */
    data: Prisma.XOR<Prisma.supply_purchasesUpdateInput, Prisma.supply_purchasesUncheckedUpdateInput>;
    /**
     * Choose, which supply_purchases to update.
     */
    where: Prisma.supply_purchasesWhereUniqueInput;
};
/**
 * supply_purchases updateMany
 */
export type supply_purchasesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update supply_purchases.
     */
    data: Prisma.XOR<Prisma.supply_purchasesUpdateManyMutationInput, Prisma.supply_purchasesUncheckedUpdateManyInput>;
    /**
     * Filter which supply_purchases to update
     */
    where?: Prisma.supply_purchasesWhereInput;
    /**
     * Limit how many supply_purchases to update.
     */
    limit?: number;
};
/**
 * supply_purchases updateManyAndReturn
 */
export type supply_purchasesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the supply_purchases
     */
    select?: Prisma.supply_purchasesSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the supply_purchases
     */
    omit?: Prisma.supply_purchasesOmit<ExtArgs> | null;
    /**
     * The data used to update supply_purchases.
     */
    data: Prisma.XOR<Prisma.supply_purchasesUpdateManyMutationInput, Prisma.supply_purchasesUncheckedUpdateManyInput>;
    /**
     * Filter which supply_purchases to update
     */
    where?: Prisma.supply_purchasesWhereInput;
    /**
     * Limit how many supply_purchases to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.supply_purchasesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * supply_purchases upsert
 */
export type supply_purchasesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the supply_purchases to update in case it exists.
     */
    where: Prisma.supply_purchasesWhereUniqueInput;
    /**
     * In case the supply_purchases found by the `where` argument doesn't exist, create a new supply_purchases with this data.
     */
    create: Prisma.XOR<Prisma.supply_purchasesCreateInput, Prisma.supply_purchasesUncheckedCreateInput>;
    /**
     * In case the supply_purchases was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.supply_purchasesUpdateInput, Prisma.supply_purchasesUncheckedUpdateInput>;
};
/**
 * supply_purchases delete
 */
export type supply_purchasesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which supply_purchases to delete.
     */
    where: Prisma.supply_purchasesWhereUniqueInput;
};
/**
 * supply_purchases deleteMany
 */
export type supply_purchasesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which supply_purchases to delete
     */
    where?: Prisma.supply_purchasesWhereInput;
    /**
     * Limit how many supply_purchases to delete.
     */
    limit?: number;
};
/**
 * supply_purchases.supplies
 */
export type supply_purchases$suppliesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * supply_purchases without action
 */
export type supply_purchasesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=supply_purchases.d.ts.map