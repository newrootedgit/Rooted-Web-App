import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model recurring_order_schedules
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type recurring_order_schedulesModel = runtime.Types.Result.DefaultSelection<Prisma.$recurring_order_schedulesPayload>;
export type AggregateRecurring_order_schedules = {
    _count: Recurring_order_schedulesCountAggregateOutputType | null;
    _avg: Recurring_order_schedulesAvgAggregateOutputType | null;
    _sum: Recurring_order_schedulesSumAggregateOutputType | null;
    _min: Recurring_order_schedulesMinAggregateOutputType | null;
    _max: Recurring_order_schedulesMaxAggregateOutputType | null;
};
export type Recurring_order_schedulesAvgAggregateOutputType = {
    days_of_week: number | null;
    interval_days: number | null;
    lead_time_days: number | null;
};
export type Recurring_order_schedulesSumAggregateOutputType = {
    days_of_week: number[];
    interval_days: number | null;
    lead_time_days: number | null;
};
export type Recurring_order_schedulesMinAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    customer_id: string | null;
    name: string | null;
    schedule_type: string | null;
    interval_days: number | null;
    start_date: Date | null;
    end_date: Date | null;
    lead_time_days: number | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type Recurring_order_schedulesMaxAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    customer_id: string | null;
    name: string | null;
    schedule_type: string | null;
    interval_days: number | null;
    start_date: Date | null;
    end_date: Date | null;
    lead_time_days: number | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type Recurring_order_schedulesCountAggregateOutputType = {
    id: number;
    farm_id: number;
    customer_id: number;
    name: number;
    schedule_type: number;
    days_of_week: number;
    interval_days: number;
    start_date: number;
    end_date: number;
    lead_time_days: number;
    is_active: number;
    created_at: number;
    _all: number;
};
export type Recurring_order_schedulesAvgAggregateInputType = {
    days_of_week?: true;
    interval_days?: true;
    lead_time_days?: true;
};
export type Recurring_order_schedulesSumAggregateInputType = {
    days_of_week?: true;
    interval_days?: true;
    lead_time_days?: true;
};
export type Recurring_order_schedulesMinAggregateInputType = {
    id?: true;
    farm_id?: true;
    customer_id?: true;
    name?: true;
    schedule_type?: true;
    interval_days?: true;
    start_date?: true;
    end_date?: true;
    lead_time_days?: true;
    is_active?: true;
    created_at?: true;
};
export type Recurring_order_schedulesMaxAggregateInputType = {
    id?: true;
    farm_id?: true;
    customer_id?: true;
    name?: true;
    schedule_type?: true;
    interval_days?: true;
    start_date?: true;
    end_date?: true;
    lead_time_days?: true;
    is_active?: true;
    created_at?: true;
};
export type Recurring_order_schedulesCountAggregateInputType = {
    id?: true;
    farm_id?: true;
    customer_id?: true;
    name?: true;
    schedule_type?: true;
    days_of_week?: true;
    interval_days?: true;
    start_date?: true;
    end_date?: true;
    lead_time_days?: true;
    is_active?: true;
    created_at?: true;
    _all?: true;
};
export type Recurring_order_schedulesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which recurring_order_schedules to aggregate.
     */
    where?: Prisma.recurring_order_schedulesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_order_schedules to fetch.
     */
    orderBy?: Prisma.recurring_order_schedulesOrderByWithRelationInput | Prisma.recurring_order_schedulesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.recurring_order_schedulesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_order_schedules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_order_schedules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned recurring_order_schedules
    **/
    _count?: true | Recurring_order_schedulesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: Recurring_order_schedulesAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: Recurring_order_schedulesSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Recurring_order_schedulesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Recurring_order_schedulesMaxAggregateInputType;
};
export type GetRecurring_order_schedulesAggregateType<T extends Recurring_order_schedulesAggregateArgs> = {
    [P in keyof T & keyof AggregateRecurring_order_schedules]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRecurring_order_schedules[P]> : Prisma.GetScalarType<T[P], AggregateRecurring_order_schedules[P]>;
};
export type recurring_order_schedulesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.recurring_order_schedulesWhereInput;
    orderBy?: Prisma.recurring_order_schedulesOrderByWithAggregationInput | Prisma.recurring_order_schedulesOrderByWithAggregationInput[];
    by: Prisma.Recurring_order_schedulesScalarFieldEnum[] | Prisma.Recurring_order_schedulesScalarFieldEnum;
    having?: Prisma.recurring_order_schedulesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Recurring_order_schedulesCountAggregateInputType | true;
    _avg?: Recurring_order_schedulesAvgAggregateInputType;
    _sum?: Recurring_order_schedulesSumAggregateInputType;
    _min?: Recurring_order_schedulesMinAggregateInputType;
    _max?: Recurring_order_schedulesMaxAggregateInputType;
};
export type Recurring_order_schedulesGroupByOutputType = {
    id: string;
    farm_id: string | null;
    customer_id: string | null;
    name: string;
    schedule_type: string;
    days_of_week: number[];
    interval_days: number | null;
    start_date: Date;
    end_date: Date | null;
    lead_time_days: number | null;
    is_active: boolean | null;
    created_at: Date | null;
    _count: Recurring_order_schedulesCountAggregateOutputType | null;
    _avg: Recurring_order_schedulesAvgAggregateOutputType | null;
    _sum: Recurring_order_schedulesSumAggregateOutputType | null;
    _min: Recurring_order_schedulesMinAggregateOutputType | null;
    _max: Recurring_order_schedulesMaxAggregateOutputType | null;
};
type GetRecurring_order_schedulesGroupByPayload<T extends recurring_order_schedulesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Recurring_order_schedulesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Recurring_order_schedulesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Recurring_order_schedulesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Recurring_order_schedulesGroupByOutputType[P]>;
}>>;
export type recurring_order_schedulesWhereInput = {
    AND?: Prisma.recurring_order_schedulesWhereInput | Prisma.recurring_order_schedulesWhereInput[];
    OR?: Prisma.recurring_order_schedulesWhereInput[];
    NOT?: Prisma.recurring_order_schedulesWhereInput | Prisma.recurring_order_schedulesWhereInput[];
    id?: Prisma.UuidFilter<"recurring_order_schedules"> | string;
    farm_id?: Prisma.UuidNullableFilter<"recurring_order_schedules"> | string | null;
    customer_id?: Prisma.UuidNullableFilter<"recurring_order_schedules"> | string | null;
    name?: Prisma.StringFilter<"recurring_order_schedules"> | string;
    schedule_type?: Prisma.StringFilter<"recurring_order_schedules"> | string;
    days_of_week?: Prisma.IntNullableListFilter<"recurring_order_schedules">;
    interval_days?: Prisma.IntNullableFilter<"recurring_order_schedules"> | number | null;
    start_date?: Prisma.DateTimeFilter<"recurring_order_schedules"> | Date | string;
    end_date?: Prisma.DateTimeNullableFilter<"recurring_order_schedules"> | Date | string | null;
    lead_time_days?: Prisma.IntNullableFilter<"recurring_order_schedules"> | number | null;
    is_active?: Prisma.BoolNullableFilter<"recurring_order_schedules"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"recurring_order_schedules"> | Date | string | null;
    customers?: Prisma.XOR<Prisma.CustomersNullableScalarRelationFilter, Prisma.customersWhereInput> | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
};
export type recurring_order_schedulesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    customer_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    schedule_type?: Prisma.SortOrder;
    days_of_week?: Prisma.SortOrder;
    interval_days?: Prisma.SortOrderInput | Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    lead_time_days?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    customers?: Prisma.customersOrderByWithRelationInput;
    farms?: Prisma.farmsOrderByWithRelationInput;
};
export type recurring_order_schedulesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.recurring_order_schedulesWhereInput | Prisma.recurring_order_schedulesWhereInput[];
    OR?: Prisma.recurring_order_schedulesWhereInput[];
    NOT?: Prisma.recurring_order_schedulesWhereInput | Prisma.recurring_order_schedulesWhereInput[];
    farm_id?: Prisma.UuidNullableFilter<"recurring_order_schedules"> | string | null;
    customer_id?: Prisma.UuidNullableFilter<"recurring_order_schedules"> | string | null;
    name?: Prisma.StringFilter<"recurring_order_schedules"> | string;
    schedule_type?: Prisma.StringFilter<"recurring_order_schedules"> | string;
    days_of_week?: Prisma.IntNullableListFilter<"recurring_order_schedules">;
    interval_days?: Prisma.IntNullableFilter<"recurring_order_schedules"> | number | null;
    start_date?: Prisma.DateTimeFilter<"recurring_order_schedules"> | Date | string;
    end_date?: Prisma.DateTimeNullableFilter<"recurring_order_schedules"> | Date | string | null;
    lead_time_days?: Prisma.IntNullableFilter<"recurring_order_schedules"> | number | null;
    is_active?: Prisma.BoolNullableFilter<"recurring_order_schedules"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"recurring_order_schedules"> | Date | string | null;
    customers?: Prisma.XOR<Prisma.CustomersNullableScalarRelationFilter, Prisma.customersWhereInput> | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
}, "id">;
export type recurring_order_schedulesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    customer_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    schedule_type?: Prisma.SortOrder;
    days_of_week?: Prisma.SortOrder;
    interval_days?: Prisma.SortOrderInput | Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    lead_time_days?: Prisma.SortOrderInput | Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.recurring_order_schedulesCountOrderByAggregateInput;
    _avg?: Prisma.recurring_order_schedulesAvgOrderByAggregateInput;
    _max?: Prisma.recurring_order_schedulesMaxOrderByAggregateInput;
    _min?: Prisma.recurring_order_schedulesMinOrderByAggregateInput;
    _sum?: Prisma.recurring_order_schedulesSumOrderByAggregateInput;
};
export type recurring_order_schedulesScalarWhereWithAggregatesInput = {
    AND?: Prisma.recurring_order_schedulesScalarWhereWithAggregatesInput | Prisma.recurring_order_schedulesScalarWhereWithAggregatesInput[];
    OR?: Prisma.recurring_order_schedulesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.recurring_order_schedulesScalarWhereWithAggregatesInput | Prisma.recurring_order_schedulesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"recurring_order_schedules"> | string;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"recurring_order_schedules"> | string | null;
    customer_id?: Prisma.UuidNullableWithAggregatesFilter<"recurring_order_schedules"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"recurring_order_schedules"> | string;
    schedule_type?: Prisma.StringWithAggregatesFilter<"recurring_order_schedules"> | string;
    days_of_week?: Prisma.IntNullableListFilter<"recurring_order_schedules">;
    interval_days?: Prisma.IntNullableWithAggregatesFilter<"recurring_order_schedules"> | number | null;
    start_date?: Prisma.DateTimeWithAggregatesFilter<"recurring_order_schedules"> | Date | string;
    end_date?: Prisma.DateTimeNullableWithAggregatesFilter<"recurring_order_schedules"> | Date | string | null;
    lead_time_days?: Prisma.IntNullableWithAggregatesFilter<"recurring_order_schedules"> | number | null;
    is_active?: Prisma.BoolNullableWithAggregatesFilter<"recurring_order_schedules"> | boolean | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"recurring_order_schedules"> | Date | string | null;
};
export type recurring_order_schedulesCreateInput = {
    id?: string;
    name: string;
    schedule_type: string;
    days_of_week?: Prisma.recurring_order_schedulesCreatedays_of_weekInput | number[];
    interval_days?: number | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    lead_time_days?: number | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    customers?: Prisma.customersCreateNestedOneWithoutRecurring_order_schedulesInput;
    farms?: Prisma.farmsCreateNestedOneWithoutRecurring_order_schedulesInput;
};
export type recurring_order_schedulesUncheckedCreateInput = {
    id?: string;
    farm_id?: string | null;
    customer_id?: string | null;
    name: string;
    schedule_type: string;
    days_of_week?: Prisma.recurring_order_schedulesCreatedays_of_weekInput | number[];
    interval_days?: number | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    lead_time_days?: number | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type recurring_order_schedulesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule_type?: Prisma.StringFieldUpdateOperationsInput | string;
    days_of_week?: Prisma.recurring_order_schedulesUpdatedays_of_weekInput | number[];
    interval_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lead_time_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    customers?: Prisma.customersUpdateOneWithoutRecurring_order_schedulesNestedInput;
    farms?: Prisma.farmsUpdateOneWithoutRecurring_order_schedulesNestedInput;
};
export type recurring_order_schedulesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule_type?: Prisma.StringFieldUpdateOperationsInput | string;
    days_of_week?: Prisma.recurring_order_schedulesUpdatedays_of_weekInput | number[];
    interval_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lead_time_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_order_schedulesCreateManyInput = {
    id?: string;
    farm_id?: string | null;
    customer_id?: string | null;
    name: string;
    schedule_type: string;
    days_of_week?: Prisma.recurring_order_schedulesCreatedays_of_weekInput | number[];
    interval_days?: number | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    lead_time_days?: number | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type recurring_order_schedulesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule_type?: Prisma.StringFieldUpdateOperationsInput | string;
    days_of_week?: Prisma.recurring_order_schedulesUpdatedays_of_weekInput | number[];
    interval_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lead_time_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_order_schedulesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule_type?: Prisma.StringFieldUpdateOperationsInput | string;
    days_of_week?: Prisma.recurring_order_schedulesUpdatedays_of_weekInput | number[];
    interval_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lead_time_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type Recurring_order_schedulesListRelationFilter = {
    every?: Prisma.recurring_order_schedulesWhereInput;
    some?: Prisma.recurring_order_schedulesWhereInput;
    none?: Prisma.recurring_order_schedulesWhereInput;
};
export type recurring_order_schedulesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type IntNullableListFilter<$PrismaModel = never> = {
    equals?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    has?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    hasEvery?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    hasSome?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type recurring_order_schedulesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    customer_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    schedule_type?: Prisma.SortOrder;
    days_of_week?: Prisma.SortOrder;
    interval_days?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    lead_time_days?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type recurring_order_schedulesAvgOrderByAggregateInput = {
    days_of_week?: Prisma.SortOrder;
    interval_days?: Prisma.SortOrder;
    lead_time_days?: Prisma.SortOrder;
};
export type recurring_order_schedulesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    customer_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    schedule_type?: Prisma.SortOrder;
    interval_days?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    lead_time_days?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type recurring_order_schedulesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    customer_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    schedule_type?: Prisma.SortOrder;
    interval_days?: Prisma.SortOrder;
    start_date?: Prisma.SortOrder;
    end_date?: Prisma.SortOrder;
    lead_time_days?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type recurring_order_schedulesSumOrderByAggregateInput = {
    days_of_week?: Prisma.SortOrder;
    interval_days?: Prisma.SortOrder;
    lead_time_days?: Prisma.SortOrder;
};
export type recurring_order_schedulesCreateNestedManyWithoutCustomersInput = {
    create?: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutCustomersInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutCustomersInput> | Prisma.recurring_order_schedulesCreateWithoutCustomersInput[] | Prisma.recurring_order_schedulesUncheckedCreateWithoutCustomersInput[];
    connectOrCreate?: Prisma.recurring_order_schedulesCreateOrConnectWithoutCustomersInput | Prisma.recurring_order_schedulesCreateOrConnectWithoutCustomersInput[];
    createMany?: Prisma.recurring_order_schedulesCreateManyCustomersInputEnvelope;
    connect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
};
export type recurring_order_schedulesUncheckedCreateNestedManyWithoutCustomersInput = {
    create?: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutCustomersInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutCustomersInput> | Prisma.recurring_order_schedulesCreateWithoutCustomersInput[] | Prisma.recurring_order_schedulesUncheckedCreateWithoutCustomersInput[];
    connectOrCreate?: Prisma.recurring_order_schedulesCreateOrConnectWithoutCustomersInput | Prisma.recurring_order_schedulesCreateOrConnectWithoutCustomersInput[];
    createMany?: Prisma.recurring_order_schedulesCreateManyCustomersInputEnvelope;
    connect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
};
export type recurring_order_schedulesUpdateManyWithoutCustomersNestedInput = {
    create?: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutCustomersInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutCustomersInput> | Prisma.recurring_order_schedulesCreateWithoutCustomersInput[] | Prisma.recurring_order_schedulesUncheckedCreateWithoutCustomersInput[];
    connectOrCreate?: Prisma.recurring_order_schedulesCreateOrConnectWithoutCustomersInput | Prisma.recurring_order_schedulesCreateOrConnectWithoutCustomersInput[];
    upsert?: Prisma.recurring_order_schedulesUpsertWithWhereUniqueWithoutCustomersInput | Prisma.recurring_order_schedulesUpsertWithWhereUniqueWithoutCustomersInput[];
    createMany?: Prisma.recurring_order_schedulesCreateManyCustomersInputEnvelope;
    set?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    disconnect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    delete?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    connect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    update?: Prisma.recurring_order_schedulesUpdateWithWhereUniqueWithoutCustomersInput | Prisma.recurring_order_schedulesUpdateWithWhereUniqueWithoutCustomersInput[];
    updateMany?: Prisma.recurring_order_schedulesUpdateManyWithWhereWithoutCustomersInput | Prisma.recurring_order_schedulesUpdateManyWithWhereWithoutCustomersInput[];
    deleteMany?: Prisma.recurring_order_schedulesScalarWhereInput | Prisma.recurring_order_schedulesScalarWhereInput[];
};
export type recurring_order_schedulesUncheckedUpdateManyWithoutCustomersNestedInput = {
    create?: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutCustomersInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutCustomersInput> | Prisma.recurring_order_schedulesCreateWithoutCustomersInput[] | Prisma.recurring_order_schedulesUncheckedCreateWithoutCustomersInput[];
    connectOrCreate?: Prisma.recurring_order_schedulesCreateOrConnectWithoutCustomersInput | Prisma.recurring_order_schedulesCreateOrConnectWithoutCustomersInput[];
    upsert?: Prisma.recurring_order_schedulesUpsertWithWhereUniqueWithoutCustomersInput | Prisma.recurring_order_schedulesUpsertWithWhereUniqueWithoutCustomersInput[];
    createMany?: Prisma.recurring_order_schedulesCreateManyCustomersInputEnvelope;
    set?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    disconnect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    delete?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    connect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    update?: Prisma.recurring_order_schedulesUpdateWithWhereUniqueWithoutCustomersInput | Prisma.recurring_order_schedulesUpdateWithWhereUniqueWithoutCustomersInput[];
    updateMany?: Prisma.recurring_order_schedulesUpdateManyWithWhereWithoutCustomersInput | Prisma.recurring_order_schedulesUpdateManyWithWhereWithoutCustomersInput[];
    deleteMany?: Prisma.recurring_order_schedulesScalarWhereInput | Prisma.recurring_order_schedulesScalarWhereInput[];
};
export type recurring_order_schedulesCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutFarmsInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutFarmsInput> | Prisma.recurring_order_schedulesCreateWithoutFarmsInput[] | Prisma.recurring_order_schedulesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.recurring_order_schedulesCreateOrConnectWithoutFarmsInput | Prisma.recurring_order_schedulesCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.recurring_order_schedulesCreateManyFarmsInputEnvelope;
    connect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
};
export type recurring_order_schedulesUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutFarmsInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutFarmsInput> | Prisma.recurring_order_schedulesCreateWithoutFarmsInput[] | Prisma.recurring_order_schedulesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.recurring_order_schedulesCreateOrConnectWithoutFarmsInput | Prisma.recurring_order_schedulesCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.recurring_order_schedulesCreateManyFarmsInputEnvelope;
    connect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
};
export type recurring_order_schedulesUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutFarmsInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutFarmsInput> | Prisma.recurring_order_schedulesCreateWithoutFarmsInput[] | Prisma.recurring_order_schedulesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.recurring_order_schedulesCreateOrConnectWithoutFarmsInput | Prisma.recurring_order_schedulesCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.recurring_order_schedulesUpsertWithWhereUniqueWithoutFarmsInput | Prisma.recurring_order_schedulesUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.recurring_order_schedulesCreateManyFarmsInputEnvelope;
    set?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    disconnect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    delete?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    connect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    update?: Prisma.recurring_order_schedulesUpdateWithWhereUniqueWithoutFarmsInput | Prisma.recurring_order_schedulesUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.recurring_order_schedulesUpdateManyWithWhereWithoutFarmsInput | Prisma.recurring_order_schedulesUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.recurring_order_schedulesScalarWhereInput | Prisma.recurring_order_schedulesScalarWhereInput[];
};
export type recurring_order_schedulesUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutFarmsInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutFarmsInput> | Prisma.recurring_order_schedulesCreateWithoutFarmsInput[] | Prisma.recurring_order_schedulesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.recurring_order_schedulesCreateOrConnectWithoutFarmsInput | Prisma.recurring_order_schedulesCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.recurring_order_schedulesUpsertWithWhereUniqueWithoutFarmsInput | Prisma.recurring_order_schedulesUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.recurring_order_schedulesCreateManyFarmsInputEnvelope;
    set?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    disconnect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    delete?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    connect?: Prisma.recurring_order_schedulesWhereUniqueInput | Prisma.recurring_order_schedulesWhereUniqueInput[];
    update?: Prisma.recurring_order_schedulesUpdateWithWhereUniqueWithoutFarmsInput | Prisma.recurring_order_schedulesUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.recurring_order_schedulesUpdateManyWithWhereWithoutFarmsInput | Prisma.recurring_order_schedulesUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.recurring_order_schedulesScalarWhereInput | Prisma.recurring_order_schedulesScalarWhereInput[];
};
export type recurring_order_schedulesCreatedays_of_weekInput = {
    set: number[];
};
export type recurring_order_schedulesUpdatedays_of_weekInput = {
    set?: number[];
    push?: number | number[];
};
export type recurring_order_schedulesCreateWithoutCustomersInput = {
    id?: string;
    name: string;
    schedule_type: string;
    days_of_week?: Prisma.recurring_order_schedulesCreatedays_of_weekInput | number[];
    interval_days?: number | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    lead_time_days?: number | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutRecurring_order_schedulesInput;
};
export type recurring_order_schedulesUncheckedCreateWithoutCustomersInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    schedule_type: string;
    days_of_week?: Prisma.recurring_order_schedulesCreatedays_of_weekInput | number[];
    interval_days?: number | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    lead_time_days?: number | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type recurring_order_schedulesCreateOrConnectWithoutCustomersInput = {
    where: Prisma.recurring_order_schedulesWhereUniqueInput;
    create: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutCustomersInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutCustomersInput>;
};
export type recurring_order_schedulesCreateManyCustomersInputEnvelope = {
    data: Prisma.recurring_order_schedulesCreateManyCustomersInput | Prisma.recurring_order_schedulesCreateManyCustomersInput[];
    skipDuplicates?: boolean;
};
export type recurring_order_schedulesUpsertWithWhereUniqueWithoutCustomersInput = {
    where: Prisma.recurring_order_schedulesWhereUniqueInput;
    update: Prisma.XOR<Prisma.recurring_order_schedulesUpdateWithoutCustomersInput, Prisma.recurring_order_schedulesUncheckedUpdateWithoutCustomersInput>;
    create: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutCustomersInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutCustomersInput>;
};
export type recurring_order_schedulesUpdateWithWhereUniqueWithoutCustomersInput = {
    where: Prisma.recurring_order_schedulesWhereUniqueInput;
    data: Prisma.XOR<Prisma.recurring_order_schedulesUpdateWithoutCustomersInput, Prisma.recurring_order_schedulesUncheckedUpdateWithoutCustomersInput>;
};
export type recurring_order_schedulesUpdateManyWithWhereWithoutCustomersInput = {
    where: Prisma.recurring_order_schedulesScalarWhereInput;
    data: Prisma.XOR<Prisma.recurring_order_schedulesUpdateManyMutationInput, Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutCustomersInput>;
};
export type recurring_order_schedulesScalarWhereInput = {
    AND?: Prisma.recurring_order_schedulesScalarWhereInput | Prisma.recurring_order_schedulesScalarWhereInput[];
    OR?: Prisma.recurring_order_schedulesScalarWhereInput[];
    NOT?: Prisma.recurring_order_schedulesScalarWhereInput | Prisma.recurring_order_schedulesScalarWhereInput[];
    id?: Prisma.UuidFilter<"recurring_order_schedules"> | string;
    farm_id?: Prisma.UuidNullableFilter<"recurring_order_schedules"> | string | null;
    customer_id?: Prisma.UuidNullableFilter<"recurring_order_schedules"> | string | null;
    name?: Prisma.StringFilter<"recurring_order_schedules"> | string;
    schedule_type?: Prisma.StringFilter<"recurring_order_schedules"> | string;
    days_of_week?: Prisma.IntNullableListFilter<"recurring_order_schedules">;
    interval_days?: Prisma.IntNullableFilter<"recurring_order_schedules"> | number | null;
    start_date?: Prisma.DateTimeFilter<"recurring_order_schedules"> | Date | string;
    end_date?: Prisma.DateTimeNullableFilter<"recurring_order_schedules"> | Date | string | null;
    lead_time_days?: Prisma.IntNullableFilter<"recurring_order_schedules"> | number | null;
    is_active?: Prisma.BoolNullableFilter<"recurring_order_schedules"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"recurring_order_schedules"> | Date | string | null;
};
export type recurring_order_schedulesCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    schedule_type: string;
    days_of_week?: Prisma.recurring_order_schedulesCreatedays_of_weekInput | number[];
    interval_days?: number | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    lead_time_days?: number | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    customers?: Prisma.customersCreateNestedOneWithoutRecurring_order_schedulesInput;
};
export type recurring_order_schedulesUncheckedCreateWithoutFarmsInput = {
    id?: string;
    customer_id?: string | null;
    name: string;
    schedule_type: string;
    days_of_week?: Prisma.recurring_order_schedulesCreatedays_of_weekInput | number[];
    interval_days?: number | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    lead_time_days?: number | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type recurring_order_schedulesCreateOrConnectWithoutFarmsInput = {
    where: Prisma.recurring_order_schedulesWhereUniqueInput;
    create: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutFarmsInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutFarmsInput>;
};
export type recurring_order_schedulesCreateManyFarmsInputEnvelope = {
    data: Prisma.recurring_order_schedulesCreateManyFarmsInput | Prisma.recurring_order_schedulesCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type recurring_order_schedulesUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.recurring_order_schedulesWhereUniqueInput;
    update: Prisma.XOR<Prisma.recurring_order_schedulesUpdateWithoutFarmsInput, Prisma.recurring_order_schedulesUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.recurring_order_schedulesCreateWithoutFarmsInput, Prisma.recurring_order_schedulesUncheckedCreateWithoutFarmsInput>;
};
export type recurring_order_schedulesUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.recurring_order_schedulesWhereUniqueInput;
    data: Prisma.XOR<Prisma.recurring_order_schedulesUpdateWithoutFarmsInput, Prisma.recurring_order_schedulesUncheckedUpdateWithoutFarmsInput>;
};
export type recurring_order_schedulesUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.recurring_order_schedulesScalarWhereInput;
    data: Prisma.XOR<Prisma.recurring_order_schedulesUpdateManyMutationInput, Prisma.recurring_order_schedulesUncheckedUpdateManyWithoutFarmsInput>;
};
export type recurring_order_schedulesCreateManyCustomersInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    schedule_type: string;
    days_of_week?: Prisma.recurring_order_schedulesCreatedays_of_weekInput | number[];
    interval_days?: number | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    lead_time_days?: number | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type recurring_order_schedulesUpdateWithoutCustomersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule_type?: Prisma.StringFieldUpdateOperationsInput | string;
    days_of_week?: Prisma.recurring_order_schedulesUpdatedays_of_weekInput | number[];
    interval_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lead_time_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutRecurring_order_schedulesNestedInput;
};
export type recurring_order_schedulesUncheckedUpdateWithoutCustomersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule_type?: Prisma.StringFieldUpdateOperationsInput | string;
    days_of_week?: Prisma.recurring_order_schedulesUpdatedays_of_weekInput | number[];
    interval_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lead_time_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_order_schedulesUncheckedUpdateManyWithoutCustomersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule_type?: Prisma.StringFieldUpdateOperationsInput | string;
    days_of_week?: Prisma.recurring_order_schedulesUpdatedays_of_weekInput | number[];
    interval_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lead_time_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_order_schedulesCreateManyFarmsInput = {
    id?: string;
    customer_id?: string | null;
    name: string;
    schedule_type: string;
    days_of_week?: Prisma.recurring_order_schedulesCreatedays_of_weekInput | number[];
    interval_days?: number | null;
    start_date: Date | string;
    end_date?: Date | string | null;
    lead_time_days?: number | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type recurring_order_schedulesUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule_type?: Prisma.StringFieldUpdateOperationsInput | string;
    days_of_week?: Prisma.recurring_order_schedulesUpdatedays_of_weekInput | number[];
    interval_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lead_time_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    customers?: Prisma.customersUpdateOneWithoutRecurring_order_schedulesNestedInput;
};
export type recurring_order_schedulesUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule_type?: Prisma.StringFieldUpdateOperationsInput | string;
    days_of_week?: Prisma.recurring_order_schedulesUpdatedays_of_weekInput | number[];
    interval_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lead_time_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_order_schedulesUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule_type?: Prisma.StringFieldUpdateOperationsInput | string;
    days_of_week?: Prisma.recurring_order_schedulesUpdatedays_of_weekInput | number[];
    interval_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    start_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    end_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lead_time_days?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type recurring_order_schedulesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    customer_id?: boolean;
    name?: boolean;
    schedule_type?: boolean;
    days_of_week?: boolean;
    interval_days?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    lead_time_days?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    customers?: boolean | Prisma.recurring_order_schedules$customersArgs<ExtArgs>;
    farms?: boolean | Prisma.recurring_order_schedules$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["recurring_order_schedules"]>;
