import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model farm_layouts
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type farm_layoutsModel = runtime.Types.Result.DefaultSelection<Prisma.$farm_layoutsPayload>;
export type AggregateFarm_layouts = {
    _count: Farm_layoutsCountAggregateOutputType | null;
    _min: Farm_layoutsMinAggregateOutputType | null;
    _max: Farm_layoutsMaxAggregateOutputType | null;
};
export type Farm_layoutsMinAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    name: string | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type Farm_layoutsMaxAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    name: string | null;
    is_active: boolean | null;
    created_at: Date | null;
};
export type Farm_layoutsCountAggregateOutputType = {
    id: number;
    farm_id: number;
    name: number;
    canvas_data: number;
    is_active: number;
    created_at: number;
    _all: number;
};
export type Farm_layoutsMinAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    is_active?: true;
    created_at?: true;
};
export type Farm_layoutsMaxAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    is_active?: true;
    created_at?: true;
};
export type Farm_layoutsCountAggregateInputType = {
    id?: true;
    farm_id?: true;
    name?: true;
    canvas_data?: true;
    is_active?: true;
    created_at?: true;
    _all?: true;
};
export type Farm_layoutsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which farm_layouts to aggregate.
     */
    where?: Prisma.farm_layoutsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farm_layouts to fetch.
     */
    orderBy?: Prisma.farm_layoutsOrderByWithRelationInput | Prisma.farm_layoutsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.farm_layoutsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farm_layouts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farm_layouts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned farm_layouts
    **/
    _count?: true | Farm_layoutsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: Farm_layoutsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: Farm_layoutsMaxAggregateInputType;
};
export type GetFarm_layoutsAggregateType<T extends Farm_layoutsAggregateArgs> = {
    [P in keyof T & keyof AggregateFarm_layouts]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFarm_layouts[P]> : Prisma.GetScalarType<T[P], AggregateFarm_layouts[P]>;
};
export type farm_layoutsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.farm_layoutsWhereInput;
    orderBy?: Prisma.farm_layoutsOrderByWithAggregationInput | Prisma.farm_layoutsOrderByWithAggregationInput[];
    by: Prisma.Farm_layoutsScalarFieldEnum[] | Prisma.Farm_layoutsScalarFieldEnum;
    having?: Prisma.farm_layoutsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Farm_layoutsCountAggregateInputType | true;
    _min?: Farm_layoutsMinAggregateInputType;
    _max?: Farm_layoutsMaxAggregateInputType;
};
export type Farm_layoutsGroupByOutputType = {
    id: string;
    farm_id: string | null;
    name: string;
    canvas_data: runtime.JsonValue;
    is_active: boolean | null;
    created_at: Date | null;
    _count: Farm_layoutsCountAggregateOutputType | null;
    _min: Farm_layoutsMinAggregateOutputType | null;
    _max: Farm_layoutsMaxAggregateOutputType | null;
};
type GetFarm_layoutsGroupByPayload<T extends farm_layoutsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Farm_layoutsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Farm_layoutsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Farm_layoutsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Farm_layoutsGroupByOutputType[P]>;
}>>;
export type farm_layoutsWhereInput = {
    AND?: Prisma.farm_layoutsWhereInput | Prisma.farm_layoutsWhereInput[];
    OR?: Prisma.farm_layoutsWhereInput[];
    NOT?: Prisma.farm_layoutsWhereInput | Prisma.farm_layoutsWhereInput[];
    id?: Prisma.UuidFilter<"farm_layouts"> | string;
    farm_id?: Prisma.UuidNullableFilter<"farm_layouts"> | string | null;
    name?: Prisma.StringFilter<"farm_layouts"> | string;
    canvas_data?: Prisma.JsonFilter<"farm_layouts">;
    is_active?: Prisma.BoolNullableFilter<"farm_layouts"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"farm_layouts"> | Date | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
};
export type farm_layoutsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    canvas_data?: Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    farms?: Prisma.farmsOrderByWithRelationInput;
};
export type farm_layoutsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.farm_layoutsWhereInput | Prisma.farm_layoutsWhereInput[];
    OR?: Prisma.farm_layoutsWhereInput[];
    NOT?: Prisma.farm_layoutsWhereInput | Prisma.farm_layoutsWhereInput[];
    farm_id?: Prisma.UuidNullableFilter<"farm_layouts"> | string | null;
    name?: Prisma.StringFilter<"farm_layouts"> | string;
    canvas_data?: Prisma.JsonFilter<"farm_layouts">;
    is_active?: Prisma.BoolNullableFilter<"farm_layouts"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"farm_layouts"> | Date | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
}, "id">;
export type farm_layoutsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    canvas_data?: Prisma.SortOrder;
    is_active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.farm_layoutsCountOrderByAggregateInput;
    _max?: Prisma.farm_layoutsMaxOrderByAggregateInput;
    _min?: Prisma.farm_layoutsMinOrderByAggregateInput;
};
export type farm_layoutsScalarWhereWithAggregatesInput = {
    AND?: Prisma.farm_layoutsScalarWhereWithAggregatesInput | Prisma.farm_layoutsScalarWhereWithAggregatesInput[];
    OR?: Prisma.farm_layoutsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.farm_layoutsScalarWhereWithAggregatesInput | Prisma.farm_layoutsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"farm_layouts"> | string;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"farm_layouts"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"farm_layouts"> | string;
    canvas_data?: Prisma.JsonWithAggregatesFilter<"farm_layouts">;
    is_active?: Prisma.BoolNullableWithAggregatesFilter<"farm_layouts"> | boolean | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"farm_layouts"> | Date | string | null;
};
export type farm_layoutsCreateInput = {
    id?: string;
    name: string;
    canvas_data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutFarm_layoutsInput;
};
export type farm_layoutsUncheckedCreateInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    canvas_data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type farm_layoutsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    canvas_data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutFarm_layoutsNestedInput;
};
export type farm_layoutsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    canvas_data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_layoutsCreateManyInput = {
    id?: string;
    farm_id?: string | null;
    name: string;
    canvas_data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type farm_layoutsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    canvas_data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_layoutsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    canvas_data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_layoutsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    canvas_data?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type farm_layoutsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type farm_layoutsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type Farm_layoutsListRelationFilter = {
    every?: Prisma.farm_layoutsWhereInput;
    some?: Prisma.farm_layoutsWhereInput;
    none?: Prisma.farm_layoutsWhereInput;
};
export type farm_layoutsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type farm_layoutsCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.farm_layoutsCreateWithoutFarmsInput, Prisma.farm_layoutsUncheckedCreateWithoutFarmsInput> | Prisma.farm_layoutsCreateWithoutFarmsInput[] | Prisma.farm_layoutsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.farm_layoutsCreateOrConnectWithoutFarmsInput | Prisma.farm_layoutsCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.farm_layoutsCreateManyFarmsInputEnvelope;
    connect?: Prisma.farm_layoutsWhereUniqueInput | Prisma.farm_layoutsWhereUniqueInput[];
};
export type farm_layoutsUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.farm_layoutsCreateWithoutFarmsInput, Prisma.farm_layoutsUncheckedCreateWithoutFarmsInput> | Prisma.farm_layoutsCreateWithoutFarmsInput[] | Prisma.farm_layoutsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.farm_layoutsCreateOrConnectWithoutFarmsInput | Prisma.farm_layoutsCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.farm_layoutsCreateManyFarmsInputEnvelope;
    connect?: Prisma.farm_layoutsWhereUniqueInput | Prisma.farm_layoutsWhereUniqueInput[];
};
export type farm_layoutsUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.farm_layoutsCreateWithoutFarmsInput, Prisma.farm_layoutsUncheckedCreateWithoutFarmsInput> | Prisma.farm_layoutsCreateWithoutFarmsInput[] | Prisma.farm_layoutsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.farm_layoutsCreateOrConnectWithoutFarmsInput | Prisma.farm_layoutsCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.farm_layoutsUpsertWithWhereUniqueWithoutFarmsInput | Prisma.farm_layoutsUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.farm_layoutsCreateManyFarmsInputEnvelope;
    set?: Prisma.farm_layoutsWhereUniqueInput | Prisma.farm_layoutsWhereUniqueInput[];
    disconnect?: Prisma.farm_layoutsWhereUniqueInput | Prisma.farm_layoutsWhereUniqueInput[];
    delete?: Prisma.farm_layoutsWhereUniqueInput | Prisma.farm_layoutsWhereUniqueInput[];
    connect?: Prisma.farm_layoutsWhereUniqueInput | Prisma.farm_layoutsWhereUniqueInput[];
    update?: Prisma.farm_layoutsUpdateWithWhereUniqueWithoutFarmsInput | Prisma.farm_layoutsUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.farm_layoutsUpdateManyWithWhereWithoutFarmsInput | Prisma.farm_layoutsUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.farm_layoutsScalarWhereInput | Prisma.farm_layoutsScalarWhereInput[];
};
export type farm_layoutsUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.farm_layoutsCreateWithoutFarmsInput, Prisma.farm_layoutsUncheckedCreateWithoutFarmsInput> | Prisma.farm_layoutsCreateWithoutFarmsInput[] | Prisma.farm_layoutsUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.farm_layoutsCreateOrConnectWithoutFarmsInput | Prisma.farm_layoutsCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.farm_layoutsUpsertWithWhereUniqueWithoutFarmsInput | Prisma.farm_layoutsUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.farm_layoutsCreateManyFarmsInputEnvelope;
    set?: Prisma.farm_layoutsWhereUniqueInput | Prisma.farm_layoutsWhereUniqueInput[];
    disconnect?: Prisma.farm_layoutsWhereUniqueInput | Prisma.farm_layoutsWhereUniqueInput[];
    delete?: Prisma.farm_layoutsWhereUniqueInput | Prisma.farm_layoutsWhereUniqueInput[];
    connect?: Prisma.farm_layoutsWhereUniqueInput | Prisma.farm_layoutsWhereUniqueInput[];
    update?: Prisma.farm_layoutsUpdateWithWhereUniqueWithoutFarmsInput | Prisma.farm_layoutsUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.farm_layoutsUpdateManyWithWhereWithoutFarmsInput | Prisma.farm_layoutsUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.farm_layoutsScalarWhereInput | Prisma.farm_layoutsScalarWhereInput[];
};
export type farm_layoutsCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    canvas_data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type farm_layoutsUncheckedCreateWithoutFarmsInput = {
    id?: string;
    name: string;
    canvas_data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type farm_layoutsCreateOrConnectWithoutFarmsInput = {
    where: Prisma.farm_layoutsWhereUniqueInput;
    create: Prisma.XOR<Prisma.farm_layoutsCreateWithoutFarmsInput, Prisma.farm_layoutsUncheckedCreateWithoutFarmsInput>;
};
export type farm_layoutsCreateManyFarmsInputEnvelope = {
    data: Prisma.farm_layoutsCreateManyFarmsInput | Prisma.farm_layoutsCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type farm_layoutsUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.farm_layoutsWhereUniqueInput;
    update: Prisma.XOR<Prisma.farm_layoutsUpdateWithoutFarmsInput, Prisma.farm_layoutsUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.farm_layoutsCreateWithoutFarmsInput, Prisma.farm_layoutsUncheckedCreateWithoutFarmsInput>;
};
export type farm_layoutsUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.farm_layoutsWhereUniqueInput;
    data: Prisma.XOR<Prisma.farm_layoutsUpdateWithoutFarmsInput, Prisma.farm_layoutsUncheckedUpdateWithoutFarmsInput>;
};
export type farm_layoutsUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.farm_layoutsScalarWhereInput;
    data: Prisma.XOR<Prisma.farm_layoutsUpdateManyMutationInput, Prisma.farm_layoutsUncheckedUpdateManyWithoutFarmsInput>;
};
export type farm_layoutsScalarWhereInput = {
    AND?: Prisma.farm_layoutsScalarWhereInput | Prisma.farm_layoutsScalarWhereInput[];
    OR?: Prisma.farm_layoutsScalarWhereInput[];
    NOT?: Prisma.farm_layoutsScalarWhereInput | Prisma.farm_layoutsScalarWhereInput[];
    id?: Prisma.UuidFilter<"farm_layouts"> | string;
    farm_id?: Prisma.UuidNullableFilter<"farm_layouts"> | string | null;
    name?: Prisma.StringFilter<"farm_layouts"> | string;
    canvas_data?: Prisma.JsonFilter<"farm_layouts">;
    is_active?: Prisma.BoolNullableFilter<"farm_layouts"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"farm_layouts"> | Date | string | null;
};
export type farm_layoutsCreateManyFarmsInput = {
    id?: string;
    name: string;
    canvas_data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: boolean | null;
    created_at?: Date | string | null;
};
export type farm_layoutsUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    canvas_data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_layoutsUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    canvas_data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_layoutsUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    canvas_data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    is_active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type farm_layoutsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    canvas_data?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.farm_layouts$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["farm_layouts"]>;
export type farm_layoutsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    canvas_data?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.farm_layouts$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["farm_layouts"]>;
export type farm_layoutsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    canvas_data?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.farm_layouts$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["farm_layouts"]>;
export type farm_layoutsSelectScalar = {
    id?: boolean;
    farm_id?: boolean;
    name?: boolean;
    canvas_data?: boolean;
    is_active?: boolean;
    created_at?: boolean;
};
export type farm_layoutsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farm_id" | "name" | "canvas_data" | "is_active" | "created_at", ExtArgs["result"]["farm_layouts"]>;
export type farm_layoutsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.farm_layouts$farmsArgs<ExtArgs>;
};
export type farm_layoutsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.farm_layouts$farmsArgs<ExtArgs>;
};
export type farm_layoutsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.farm_layouts$farmsArgs<ExtArgs>;
};
export type $farm_layoutsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "farm_layouts";
    objects: {
        farms: Prisma.$farmsPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farm_id: string | null;
        name: string;
        canvas_data: runtime.JsonValue;
        is_active: boolean | null;
        created_at: Date | null;
    }, ExtArgs["result"]["farm_layouts"]>;
    composites: {};
};
export type farm_layoutsGetPayload<S extends boolean | null | undefined | farm_layoutsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload, S>;
export type farm_layoutsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<farm_layoutsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Farm_layoutsCountAggregateInputType | true;
};
export interface farm_layoutsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['farm_layouts'];
        meta: {
            name: 'farm_layouts';
        };
    };
    /**
     * Find zero or one Farm_layouts that matches the filter.
     * @param {farm_layoutsFindUniqueArgs} args - Arguments to find a Farm_layouts
     * @example
     * // Get one Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends farm_layoutsFindUniqueArgs>(args: Prisma.SelectSubset<T, farm_layoutsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__farm_layoutsClient<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Farm_layouts that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {farm_layoutsFindUniqueOrThrowArgs} args - Arguments to find a Farm_layouts
     * @example
     * // Get one Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends farm_layoutsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, farm_layoutsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__farm_layoutsClient<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Farm_layouts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_layoutsFindFirstArgs} args - Arguments to find a Farm_layouts
     * @example
     * // Get one Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends farm_layoutsFindFirstArgs>(args?: Prisma.SelectSubset<T, farm_layoutsFindFirstArgs<ExtArgs>>): Prisma.Prisma__farm_layoutsClient<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Farm_layouts that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_layoutsFindFirstOrThrowArgs} args - Arguments to find a Farm_layouts
     * @example
     * // Get one Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends farm_layoutsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, farm_layoutsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__farm_layoutsClient<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Farm_layouts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_layoutsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.findMany()
     *
     * // Get first 10 Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const farm_layoutsWithIdOnly = await prisma.farm_layouts.findMany({ select: { id: true } })
     *
     */
    findMany<T extends farm_layoutsFindManyArgs>(args?: Prisma.SelectSubset<T, farm_layoutsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Farm_layouts.
     * @param {farm_layoutsCreateArgs} args - Arguments to create a Farm_layouts.
     * @example
     * // Create one Farm_layouts
     * const Farm_layouts = await prisma.farm_layouts.create({
     *   data: {
     *     // ... data to create a Farm_layouts
     *   }
     * })
     *
     */
    create<T extends farm_layoutsCreateArgs>(args: Prisma.SelectSubset<T, farm_layoutsCreateArgs<ExtArgs>>): Prisma.Prisma__farm_layoutsClient<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Farm_layouts.
     * @param {farm_layoutsCreateManyArgs} args - Arguments to create many Farm_layouts.
     * @example
     * // Create many Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends farm_layoutsCreateManyArgs>(args?: Prisma.SelectSubset<T, farm_layoutsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Farm_layouts and returns the data saved in the database.
     * @param {farm_layoutsCreateManyAndReturnArgs} args - Arguments to create many Farm_layouts.
     * @example
     * // Create many Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Farm_layouts and only return the `id`
     * const farm_layoutsWithIdOnly = await prisma.farm_layouts.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends farm_layoutsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, farm_layoutsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Farm_layouts.
     * @param {farm_layoutsDeleteArgs} args - Arguments to delete one Farm_layouts.
     * @example
     * // Delete one Farm_layouts
     * const Farm_layouts = await prisma.farm_layouts.delete({
     *   where: {
     *     // ... filter to delete one Farm_layouts
     *   }
     * })
     *
     */
    delete<T extends farm_layoutsDeleteArgs>(args: Prisma.SelectSubset<T, farm_layoutsDeleteArgs<ExtArgs>>): Prisma.Prisma__farm_layoutsClient<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Farm_layouts.
     * @param {farm_layoutsUpdateArgs} args - Arguments to update one Farm_layouts.
     * @example
     * // Update one Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends farm_layoutsUpdateArgs>(args: Prisma.SelectSubset<T, farm_layoutsUpdateArgs<ExtArgs>>): Prisma.Prisma__farm_layoutsClient<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Farm_layouts.
     * @param {farm_layoutsDeleteManyArgs} args - Arguments to filter Farm_layouts to delete.
     * @example
     * // Delete a few Farm_layouts
     * const { count } = await prisma.farm_layouts.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends farm_layoutsDeleteManyArgs>(args?: Prisma.SelectSubset<T, farm_layoutsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Farm_layouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_layoutsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends farm_layoutsUpdateManyArgs>(args: Prisma.SelectSubset<T, farm_layoutsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Farm_layouts and returns the data updated in the database.
     * @param {farm_layoutsUpdateManyAndReturnArgs} args - Arguments to update many Farm_layouts.
     * @example
     * // Update many Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Farm_layouts and only return the `id`
     * const farm_layoutsWithIdOnly = await prisma.farm_layouts.updateManyAndReturn({
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
    updateManyAndReturn<T extends farm_layoutsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, farm_layoutsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Farm_layouts.
     * @param {farm_layoutsUpsertArgs} args - Arguments to update or create a Farm_layouts.
     * @example
     * // Update or create a Farm_layouts
     * const farm_layouts = await prisma.farm_layouts.upsert({
     *   create: {
     *     // ... data to create a Farm_layouts
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Farm_layouts we want to update
     *   }
     * })
     */
    upsert<T extends farm_layoutsUpsertArgs>(args: Prisma.SelectSubset<T, farm_layoutsUpsertArgs<ExtArgs>>): Prisma.Prisma__farm_layoutsClient<runtime.Types.Result.GetResult<Prisma.$farm_layoutsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Farm_layouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_layoutsCountArgs} args - Arguments to filter Farm_layouts to count.
     * @example
     * // Count the number of Farm_layouts
     * const count = await prisma.farm_layouts.count({
     *   where: {
     *     // ... the filter for the Farm_layouts we want to count
     *   }
     * })
    **/
    count<T extends farm_layoutsCountArgs>(args?: Prisma.Subset<T, farm_layoutsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Farm_layoutsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Farm_layouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Farm_layoutsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Farm_layoutsAggregateArgs>(args: Prisma.Subset<T, Farm_layoutsAggregateArgs>): Prisma.PrismaPromise<GetFarm_layoutsAggregateType<T>>;
    /**
     * Group by Farm_layouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {farm_layoutsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends farm_layoutsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: farm_layoutsGroupByArgs['orderBy'];
    } : {
        orderBy?: farm_layoutsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, farm_layoutsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFarm_layoutsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the farm_layouts model
     */
    readonly fields: farm_layoutsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for farm_layouts.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__farm_layoutsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farms<T extends Prisma.farm_layouts$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.farm_layouts$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the farm_layouts model
 */
export interface farm_layoutsFieldRefs {
    readonly id: Prisma.FieldRef<"farm_layouts", 'String'>;
    readonly farm_id: Prisma.FieldRef<"farm_layouts", 'String'>;
    readonly name: Prisma.FieldRef<"farm_layouts", 'String'>;
    readonly canvas_data: Prisma.FieldRef<"farm_layouts", 'Json'>;
    readonly is_active: Prisma.FieldRef<"farm_layouts", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"farm_layouts", 'DateTime'>;
}
/**
 * farm_layouts findUnique
 */
export type farm_layoutsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsInclude<ExtArgs> | null;
    /**
     * Filter, which farm_layouts to fetch.
     */
    where: Prisma.farm_layoutsWhereUniqueInput;
};
/**
 * farm_layouts findUniqueOrThrow
 */
export type farm_layoutsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsInclude<ExtArgs> | null;
    /**
     * Filter, which farm_layouts to fetch.
     */
    where: Prisma.farm_layoutsWhereUniqueInput;
};
/**
 * farm_layouts findFirst
 */
export type farm_layoutsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsInclude<ExtArgs> | null;
    /**
     * Filter, which farm_layouts to fetch.
     */
    where?: Prisma.farm_layoutsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farm_layouts to fetch.
     */
    orderBy?: Prisma.farm_layoutsOrderByWithRelationInput | Prisma.farm_layoutsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for farm_layouts.
     */
    cursor?: Prisma.farm_layoutsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farm_layouts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farm_layouts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of farm_layouts.
     */
    distinct?: Prisma.Farm_layoutsScalarFieldEnum | Prisma.Farm_layoutsScalarFieldEnum[];
};
/**
 * farm_layouts findFirstOrThrow
 */
export type farm_layoutsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsInclude<ExtArgs> | null;
    /**
     * Filter, which farm_layouts to fetch.
     */
    where?: Prisma.farm_layoutsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farm_layouts to fetch.
     */
    orderBy?: Prisma.farm_layoutsOrderByWithRelationInput | Prisma.farm_layoutsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for farm_layouts.
     */
    cursor?: Prisma.farm_layoutsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farm_layouts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farm_layouts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of farm_layouts.
     */
    distinct?: Prisma.Farm_layoutsScalarFieldEnum | Prisma.Farm_layoutsScalarFieldEnum[];
};
/**
 * farm_layouts findMany
 */
export type farm_layoutsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsInclude<ExtArgs> | null;
    /**
     * Filter, which farm_layouts to fetch.
     */
    where?: Prisma.farm_layoutsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of farm_layouts to fetch.
     */
    orderBy?: Prisma.farm_layoutsOrderByWithRelationInput | Prisma.farm_layoutsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing farm_layouts.
     */
    cursor?: Prisma.farm_layoutsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` farm_layouts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` farm_layouts.
     */
    skip?: number;
    distinct?: Prisma.Farm_layoutsScalarFieldEnum | Prisma.Farm_layoutsScalarFieldEnum[];
};
/**
 * farm_layouts create
 */
