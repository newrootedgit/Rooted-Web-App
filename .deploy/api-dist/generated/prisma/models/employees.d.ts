import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model employees
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export type employeesModel = runtime.Types.Result.DefaultSelection<Prisma.$employeesPayload>;
export type AggregateEmployees = {
    _count: EmployeesCountAggregateOutputType | null;
    _avg: EmployeesAvgAggregateOutputType | null;
    _sum: EmployeesSumAggregateOutputType | null;
    _min: EmployeesMinAggregateOutputType | null;
    _max: EmployeesMaxAggregateOutputType | null;
};
export type EmployeesAvgAggregateOutputType = {
    hourly_rate: runtime.Decimal | null;
};
export type EmployeesSumAggregateOutputType = {
    hourly_rate: runtime.Decimal | null;
};
export type EmployeesMinAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    position: string | null;
    status: string | null;
    hire_date: Date | null;
    hourly_rate: runtime.Decimal | null;
    notes: string | null;
    created_at: Date | null;
};
export type EmployeesMaxAggregateOutputType = {
    id: string | null;
    farm_id: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    position: string | null;
    status: string | null;
    hire_date: Date | null;
    hourly_rate: runtime.Decimal | null;
    notes: string | null;
    created_at: Date | null;
};
export type EmployeesCountAggregateOutputType = {
    id: number;
    farm_id: number;
    first_name: number;
    last_name: number;
    email: number;
    phone: number;
    position: number;
    status: number;
    hire_date: number;
    hourly_rate: number;
    notes: number;
    created_at: number;
    _all: number;
};
export type EmployeesAvgAggregateInputType = {
    hourly_rate?: true;
};
export type EmployeesSumAggregateInputType = {
    hourly_rate?: true;
};
export type EmployeesMinAggregateInputType = {
    id?: true;
    farm_id?: true;
    first_name?: true;
    last_name?: true;
    email?: true;
    phone?: true;
    position?: true;
    status?: true;
    hire_date?: true;
    hourly_rate?: true;
    notes?: true;
    created_at?: true;
};
export type EmployeesMaxAggregateInputType = {
    id?: true;
    farm_id?: true;
    first_name?: true;
    last_name?: true;
    email?: true;
    phone?: true;
    position?: true;
    status?: true;
    hire_date?: true;
    hourly_rate?: true;
    notes?: true;
    created_at?: true;
};
export type EmployeesCountAggregateInputType = {
    id?: true;
    farm_id?: true;
    first_name?: true;
    last_name?: true;
    email?: true;
    phone?: true;
    position?: true;
    status?: true;
    hire_date?: true;
    hourly_rate?: true;
    notes?: true;
    created_at?: true;
    _all?: true;
};
export type EmployeesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which employees to aggregate.
     */
    where?: Prisma.employeesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of employees to fetch.
     */
    orderBy?: Prisma.employeesOrderByWithRelationInput | Prisma.employeesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.employeesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` employees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` employees.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned employees
    **/
    _count?: true | EmployeesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: EmployeesAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: EmployeesSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: EmployeesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: EmployeesMaxAggregateInputType;
};
export type GetEmployeesAggregateType<T extends EmployeesAggregateArgs> = {
    [P in keyof T & keyof AggregateEmployees]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEmployees[P]> : Prisma.GetScalarType<T[P], AggregateEmployees[P]>;
};
export type employeesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.employeesWhereInput;
    orderBy?: Prisma.employeesOrderByWithAggregationInput | Prisma.employeesOrderByWithAggregationInput[];
    by: Prisma.EmployeesScalarFieldEnum[] | Prisma.EmployeesScalarFieldEnum;
    having?: Prisma.employeesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EmployeesCountAggregateInputType | true;
    _avg?: EmployeesAvgAggregateInputType;
    _sum?: EmployeesSumAggregateInputType;
    _min?: EmployeesMinAggregateInputType;
    _max?: EmployeesMaxAggregateInputType;
};
export type EmployeesGroupByOutputType = {
    id: string;
    farm_id: string | null;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    position: string | null;
    status: string | null;
    hire_date: Date | null;
    hourly_rate: runtime.Decimal | null;
    notes: string | null;
    created_at: Date | null;
    _count: EmployeesCountAggregateOutputType | null;
    _avg: EmployeesAvgAggregateOutputType | null;
    _sum: EmployeesSumAggregateOutputType | null;
    _min: EmployeesMinAggregateOutputType | null;
    _max: EmployeesMaxAggregateOutputType | null;
};
type GetEmployeesGroupByPayload<T extends employeesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EmployeesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EmployeesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EmployeesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EmployeesGroupByOutputType[P]>;
}>>;
export type employeesWhereInput = {
    AND?: Prisma.employeesWhereInput | Prisma.employeesWhereInput[];
    OR?: Prisma.employeesWhereInput[];
    NOT?: Prisma.employeesWhereInput | Prisma.employeesWhereInput[];
    id?: Prisma.UuidFilter<"employees"> | string;
    farm_id?: Prisma.UuidNullableFilter<"employees"> | string | null;
    first_name?: Prisma.StringFilter<"employees"> | string;
    last_name?: Prisma.StringFilter<"employees"> | string;
    email?: Prisma.StringNullableFilter<"employees"> | string | null;
    phone?: Prisma.StringNullableFilter<"employees"> | string | null;
    position?: Prisma.StringNullableFilter<"employees"> | string | null;
    status?: Prisma.StringNullableFilter<"employees"> | string | null;
    hire_date?: Prisma.DateTimeNullableFilter<"employees"> | Date | string | null;
    hourly_rate?: Prisma.DecimalNullableFilter<"employees"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.StringNullableFilter<"employees"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"employees"> | Date | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
};
export type employeesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    position?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    hire_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    hourly_rate?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    farms?: Prisma.farmsOrderByWithRelationInput;
};
export type employeesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.employeesWhereInput | Prisma.employeesWhereInput[];
    OR?: Prisma.employeesWhereInput[];
    NOT?: Prisma.employeesWhereInput | Prisma.employeesWhereInput[];
    farm_id?: Prisma.UuidNullableFilter<"employees"> | string | null;
    first_name?: Prisma.StringFilter<"employees"> | string;
    last_name?: Prisma.StringFilter<"employees"> | string;
    email?: Prisma.StringNullableFilter<"employees"> | string | null;
    phone?: Prisma.StringNullableFilter<"employees"> | string | null;
    position?: Prisma.StringNullableFilter<"employees"> | string | null;
    status?: Prisma.StringNullableFilter<"employees"> | string | null;
    hire_date?: Prisma.DateTimeNullableFilter<"employees"> | Date | string | null;
    hourly_rate?: Prisma.DecimalNullableFilter<"employees"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.StringNullableFilter<"employees"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"employees"> | Date | string | null;
    farms?: Prisma.XOR<Prisma.FarmsNullableScalarRelationFilter, Prisma.farmsWhereInput> | null;
}, "id">;
export type employeesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    position?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrderInput | Prisma.SortOrder;
    hire_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    hourly_rate?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.employeesCountOrderByAggregateInput;
    _avg?: Prisma.employeesAvgOrderByAggregateInput;
    _max?: Prisma.employeesMaxOrderByAggregateInput;
    _min?: Prisma.employeesMinOrderByAggregateInput;
    _sum?: Prisma.employeesSumOrderByAggregateInput;
};
export type employeesScalarWhereWithAggregatesInput = {
    AND?: Prisma.employeesScalarWhereWithAggregatesInput | Prisma.employeesScalarWhereWithAggregatesInput[];
    OR?: Prisma.employeesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.employeesScalarWhereWithAggregatesInput | Prisma.employeesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"employees"> | string;
    farm_id?: Prisma.UuidNullableWithAggregatesFilter<"employees"> | string | null;
    first_name?: Prisma.StringWithAggregatesFilter<"employees"> | string;
    last_name?: Prisma.StringWithAggregatesFilter<"employees"> | string;
    email?: Prisma.StringNullableWithAggregatesFilter<"employees"> | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"employees"> | string | null;
    position?: Prisma.StringNullableWithAggregatesFilter<"employees"> | string | null;
    status?: Prisma.StringNullableWithAggregatesFilter<"employees"> | string | null;
    hire_date?: Prisma.DateTimeNullableWithAggregatesFilter<"employees"> | Date | string | null;
    hourly_rate?: Prisma.DecimalNullableWithAggregatesFilter<"employees"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"employees"> | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"employees"> | Date | string | null;
};
export type employeesCreateInput = {
    id?: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
    status?: string | null;
    hire_date?: Date | string | null;
    hourly_rate?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    created_at?: Date | string | null;
    farms?: Prisma.farmsCreateNestedOneWithoutEmployeesInput;
};
export type employeesUncheckedCreateInput = {
    id?: string;
    farm_id?: string | null;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
    status?: string | null;
    hire_date?: Date | string | null;
    hourly_rate?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type employeesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    hire_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    hourly_rate?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    farms?: Prisma.farmsUpdateOneWithoutEmployeesNestedInput;
};
export type employeesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    hire_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    hourly_rate?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type employeesCreateManyInput = {
    id?: string;
    farm_id?: string | null;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
    status?: string | null;
    hire_date?: Date | string | null;
    hourly_rate?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type employeesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    hire_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    hourly_rate?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type employeesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farm_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    hire_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    hourly_rate?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type employeesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    hire_date?: Prisma.SortOrder;
    hourly_rate?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type employeesAvgOrderByAggregateInput = {
    hourly_rate?: Prisma.SortOrder;
};
export type employeesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    hire_date?: Prisma.SortOrder;
    hourly_rate?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type employeesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farm_id?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    hire_date?: Prisma.SortOrder;
    hourly_rate?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type employeesSumOrderByAggregateInput = {
    hourly_rate?: Prisma.SortOrder;
};
export type EmployeesListRelationFilter = {
    every?: Prisma.employeesWhereInput;
    some?: Prisma.employeesWhereInput;
    none?: Prisma.employeesWhereInput;
};
export type employeesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type NullableDecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type employeesCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.employeesCreateWithoutFarmsInput, Prisma.employeesUncheckedCreateWithoutFarmsInput> | Prisma.employeesCreateWithoutFarmsInput[] | Prisma.employeesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.employeesCreateOrConnectWithoutFarmsInput | Prisma.employeesCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.employeesCreateManyFarmsInputEnvelope;
    connect?: Prisma.employeesWhereUniqueInput | Prisma.employeesWhereUniqueInput[];
};
export type employeesUncheckedCreateNestedManyWithoutFarmsInput = {
    create?: Prisma.XOR<Prisma.employeesCreateWithoutFarmsInput, Prisma.employeesUncheckedCreateWithoutFarmsInput> | Prisma.employeesCreateWithoutFarmsInput[] | Prisma.employeesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.employeesCreateOrConnectWithoutFarmsInput | Prisma.employeesCreateOrConnectWithoutFarmsInput[];
    createMany?: Prisma.employeesCreateManyFarmsInputEnvelope;
    connect?: Prisma.employeesWhereUniqueInput | Prisma.employeesWhereUniqueInput[];
};
export type employeesUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.employeesCreateWithoutFarmsInput, Prisma.employeesUncheckedCreateWithoutFarmsInput> | Prisma.employeesCreateWithoutFarmsInput[] | Prisma.employeesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.employeesCreateOrConnectWithoutFarmsInput | Prisma.employeesCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.employeesUpsertWithWhereUniqueWithoutFarmsInput | Prisma.employeesUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.employeesCreateManyFarmsInputEnvelope;
    set?: Prisma.employeesWhereUniqueInput | Prisma.employeesWhereUniqueInput[];
    disconnect?: Prisma.employeesWhereUniqueInput | Prisma.employeesWhereUniqueInput[];
    delete?: Prisma.employeesWhereUniqueInput | Prisma.employeesWhereUniqueInput[];
    connect?: Prisma.employeesWhereUniqueInput | Prisma.employeesWhereUniqueInput[];
    update?: Prisma.employeesUpdateWithWhereUniqueWithoutFarmsInput | Prisma.employeesUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.employeesUpdateManyWithWhereWithoutFarmsInput | Prisma.employeesUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.employeesScalarWhereInput | Prisma.employeesScalarWhereInput[];
};
export type employeesUncheckedUpdateManyWithoutFarmsNestedInput = {
    create?: Prisma.XOR<Prisma.employeesCreateWithoutFarmsInput, Prisma.employeesUncheckedCreateWithoutFarmsInput> | Prisma.employeesCreateWithoutFarmsInput[] | Prisma.employeesUncheckedCreateWithoutFarmsInput[];
    connectOrCreate?: Prisma.employeesCreateOrConnectWithoutFarmsInput | Prisma.employeesCreateOrConnectWithoutFarmsInput[];
    upsert?: Prisma.employeesUpsertWithWhereUniqueWithoutFarmsInput | Prisma.employeesUpsertWithWhereUniqueWithoutFarmsInput[];
    createMany?: Prisma.employeesCreateManyFarmsInputEnvelope;
    set?: Prisma.employeesWhereUniqueInput | Prisma.employeesWhereUniqueInput[];
    disconnect?: Prisma.employeesWhereUniqueInput | Prisma.employeesWhereUniqueInput[];
    delete?: Prisma.employeesWhereUniqueInput | Prisma.employeesWhereUniqueInput[];
    connect?: Prisma.employeesWhereUniqueInput | Prisma.employeesWhereUniqueInput[];
    update?: Prisma.employeesUpdateWithWhereUniqueWithoutFarmsInput | Prisma.employeesUpdateWithWhereUniqueWithoutFarmsInput[];
    updateMany?: Prisma.employeesUpdateManyWithWhereWithoutFarmsInput | Prisma.employeesUpdateManyWithWhereWithoutFarmsInput[];
    deleteMany?: Prisma.employeesScalarWhereInput | Prisma.employeesScalarWhereInput[];
};
export type employeesCreateWithoutFarmsInput = {
    id?: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
    status?: string | null;
    hire_date?: Date | string | null;
    hourly_rate?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type employeesUncheckedCreateWithoutFarmsInput = {
    id?: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
    status?: string | null;
    hire_date?: Date | string | null;
    hourly_rate?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type employeesCreateOrConnectWithoutFarmsInput = {
    where: Prisma.employeesWhereUniqueInput;
    create: Prisma.XOR<Prisma.employeesCreateWithoutFarmsInput, Prisma.employeesUncheckedCreateWithoutFarmsInput>;
};
export type employeesCreateManyFarmsInputEnvelope = {
    data: Prisma.employeesCreateManyFarmsInput | Prisma.employeesCreateManyFarmsInput[];
    skipDuplicates?: boolean;
};
export type employeesUpsertWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.employeesWhereUniqueInput;
    update: Prisma.XOR<Prisma.employeesUpdateWithoutFarmsInput, Prisma.employeesUncheckedUpdateWithoutFarmsInput>;
    create: Prisma.XOR<Prisma.employeesCreateWithoutFarmsInput, Prisma.employeesUncheckedCreateWithoutFarmsInput>;
};
export type employeesUpdateWithWhereUniqueWithoutFarmsInput = {
    where: Prisma.employeesWhereUniqueInput;
    data: Prisma.XOR<Prisma.employeesUpdateWithoutFarmsInput, Prisma.employeesUncheckedUpdateWithoutFarmsInput>;
};
export type employeesUpdateManyWithWhereWithoutFarmsInput = {
    where: Prisma.employeesScalarWhereInput;
    data: Prisma.XOR<Prisma.employeesUpdateManyMutationInput, Prisma.employeesUncheckedUpdateManyWithoutFarmsInput>;
};
export type employeesScalarWhereInput = {
    AND?: Prisma.employeesScalarWhereInput | Prisma.employeesScalarWhereInput[];
    OR?: Prisma.employeesScalarWhereInput[];
    NOT?: Prisma.employeesScalarWhereInput | Prisma.employeesScalarWhereInput[];
    id?: Prisma.UuidFilter<"employees"> | string;
    farm_id?: Prisma.UuidNullableFilter<"employees"> | string | null;
    first_name?: Prisma.StringFilter<"employees"> | string;
    last_name?: Prisma.StringFilter<"employees"> | string;
    email?: Prisma.StringNullableFilter<"employees"> | string | null;
    phone?: Prisma.StringNullableFilter<"employees"> | string | null;
    position?: Prisma.StringNullableFilter<"employees"> | string | null;
    status?: Prisma.StringNullableFilter<"employees"> | string | null;
    hire_date?: Prisma.DateTimeNullableFilter<"employees"> | Date | string | null;
    hourly_rate?: Prisma.DecimalNullableFilter<"employees"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.StringNullableFilter<"employees"> | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"employees"> | Date | string | null;
};
export type employeesCreateManyFarmsInput = {
    id?: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
    status?: string | null;
    hire_date?: Date | string | null;
    hourly_rate?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: string | null;
    created_at?: Date | string | null;
};
export type employeesUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    hire_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    hourly_rate?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type employeesUncheckedUpdateWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    hire_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    hourly_rate?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type employeesUncheckedUpdateManyWithoutFarmsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    hire_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    hourly_rate?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type employeesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    email?: boolean;
    phone?: boolean;
    position?: boolean;
    status?: boolean;
    hire_date?: boolean;
    hourly_rate?: boolean;
    notes?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.employees$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["employees"]>;
export type employeesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    email?: boolean;
    phone?: boolean;
    position?: boolean;
    status?: boolean;
    hire_date?: boolean;
    hourly_rate?: boolean;
    notes?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.employees$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["employees"]>;
export type employeesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farm_id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    email?: boolean;
    phone?: boolean;
    position?: boolean;
    status?: boolean;
    hire_date?: boolean;
    hourly_rate?: boolean;
    notes?: boolean;
    created_at?: boolean;
    farms?: boolean | Prisma.employees$farmsArgs<ExtArgs>;
}, ExtArgs["result"]["employees"]>;
export type employeesSelectScalar = {
    id?: boolean;
    farm_id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    email?: boolean;
    phone?: boolean;
    position?: boolean;
    status?: boolean;
    hire_date?: boolean;
    hourly_rate?: boolean;
    notes?: boolean;
    created_at?: boolean;
};
export type employeesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farm_id" | "first_name" | "last_name" | "email" | "phone" | "position" | "status" | "hire_date" | "hourly_rate" | "notes" | "created_at", ExtArgs["result"]["employees"]>;
export type employeesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.employees$farmsArgs<ExtArgs>;
};
export type employeesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.employees$farmsArgs<ExtArgs>;
};
export type employeesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farms?: boolean | Prisma.employees$farmsArgs<ExtArgs>;
};
export type $employeesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "employees";
    objects: {
        farms: Prisma.$farmsPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farm_id: string | null;
        first_name: string;
        last_name: string;
        email: string | null;
        phone: string | null;
        position: string | null;
        status: string | null;
        hire_date: Date | null;
        hourly_rate: runtime.Decimal | null;
        notes: string | null;
        created_at: Date | null;
    }, ExtArgs["result"]["employees"]>;
    composites: {};
};
export type employeesGetPayload<S extends boolean | null | undefined | employeesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$employeesPayload, S>;
export type employeesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<employeesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EmployeesCountAggregateInputType | true;
};
export interface employeesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['employees'];
        meta: {
            name: 'employees';
        };
    };
    /**
     * Find zero or one Employees that matches the filter.
     * @param {employeesFindUniqueArgs} args - Arguments to find a Employees
     * @example
     * // Get one Employees
     * const employees = await prisma.employees.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends employeesFindUniqueArgs>(args: Prisma.SelectSubset<T, employeesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__employeesClient<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Employees that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {employeesFindUniqueOrThrowArgs} args - Arguments to find a Employees
     * @example
     * // Get one Employees
     * const employees = await prisma.employees.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends employeesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, employeesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__employeesClient<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Employees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {employeesFindFirstArgs} args - Arguments to find a Employees
     * @example
     * // Get one Employees
     * const employees = await prisma.employees.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends employeesFindFirstArgs>(args?: Prisma.SelectSubset<T, employeesFindFirstArgs<ExtArgs>>): Prisma.Prisma__employeesClient<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Employees that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {employeesFindFirstOrThrowArgs} args - Arguments to find a Employees
     * @example
     * // Get one Employees
     * const employees = await prisma.employees.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends employeesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, employeesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__employeesClient<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Employees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {employeesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Employees
     * const employees = await prisma.employees.findMany()
     *
     * // Get first 10 Employees
     * const employees = await prisma.employees.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const employeesWithIdOnly = await prisma.employees.findMany({ select: { id: true } })
     *
     */
    findMany<T extends employeesFindManyArgs>(args?: Prisma.SelectSubset<T, employeesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Employees.
     * @param {employeesCreateArgs} args - Arguments to create a Employees.
     * @example
     * // Create one Employees
     * const Employees = await prisma.employees.create({
     *   data: {
     *     // ... data to create a Employees
     *   }
     * })
     *
     */
    create<T extends employeesCreateArgs>(args: Prisma.SelectSubset<T, employeesCreateArgs<ExtArgs>>): Prisma.Prisma__employeesClient<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Employees.
     * @param {employeesCreateManyArgs} args - Arguments to create many Employees.
     * @example
     * // Create many Employees
     * const employees = await prisma.employees.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends employeesCreateManyArgs>(args?: Prisma.SelectSubset<T, employeesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Employees and returns the data saved in the database.
     * @param {employeesCreateManyAndReturnArgs} args - Arguments to create many Employees.
     * @example
     * // Create many Employees
     * const employees = await prisma.employees.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Employees and only return the `id`
     * const employeesWithIdOnly = await prisma.employees.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends employeesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, employeesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Employees.
     * @param {employeesDeleteArgs} args - Arguments to delete one Employees.
     * @example
     * // Delete one Employees
     * const Employees = await prisma.employees.delete({
     *   where: {
     *     // ... filter to delete one Employees
     *   }
     * })
     *
     */
    delete<T extends employeesDeleteArgs>(args: Prisma.SelectSubset<T, employeesDeleteArgs<ExtArgs>>): Prisma.Prisma__employeesClient<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Employees.
     * @param {employeesUpdateArgs} args - Arguments to update one Employees.
     * @example
     * // Update one Employees
     * const employees = await prisma.employees.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends employeesUpdateArgs>(args: Prisma.SelectSubset<T, employeesUpdateArgs<ExtArgs>>): Prisma.Prisma__employeesClient<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Employees.
     * @param {employeesDeleteManyArgs} args - Arguments to filter Employees to delete.
     * @example
     * // Delete a few Employees
     * const { count } = await prisma.employees.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends employeesDeleteManyArgs>(args?: Prisma.SelectSubset<T, employeesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {employeesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Employees
     * const employees = await prisma.employees.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends employeesUpdateManyArgs>(args: Prisma.SelectSubset<T, employeesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Employees and returns the data updated in the database.
     * @param {employeesUpdateManyAndReturnArgs} args - Arguments to update many Employees.
     * @example
     * // Update many Employees
     * const employees = await prisma.employees.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Employees and only return the `id`
     * const employeesWithIdOnly = await prisma.employees.updateManyAndReturn({
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
    updateManyAndReturn<T extends employeesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, employeesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Employees.
     * @param {employeesUpsertArgs} args - Arguments to update or create a Employees.
     * @example
     * // Update or create a Employees
     * const employees = await prisma.employees.upsert({
     *   create: {
     *     // ... data to create a Employees
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Employees we want to update
     *   }
     * })
     */
    upsert<T extends employeesUpsertArgs>(args: Prisma.SelectSubset<T, employeesUpsertArgs<ExtArgs>>): Prisma.Prisma__employeesClient<runtime.Types.Result.GetResult<Prisma.$employeesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {employeesCountArgs} args - Arguments to filter Employees to count.
     * @example
     * // Count the number of Employees
     * const count = await prisma.employees.count({
     *   where: {
     *     // ... the filter for the Employees we want to count
     *   }
     * })
    **/
    count<T extends employeesCountArgs>(args?: Prisma.Subset<T, employeesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EmployeesCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EmployeesAggregateArgs>(args: Prisma.Subset<T, EmployeesAggregateArgs>): Prisma.PrismaPromise<GetEmployeesAggregateType<T>>;
    /**
     * Group by Employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {employeesGroupByArgs} args - Group by arguments.
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
    groupBy<T extends employeesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: employeesGroupByArgs['orderBy'];
    } : {
        orderBy?: employeesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, employeesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmployeesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the employees model
     */
    readonly fields: employeesFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for employees.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__employeesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farms<T extends Prisma.employees$farmsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.employees$farmsArgs<ExtArgs>>): Prisma.Prisma__farmsClient<runtime.Types.Result.GetResult<Prisma.$farmsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the employees model
 */
export interface employeesFieldRefs {
    readonly id: Prisma.FieldRef<"employees", 'String'>;
    readonly farm_id: Prisma.FieldRef<"employees", 'String'>;
    readonly first_name: Prisma.FieldRef<"employees", 'String'>;
    readonly last_name: Prisma.FieldRef<"employees", 'String'>;
    readonly email: Prisma.FieldRef<"employees", 'String'>;
    readonly phone: Prisma.FieldRef<"employees", 'String'>;
    readonly position: Prisma.FieldRef<"employees", 'String'>;
    readonly status: Prisma.FieldRef<"employees", 'String'>;
    readonly hire_date: Prisma.FieldRef<"employees", 'DateTime'>;
    readonly hourly_rate: Prisma.FieldRef<"employees", 'Decimal'>;
    readonly notes: Prisma.FieldRef<"employees", 'String'>;
    readonly created_at: Prisma.FieldRef<"employees", 'DateTime'>;
}
/**
 * employees findUnique
 */
export type employeesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesInclude<ExtArgs> | null;
    /**
     * Filter, which employees to fetch.
     */
    where: Prisma.employeesWhereUniqueInput;
};
/**
 * employees findUniqueOrThrow
 */
export type employeesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesInclude<ExtArgs> | null;
    /**
     * Filter, which employees to fetch.
     */
    where: Prisma.employeesWhereUniqueInput;
};
/**
 * employees findFirst
 */
export type employeesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesInclude<ExtArgs> | null;
    /**
     * Filter, which employees to fetch.
     */
    where?: Prisma.employeesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of employees to fetch.
     */
    orderBy?: Prisma.employeesOrderByWithRelationInput | Prisma.employeesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for employees.
     */
    cursor?: Prisma.employeesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` employees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` employees.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of employees.
     */
    distinct?: Prisma.EmployeesScalarFieldEnum | Prisma.EmployeesScalarFieldEnum[];
};
/**
 * employees findFirstOrThrow
 */
export type employeesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesInclude<ExtArgs> | null;
    /**
     * Filter, which employees to fetch.
     */
    where?: Prisma.employeesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of employees to fetch.
     */
    orderBy?: Prisma.employeesOrderByWithRelationInput | Prisma.employeesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for employees.
     */
    cursor?: Prisma.employeesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` employees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` employees.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of employees.
     */
    distinct?: Prisma.EmployeesScalarFieldEnum | Prisma.EmployeesScalarFieldEnum[];
};
/**
 * employees findMany
 */
export type employeesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesInclude<ExtArgs> | null;
    /**
     * Filter, which employees to fetch.
     */
    where?: Prisma.employeesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of employees to fetch.
     */
    orderBy?: Prisma.employeesOrderByWithRelationInput | Prisma.employeesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing employees.
     */
    cursor?: Prisma.employeesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` employees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` employees.
     */
    skip?: number;
    distinct?: Prisma.EmployeesScalarFieldEnum | Prisma.EmployeesScalarFieldEnum[];
};
/**
 * employees create
 */
export type employeesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesInclude<ExtArgs> | null;
    /**
     * The data needed to create a employees.
     */
    data: Prisma.XOR<Prisma.employeesCreateInput, Prisma.employeesUncheckedCreateInput>;
};
/**
 * employees createMany
 */
export type employeesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many employees.
     */
    data: Prisma.employeesCreateManyInput | Prisma.employeesCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * employees createManyAndReturn
 */
export type employeesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * The data used to create many employees.
     */
    data: Prisma.employeesCreateManyInput | Prisma.employeesCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * employees update
 */
export type employeesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesInclude<ExtArgs> | null;
    /**
     * The data needed to update a employees.
     */
    data: Prisma.XOR<Prisma.employeesUpdateInput, Prisma.employeesUncheckedUpdateInput>;
    /**
     * Choose, which employees to update.
     */
    where: Prisma.employeesWhereUniqueInput;
};
/**
 * employees updateMany
 */