export type recurring_order_schedulesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    customer_id?: boolean;
    name?: boolean;
    schedule_type?: boolean;
    days_of_week?: boolean;
    interval_days?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    lead_time_days?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    customers?: boolean | Prisma.recurring_order_schedules$customersArgs<ExtArgs>;
    farms?: boolean | Prisma.recurring_order_schedules$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["recurring_order_schedules"]>;
export type recurring_order_schedulesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    customer_id?: boolean;
    name?: boolean;
    schedule_type?: boolean;
    days_of_week?: boolean;
    interval_days?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    lead_time_days?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    customers?: boolean | Prisma.recurring_order_schedules$customersArgs<ExtArgs>;
    farms?: boolean | Prisma.recurring_order_schedules$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["recurring_order_schedules"]>;
export type recurring_order_schedulesSelectScalar = {
    id?: boolean;
    farm_id?: boolean;
    customer_id?: boolean;
    name?: boolean;
    schedule_type?: boolean;
    days_of_week?: boolean;
    interval_days?: boolean;
    start_date?: boolean;
    end_date?: boolean;
    lead_time_days?: boolean;
    is_active?: boolean;
    created_at?: boolean;
};
export type recurring_order_schedulesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farm_id" | "customer_id" | "name" | "schedule_type" | "days_of_week" | "interval_days" | "start_date" | "end_date" | "lead_time_days" | "is_active" | "created_at", ExtArgs["result"]["recurring_order_schedules"]>;
export type recurring_order_schedulesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customers?: boolean | Prisma.recurring_order_schedules$customersArgs<ExtArgs>;
    farms?: boolean | Prisma.recurring_order_schedules$farmsArgs<ExtArgs>;
};
export type recurring_order_schedulesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customers?: boolean | Prisma.recurring_order_schedules$customersArgs<ExtArgs>;
    farms?: boolean | Prisma.recurring_order_schedules$farmsArgs<ExtArgs>;
};
export type recurring_order_schedulesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customers?: boolean | Prisma.recurring_order_schedules$customersArgs<ExtArgs>;
    farms?: boolean | Prisma.recurring_order_schedules$farmsArgs<ExtArgs>;
};
export type $recurring_order_schedulesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "recurring_order_schedules";
    objects: {
        customers: Prisma.$customersPayload<ExtArgs> | null;
        farms: Prisma.$farmsPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farm_id: string | null;
        customer_id: string | null;
        name: string;
        schedule_type: string;
        days_of_week: number[];
        interval_days: number | null;
        start_date: Date;
        end_date: Date | null;
        lead_time_days: number | null;
        is_active: boolean | null;
        created_at: Date | null;
    }, ExtArgs["result"]["recurring_order_schedules"]>;
    composites: {};
};
export type recurring_order_schedulesGetPayload<S extends boolean | null | undefined | recurring_order_schedulesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload, S>;
export type recurring_order_schedulesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<recurring_order_schedulesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Recurring_order_schedulesCountAggregateInputType | true;
};
export interface recurring_order_schedulesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['recurring_order_schedules'];
        meta: {
            name: 'recurring_order_schedules';
        };
    };
    /**
     * Find zero or one Recurring_order_schedules that matches the filter.
     * @param {recurring_order_schedulesFindUniqueArgs} args - Arguments to find a Recurring_order_schedules
     * @example
     * // Get one Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends recurring_order_schedulesFindUniqueArgs>(args: Prisma.SelectSubset<T, recurring_order_schedulesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__recurring_order_schedulesClient<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Recurring_order_schedules that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {recurring_order_schedulesFindUniqueOrThrowArgs} args - Arguments to find a Recurring_order_schedules
     * @example
     * // Get one Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends recurring_order_schedulesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, recurring_order_schedulesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__recurring_order_schedulesClient<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Recurring_order_schedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_order_schedulesFindFirstArgs} args - Arguments to find a Recurring_order_schedules
     * @example
     * // Get one Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends recurring_order_schedulesFindFirstArgs>(args?: Prisma.SelectSubset<T, recurring_order_schedulesFindFirstArgs<ExtArgs>>): Prisma.Prisma__recurring_order_schedulesClient<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Recurring_order_schedules that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_order_schedulesFindFirstOrThrowArgs} args - Arguments to find a Recurring_order_schedules
     * @example
     * // Get one Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends recurring_order_schedulesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, recurring_order_schedulesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__recurring_order_schedulesClient<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Recurring_order_schedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_order_schedulesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.findMany()
     *
     * // Get first 10 Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const recurring_order_schedulesWithIdOnly = await prisma.recurring_order_schedules.findMany({ select: { id: true } })
     *
     */
    findMany<T extends recurring_order_schedulesFindManyArgs>(args?: Prisma.SelectSubset<T, recurring_order_schedulesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Recurring_order_schedules.
     * @param {recurring_order_schedulesCreateArgs} args - Arguments to create a Recurring_order_schedules.
     * @example
     * // Create one Recurring_order_schedules
     * const Recurring_order_schedules = await prisma.recurring_order_schedules.create({
     *   data: {
     *     // ... data to create a Recurring_order_schedules
     *   }
     * })
     *
     */
    create<T extends recurring_order_schedulesCreateArgs>(args: Prisma.SelectSubset<T, recurring_order_schedulesCreateArgs<ExtArgs>>): Prisma.Prisma__recurring_order_schedulesClient<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Recurring_order_schedules.
     * @param {recurring_order_schedulesCreateManyArgs} args - Arguments to create many Recurring_order_schedules.
     * @example
     * // Create many Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends recurring_order_schedulesCreateManyArgs>(args?: Prisma.SelectSubset<T, recurring_order_schedulesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Recurring_order_schedules and returns the data saved in the database.
     * @param {recurring_order_schedulesCreateManyAndReturnArgs} args - Arguments to create many Recurring_order_schedules.
     * @example
     * // Create many Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Recurring_order_schedules and only return the `id`
     * const recurring_order_schedulesWithIdOnly = await prisma.recurring_order_schedules.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends recurring_order_schedulesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, recurring_order_schedulesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Recurring_order_schedules.
     * @param {recurring_order_schedulesDeleteArgs} args - Arguments to delete one Recurring_order_schedules.
     * @example
     * // Delete one Recurring_order_schedules
     * const Recurring_order_schedules = await prisma.recurring_order_schedules.delete({
     *   where: {
     *     // ... filter to delete one Recurring_order_schedules
     *   }
     * })
     *
     */
    delete<T extends recurring_order_schedulesDeleteArgs>(args: Prisma.SelectSubset<T, recurring_order_schedulesDeleteArgs<ExtArgs>>): Prisma.Prisma__recurring_order_schedulesClient<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Recurring_order_schedules.
     * @param {recurring_order_schedulesUpdateArgs} args - Arguments to update one Recurring_order_schedules.
     * @example
     * // Update one Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends recurring_order_schedulesUpdateArgs>(args: Prisma.SelectSubset<T, recurring_order_schedulesUpdateArgs<ExtArgs>>): Prisma.Prisma__recurring_order_schedulesClient<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Recurring_order_schedules.
     * @param {recurring_order_schedulesDeleteManyArgs} args - Arguments to filter Recurring_order_schedules to delete.
     * @example
     * // Delete a few Recurring_order_schedules
     * const { count } = await prisma.recurring_order_schedules.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends recurring_order_schedulesDeleteManyArgs>(args?: Prisma.SelectSubset<T, recurring_order_schedulesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Recurring_order_schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_order_schedulesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends recurring_order_schedulesUpdateManyArgs>(args: Prisma.SelectSubset<T, recurring_order_schedulesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Recurring_order_schedules and returns the data updated in the database.
     * @param {recurring_order_schedulesUpdateManyAndReturnArgs} args - Arguments to update many Recurring_order_schedules.
     * @example
     * // Update many Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Recurring_order_schedules and only return the `id`
     * const recurring_order_schedulesWithIdOnly = await prisma.recurring_order_schedules.updateManyAndReturn({
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
    updateManyAndReturn<T extends recurring_order_schedulesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, recurring_order_schedulesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Recurring_order_schedules.
     * @param {recurring_order_schedulesUpsertArgs} args - Arguments to update or create a Recurring_order_schedules.
     * @example
     * // Update or create a Recurring_order_schedules
     * const recurring_order_schedules = await prisma.recurring_order_schedules.upsert({
     *   create: {
     *     // ... data to create a Recurring_order_schedules
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Recurring_order_schedules we want to update
     *   }
     * })
     */
    upsert<T extends recurring_order_schedulesUpsertArgs>(args: Prisma.SelectSubset<T, recurring_order_schedulesUpsertArgs<ExtArgs>>): Prisma.Prisma__recurring_order_schedulesClient<runtime.Types.Result.GetResult<Prisma.$recurring_order_schedulesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Recurring_order_schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_order_schedulesCountArgs} args - Arguments to filter Recurring_order_schedules to count.
     * @example
     * // Count the number of Recurring_order_schedules
     * const count = await prisma.recurring_order_schedules.count({
     *   where: {
     *     // ... the filter for the Recurring_order_schedules we want to count
     *   }
     * })
    **/
    count<T extends recurring_order_schedulesCountArgs>(args?: Prisma.Subset<T, recurring_order_schedulesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Recurring_order_schedulesCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Recurring_order_schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Recurring_order_schedulesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Recurring_order_schedulesAggregateArgs>(args: Prisma.Subset<T, Recurring_order_schedulesAggregateArgs>): Prisma.PrismaPromise<GetRecurring_order_schedulesAggregateType<T>>;
    /**
     * Group by Recurring_order_schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {recurring_order_schedulesGroupByArgs} args - Group by arguments.
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
    groupBy<T extends recurring_order_schedulesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: recurring_order_schedulesGroupByArgs['orderBy'];
    } : {
        orderBy?: recurring_order_schedulesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, recurring_order_schedulesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecurring_order_schedulesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the recurring_order_schedules model
     */
    readonly fields: recurring_order_schedulesFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for recurring_order_schedules.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__recurring_order_schedulesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customers<T extends Prisma.recurring_order_schedules$customersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.recurring_order_schedules$customersArgs<ExtArgs>>): Prisma.Prisma__customersClient<runtime.Types.Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    farms<T extends Prisma.recurring_order_schedules$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.recurring_order_schedules$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the recurring_order_schedules model
 */
export interface recurring_order_schedulesFieldRefs {
    readonly id: Prisma.FieldRef<"recurring_order_schedules", 'String'>;
    readonly farm_id: Prisma.FieldRef<"recurring_order_schedules", 'String'>;
    readonly customer_id: Prisma.FieldRef<"recurring_order_schedules", 'String'>;
    readonly name: Prisma.FieldRef<"recurring_order_schedules", 'String'>;
    readonly schedule_type: Prisma.FieldRef<"recurring_order_schedules", 'String'>;
    readonly days_of_week: Prisma.FieldRef<"recurring_order_schedules", 'Int[]'>;
    readonly interval_days: Prisma.FieldRef<"recurring_order_schedules", 'Int'>;
    readonly start_date: Prisma.FieldRef<"recurring_order_schedules", 'DateTime'>;
    readonly end_date: Prisma.FieldRef<"recurring_order_schedules", 'DateTime'>;
    readonly lead_time_days: Prisma.FieldRef<"recurring_order_schedules", 'Int'>;
    readonly is_active: Prisma.FieldRef<"recurring_order_schedules", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"recurring_order_schedules", 'DateTime'>;
}
/**
 * recurring_order_schedules findUnique
 */
export type recurring_order_schedulesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesInclude<ExtArgs> | null;
    /**
     * Filter, which recurring_order_schedules to fetch.
     */
    where: Prisma.recurring_order_schedulesWhereUniqueInput;
};
/**
 * recurring_order_schedules findUniqueOrThrow
 */
export type recurring_order_schedulesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesInclude<ExtArgs> | null;
    /**
     * Filter, which recurring_order_schedules to fetch.
     */
    where: Prisma.recurring_order_schedulesWhereUniqueInput;
};
/**
 * recurring_order_schedules findFirst
 */
export type recurring_order_schedulesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesInclude<ExtArgs> | null;
    /**
     * Filter, which recurring_order_schedules to fetch.
     */
    where?: Prisma.recurring_order_schedulesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_order_schedules to fetch.
     */
    orderBy?: Prisma.recurring_order_schedulesOrderByWithRelationInput | Prisma.recurring_order_schedulesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for recurring_order_schedules.
     */
    cursor?: Prisma.recurring_order_schedulesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_order_schedules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_order_schedules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of recurring_order_schedules.
     */
    distinct?: Prisma.Recurring_order_schedulesScalarFieldEnum | Prisma.Recurring_order_schedulesScalarFieldEnum[];
};
/**
 * recurring_order_schedules findFirstOrThrow
 */
export type recurring_order_schedulesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesInclude<ExtArgs> | null;
    /**
     * Filter, which recurring_order_schedules to fetch.
     */
    where?: Prisma.recurring_order_schedulesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_order_schedules to fetch.
     */
    orderBy?: Prisma.recurring_order_schedulesOrderByWithRelationInput | Prisma.recurring_order_schedulesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for recurring_order_schedules.
     */
    cursor?: Prisma.recurring_order_schedulesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_order_schedules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_order_schedules.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of recurring_order_schedules.
     */
    distinct?: Prisma.Recurring_order_schedulesScalarFieldEnum | Prisma.Recurring_order_schedulesScalarFieldEnum[];
};
/**
 * recurring_order_schedules findMany
 */
