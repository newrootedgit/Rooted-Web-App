import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model rack_assignments
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type rack_assignmentsModel = runtime.Types.Result.DefaultSelection<Prisma.$rack_assignmentsPayload>;
export type AggregateRack_assignments = {
    _count: Rack_assignmentsCountAggregateOutputType | null;
    _avg: Rack_assignmentsAvgAggregateOutputType | null;
    _sum: Rack_assignmentsSumAggregateOutputType | null;
    _min: Rack_assignmentsMinAggregateOutputType | null;
    _max: Rack_assignmentsMaxAggregateOutputType | null;
};
export type Rack_assignmentsAvgAggregateOutputType = {
    level: number | null;
    tray_count: number | null;
};
export type Rack_assignmentsSumAggregateOutputType = {
    level: number | null;
    tray_count: number | null;
};
export type Rack_assignmentsMinAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    rack_element_id: string | null;
    level: number | null;
    order_item_id: string | null;
    tray_count: number | null;
    assigned_at: Date | null;
    assigned_by: string | null;
    is_active: boolean | null;
    removed_at: Date | null;
};
export type Rack_assignmentsMaxAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    rack_element_id: string | null;
    level: number | null;
    order_item_id: string | null;
    tray_count: number | null;
    assigned_at: Date | null;
    assigned_by: string | null;
    is_active: boolean | null;
    removed_at: Date | null;
};
export type Rack_assignmentsCountAggregateOutputType = {
    id: number;
    farm_id: number;
    rack_element_id: number;
    level: number;
    order_item_id: number;
    tray_count: number;
    assigned_at: number;
    assigned_by: number;
    is_active: number;
    removed_at: number;
    _all: number;
};
export type Rack_assignmentsAvgAggregateInputType = {
    level?: true;
    tray_count?: true;
};
export type Rack_assignmentsSumAggregateInputType = {
    level?: true;
    tray_count?: true;
};
export type Rack_assignmentsMinAggregateInputType = {
    id?: true;
    farm_id?: true;
    rack_element_id?: true;
    level?: true;
    order_item_id?: true;
    tray_count?: true;
    assigned_at?: true;
    assigned_by?: true;
    is_active?: true;
    removed_at?: true;
};
export type Rack_assignmentsMaxAggregateInputType = {
    id?: true;
    farm_id?: true;
    rack_element_id?: true;
    level?: true;
    order_item_id?: true;
    tray_count?: true;
    assigned_at?: true;
    assigned_by?: true;
    is_active?: true;
    removed_at?: true;
};
export type Rack_assignmentsCountAggregateInputType = {
    id?: true;
    farm_id?: true;
    rack_element_id?: true;
    level?: true;
    order_item_id?: true;
    tray_count?: true;
    assigned_at?: true;
    assigned_by?: true;
    is_active?: true;
    removed_at?: true;
    _all?: true;
};
export type Rack_assignmentsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which rack_assignments to aggregate.
     */
    where?: Prisma.rack_assignmentsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of rack_assignments to fetch.
     */
    orderBy?: Prisma.rack_assignmentsOrderByWithRelationInput | Prisma.rack_assignmentsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.rack_assignmentsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` rack_assignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` rack_assignments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned rack_assignments
    **/
    _count?: true | Rack_assignmentsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Rack_assignmentsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Rack_assignmentsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Rack_assignmentsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Rack_assignmentsMaxAggregateInputType;
};
export type GetRack_assignmentsAggregateType<T extends Rack_assignmentsAggregateArgs> = {
    [P in keyof T & keyof AggregateRack_assignments]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRack_assignments[P]> : Prisma.GetScalarType<T[P], AggregateRack_assignments[P]>;
};
export type rack_assignmentsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.rack_assignmentsWhereInput;
    orderBy?: Prisma.rack_assignmentsOrderByWithAggregationInput | Prisma.rack_assignmentsOrderByWithAggregationInput[];
    by: Prisma.Rack_assignmentsScalarFieldEnum[] | Prisma.Rack_assignmentsScalarFieldEnum;
    having?: Prisma.rack_assignmentsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Rack_assignmentsCountAggregateInputType | true;
    _avg?: Rack_assignmentsAvgAggregateInputType;
    _sum?: Rack_assignmentsSumAggregateInputType;
    _min?: Rack_assignmentsMinAggregateInputType;
    _max?: Rack_assignmentsMaxAggregateInputType;
};
export type Rack_assignmentsGroupByOutputType = {
    id: string;
    farm_id: string | null;
    rack_element_id: string;
    level: number;
    order_item_id: string | null;
    tray_count: number;
    assigned_at: Date | null;
    assigned_by: string | null;
    is_active: boolean | null;
    removed_at: Date | null;
    _count: Rack_assignmentsCountAggregateOutputType | null;
    _avg: Rack_assignmentsAvgAggregateOutputType | null;
    _sum: Rack_assignmentsSumAggregateOutputType | null;
    _min: Rack_assignmentsMinAggregateOutputType | null;
    _max: Rack_assignmentsMaxAggregateOutputType | null;
};
type GetRack_assignmentsGroupByPayload<T extends rack_assignmentsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Rack_assignmentsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Rack_assignmentsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Rack_assignmentsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Rack_assignmentsGroupByOutputType[P]>;
}>>;
export type rack_assignmentsWhereInput = {
    AND?: Prisma.rack_assignmentsWhereInput | Prisma.rack_assignmentsWhereInput[];
    OR?: Prisma.rack_assignmentsWhereInput[];
    NOT?: Prisma.rack_assignmentsWhereInput | Prisma.rack_assignmentsWhereInput[];
    id?: Prisma.UuidFilter<"rack_assignments"> | string;
    farm_id?: Prisma.UuidNullableFilter<"rack_assignments"> | string | null;
    rack_element_id?: Prisma.StringFilter<"rack_assignments"> | string;
    level?: Prisma.IntFilter<"rack_assignments"> | number;
    order_item_id?: Prisma.UuidNullableFilter<"rack_assignments"> | string | null;
    tray_count?: Prisma.IntFilter<"rack_assignments"> | number;
    assigned_at?: Prisma.DateTimeNullableFilter<"rack_assignments"> | Date | string | null;
    assigned_by?: Prisma.StringNullableFilter<"rack_assignments"> | string | null;
    is_active?: Prisma.BoolNullableFilter<"rack_assignments"> | boolean | null;
    removed_at?: Prisma.DateTimeNullableFilter<"rack_assignments"> | Date | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    order_items?: Prisma.XOR<Prisma.Order_itemsNullableScalarRelationFilter, Prisma.order_itemsWhereInput> | null;
};
export type rack_assignmentsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    rack_element_id?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    order_item_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    tray_count?: Prisma.SortOrder;
    assigned_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    assigned_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    removed_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    farms?: Prisma.farmsOrderByWithRelationInput;
    order_items?: Prisma.order_itemsOrderByWithRelationInput;
};
export type rack_assignmentsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.rack_assignmentsWhereInput | Prisma.rack_assignmentsWhereInput[];
    OR?: Prisma.rack_assignmentsWhereInput[];
    NOT?: Prisma.rack_assignmentsWhereInput | Prisma.rack_assignmentsWhereInput[];
    farm_id?: Prisma.UuidNullableFilter<"rack_assignments"> | string | null;
    rack_element_id?: Prisma.StringFilter<"rack_assignments"> | string;
    level?: Prisma.IntFilter<"rack_assignments"> | number;
    order_item_id?: Prisma.UuidNullableFilter<"rack_assignments"> | string | null;
    tray_count?: Prisma.IntFilter<"rack_assignments"> | number;
    assigned_at?: Prisma.DateTimeNullableFilter<"rack_assignments"> | Date | string | null;
    assigned_by?: Prisma.StringNullableFilter<"rack_assignments"> | string | null;
    is_active?: Prisma.BoolNullableFilter<"rack_assignments"> | boolean | null;
    removed_at?: Prisma.DateTimeNullableFilter<"rack_assignments"> | Date | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    order_items?: Prisma.XOR<Prisma.Order_itemsNullableScalarRelationFilter, Prisma.order_itemsWhereInput> | null;
}, "id">;
export type rack_assignmentsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    rack_element_id?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    order_item_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    tray_count?: Prisma.SortOrder;
    assigned_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    assigned_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    removed_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.rack_assignmentsCountOrderByAggregateInput;
    _avg?: Prisma.rack_assignmentsAvgOrderByAggregateInput;
    _max?: Prisma.rack_assignmentsMaxOrderByAggregateInput;
    _min?: Prisma.rack_assignmentsMinOrderByAggregateInput;
    _sum?: Prisma.rack_assignmentsSumOrderByAggregateInput;
};
export type rack_assignmentsScalarWhereWithAggregatesInput = {
    AND?: Prisma.rack_assignmentsScalarWhereWithAggregatesInput | Prisma.rack_assignmentsScalarWhereWithAggregatesInput[];
    OR?: Prisma.rack_assignmentsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.rack_assignmentsScalarWhereWithAggregatesInput | Prisma.rack_assignmentsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"rack_assignments"> | string;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"rack_assignments"> | string | null;
    rack_element_id?: Prisma.StringWithAggregatesFilter<"rack_assignments"> | string;
    level?: Prisma.IntWithAggregatesFilter<"rack_assignments"> | number;
    order_item_id?: Prisma.UuidNullableWithAggregatesFilter<"rack_assignments"> | string | null;
    tray_count?: Prisma.IntWithAggregatesFilter<"rack_assignments"> | number;
    assigned_at?: Prisma.DateTimeNullableWithAggregatesFilter<"rack_assignments"> | Date | string | null;
    assigned_by?: Prisma.StringNullableWithAggregatesFilter<"rack_assignments"> | string | null;
    is_active?: Prisma.BoolNullableWithAggregatesFilter<"rack_assignments"> | boolean | null;
    removed_at?: Prisma.DateTimeNullableWithAggregatesFilter<"rack_assignments"> | Date | string | null;
};
export type rack_assignmentsCreateInput = {
    id?: string;
    rack_element_id: string;
    level: number;
    tray_count: number;
    assigned_at?: Date | string | null;
    assigned_by?: string | null;
    is_active?: boolean | null;
    removed_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutRack_assignmentsInput;
    order_items?: Prisma.order_itemsCreateNestedOneWithoutRack_assignmentsInput;
};
export type rack_assignmentsUncheckedCreateInput = {
    id?: string;
    farm_id?: string | null;
    rack_element_id: string;
    level: number;
    order_item_id?: string | null;
    tray_count: number;
    assigned_at?: Date | string | null;
    assigned_by?: string | null;
    is_active?: boolean | null;
    removed_at?: Date | string | null;
};
export type rack_assignmentsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rack_element_id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    tray_count?: Prisma.IntFieldUpdateOperationsInput | number;
    assigned_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    assigned_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    removed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutRack_assignmentsNestedInput;
    order_items?: Prisma.order_itemsUpdateOneWithoutRack_assignmentsNestedInput;
};
export type rack_assignmentsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rack_element_id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    order_item_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tray_count?: Prisma.IntFieldUpdateOperationsInput | number;
    assigned_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    assigned_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    removed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type rack_assignmentsCreateManyInput = {
    id?: string;
    farm_id?: string | null;
    rack_element_id: string;
    level: number;
    order_item_id?: string | null;
    tray_count: number;
    assigned_at?: Date | string | null;
    assigned_by?: string | null;
    is_active?: boolean | null;
    removed_at?: Date | string | null;
};
export type rack_assignmentsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rack_element_id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    tray_count?: Prisma.IntFieldUpdateOperationsInput | number;
    assigned_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    assigned_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    removed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type rack_assignmentsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rack_element_id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    order_item_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tray_count?: Prisma.IntFieldUpdateOperationsInput | number;
    assigned_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    assigned_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    removed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type Rack_assignmentsListRelationFilter = {
    every?: Prisma.rack_assignmentsWhereInput;
    some?: Prisma.rack_assignmentsWhereInput;
    none?: Prisma.rack_assignmentsWhereInput;
};
export type rack_assignmentsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type rack_assignmentsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    rack_element_id?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    order_item_id?: Prisma.SortOrder;
    tray_count?: Prisma.SortOrder;
    assigned_at?: Prisma.SortOrder;
    assigned_by?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    removed_at?: Prisma.SortOrder;
};
export type rack_assignmentsAvgOrderByAggregateInput = {
    level?: Prisma.SortOrder;
    tray_count?: Prisma.SortOrder;
};
export type rack_assignmentsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    rack_element_id?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    order_item_id?: Prisma.SortOrder;
    tray_count?: Prisma.SortOrder;
    assigned_at?: Prisma.SortOrder;
    assigned_by?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    removed_at?: Prisma.SortOrder;
};
export type rack_assignmentsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    rack_element_id?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    order_item_id?: Prisma.SortOrder;
    tray_count?: Prisma.SortOrder;
    assigned_at?: Prisma.SortOrder;
    assigned_by?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    removed_at?: Prisma.SortOrder;
};
export type rack_assignmentsSumOrderByAggregateInput = {
    level?: Prisma.SortOrder;
    tray_count?: Prisma.SortOrder;
};
export type rack_assignmentsCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutFarmsInput, Prisma.rack_assignmentsUncheckedCreateWithoutFarmsInput> | Prisma.rack_assignmentsCreateWithoutFarmsInput[] | Prisma.rack_assignmentsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.rack_assignmentsCreateOrConnectWithoutFarmsInput | Prisma.rack_assignmentsCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.rack_assignmentsCreateManyFarmsInputEnvelope;
    connect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
};
export type rack_assignmentsUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutFarmsInput, Prisma.rack_assignmentsUncheckedCreateWithoutFarmsInput> | Prisma.rack_assignmentsCreateWithoutFarmsInput[] | Prisma.rack_assignmentsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.rack_assignmentsCreateOrConnectWithoutFarmsInput | Prisma.rack_assignmentsCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.rack_assignmentsCreateManyFarmsInputEnvelope;
    connect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
};
export type rack_assignmentsUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutFarmsInput, Prisma.rack_assignmentsUncheckedCreateWithoutFarmsInput> | Prisma.rack_assignmentsCreateWithoutFarmsInput[] | Prisma.rack_assignmentsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.rack_assignmentsCreateOrConnectWithoutFarmsInput | Prisma.rack_assignmentsCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.rack_assignmentsUpsertWithWhereUniqueWithoutFarmsInput | Prisma.rack_assignmentsUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.rack_assignmentsCreateManyFarmsInputEnvelope;
    set?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    disconnect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    delete?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    connect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    update?: Prisma.rack_assignmentsUpdateWithWhereUniqueWithoutFarmsInput | Prisma.rack_assignmentsUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.rack_assignmentsUpdateManyWithWhereWithoutFarmsInput | Prisma.rack_assignmentsUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.rack_assignmentsScalarWhereInput | Prisma.rack_assignmentsScalarWhereInput[];
};
export type rack_assignmentsUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutFarmsInput, Prisma.rack_assignmentsUncheckedCreateWithoutFarmsInput> | Prisma.rack_assignmentsCreateWithoutFarmsInput[] | Prisma.rack_assignmentsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.rack_assignmentsCreateOrConnectWithoutFarmsInput | Prisma.rack_assignmentsCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.rack_assignmentsUpsertWithWhereUniqueWithoutFarmsInput | Prisma.rack_assignmentsUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.rack_assignmentsCreateManyFarmsInputEnvelope;
    set?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    disconnect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    delete?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    connect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    update?: Prisma.rack_assignmentsUpdateWithWhereUniqueWithoutFarmsInput | Prisma.rack_assignmentsUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.rack_assignmentsUpdateManyWithWhereWithoutFarmsInput | Prisma.rack_assignmentsUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.rack_assignmentsScalarWhereInput | Prisma.rack_assignmentsScalarWhereInput[];
};
export type rack_assignmentsCreateNestedManyWithoutOrder_itemsInput = {
    create?: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutOrder_itemsInput, Prisma.rack_assignmentsUncheckedCreateWithoutOrder_itemsInput> | Prisma.rack_assignmentsCreateWithoutOrder_itemsInput[] | Prisma.rack_assignmentsUncheckedCreateWithoutOrder_itemsInput[];
    connectOrCreate?: Prisma.rack_assignmentsCreateOrConnectWithoutOrder_itemsInput | Prisma.rack_assignmentsCreateOrConnectWithoutOrder_itemsInput[];
    createMany?: Prisma.rack_assignmentsCreateManyOrder_itemsInputEnvelope;
    connect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
};
export type rack_assignmentsUncheckedCreateNestedManyWithoutOrder_itemsInput = {
    create?: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutOrder_itemsInput, Prisma.rack_assignmentsUncheckedCreateWithoutOrder_itemsInput> | Prisma.rack_assignmentsCreateWithoutOrder_itemsInput[] | Prisma.rack_assignmentsUncheckedCreateWithoutOrder_itemsInput[];
    connectOrCreate?: Prisma.rack_assignmentsCreateOrConnectWithoutOrder_itemsInput | Prisma.rack_assignmentsCreateOrConnectWithoutOrder_itemsInput[];
    createMany?: Prisma.rack_assignmentsCreateManyOrder_itemsInputEnvelope;
    connect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
};
export type rack_assignmentsUpdateManyWithoutOrder_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutOrder_itemsInput, Prisma.rack_assignmentsUncheckedCreateWithoutOrder_itemsInput> | Prisma.rack_assignmentsCreateWithoutOrder_itemsInput[] | Prisma.rack_assignmentsUncheckedCreateWithoutOrder_itemsInput[];
    connectOrCreate?: Prisma.rack_assignmentsCreateOrConnectWithoutOrder_itemsInput | Prisma.rack_assignmentsCreateOrConnectWithoutOrder_itemsInput[];
    upsert?: Prisma.rack_assignmentsUpsertWithWhereUniqueWithoutOrder_itemsInput | Prisma.rack_assignmentsUpsertWithWhereUniqueWithoutOrder_itemsInput[];
    createMany?: Prisma.rack_assignmentsCreateManyOrder_itemsInputEnvelope;
    set?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    disconnect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    delete?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    connect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    update?: Prisma.rack_assignmentsUpdateWithWhereUniqueWithoutOrder_itemsInput | Prisma.rack_assignmentsUpdateWithWhereUniqueWithoutOrder_itemsInput[];
    updateMany?: Prisma.rack_assignmentsUpdateManyWithWhereWithoutOrder_itemsInput | Prisma.rack_assignmentsUpdateManyWithWhereWithoutOrder_itemsInput[];
    deleteMany?: Prisma.rack_assignmentsScalarWhereInput | Prisma.rack_assignmentsScalarWhereInput[];
};
export type rack_assignmentsUncheckedUpdateManyWithoutOrder_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutOrder_itemsInput, Prisma.rack_assignmentsUncheckedCreateWithoutOrder_itemsInput> | Prisma.rack_assignmentsCreateWithoutOrder_itemsInput[] | Prisma.rack_assignmentsUncheckedCreateWithoutOrder_itemsInput[];
    connectOrCreate?: Prisma.rack_assignmentsCreateOrConnectWithoutOrder_itemsInput | Prisma.rack_assignmentsCreateOrConnectWithoutOrder_itemsInput[];
    upsert?: Prisma.rack_assignmentsUpsertWithWhereUniqueWithoutOrder_itemsInput | Prisma.rack_assignmentsUpsertWithWhereUniqueWithoutOrder_itemsInput[];
    createMany?: Prisma.rack_assignmentsCreateManyOrder_itemsInputEnvelope;
    set?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    disconnect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    delete?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    connect?: Prisma.rack_assignmentsWhereUniqueInput | Prisma.rack_assignmentsWhereUniqueInput[];
    update?: Prisma.rack_assignmentsUpdateWithWhereUniqueWithoutOrder_itemsInput | Prisma.rack_assignmentsUpdateWithWhereUniqueWithoutOrder_itemsInput[];
    updateMany?: Prisma.rack_assignmentsUpdateManyWithWhereWithoutOrder_itemsInput | Prisma.rack_assignmentsUpdateManyWithWhereWithoutOrder_itemsInput[];
    deleteMany?: Prisma.rack_assignmentsScalarWhereInput | Prisma.rack_assignmentsScalarWhereInput[];
};
export type rack_assignmentsCreateWithoutFarmsInput = {
    id?: string;
    rack_element_id: string;
    level: number;
    tray_count: number;
    assigned_at?: Date | string | null;
    assigned_by?: string | null;
    is_active?: boolean | null;
    removed_at?: Date | string | null;
    order_items?: Prisma.order_itemsCreateNestedOneWithoutRack_assignmentsInput;
};
export type rack_assignmentsUncheckedCreateWithoutFarmsInput = {
    id?: string;
    rack_element_id: string;
    level: number;
    order_item_id?: string | null;
    tray_count: number;
    assigned_at?: Date | string | null;
    assigned_by?: string | null;
    is_active?: boolean | null;
    removed_at?: Date | string | null;
};
export type rack_assignmentsCreateOrConnectWithoutFarmsInput = {
    where: Prisma.rack_assignmentsWhereUniqueInput;
    create: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutFarmsInput, Prisma.rack_assignmentsUncheckedCreateWithoutFarmsInput>;
};
export type rack_assignmentsCreateManyFarmsInputEnvelope = {
    data: Prisma.rack_assignmentsCreateManyFarmsInput | Prisma.rack_assignmentsCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type rack_assignmentsUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.rack_assignmentsWhereUniqueInput;
    update: Prisma.XOR<Prisma.rack_assignmentsUpdateWithoutFarmsInput, Prisma.rack_assignmentsUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutFarmsInput, Prisma.rack_assignmentsUncheckedCreateWithoutFarmsInput>;
};
export type rack_assignmentsUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.rack_assignmentsWhereUniqueInput;
    data: Prisma.XOR<Prisma.rack_assignmentsUpdateWithoutFarmsInput, Prisma.rack_assignmentsUncheckedUpdateWithoutFarmsInput>;
};
export type rack_assignmentsUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.rack_assignmentsScalarWhereInput;
    data: Prisma.XOR<Prisma.rack_assignmentsUpdateManyMutationInput, Prisma.rack_assignmentsUncheckedUpdateManyWithoutFarmsInput>;
};
export type rack_assignmentsScalarWhereInput = {
    AND?: Prisma.rack_assignmentsScalarWhereInput | Prisma.rack_assignmentsScalarWhereInput[];
    OR?: Prisma.rack_assignmentsScalarWhereInput[];
    NOT?: Prisma.rack_assignmentsScalarWhereInput | Prisma.rack_assignmentsScalarWhereInput[];
    id?: Prisma.UuidFilter<"rack_assignments"> | string;
    farm_id?: Prisma.UuidNullableFilter<"rack_assignments"> | string | null;
    rack_element_id?: Prisma.StringFilter<"rack_assignments"> | string;
    level?: Prisma.IntFilter<"rack_assignments"> | number;
    order_item_id?: Prisma.UuidNullableFilter<"rack_assignments"> | string | null;
    tray_count?: Prisma.IntFilter<"rack_assignments"> | number;
    assigned_at?: Prisma.DateTimeNullableFilter<"rack_assignments"> | Date | string | null;
    assigned_by?: Prisma.StringNullableFilter<"rack_assignments"> | string | null;
    is_active?: Prisma.BoolNullableFilter<"rack_assignments"> | boolean | null;
    removed_at?: Prisma.DateTimeNullableFilter<"rack_assignments"> | Date | string | null;
};
export type rack_assignmentsCreateWithoutOrder_itemsInput = {
    id?: string;
    rack_element_id: string;
    level: number;
    tray_count: number;
    assigned_at?: Date | string | null;
    assigned_by?: string | null;
    is_active?: boolean | null;
    removed_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutRack_assignmentsInput;
};
export type rack_assignmentsUncheckedCreateWithoutOrder_itemsInput = {
    id?: string;
    farm_id?: string | null;
    rack_element_id: string;
    level: number;
    tray_count: number;
    assigned_at?: Date | string | null;
    assigned_by?: string | null;
    is_active?: boolean | null;
    removed_at?: Date | string | null;
};
export type rack_assignmentsCreateOrConnectWithoutOrder_itemsInput = {
    where: Prisma.rack_assignmentsWhereUniqueInput;
    create: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutOrder_itemsInput, Prisma.rack_assignmentsUncheckedCreateWithoutOrder_itemsInput>;
};
export type rack_assignmentsCreateManyOrder_itemsInputEnvelope = {
    data: Prisma.rack_assignmentsCreateManyOrder_itemsInput | Prisma.rack_assignmentsCreateManyOrder_itemsInput[];
    skipDuplicates?: boolean;
};
export type rack_assignmentsUpsertWithWhereUniqueWithoutOrder_itemsInput = {
    where: Prisma.rack_assignmentsWhereUniqueInput;
    update: Prisma.XOR<Prisma.rack_assignmentsUpdateWithoutOrder_itemsInput, Prisma.rack_assignmentsUncheckedUpdateWithoutOrder_itemsInput>;
    create: Prisma.XOR<Prisma.rack_assignmentsCreateWithoutOrder_itemsInput, Prisma.rack_assignmentsUncheckedCreateWithoutOrder_itemsInput>;
};
export type rack_assignmentsUpdateWithWhereUniqueWithoutOrder_itemsInput = {
    where: Prisma.rack_assignmentsWhereUniqueInput;
    data: Prisma.XOR<Prisma.rack_assignmentsUpdateWithoutOrder_itemsInput, Prisma.rack_assignmentsUncheckedUpdateWithoutOrder_itemsInput>;
};
export type rack_assignmentsUpdateManyWithWhereWithoutOrder_itemsInput = {
    where: Prisma.rack_assignmentsScalarWhereInput;
    data: Prisma.XOR<Prisma.rack_assignmentsUpdateManyMutationInput, Prisma.rack_assignmentsUncheckedUpdateManyWithoutOrder_itemsInput>;
};
export type rack_assignmentsCreateManyFarmsInput = {
    id?: string;
    rack_element_id: string;
    level: number;
    order_item_id?: string | null;
    tray_count: number;
    assigned_at?: Date | string | null;
    assigned_by?: string | null;
    is_active?: boolean | null;
    removed_at?: Date | string | null;
};
export type rack_assignmentsUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rack_element_id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    tray_count?: Prisma.IntFieldUpdateOperationsInput | number;
    assigned_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    assigned_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    removed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    order_items?: Prisma.order_itemsUpdateOneWithoutRack_assignmentsNestedInput;
};
export type rack_assignmentsUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rack_element_id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    order_item_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tray_count?: Prisma.IntFieldUpdateOperationsInput | number;
    assigned_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    assigned_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    removed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type rack_assignmentsUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rack_element_id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    order_item_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tray_count?: Prisma.IntFieldUpdateOperationsInput | number;
    assigned_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    assigned_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    removed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type rack_assignmentsCreateManyOrder_itemsInput = {
    id?: string;
    farm_id?: string | null;
    rack_element_id: string;
    level: number;
    tray_count: number;
    assigned_at?: Date | string | null;
    assigned_by?: string | null;
    is_active?: boolean | null;
    removed_at?: Date | string | null;
};
export type rack_assignmentsUpdateWithoutOrder_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rack_element_id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    tray_count?: Prisma.IntFieldUpdateOperationsInput | number;
    assigned_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    assigned_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    removed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutRack_assignmentsNestedInput;
};
export type rack_assignmentsUncheckedUpdateWithoutOrder_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rack_element_id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    tray_count?: Prisma.IntFieldUpdateOperationsInput | number;
    assigned_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    assigned_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    removed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type rack_assignmentsUncheckedUpdateManyWithoutOrder_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rack_element_id?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    tray_count?: Prisma.IntFieldUpdateOperationsInput | number;
    assigned_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    assigned_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    removed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type rack_assignmentsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    rack_element_id?: boolean;
    level?: boolean;
    order_item_id?: boolean;
    tray_count?: boolean;
    assigned_at?: boolean;
    assigned_by?: boolean;
    is_active?: boolean;
    removed_at?: boolean;
    farms?: boolean | Prisma.rack_assignments$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.rack_assignments$order_itemsArgs<ExtArgs>;
}, ExtArgs["result"]["rack_assignments"]>;
export type rack_assignmentsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    rack_element_id?: boolean;
    level?: boolean;
    order_item_id?: boolean;
    tray_count?: boolean;
    assigned_at?: boolean;
    assigned_by?: boolean;
    is_active?: boolean;
    removed_at?: boolean;
    farms?: boolean | Prisma.rack_assignments$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.rack_assignments$order_itemsArgs<ExtArgs>;
}, ExtArgs["result"]["rack_assignments"]>;
export type rack_assignmentsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    rack_element_id?: boolean;
    level?: boolean;
    order_item_id?: boolean;
    tray_count?: boolean;
    assigned_at?: boolean;
    assigned_by?: boolean;
    is_active?: boolean;
    removed_at?: boolean;
    farms?: boolean | Prisma.rack_assignments$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.rack_assignments$order_itemsArgs<ExtArgs>;
}, ExtArgs["result"]["rack_assignments"]>;
export type rack_assignmentsSelectScalar = {
    id?: boolean;
    farm_id?: boolean;
    rack_element_id?: boolean;
    level?: boolean;
    order_item_id?: boolean;
    tray_count?: boolean;
    assigned_at?: boolean;
    assigned_by?: boolean;
    is_active?: boolean;
    removed_at?: boolean;
};
export type rack_assignmentsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farm_id" | "rack_element_id" | "level" | "order_item_id" | "tray_count" | "assigned_at" | "assigned_by" | "is_active" | "removed_at", ExtArgs["result"]["rack_assignments"]>;
export type rack_assignmentsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.rack_assignments$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.rack_assignments$order_itemsArgs<ExtArgs>;
};
export type rack_assignmentsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.rack_assignments$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.rack_assignments$order_itemsArgs<ExtArgs>;
};
export type rack_assignmentsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.rack_assignments$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.rack_assignments$order_itemsArgs<ExtArgs>;
};
export type $rack_assignmentsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "rack_assignments";
    objects: {
        farms: Prisma.$farmsPayload<ExtArgs> | null;
        order_items: Prisma.$order_itemsPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farm_id: string | null;
        rack_element_id: string;
        level: number;
        order_item_id: string | null;
        tray_count: number;
        assigned_at: Date | null;
        assigned_by: string | null;
        is_active: boolean | null;
        removed_at: Date | null;
    }, ExtArgs["result"]["rack_assignments"]>;
    composites: {};
};
export type rack_assignmentsGetPayload<S extends boolean | null | undefined | rack_assignmentsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload, S>;
export type rack_assignmentsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<rack_assignmentsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Rack_assignmentsCountAggregateInputType | true;
};
export interface rack_assignmentsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['rack_assignments'];
        meta: {
            name: 'rack_assignments';
        };
    };
    /**
     * Find zero or one Rack_assignments that matches the filter.
     * @param {rack_assignmentsFindUniqueArgs} args - Arguments to find a Rack_assignments
     * @example
     * // Get one Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends rack_assignmentsFindUniqueArgs>(args: Prisma.SelectSubset<T, rack_assignmentsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__rack_assignmentsClient<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Rack_assignments that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {rack_assignmentsFindUniqueOrThrowArgs} args - Arguments to find a Rack_assignments
     * @example
     * // Get one Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends rack_assignmentsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, rack_assignmentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__rack_assignmentsClient<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Rack_assignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rack_assignmentsFindFirstArgs} args - Arguments to find a Rack_assignments
     * @example
     * // Get one Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends rack_assignmentsFindFirstArgs>(args?: Prisma.SelectSubset<T, rack_assignmentsFindFirstArgs<ExtArgs>>): Prisma.Prisma__rack_assignmentsClient<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Rack_assignments that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rack_assignmentsFindFirstOrThrowArgs} args - Arguments to find a Rack_assignments
     * @example
     * // Get one Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends rack_assignmentsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, rack_assignmentsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__rack_assignmentsClient<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Rack_assignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rack_assignmentsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.findMany()
     *
     * // Get first 10 Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const rack_assignmentsWithIdOnly = await prisma.rack_assignments.findMany({ select: { id: true } })
     *
     */
    findMany<T extends rack_assignmentsFindManyArgs>(args?: Prisma.SelectSubset<T, rack_assignmentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Rack_assignments.
     * @param {rack_assignmentsCreateArgs} args - Arguments to create a Rack_assignments.
     * @example
     * // Create one Rack_assignments
     * const Rack_assignments = await prisma.rack_assignments.create({
     *   data: {
     *     // ... data to create a Rack_assignments
     *   }
     * })
     *
     */
    create<T extends rack_assignmentsCreateArgs>(args: Prisma.SelectSubset<T, rack_assignmentsCreateArgs<ExtArgs>>): Prisma.Prisma__rack_assignmentsClient<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Rack_assignments.
     * @param {rack_assignmentsCreateManyArgs} args - Arguments to create many Rack_assignments.
     * @example
     * // Create many Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends rack_assignmentsCreateManyArgs>(args?: Prisma.SelectSubset<T, rack_assignmentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Rack_assignments and returns the data saved in the database.
     * @param {rack_assignmentsCreateManyAndReturnArgs} args - Arguments to create many Rack_assignments.
     * @example
     * // Create many Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Rack_assignments and only return the `id`
     * const rack_assignmentsWithIdOnly = await prisma.rack_assignments.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends rack_assignmentsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, rack_assignmentsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Rack_assignments.
     * @param {rack_assignmentsDeleteArgs} args - Arguments to delete one Rack_assignments.
     * @example
     * // Delete one Rack_assignments
     * const Rack_assignments = await prisma.rack_assignments.delete({
     *   where: {
     *     // ... filter to delete one Rack_assignments
     *   }
     * })
     *
     */
    delete<T extends rack_assignmentsDeleteArgs>(args: Prisma.SelectSubset<T, rack_assignmentsDeleteArgs<ExtArgs>>): Prisma.Prisma__rack_assignmentsClient<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Rack_assignments.
     * @param {rack_assignmentsUpdateArgs} args - Arguments to update one Rack_assignments.
     * @example
     * // Update one Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends rack_assignmentsUpdateArgs>(args: Prisma.SelectSubset<T, rack_assignmentsUpdateArgs<ExtArgs>>): Prisma.Prisma__rack_assignmentsClient<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Rack_assignments.
     * @param {rack_assignmentsDeleteManyArgs} args - Arguments to filter Rack_assignments to delete.
     * @example
     * // Delete a few Rack_assignments
     * const { count } = await prisma.rack_assignments.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends rack_assignmentsDeleteManyArgs>(args?: Prisma.SelectSubset<T, rack_assignmentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Rack_assignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rack_assignmentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends rack_assignmentsUpdateManyArgs>(args: Prisma.SelectSubset<T, rack_assignmentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Rack_assignments and returns the data updated in the database.
     * @param {rack_assignmentsUpdateManyAndReturnArgs} args - Arguments to update many Rack_assignments.
     * @example
     * // Update many Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Rack_assignments and only return the `id`
     * const rack_assignmentsWithIdOnly = await prisma.rack_assignments.updateManyAndReturn({
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
    updateManyAndReturn<T extends rack_assignmentsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, rack_assignmentsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Rack_assignments.
     * @param {rack_assignmentsUpsertArgs} args - Arguments to update or create a Rack_assignments.
     * @example
     * // Update or create a Rack_assignments
     * const rack_assignments = await prisma.rack_assignments.upsert({
     *   create: {
     *     // ... data to create a Rack_assignments
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rack_assignments we want to update
     *   }
     * })
     */
    upsert<T extends rack_assignmentsUpsertArgs>(args: Prisma.SelectSubset<T, rack_assignmentsUpsertArgs<ExtArgs>>): Prisma.Prisma__rack_assignmentsClient<runtime.Types.Result.GetResult<Prisma.$rack_assignmentsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Rack_assignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rack_assignmentsCountArgs} args - Arguments to filter Rack_assignments to count.
     * @example
     * // Count the number of Rack_assignments
     * const count = await prisma.rack_assignments.count({
     *   where: {
     *     // ... the filter for the Rack_assignments we want to count
     *   }
     * })
    **/
    count<T extends rack_assignmentsCountArgs>(args?: Prisma.Subset<T, rack_assignmentsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Rack_assignmentsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Rack_assignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Rack_assignmentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Rack_assignmentsAggregateArgs>(args: Prisma.Subset<T, Rack_assignmentsAggregateArgs>): Prisma.PrismaPromise<GetRack_assignmentsAggregateType<T>>;
    /**
     * Group by Rack_assignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rack_assignmentsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends rack_assignmentsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: rack_assignmentsGroupByArgs['orderBy'];
    } : {
        orderBy?: rack_assignmentsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, rack_assignmentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRack_assignmentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the rack_assignments model
     */
    readonly fields: rack_assignmentsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for rack_assignments.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__rack_assignmentsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farms<T extends Prisma.rack_assignments$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.rack_assignments$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    order_items<T extends Prisma.rack_assignments$order_itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.rack_assignments$order_itemsArgs<ExtArgs>>): Prisma.Prisma__order_itemsClient<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the rack_assignments model
 */
export interface rack_assignmentsFieldRefs {
    readonly id: Prisma.FieldRef<"rack_assignments", 'String'>;
    readonly farm_id: Prisma.FieldRef<"rack_assignments", 'String'>;
    readonly rack_element_id: Prisma.FieldRef<"rack_assignments", 'String'>;
    readonly level: Prisma.FieldRef<"rack_assignments", 'Int'>;
    readonly order_item_id: Prisma.FieldRef<"rack_assignments", 'String'>;
    readonly tray_count: Prisma.FieldRef<"rack_assignments", 'Int'>;
    readonly assigned_at: Prisma.FieldRef<"rack_assignments", 'DateTime'>;
    readonly assigned_by: Prisma.FieldRef<"rack_assignments", 'String'>;
    readonly is_active: Prisma.FieldRef<"rack_assignments", 'Boolean'>;
    readonly removed_at: Prisma.FieldRef<"rack_assignments", 'DateTime'>;
}
/**
 * rack_assignments findUnique
 */
export type rack_assignmentsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which rack_assignments to fetch.
     */
    where: Prisma.rack_assignmentsWhereUniqueInput;
};
/**
 * rack_assignments findUniqueOrThrow
 */
export type rack_assignmentsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which rack_assignments to fetch.
     */
    where: Prisma.rack_assignmentsWhereUniqueInput;
};
/**
 * rack_assignments findFirst
 */
export type rack_assignmentsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which rack_assignments to fetch.
     */
    where?: Prisma.rack_assignmentsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of rack_assignments to fetch.
     */
    orderBy?: Prisma.rack_assignmentsOrderByWithRelationInput | Prisma.rack_assignmentsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for rack_assignments.
     */
    cursor?: Prisma.rack_assignmentsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` rack_assignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` rack_assignments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of rack_assignments.
     */
    distinct?: Prisma.Rack_assignmentsScalarFieldEnum | Prisma.Rack_assignmentsScalarFieldEnum[];
};
/**
 * rack_assignments findFirstOrThrow
 */
export type rack_assignmentsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which rack_assignments to fetch.
     */
    where?: Prisma.rack_assignmentsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of rack_assignments to fetch.
     */
    orderBy?: Prisma.rack_assignmentsOrderByWithRelationInput | Prisma.rack_assignmentsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for rack_assignments.
     */
    cursor?: Prisma.rack_assignmentsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` rack_assignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` rack_assignments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of rack_assignments.
     */
    distinct?: Prisma.Rack_assignmentsScalarFieldEnum | Prisma.Rack_assignmentsScalarFieldEnum[];
};
/**
 * rack_assignments findMany
 */