export type farm_layoutsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsInclude<ExtArgs> | null;
    /**
     * The data needed to create a farm_layouts.
     */
    data: Prisma.XOR<Prisma.farm_layoutsCreateInput, Prisma.farm_layoutsUncheckedCreateInput>;
};
/**
 * farm_layouts createMany
 */
export type farm_layoutsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many farm_layouts.
     */
    data: Prisma.farm_layoutsCreateManyInput | Prisma.farm_layoutsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * farm_layouts createManyAndReturn
 */
export type farm_layoutsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * The data used to create many farm_layouts.
     */
    data: Prisma.farm_layoutsCreateManyInput | Prisma.farm_layoutsCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * farm_layouts update
 */
export type farm_layoutsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsInclude<ExtArgs> | null;
    /**
     * The data needed to update a farm_layouts.
     */
    data: Prisma.XOR<Prisma.farm_layoutsUpdateInput, Prisma.farm_layoutsUncheckedUpdateInput>;
    /**
     * Choose, which farm_layouts to update.
     */
    where: Prisma.farm_layoutsWhereUniqueInput;
};
/**
 * farm_layouts updateMany
 */
export type farm_layoutsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update farm_layouts.
     */
    data: Prisma.XOR<Prisma.farm_layoutsUpdateManyMutationInput, Prisma.farm_layoutsUncheckedUpdateManyInput>;
    /**
     * Filter which farm_layouts to update
     */
    where?: Prisma.farm_layoutsWhereInput;
    /**
     * Limit how many farm_layouts to update.
     */
    limit?: number;
};
/**
 * farm_layouts updateManyAndReturn
 */