export type recurring_order_schedulesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesInclude<ExtArgs> | null;
    /**
     * Filter, which recurring_order_schedules to fetch.
     */
    where?: Prisma.recurring_order_schedulesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of recurring_order_schedules to fetch.
     */
    orderBy?: Prisma.recurring_order_schedulesOrderByWithRelationInput | Prisma.recurring_order_schedulesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing recurring_order_schedules.
     */
    cursor?: Prisma.recurring_order_schedulesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` recurring_order_schedules from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` recurring_order_schedules.
     */
    skip?: number;
    distinct?: Prisma.Recurring_order_schedulesScalarFieldEnum | Prisma.Recurring_order_schedulesScalarFieldEnum[];
};
/**
 * recurring_order_schedules create
 */
export type recurring_order_schedulesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesInclude<ExtArgs> | null;
    /**
     * The data needed to create a recurring_order_schedules.
     */
    data: Prisma.XOR<Prisma.recurring_order_schedulesCreateInput, Prisma.recurring_order_schedulesUncheckedCreateInput>;
};
/**
 * recurring_order_schedules createMany
 */
export type recurring_order_schedulesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many recurring_order_schedules.
     */
    data: Prisma.recurring_order_schedulesCreateManyInput | Prisma.recurring_order_schedulesCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * recurring_order_schedules createManyAndReturn
 */