export type rack_assignmentsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which rack_assignments to fetch.
     */
    where?: Prisma.rack_assignmentsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of rack_assignments to fetch.
     */
    orderBy?: Prisma.rack_assignmentsOrderByWithRelationInput | Prisma.rack_assignmentsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing rack_assignments.
     */
    cursor?: Prisma.rack_assignmentsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` rack_assignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` rack_assignments.
     */
    skip?: number;
    distinct?: Prisma.Rack_assignmentsScalarFieldEnum | Prisma.Rack_assignmentsScalarFieldEnum[];
};
/**
 * rack_assignments create
 */
export type rack_assignmentsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a rack_assignments.
     */
    data: Prisma.XOR<Prisma.rack_assignmentsCreateInput, Prisma.rack_assignmentsUncheckedCreateInput>;
};
/**
 * rack_assignments createMany
 */
export type rack_assignmentsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many rack_assignments.
     */
    data: Prisma.rack_assignmentsCreateManyInput | Prisma.rack_assignmentsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * rack_assignments createManyAndReturn
 */
export type rack_assignmentsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the rack_assignments
     */
    select?: Prisma.rack_assignmentsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the rack_assignments
     */
    omit?: Prisma.rack_assignmentsOmit<ExtArgs> | null;
    /**
     * The data used to create many rack_assignments.
     */
    data: Prisma.rack_assignmentsCreateManyInput | Prisma.rack_assignmentsCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.rack_assignmentsIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * rack_assignments update
 */
