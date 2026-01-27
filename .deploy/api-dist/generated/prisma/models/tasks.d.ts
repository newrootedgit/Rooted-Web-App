import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model tasks
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type tasksModel = runtime.Types.Result.DefaultSelection<Prisma.$tasksPayload>;
export type AggregateTasks = {
    _count: TasksCountAggregateOutputType | null;
    _avg: TasksAvgAggregateOutputType | null;
    _sum: TasksSumAggregateOutputType | null;
    _min: TasksMinAggregateOutputType | null;
    _max: TasksMaxAggregateOutputType | null;
};
export type TasksAvgAggregateOutputType = {
    actual_trays: number | null;
};
export type TasksSumAggregateOutputType = {
    actual_trays: number | null;
};
export type TasksMinAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    order_item_id: string | null;
    title: string | null;
    type: string | null;
    due_date: Date | null;
    status: string | null;
    priority: string | null;
    completed_at: Date | null;
    completed_by: string | null;
    completion_notes: string | null;
    actual_trays: number | null;
    seed_lot: string | null;
    created_at: Date | null;
};
export type TasksMaxAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    order_item_id: string | null;
    title: string | null;
    type: string | null;
    due_date: Date | null;
    status: string | null;
    priority: string | null;
    completed_at: Date | null;
    completed_by: string | null;
    completion_notes: string | null;
    actual_trays: number | null;
    seed_lot: string | null;
    created_at: Date | null;
};
export type TasksCountAggregateOutputType = {
    id: number;
    farm_id: number;
    order_item_id: number;
    title: number;
    type: number;
    due_date: number;
    status: number;
    priority: number;
    completed_at: number;
    completed_by: number;
    completion_notes: number;
    actual_trays: number;
    seed_lot: number;
    created_at: number;
    _all: number;
};
export type TasksAvgAggregateInputType = {
    actual_trays?: true;
};
export type TasksSumAggregateInputType = {
    actual_trays?: true;
};
export type TasksMinAggregateInputType = {
    id?: true;
    farm_id?: true;
    order_item_id?: true;
    title?: true;
    type?: true;
    due_date?: true;
    status?: true;
    priority?: true;
    completed_at?: true;
    completed_by?: true;
    completion_notes?: true;
    actual_trays?: true;
    seed_lot?: true;
    created_at?: true;
};
export type TasksMaxAggregateInputType = {
    id?: true;
    farm_id?: true;
    order_item_id?: true;
    title?: true;
    type?: true;
    due_date?: true;
    status?: true;
    priority?: true;
    completed_at?: true;
    completed_by?: true;
    completion_notes?: true;
    actual_trays?: true;
    seed_lot?: true;
    created_at?: true;
};
export type TasksCountAggregateInputType = {
    id?: true;
    farm_id?: true;
    order_item_id?: true;
    title?: true;
    type?: true;
    due_date?: true;
    status?: true;
    priority?: true;
    completed_at?: true;
    completed_by?: true;
    completion_notes?: true;
    actual_trays?: true;
    seed_lot?: true;
    created_at?: true;
    _all?: true;
};
export type TasksAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which tasks to aggregate.
     */
    where?: Prisma.tasksWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of tasks to fetch.
     */
    orderBy?: Prisma.tasksOrderByWithRelationInput | Prisma.tasksOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.tasksWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` tasks.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned tasks
    **/
    _count?: true | TasksCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: TasksAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: TasksSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: TasksMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: TasksMaxAggregateInputType;
};
export type GetTasksAggregateType<T extends TasksAggregateArgs> = {
    [P in keyof T & keyof AggregateTasks]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTasks[P]> : Prisma.GetScalarType<T[P], AggregateTasks[P]>;
};
export type tasksGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.tasksWhereInput;
    orderBy?: Prisma.tasksOrderByWithAggregationInput | Prisma.tasksOrderByWithAggregationInput[];
    by: Prisma.TasksScalarFieldEnum[] | Prisma.TasksScalarFieldEnum;
    having?: Prisma.tasksScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TasksCountAggregateInputType | true;
    _avg?: TasksAvgAggregateInputType;
    _sum?: TasksSumAggregateInputType;
    _min?: TasksMinAggregateInputType;
    _max?: TasksMaxAggregateInputType;
};
export type TasksGroupByOutputType = {
    id: string;
    farm_id: string | null;
    order_item_id: string | null;
    title: string;
    type: string;
    due_date: Date;
    status: string | null;
    priority: string | null;
    completed_at: Date | null;
    completed_by: string | null;
    completion_notes: string | null;
    actual_trays: number | null;
    seed_lot: string | null;
    created_at: Date | null;
    _count: TasksCountAggregateOutputType | null;
    _avg: TasksAvgAggregateOutputType | null;
    _sum: TasksSumAggregateOutputType | null;
    _min: TasksMinAggregateOutputType | null;
    _max: TasksMaxAggregateOutputType | null;
};
type GetTasksGroupByPayload<T extends tasksGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TasksGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TasksGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TasksGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TasksGroupByOutputType[P]>;
}>>;
export type tasksWhereInput = {
    AND?: Prisma.tasksWhereInput | Prisma.tasksWhereInput[];
    OR?: Prisma.tasksWhereInput[];
    NOT?: Prisma.tasksWhereInput | Prisma.tasksWhereInput[];
    id?: Prisma.UuidFilter<"tasks"> | string;
    farm_id?: Prisma.UuidNullableFilter<"tasks"> | string | null;
    order_item_id?: Prisma.UuidNullableFilter<"tasks"> | string | null;
    title?: Prisma.StringFilter<"tasks"> | string;
    type?: Prisma.StringFilter<"tasks"> | string;
    due_date?: Prisma.DateTimeFilter<"tasks"> | Date | string;
    status?: Prisma.StringNullableFilter<"tasks"> | string | null;
    priority?: Prisma.StringNullableFilter<"tasks"> | string | null;
    completed_at?: Prisma.DateTimeNullableFilter<"tasks"> | Date | string | null;
    completed_by?: Prisma.StringNullableFilter<"tasks"> | string | null;
    completion_notes?: Prisma.StringNullableFilter<"tasks"> | string | null;
    actual_trays?: Prisma.IntNullableFilter<"tasks"> | number | null;
    seed_lot?: Prisma.StringNullableFilter<"tasks"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"tasks"> | Date | string | null;
    supply_usage?: Prisma.Supply_usageListRelationFilter;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    order_items?: Prisma.XOR<Prisma.Order_itemsNullableScalarRelationFilter, Prisma.order_itemsWhereInput> | null;
};
export type tasksOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    order_item_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    title?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    due_date?: Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    priority?: Prisma.SortOrderInput | Prisma.SortOrder;
    completed_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    completed_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    completion_notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    actual_trays?: Prisma.SortOrderInput | Prisma.SortOrder;
    seed_lot?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    supply_usage?: Prisma.supply_usageOrderByRelationAggregateInput;
    farms?: Prisma.farmsOrderByWithRelationInput;
    order_items?: Prisma.order_itemsOrderByWithRelationInput;
};
export type tasksWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.tasksWhereInput | Prisma.tasksWhereInput[];
    OR?: Prisma.tasksWhereInput[];
    NOT?: Prisma.tasksWhereInput | Prisma.tasksWhereInput[];
    farm_id?: Prisma.UuidNullableFilter<"tasks"> | string | null;
    order_item_id?: Prisma.UuidNullableFilter<"tasks"> | string | null;
    title?: Prisma.StringFilter<"tasks"> | string;
    type?: Prisma.StringFilter<"tasks"> | string;
    due_date?: Prisma.DateTimeFilter<"tasks"> | Date | string;
    status?: Prisma.StringNullableFilter<"tasks"> | string | null;
    priority?: Prisma.StringNullableFilter<"tasks"> | string | null;
    completed_at?: Prisma.DateTimeNullableFilter<"tasks"> | Date | string | null;
    completed_by?: Prisma.StringNullableFilter<"tasks"> | string | null;
    completion_notes?: Prisma.StringNullableFilter<"tasks"> | string | null;
    actual_trays?: Prisma.IntNullableFilter<"tasks"> | number | null;
    seed_lot?: Prisma.StringNullableFilter<"tasks"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"tasks"> | Date | string | null;
    supply_usage?: Prisma.Supply_usageListRelationFilter;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
    order_items?: Prisma.XOR<Prisma.Order_itemsNullableScalarRelationFilter, Prisma.order_itemsWhereInput> | null;
}, "id">;
export type tasksOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    order_item_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    title?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    due_date?: Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    priority?: Prisma.SortOrderInput | Prisma.SortOrder;
    completed_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    completed_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    completion_notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    actual_trays?: Prisma.SortOrderInput | Prisma.SortOrder;
    seed_lot?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.tasksCountOrderByAggregateInput;
    _avg?: Prisma.tasksAvgOrderByAggregateInput;
    _max?: Prisma.tasksMaxOrderByAggregateInput;
    _min?: Prisma.tasksMinOrderByAggregateInput;
    _sum?: Prisma.tasksSumOrderByAggregateInput;
};
export type tasksScalarWhereWithAggregatesInput = {
    AND?: Prisma.tasksScalarWhereWithAggregatesInput | Prisma.tasksScalarWhereWithAggregatesInput[];
    OR?: Prisma.tasksScalarWhereWithAggregatesInput[];
    NOT?: Prisma.tasksScalarWhereWithAggregatesInput | Prisma.tasksScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"tasks"> | string;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"tasks"> | string | null;
    order_item_id?: Prisma.UuidNullableWithAggregatesFilter<"tasks"> | string | null;
    title?: Prisma.StringWithAggregatesFilter<"tasks"> | string;
    type?: Prisma.StringWithAggregatesFilter<"tasks"> | string;
    due_date?: Prisma.DateTimeWithAggregatesFilter<"tasks"> | Date | string;
    status?: Prisma.StringNullableWithAggregatesFilter<"tasks"> | string | null;
    priority?: Prisma.StringNullableWithAggregatesFilter<"tasks"> | string | null;
    completed_at?: Prisma.DateTimeNullableWithAggregatesFilter<"tasks"> | Date | string | null;
    completed_by?: Prisma.StringNullableWithAggregatesFilter<"tasks"> | string | null;
    completion_notes?: Prisma.StringNullableWithAggregatesFilter<"tasks"> | string | null;
    actual_trays?: Prisma.IntNullableWithAggregatesFilter<"tasks"> | number | null;
    seed_lot?: Prisma.StringNullableWithAggregatesFilter<"tasks"> | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"tasks"> | Date | string | null;
};
export type tasksCreateInput = {
    id?: string;
    title: string;
    type: string;
    due_date: Date | string;
    status?: string | null;
    priority?: string | null;
    completed_at?: Date | string | null;
    completed_by?: string | null;
    completion_notes?: string | null;
    actual_trays?: number | null;
    seed_lot?: string | null;
    created_at?: Date | string | null;
    supply_usage?: Prisma.supply_usageCreateNestedManyWithoutTasksInput;
    farms?: Prisma.farmsCreateNestedOneWithoutTasksInput;
    order_items?: Prisma.order_itemsCreateNestedOneWithoutTasksInput;
};
export type tasksUncheckedCreateInput = {
    id?: string;
    farm_id?: string | null;
    order_item_id?: string | null;
    title: string;
    type: string;
    due_date: Date | string;
    status?: string | null;
    priority?: string | null;
    completed_at?: Date | string | null;
    completed_by?: string | null;
    completion_notes?: string | null;
    actual_trays?: number | null;
    seed_lot?: string | null;
    created_at?: Date | string | null;
    supply_usage?: Prisma.supply_usageUncheckedCreateNestedManyWithoutTasksInput;
};
export type tasksUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_usage?: Prisma.supply_usageUpdateManyWithoutTasksNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutTasksNestedInput;
    order_items?: Prisma.order_itemsUpdateOneWithoutTasksNestedInput;
};
export type tasksUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_item_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_usage?: Prisma.supply_usageUncheckedUpdateManyWithoutTasksNestedInput;
};
export type tasksCreateManyInput = {
    id?: string;
    farm_id?: string | null;
    order_item_id?: string | null;
    title: string;
    type: string;
    due_date: Date | string;
    status?: string | null;
    priority?: string | null;
    completed_at?: Date | string | null;
    completed_by?: string | null;
    completion_notes?: string | null;
    actual_trays?: number | null;
    seed_lot?: string | null;
    created_at?: Date | string | null;
};
export type tasksUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type tasksUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_item_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TasksListRelationFilter = {
    every?: Prisma.tasksWhereInput;
    some?: Prisma.tasksWhereInput;
    none?: Prisma.tasksWhereInput;
};
export type tasksOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TasksNullableScalarRelationFilter = {
    is?: Prisma.tasksWhereInput | null;
    isNot?: Prisma.tasksWhereInput | null;
};
export type tasksCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    order_item_id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    due_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    completed_at?: Prisma.SortOrder;
    completed_by?: Prisma.SortOrder;
    completion_notes?: Prisma.SortOrder;
    actual_trays?: Prisma.SortOrder;
    seed_lot?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type tasksAvgOrderByAggregateInput = {
    actual_trays?: Prisma.SortOrder;
};
export type tasksMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    order_item_id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    due_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    completed_at?: Prisma.SortOrder;
    completed_by?: Prisma.SortOrder;
    completion_notes?: Prisma.SortOrder;
    actual_trays?: Prisma.SortOrder;
    seed_lot?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type tasksMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    order_item_id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    due_date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    completed_at?: Prisma.SortOrder;
    completed_by?: Prisma.SortOrder;
    completion_notes?: Prisma.SortOrder;
    actual_trays?: Prisma.SortOrder;
    seed_lot?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type tasksSumOrderByAggregateInput = {
    actual_trays?: Prisma.SortOrder;
};
export type tasksCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.tasksCreateWithoutFarmsInput, Prisma.tasksUncheckedCreateWithoutFarmsInput> | Prisma.tasksCreateWithoutFarmsInput[] | Prisma.tasksUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.tasksCreateOrConnectWithoutFarmsInput | Prisma.tasksCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.tasksCreateManyFarmsInputEnvelope;
    connect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
};
export type tasksUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.tasksCreateWithoutFarmsInput, Prisma.tasksUncheckedCreateWithoutFarmsInput> | Prisma.tasksCreateWithoutFarmsInput[] | Prisma.tasksUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.tasksCreateOrConnectWithoutFarmsInput | Prisma.tasksCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.tasksCreateManyFarmsInputEnvelope;
    connect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
};
export type tasksUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.tasksCreateWithoutFarmsInput, Prisma.tasksUncheckedCreateWithoutFarmsInput> | Prisma.tasksCreateWithoutFarmsInput[] | Prisma.tasksUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.tasksCreateOrConnectWithoutFarmsInput | Prisma.tasksCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.tasksUpsertWithWhereUniqueWithoutFarmsInput | Prisma.tasksUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.tasksCreateManyFarmsInputEnvelope;
    set?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    disconnect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    delete?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    connect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    update?: Prisma.tasksUpdateWithWhereUniqueWithoutFarmsInput | Prisma.tasksUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.tasksUpdateManyWithWhereWithoutFarmsInput | Prisma.tasksUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.tasksScalarWhereInput | Prisma.tasksScalarWhereInput[];
};
export type tasksUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.tasksCreateWithoutFarmsInput, Prisma.tasksUncheckedCreateWithoutFarmsInput> | Prisma.tasksCreateWithoutFarmsInput[] | Prisma.tasksUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.tasksCreateOrConnectWithoutFarmsInput | Prisma.tasksCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.tasksUpsertWithWhereUniqueWithoutFarmsInput | Prisma.tasksUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.tasksCreateManyFarmsInputEnvelope;
    set?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    disconnect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    delete?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    connect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    update?: Prisma.tasksUpdateWithWhereUniqueWithoutFarmsInput | Prisma.tasksUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.tasksUpdateManyWithWhereWithoutFarmsInput | Prisma.tasksUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.tasksScalarWhereInput | Prisma.tasksScalarWhereInput[];
};
export type tasksCreateNestedManyWithoutOrder_itemsInput = {
    create?: Prisma.XOR<Prisma.tasksCreateWithoutOrder_itemsInput, Prisma.tasksUncheckedCreateWithoutOrder_itemsInput> | Prisma.tasksCreateWithoutOrder_itemsInput[] | Prisma.tasksUncheckedCreateWithoutOrder_itemsInput[];
    connectOrCreate?: Prisma.tasksCreateOrConnectWithoutOrder_itemsInput | Prisma.tasksCreateOrConnectWithoutOrder_itemsInput[];
    createMany?: Prisma.tasksCreateManyOrder_itemsInputEnvelope;
    connect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
};
export type tasksUncheckedCreateNestedManyWithoutOrder_itemsInput = {
    create?: Prisma.XOR<Prisma.tasksCreateWithoutOrder_itemsInput, Prisma.tasksUncheckedCreateWithoutOrder_itemsInput> | Prisma.tasksCreateWithoutOrder_itemsInput[] | Prisma.tasksUncheckedCreateWithoutOrder_itemsInput[];
    connectOrCreate?: Prisma.tasksCreateOrConnectWithoutOrder_itemsInput | Prisma.tasksCreateOrConnectWithoutOrder_itemsInput[];
    createMany?: Prisma.tasksCreateManyOrder_itemsInputEnvelope;
    connect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
};
export type tasksUpdateManyWithoutOrder_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.tasksCreateWithoutOrder_itemsInput, Prisma.tasksUncheckedCreateWithoutOrder_itemsInput> | Prisma.tasksCreateWithoutOrder_itemsInput[] | Prisma.tasksUncheckedCreateWithoutOrder_itemsInput[];
    connectOrCreate?: Prisma.tasksCreateOrConnectWithoutOrder_itemsInput | Prisma.tasksCreateOrConnectWithoutOrder_itemsInput[];
    upsert?: Prisma.tasksUpsertWithWhereUniqueWithoutOrder_itemsInput | Prisma.tasksUpsertWithWhereUniqueWithoutOrder_itemsInput[];
    createMany?: Prisma.tasksCreateManyOrder_itemsInputEnvelope;
    set?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    disconnect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    delete?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    connect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    update?: Prisma.tasksUpdateWithWhereUniqueWithoutOrder_itemsInput | Prisma.tasksUpdateWithWhereUniqueWithoutOrder_itemsInput[];
    updateMany?: Prisma.tasksUpdateManyWithWhereWithoutOrder_itemsInput | Prisma.tasksUpdateManyWithWhereWithoutOrder_itemsInput[];
    deleteMany?: Prisma.tasksScalarWhereInput | Prisma.tasksScalarWhereInput[];
};
export type tasksUncheckedUpdateManyWithoutOrder_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.tasksCreateWithoutOrder_itemsInput, Prisma.tasksUncheckedCreateWithoutOrder_itemsInput> | Prisma.tasksCreateWithoutOrder_itemsInput[] | Prisma.tasksUncheckedCreateWithoutOrder_itemsInput[];
    connectOrCreate?: Prisma.tasksCreateOrConnectWithoutOrder_itemsInput | Prisma.tasksCreateOrConnectWithoutOrder_itemsInput[];
    upsert?: Prisma.tasksUpsertWithWhereUniqueWithoutOrder_itemsInput | Prisma.tasksUpsertWithWhereUniqueWithoutOrder_itemsInput[];
    createMany?: Prisma.tasksCreateManyOrder_itemsInputEnvelope;
    set?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    disconnect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    delete?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    connect?: Prisma.tasksWhereUniqueInput | Prisma.tasksWhereUniqueInput[];
    update?: Prisma.tasksUpdateWithWhereUniqueWithoutOrder_itemsInput | Prisma.tasksUpdateWithWhereUniqueWithoutOrder_itemsInput[];
    updateMany?: Prisma.tasksUpdateManyWithWhereWithoutOrder_itemsInput | Prisma.tasksUpdateManyWithWhereWithoutOrder_itemsInput[];
    deleteMany?: Prisma.tasksScalarWhereInput | Prisma.tasksScalarWhereInput[];
};
export type tasksCreateNestedOneWithoutSupply_usageInput = {
    create?: Prisma.XOR<Prisma.tasksCreateWithoutSupply_usageInput, Prisma.tasksUncheckedCreateWithoutSupply_usageInput>;
    connectOrCreate?: Prisma.tasksCreateOrConnectWithoutSupply_usageInput;
    connect?: Prisma.tasksWhereUniqueInput;
};
export type tasksUpdateOneWithoutSupply_usageNestedInput = {
    create?: Prisma.XOR<Prisma.tasksCreateWithoutSupply_usageInput, Prisma.tasksUncheckedCreateWithoutSupply_usageInput>;
    connectOrCreate?: Prisma.tasksCreateOrConnectWithoutSupply_usageInput;
    upsert?: Prisma.tasksUpsertWithoutSupply_usageInput;
    disconnect?: Prisma.tasksWhereInput | boolean;
    delete?: Prisma.tasksWhereInput | boolean;
    connect?: Prisma.tasksWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.tasksUpdateToOneWithWhereWithoutSupply_usageInput, Prisma.tasksUpdateWithoutSupply_usageInput>, Prisma.tasksUncheckedUpdateWithoutSupply_usageInput>;
};
export type tasksCreateWithoutFarmsInput = {
    id?: string;
    title: string;
    type: string;
    due_date: Date | string;
    status?: string | null;
    priority?: string | null;
    completed_at?: Date | string | null;
    completed_by?: string | null;
    completion_notes?: string | null;
    actual_trays?: number | null;
    seed_lot?: string | null;
    created_at?: Date | string | null;
    supply_usage?: Prisma.supply_usageCreateNestedManyWithoutTasksInput;
    order_items?: Prisma.order_itemsCreateNestedOneWithoutTasksInput;
};
export type tasksUncheckedCreateWithoutFarmsInput = {
    id?: string;
    order_item_id?: string | null;
    title: string;
    type: string;
    due_date: Date | string;
    status?: string | null;
    priority?: string | null;
    completed_at?: Date | string | null;
    completed_by?: string | null;
    completion_notes?: string | null;
    actual_trays?: number | null;
    seed_lot?: string | null;
    created_at?: Date | string | null;
    supply_usage?: Prisma.supply_usageUncheckedCreateNestedManyWithoutTasksInput;
};
export type tasksCreateOrConnectWithoutFarmsInput = {
    where: Prisma.tasksWhereUniqueInput;
    create: Prisma.XOR<Prisma.tasksCreateWithoutFarmsInput, Prisma.tasksUncheckedCreateWithoutFarmsInput>;
};
export type tasksCreateManyFarmsInputEnvelope = {
    data: Prisma.tasksCreateManyFarmsInput | Prisma.tasksCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type tasksUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.tasksWhereUniqueInput;
    update: Prisma.XOR<Prisma.tasksUpdateWithoutFarmsInput, Prisma.tasksUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.tasksCreateWithoutFarmsInput, Prisma.tasksUncheckedCreateWithoutFarmsInput>;
};
export type tasksUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.tasksWhereUniqueInput;
    data: Prisma.XOR<Prisma.tasksUpdateWithoutFarmsInput, Prisma.tasksUncheckedUpdateWithoutFarmsInput>;
};
export type tasksUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.tasksScalarWhereInput;
    data: Prisma.XOR<Prisma.tasksUpdateManyMutationInput, Prisma.tasksUncheckedUpdateManyWithoutFarmsInput>;
};
export type tasksScalarWhereInput = {
    AND?: Prisma.tasksScalarWhereInput | Prisma.tasksScalarWhereInput[];
    OR?: Prisma.tasksScalarWhereInput[];
    NOT?: Prisma.tasksScalarWhereInput | Prisma.tasksScalarWhereInput[];
    id?: Prisma.UuidFilter<"tasks"> | string;
    farm_id?: Prisma.UuidNullableFilter<"tasks"> | string | null;
    order_item_id?: Prisma.UuidNullableFilter<"tasks"> | string | null;
    title?: Prisma.StringFilter<"tasks"> | string;
    type?: Prisma.StringFilter<"tasks"> | string;
    due_date?: Prisma.DateTimeFilter<"tasks"> | Date | string;
    status?: Prisma.StringNullableFilter<"tasks"> | string | null;
    priority?: Prisma.StringNullableFilter<"tasks"> | string | null;
    completed_at?: Prisma.DateTimeNullableFilter<"tasks"> | Date | string | null;
    completed_by?: Prisma.StringNullableFilter<"tasks"> | string | null;
    completion_notes?: Prisma.StringNullableFilter<"tasks"> | string | null;
    actual_trays?: Prisma.IntNullableFilter<"tasks"> | number | null;
    seed_lot?: Prisma.StringNullableFilter<"tasks"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"tasks"> | Date | string | null;
};
export type tasksCreateWithoutOrder_itemsInput = {
    id?: string;
    title: string;
    type: string;
    due_date: Date | string;
    status?: string | null;
    priority?: string | null;
    completed_at?: Date | string | null;
    completed_by?: string | null;
    completion_notes?: string | null;
    actual_trays?: number | null;
    seed_lot?: string | null;
    created_at?: Date | string | null;
    supply_usage?: Prisma.supply_usageCreateNestedManyWithoutTasksInput;
    farms?: Prisma.farmsCreateNestedOneWithoutTasksInput;
};
export type tasksUncheckedCreateWithoutOrder_itemsInput = {
    id?: string;
    farm_id?: string | null;
    title: string;
    type: string;
    due_date: Date | string;
    status?: string | null;
    priority?: string | null;
    completed_at?: Date | string | null;
    completed_by?: string | null;
    completion_notes?: string | null;
    actual_trays?: number | null;
    seed_lot?: string | null;
    created_at?: Date | string | null;
    supply_usage?: Prisma.supply_usageUncheckedCreateNestedManyWithoutTasksInput;
};
export type tasksCreateOrConnectWithoutOrder_itemsInput = {
    where: Prisma.tasksWhereUniqueInput;
    create: Prisma.XOR<Prisma.tasksCreateWithoutOrder_itemsInput, Prisma.tasksUncheckedCreateWithoutOrder_itemsInput>;
};
export type tasksCreateManyOrder_itemsInputEnvelope = {
    data: Prisma.tasksCreateManyOrder_itemsInput | Prisma.tasksCreateManyOrder_itemsInput[];
    skipDuplicates?: boolean;
};
export type tasksUpsertWithWhereUniqueWithoutOrder_itemsInput = {
    where: Prisma.tasksWhereUniqueInput;
    update: Prisma.XOR<Prisma.tasksUpdateWithoutOrder_itemsInput, Prisma.tasksUncheckedUpdateWithoutOrder_itemsInput>;
    create: Prisma.XOR<Prisma.tasksCreateWithoutOrder_itemsInput, Prisma.tasksUncheckedCreateWithoutOrder_itemsInput>;
};
export type tasksUpdateWithWhereUniqueWithoutOrder_itemsInput = {
    where: Prisma.tasksWhereUniqueInput;
    data: Prisma.XOR<Prisma.tasksUpdateWithoutOrder_itemsInput, Prisma.tasksUncheckedUpdateWithoutOrder_itemsInput>;
};
export type tasksUpdateManyWithWhereWithoutOrder_itemsInput = {
    where: Prisma.tasksScalarWhereInput;
    data: Prisma.XOR<Prisma.tasksUpdateManyMutationInput, Prisma.tasksUncheckedUpdateManyWithoutOrder_itemsInput>;
};
export type tasksCreateWithoutSupply_usageInput = {
    id?: string;
    title: string;
    type: string;
    due_date: Date | string;
    status?: string | null;
    priority?: string | null;
    completed_at?: Date | string | null;
    completed_by?: string | null;
    completion_notes?: string | null;
    actual_trays?: number | null;
    seed_lot?: string | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutTasksInput;
    order_items?: Prisma.order_itemsCreateNestedOneWithoutTasksInput;
};
export type tasksUncheckedCreateWithoutSupply_usageInput = {
    id?: string;
    farm_id?: string | null;
    order_item_id?: string | null;
    title: string;
    type: string;
    due_date: Date | string;
    status?: string | null;
    priority?: string | null;
    completed_at?: Date | string | null;
    completed_by?: string | null;
    completion_notes?: string | null;
    actual_trays?: number | null;
    seed_lot?: string | null;
    created_at?: Date | string | null;
};
export type tasksCreateOrConnectWithoutSupply_usageInput = {
    where: Prisma.tasksWhereUniqueInput;
    create: Prisma.XOR<Prisma.tasksCreateWithoutSupply_usageInput, Prisma.tasksUncheckedCreateWithoutSupply_usageInput>;
};
export type tasksUpsertWithoutSupply_usageInput = {
    update: Prisma.XOR<Prisma.tasksUpdateWithoutSupply_usageInput, Prisma.tasksUncheckedUpdateWithoutSupply_usageInput>;
    create: Prisma.XOR<Prisma.tasksCreateWithoutSupply_usageInput, Prisma.tasksUncheckedCreateWithoutSupply_usageInput>;
    where?: Prisma.tasksWhereInput;
};
export type tasksUpdateToOneWithWhereWithoutSupply_usageInput = {
    where?: Prisma.tasksWhereInput;
    data: Prisma.XOR<Prisma.tasksUpdateWithoutSupply_usageInput, Prisma.tasksUncheckedUpdateWithoutSupply_usageInput>;
};
export type tasksUpdateWithoutSupply_usageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutTasksNestedInput;
    order_items?: Prisma.order_itemsUpdateOneWithoutTasksNestedInput;
};
export type tasksUncheckedUpdateWithoutSupply_usageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    order_item_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type tasksCreateManyFarmsInput = {
    id?: string;
    order_item_id?: string | null;
    title: string;
    type: string;
    due_date: Date | string;
    status?: string | null;
    priority?: string | null;
    completed_at?: Date | string | null;
    completed_by?: string | null;
    completion_notes?: string | null;
    actual_trays?: number | null;
    seed_lot?: string | null;
    created_at?: Date | string | null;
};
export type tasksUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_usage?: Prisma.supply_usageUpdateManyWithoutTasksNestedInput;
    order_items?: Prisma.order_itemsUpdateOneWithoutTasksNestedInput;
};
export type tasksUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    order_item_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_usage?: Prisma.supply_usageUncheckedUpdateManyWithoutTasksNestedInput;
};
export type tasksUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    order_item_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type tasksCreateManyOrder_itemsInput = {
    id?: string;
    farm_id?: string | null;
    title: string;
    type: string;
    due_date: Date | string;
    status?: string | null;
    priority?: string | null;
    completed_at?: Date | string | null;
    completed_by?: string | null;
    completion_notes?: string | null;
    actual_trays?: number | null;
    seed_lot?: string | null;
    created_at?: Date | string | null;
};
export type tasksUpdateWithoutOrder_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_usage?: Prisma.supply_usageUpdateManyWithoutTasksNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutTasksNestedInput;
};
export type tasksUncheckedUpdateWithoutOrder_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    supply_usage?: Prisma.supply_usageUncheckedUpdateManyWithoutTasksNestedInput;
};
export type tasksUncheckedUpdateManyWithoutOrder_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    due_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priority?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completion_notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    actual_trays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    seed_lot?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
/**
 * Count Type TasksCountOutputType
 */
export type TasksCountOutputType = {
    supply_usage: number;
};
export type TasksCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supply_usage?: boolean | TasksCountOutputTypeCountSupply_usageArgs;
};
/**
 * TasksCountOutputType without action
 */
export type TasksCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TasksCountOutputType
     */
    select?: Prisma.TasksCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * TasksCountOutputType without action
 */
export type TasksCountOutputTypeCountSupply_usageArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.supply_usageWhereInput;
};
export type tasksSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    order_item_id?: boolean;
    title?: boolean;
    type?: boolean;
    due_date?: boolean;
    status?: boolean;
    priority?: boolean;
    completed_at?: boolean;
    completed_by?: boolean;
    completion_notes?: boolean;
    actual_trays?: boolean;
    seed_lot?: boolean;
    created_at?: boolean;
    supply_usage?: boolean | Prisma.tasks$supply_usageArgs<ExtArgs>;
    farms?: boolean | Prisma.tasks$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.tasks$order_itemsArgs<ExtArgs>;
    _count?: boolean | Prisma.TasksCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tasks"]>;
export type tasksSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    order_item_id?: boolean;
    title?: boolean;
    type?: boolean;
    due_date?: boolean;
    status?: boolean;
    priority?: boolean;
    completed_at?: boolean;
    completed_by?: boolean;
    completion_notes?: boolean;
    actual_trays?: boolean;
    seed_lot?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.tasks$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.tasks$order_itemsArgs<ExtArgs>;
}, ExtArgs["result"]["tasks"]>;
export type tasksSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    order_item_id?: boolean;
    title?: boolean;
    type?: boolean;
    due_date?: boolean;
    status?: boolean;
    priority?: boolean;
    completed_at?: boolean;
    completed_by?: boolean;
    completion_notes?: boolean;
    actual_trays?: boolean;
    seed_lot?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.tasks$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.tasks$order_itemsArgs<ExtArgs>;
}, ExtArgs["result"]["tasks"]>;
export type tasksSelectScalar = {
    id?: boolean;
    farm_id?: boolean;
    order_item_id?: boolean;
    title?: boolean;
    type?: boolean;
    due_date?: boolean;
    status?: boolean;
    priority?: boolean;
    completed_at?: boolean;
    completed_by?: boolean;
    completion_notes?: boolean;
    actual_trays?: boolean;
    seed_lot?: boolean;
    created_at?: boolean;
};
export type tasksOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farm_id" | "order_item_id" | "title" | "type" | "due_date" | "status" | "priority" | "completed_at" | "completed_by" | "completion_notes" | "actual_trays" | "seed_lot" | "created_at", ExtArgs["result"]["tasks"]>;
export type tasksInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    supply_usage?: boolean | Prisma.tasks$supply_usageArgs<ExtArgs>;
    farms?: boolean | Prisma.tasks$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.tasks$order_itemsArgs<ExtArgs>;
    _count?: boolean | Prisma.TasksCountOutputTypeDefaultArgs<ExtArgs>;
};
export type tasksIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.tasks$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.tasks$order_itemsArgs<ExtArgs>;
};
export type tasksIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.tasks$farmsArgs<ExtArgs>;
    order_items?: boolean | Prisma.tasks$order_itemsArgs<ExtArgs>;
};
export type $tasksPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "tasks";
    objects: {
        supply_usage: Prisma.$supply_usagePayload<ExtArgs>[];
        farms: Prisma.$farmsPayload<ExtArgs> | null;
        order_items: Prisma.$order_itemsPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farm_id: string | null;
        order_item_id: string | null;
        title: string;
        type: string;
        due_date: Date;
        status: string | null;
        priority: string | null;
        completed_at: Date | null;
        completed_by: string | null;
        completion_notes: string | null;
        actual_trays: number | null;
        seed_lot: string | null;
        created_at: Date | null;
    }, ExtArgs["result"]["tasks"]>;
    composites: {};
};
export type tasksGetPayload<S extends boolean | null | undefined | tasksDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$tasksPayload, S>;
export type tasksCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<tasksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TasksCountAggregateInputType | true;
};
export interface tasksDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['tasks'];
        meta: {
            name: 'tasks';
        };
    };
    /**
     * Find zero or one Tasks that matches the filter.
     * @param {tasksFindUniqueArgs} args - Arguments to find a Tasks
     * @example
     * // Get one Tasks
     * const tasks = await prisma.tasks.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tasksFindUniqueArgs>(args: Prisma.SelectSubset<T, tasksFindUniqueArgs<ExtArgs>>): Prisma.Prisma__tasksClient<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Tasks that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tasksFindUniqueOrThrowArgs} args - Arguments to find a Tasks
     * @example
     * // Get one Tasks
     * const tasks = await prisma.tasks.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tasksFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, tasksFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__tasksClient<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksFindFirstArgs} args - Arguments to find a Tasks
     * @example
     * // Get one Tasks
     * const tasks = await prisma.tasks.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tasksFindFirstArgs>(args?: Prisma.SelectSubset<T, tasksFindFirstArgs<ExtArgs>>): Prisma.Prisma__tasksClient<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Tasks that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksFindFirstOrThrowArgs} args - Arguments to find a Tasks
     * @example
     * // Get one Tasks
     * const tasks = await prisma.tasks.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tasksFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, tasksFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__tasksClient<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.tasks.findMany()
     *
     * // Get first 10 Tasks
     * const tasks = await prisma.tasks.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const tasksWithIdOnly = await prisma.tasks.findMany({ select: { id: true } })
     *
     */
    findMany<T extends tasksFindManyArgs>(args?: Prisma.SelectSubset<T, tasksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Tasks.
     * @param {tasksCreateArgs} args - Arguments to create a Tasks.
     * @example
     * // Create one Tasks
     * const Tasks = await prisma.tasks.create({
     *   data: {
     *     // ... data to create a Tasks
     *   }
     * })
     *
     */
    create<T extends tasksCreateArgs>(args: Prisma.SelectSubset<T, tasksCreateArgs<ExtArgs>>): Prisma.Prisma__tasksClient<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Tasks.
     * @param {tasksCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const tasks = await prisma.tasks.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends tasksCreateManyArgs>(args?: Prisma.SelectSubset<T, tasksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {tasksCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const tasks = await prisma.tasks.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Tasks and only return the `id`
     * const tasksWithIdOnly = await prisma.tasks.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends tasksCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, tasksCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Tasks.
     * @param {tasksDeleteArgs} args - Arguments to delete one Tasks.
     * @example
     * // Delete one Tasks
     * const Tasks = await prisma.tasks.delete({
     *   where: {
     *     // ... filter to delete one Tasks
     *   }
     * })
     *
     */
    delete<T extends tasksDeleteArgs>(args: Prisma.SelectSubset<T, tasksDeleteArgs<ExtArgs>>): Prisma.Prisma__tasksClient<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Tasks.
     * @param {tasksUpdateArgs} args - Arguments to update one Tasks.
     * @example
     * // Update one Tasks
     * const tasks = await prisma.tasks.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends tasksUpdateArgs>(args: Prisma.SelectSubset<T, tasksUpdateArgs<ExtArgs>>): Prisma.Prisma__tasksClient<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Tasks.
     * @param {tasksDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.tasks.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends tasksDeleteManyArgs>(args?: Prisma.SelectSubset<T, tasksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const tasks = await prisma.tasks.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends tasksUpdateManyArgs>(args: Prisma.SelectSubset<T, tasksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Tasks and returns the data updated in the database.
     * @param {tasksUpdateManyAndReturnArgs} args - Arguments to update many Tasks.
     * @example
     * // Update many Tasks
     * const tasks = await prisma.tasks.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Tasks and only return the `id`
     * const tasksWithIdOnly = await prisma.tasks.updateManyAndReturn({
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
    updateManyAndReturn<T extends tasksUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, tasksUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Tasks.
     * @param {tasksUpsertArgs} args - Arguments to update or create a Tasks.
     * @example
     * // Update or create a Tasks
     * const tasks = await prisma.tasks.upsert({
     *   create: {
     *     // ... data to create a Tasks
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tasks we want to update
     *   }
     * })
     */
    upsert<T extends tasksUpsertArgs>(args: Prisma.SelectSubset<T, tasksUpsertArgs<ExtArgs>>): Prisma.Prisma__tasksClient<runtime.Types.Result.GetResult<Prisma.$tasksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.tasks.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends tasksCountArgs>(args?: Prisma.Subset<T, tasksCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TasksCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TasksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TasksAggregateArgs>(args: Prisma.Subset<T, TasksAggregateArgs>): Prisma.PrismaPromise<GetTasksAggregateType<T>>;
    /**
     * Group by Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tasksGroupByArgs} args - Group by arguments.
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
    groupBy<T extends tasksGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: tasksGroupByArgs['orderBy'];
    } : {
        orderBy?: tasksGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, tasksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTasksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the tasks model
     */
    readonly fields: tasksFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for tasks.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__tasksClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    supply_usage<T extends Prisma.tasks$supply_usageArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.tasks$supply_usageArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$supply_usagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    farms<T extends Prisma.tasks$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.tasks$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    order_items<T extends Prisma.tasks$order_itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.tasks$order_itemsArgs<ExtArgs>>): Prisma.Prisma__order_itemsClient<runtime.Types.Result.GetResult<Prisma.$order_itemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the tasks model
 */
export interface tasksFieldRefs {
    readonly id: Prisma.FieldRef<"tasks", 'String'>;
    readonly farm_id: Prisma.FieldRef<"tasks", 'String'>;
    readonly order_item_id: Prisma.FieldRef<"tasks", 'String'>;
    readonly title: Prisma.FieldRef<"tasks", 'String'>;
    readonly type: Prisma.FieldRef<"tasks", 'String'>;
    readonly due_date: Prisma.FieldRef<"tasks", 'DateTime'>;
    readonly status: Prisma.FieldRef<"tasks", 'String'>;
    readonly priority: Prisma.FieldRef<"tasks", 'String'>;
    readonly completed_at: Prisma.FieldRef<"tasks", 'DateTime'>;
    readonly completed_by: Prisma.FieldRef<"tasks", 'String'>;
    readonly completion_notes: Prisma.FieldRef<"tasks", 'String'>;
    readonly actual_trays: Prisma.FieldRef<"tasks", 'Int'>;
    readonly seed_lot: Prisma.FieldRef<"tasks", 'String'>;
    readonly created_at: Prisma.FieldRef<"tasks", 'DateTime'>;
}
/**
 * tasks findUnique
 */
export type tasksFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which tasks to fetch.
     */
    where: Prisma.tasksWhereUniqueInput;
};
/**
 * tasks findUniqueOrThrow
 */
export type tasksFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which tasks to fetch.
     */
    where: Prisma.tasksWhereUniqueInput;
};
/**
 * tasks findFirst
 */
export type tasksFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which tasks to fetch.
     */
    where?: Prisma.tasksWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of tasks to fetch.
     */
    orderBy?: Prisma.tasksOrderByWithRelationInput | Prisma.tasksOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for tasks.
     */
    cursor?: Prisma.tasksWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` tasks.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of tasks.
     */
    distinct?: Prisma.TasksScalarFieldEnum | Prisma.TasksScalarFieldEnum[];
};
/**
 * tasks findFirstOrThrow
 */