export type farm_layoutsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * The data used to update farm_layouts.
     */
    data: Prisma.XOR<Prisma.farm_layoutsUpdateManyMutationInput, Prisma.farm_layoutsUncheckedUpdateManyInput>;
    /**
     * Filter which farm_layouts to update
     */
    where?: Prisma.farm_layoutsWhereInput;
    /**
     * Limit how many farm_layouts to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * farm_layouts upsert
 */
export type farm_layoutsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsInclude<ExtArgs> | null;
    /**
     * The filter to search for the farm_layouts to update in case it exists.
     */
    where: Prisma.farm_layoutsWhereUniqueInput;
    /**
     * In case the farm_layouts found by the `where` argument doesn't exist, create a new farm_layouts with this data.
     */
    create: Prisma.XOR<Prisma.farm_layoutsCreateInput, Prisma.farm_layoutsUncheckedCreateInput>;
    /**
     * In case the farm_layouts was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.farm_layoutsUpdateInput, Prisma.farm_layoutsUncheckedUpdateInput>;
};
/**
 * farm_layouts delete
 */
export type farm_layoutsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsInclude<ExtArgs> | null;
    /**
     * Filter which farm_layouts to delete.
     */
    where: Prisma.farm_layoutsWhereUniqueInput;
};
/**
 * farm_layouts deleteMany
 */
export type farm_layoutsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which farm_layouts to delete
     */
    where?: Prisma.farm_layoutsWhereInput;
    /**
     * Limit how many farm_layouts to delete.
     */
    limit?: number;
};
/**
 * farm_layouts.farms
 */
export type farm_layouts$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * farm_layouts without action
 */
export type farm_layoutsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the farm_layouts
     */
    select?: Prisma.farm_layoutsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the farm_layouts
     */
    omit?: Prisma.farm_layoutsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.farm_layoutsInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=farm_layouts.d.ts.map