export type employeesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update employees.
     */
    data: Prisma.XOR<Prisma.employeesUpdateManyMutationInput, Prisma.employeesUncheckedUpdateManyInput>;
    /**
     * Filter which employees to update
     */
    where?: Prisma.employeesWhereInput;
    /**
     * Limit how many employees to update.
     */
    limit?: number;
};
/**
 * employees updateManyAndReturn
 */
export type employeesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * The data used to update employees.
     */
    data: Prisma.XOR<Prisma.employeesUpdateManyMutationInput, Prisma.employeesUncheckedUpdateManyInput>;
    /**
     * Filter which employees to update
     */
    where?: Prisma.employeesWhereInput;
    /**
     * Limit how many employees to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * employees upsert
 */
export type employeesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesInclude<ExtArgs> | null;
    /**
     * The filter to search for the employees to update in case it exists.
     */
    where: Prisma.employeesWhereUniqueInput;
    /**
     * In case the employees found by the `where` argument doesn't exist, create a new employees with this data.
     */
    create: Prisma.XOR<Prisma.employeesCreateInput, Prisma.employeesUncheckedCreateInput>;
    /**
     * In case the employees was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.employeesUpdateInput, Prisma.employeesUncheckedUpdateInput>;
};
/**
 * employees delete
 */
export type employeesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesInclude<ExtArgs> | null;
    /**
     * Filter which employees to delete.
     */
    where: Prisma.employeesWhereUniqueInput;
};
/**
 * employees deleteMany
 */
export type employeesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which employees to delete
     */
    where?: Prisma.employeesWhereInput;
    /**
     * Limit how many employees to delete.
     */
    limit?: number;
};
/**
 * employees.farms
 */
export type employees$farmsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * employees without action
 */
export type employeesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the employees
     */
    select?: Prisma.employeesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the employees
     */
    omit?: Prisma.employeesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.employeesInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=employees.d.ts.map