export type recurring_order_schedulesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * The data used to create many recurring_order_schedules.
     */
    data: Prisma.recurring_order_schedulesCreateManyInput | Prisma.recurring_order_schedulesCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * recurring_order_schedules update
 */
export type recurring_order_schedulesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesInclude<ExtArgs> | null;
    /**
     * The data needed to update a recurring_order_schedules.
     */
    data: Prisma.XOR<Prisma.recurring_order_schedulesUpdateInput, Prisma.recurring_order_schedulesUncheckedUpdateInput>;
    /**
     * Choose, which recurring_order_schedules to update.
     */
    where: Prisma.recurring_order_schedulesWhereUniqueInput;
};
/**
 * recurring_order_schedules updateMany
 */
export type recurring_order_schedulesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update recurring_order_schedules.
     */
    data: Prisma.XOR<Prisma.recurring_order_schedulesUpdateManyMutationInput, Prisma.recurring_order_schedulesUncheckedUpdateManyInput>;
    /**
     * Filter which recurring_order_schedules to update
     */
    where?: Prisma.recurring_order_schedulesWhereInput;
    /**
     * Limit how many recurring_order_schedules to update.
     */
    limit?: number;
};
/**
 * recurring_order_schedules updateManyAndReturn
 */
export type recurring_order_schedulesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * The data used to update recurring_order_schedules.
     */
    data: Prisma.XOR<Prisma.recurring_order_schedulesUpdateManyMutationInput, Prisma.recurring_order_schedulesUncheckedUpdateManyInput>;
    /**
     * Filter which recurring_order_schedules to update
     */
    where?: Prisma.recurring_order_schedulesWhereInput;
    /**
     * Limit how many recurring_order_schedules to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * recurring_order_schedules upsert
 */