export type rack_assignmentsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a rack_assignments.
     */
    data: Prisma.XOR<Prisma.rack_assignmentsUpdateInput, Prisma.rack_assignmentsUncheckedUpdateInput>;
    /**
     * Choose, which rack_assignments to update.
     */
    where: Prisma.rack_assignmentsWhereUniqueInput;
};
/**
 * rack_assignments updateMany
 */
export type rack_assignmentsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update rack_assignments.
     */
    data: Prisma.XOR<Prisma.rack_assignmentsUpdateManyMutationInput, Prisma.rack_assignmentsUncheckedUpdateManyInput>;
    /**
     * Filter which rack_assignments to update
     */
    where?: Prisma.rack_assignmentsWhereInput;
    /**
     * Limit how many rack_assignments to update.
     */
    limit?: number;
};
/**
 * rack_assignments updateManyAndReturn
 */
export type rack_assignmentsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the rack_assignments
     */
    select?: Prisma.rack_assignmentsSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the rack_assignments
     */
    omit?: Prisma.rack_assignmentsOmit<ExtArgs> | null;
    /**
     * The data used to update rack_assignments.
     */
    data: Prisma.XOR<Prisma.rack_assignmentsUpdateManyMutationInput, Prisma.rack_assignmentsUncheckedUpdateManyInput>;
    /**
     * Filter which rack_assignments to update
     */
    where?: Prisma.rack_assignmentsWhereInput;
    /**
     * Limit how many rack_assignments to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.rack_assignmentsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * rack_assignments upsert
 */
export type rack_assignmentsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the rack_assignments to update in case it exists.
     */
    where: Prisma.rack_assignmentsWhereUniqueInput;
    /**
     * In case the rack_assignments found by the `where` argument doesn't exist, create a new rack_assignments with this data.
     */
    create: Prisma.XOR<Prisma.rack_assignmentsCreateInput, Prisma.rack_assignmentsUncheckedCreateInput>;
    /**
     * In case the rack_assignments was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.rack_assignmentsUpdateInput, Prisma.rack_assignmentsUncheckedUpdateInput>;
};
/**
 * rack_assignments delete
 */
export type rack_assignmentsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which rack_assignments to delete.
     */
    where: Prisma.rack_assignmentsWhereUniqueInput;
};
/**
 * rack_assignments deleteMany
 */
export type rack_assignmentsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which rack_assignments to delete
     */
    where?: Prisma.rack_assignmentsWhereInput;
    /**
     * Limit how many rack_assignments to delete.
     */
    limit?: number;
};
/**
 * rack_assignments.farms
 */
export type rack_assignments$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * rack_assignments.order_items
 */
export type rack_assignments$order_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * rack_assignments without action
 */
export type rack_assignmentsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=rack_assignments.d.ts.map