export type tasksFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which tasks to fetch.
     */
    where?: Prisma.tasksWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of tasks to fetch.
     */
    orderBy?: Prisma.tasksOrderByWithRelationInput | Prisma.tasksOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for tasks.
     */
    cursor?: Prisma.tasksWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` tasks.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of tasks.
     */
    distinct?: Prisma.TasksScalarFieldEnum | Prisma.TasksScalarFieldEnum[];
};
/**
 * tasks findMany
 */
export type tasksFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which tasks to fetch.
     */
    where?: Prisma.tasksWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of tasks to fetch.
     */
    orderBy?: Prisma.tasksOrderByWithRelationInput | Prisma.tasksOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing tasks.
     */
    cursor?: Prisma.tasksWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` tasks from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` tasks.
     */
    skip?: number;
    distinct?: Prisma.TasksScalarFieldEnum | Prisma.TasksScalarFieldEnum[];
};
/**
 * tasks create
 */
export type tasksCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a tasks.
     */
    data: Prisma.XOR<Prisma.tasksCreateInput, Prisma.tasksUncheckedCreateInput>;
};
/**
 * tasks createMany
 */
export type tasksCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many tasks.
     */
    data: Prisma.tasksCreateManyInput | Prisma.tasksCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * tasks createManyAndReturn
 */
export type tasksCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: Prisma.tasksSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the tasks
     */
    omit?: Prisma.tasksOmit<ExtArgs> | null;
    /**
     * The data used to create many tasks.
     */
    data: Prisma.tasksCreateManyInput | Prisma.tasksCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.tasksIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * tasks update
 */
export type tasksUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a tasks.
     */
    data: Prisma.XOR<Prisma.tasksUpdateInput, Prisma.tasksUncheckedUpdateInput>;
    /**
     * Choose, which tasks to update.
     */
    where: Prisma.tasksWhereUniqueInput;
};
/**
 * tasks updateMany
 */
export type tasksUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update tasks.
     */
    data: Prisma.XOR<Prisma.tasksUpdateManyMutationInput, Prisma.tasksUncheckedUpdateManyInput>;
    /**
     * Filter which tasks to update
     */
    where?: Prisma.tasksWhereInput;
    /**
     * Limit how many tasks to update.
     */
    limit?: number;
};
/**
 * tasks updateManyAndReturn
 */
export type tasksUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tasks
     */
    select?: Prisma.tasksSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the tasks
     */
    omit?: Prisma.tasksOmit<ExtArgs> | null;
    /**
     * The data used to update tasks.
     */
    data: Prisma.XOR<Prisma.tasksUpdateManyMutationInput, Prisma.tasksUncheckedUpdateManyInput>;
    /**
     * Filter which tasks to update
     */
    where?: Prisma.tasksWhereInput;
    /**
     * Limit how many tasks to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.tasksIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * tasks upsert
 */
export type tasksUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the tasks to update in case it exists.
     */
    where: Prisma.tasksWhereUniqueInput;
    /**
     * In case the tasks found by the `where` argument doesn't exist, create a new tasks with this data.
     */
    create: Prisma.XOR<Prisma.tasksCreateInput, Prisma.tasksUncheckedCreateInput>;
    /**
     * In case the tasks was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.tasksUpdateInput, Prisma.tasksUncheckedUpdateInput>;
};
/**
 * tasks delete
 */
export type tasksDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which tasks to delete.
     */
    where: Prisma.tasksWhereUniqueInput;
};
/**
 * tasks deleteMany
 */
export type tasksDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which tasks to delete
     */
    where?: Prisma.tasksWhereInput;
    /**
     * Limit how many tasks to delete.
     */
    limit?: number;
};
/**
 * tasks.supply_usage
 */
export type tasks$supply_usageArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * tasks.farms
 */
export type tasks$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * tasks.order_items
 */
export type tasks$order_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * tasks without action
 */
export type tasksDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=tasks.d.ts.map