export type recurring_order_schedulesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesInclude<ExtArgs> | null;
    /**
     * The filter to search for the recurring_order_schedules to update in case it exists.
     */
    where: Prisma.recurring_order_schedulesWhereUniqueInput;
    /**
     * In case the recurring_order_schedules found by the `where` argument doesn't exist, create a new recurring_order_schedules with this data.
     */
    create: Prisma.XOR<Prisma.recurring_order_schedulesCreateInput, Prisma.recurring_order_schedulesUncheckedCreateInput>;
    /**
     * In case the recurring_order_schedules was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.recurring_order_schedulesUpdateInput, Prisma.recurring_order_schedulesUncheckedUpdateInput>;
};
/**
 * recurring_order_schedules delete
 */
export type recurring_order_schedulesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesInclude<ExtArgs> | null;
    /**
     * Filter which recurring_order_schedules to delete.
     */
    where: Prisma.recurring_order_schedulesWhereUniqueInput;
};
/**
 * recurring_order_schedules deleteMany
 */
export type recurring_order_schedulesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which recurring_order_schedules to delete
     */
    where?: Prisma.recurring_order_schedulesWhereInput;
    /**
     * Limit how many recurring_order_schedules to delete.
     */
    limit?: number;
};
/**
 * recurring_order_schedules.customers
 */
export type recurring_order_schedules$customersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: Prisma.customersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the customers
     */
    omit?: Prisma.customersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.customersInclude<ExtArgs> | null;
    where?: Prisma.customersWhereInput;
};
/**
 * recurring_order_schedules.farms
 */
export type recurring_order_schedules$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * recurring_order_schedules without action
 */
export type recurring_order_schedulesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the recurring_order_schedules
     */
    select?: Prisma.recurring_order_schedulesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the recurring_order_schedules
     */
    omit?: Prisma.recurring_order_schedulesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.recurring_order_schedulesInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=recurring_order_schedules.d.ts.map