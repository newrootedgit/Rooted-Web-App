import * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
 * Metrics
 */
export type Metrics = runtime.Metrics;
export type Metric<T> = runtime.Metric<T>;
export type MetricHistogram = runtime.MetricHistogram;
export type MetricHistogramBucket = runtime.MetricHistogramBucket;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 6.19.2
 * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly blend_ingredients: "blend_ingredients";
    readonly blends: "blends";
    readonly customers: "customers";
    readonly employees: "employees";
    readonly farm_layouts: "farm_layouts";
    readonly farm_users: "farm_users";
    readonly farms: "farms";
    readonly machines: "machines";
    readonly order_items: "order_items";
    readonly orders: "orders";
    readonly product_categories: "product_categories";
    readonly products: "products";
    readonly rack_assignments: "rack_assignments";
    readonly recurring_order_schedules: "recurring_order_schedules";
    readonly supplies: "supplies";
    readonly supply_categories: "supply_categories";
    readonly supply_purchases: "supply_purchases";
    readonly supply_usage: "supply_usage";
    readonly tasks: "tasks";
    readonly tenants: "tenants";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "blend_ingredients" | "blends" | "customers" | "employees" | "farm_layouts" | "farm_users" | "farms" | "machines" | "order_items" | "orders" | "product_categories" | "products" | "rack_assignments" | "recurring_order_schedules" | "supplies" | "supply_categories" | "supply_purchases" | "supply_usage" | "tasks" | "tenants";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        blend_ingredients: {
            payload: Prisma.$blend_ingredientsPayload<ExtArgs>;
            fields: Prisma.blend_ingredientsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.blend_ingredientsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blend_ingredientsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.blend_ingredientsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blend_ingredientsPayload>;
                };
                findFirst: {
                    args: Prisma.blend_ingredientsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blend_ingredientsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.blend_ingredientsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blend_ingredientsPayload>;
                };
                findMany: {
                    args: Prisma.blend_ingredientsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blend_ingredientsPayload>[];
                };
                create: {
                    args: Prisma.blend_ingredientsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blend_ingredientsPayload>;
                };
                createMany: {
                    args: Prisma.blend_ingredientsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.blend_ingredientsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blend_ingredientsPayload>[];
                };
                delete: {
                    args: Prisma.blend_ingredientsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blend_ingredientsPayload>;
                };
                update: {
                    args: Prisma.blend_ingredientsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blend_ingredientsPayload>;
                };
                deleteMany: {
                    args: Prisma.blend_ingredientsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.blend_ingredientsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.blend_ingredientsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blend_ingredientsPayload>[];
                };
                upsert: {
                    args: Prisma.blend_ingredientsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blend_ingredientsPayload>;
                };
                aggregate: {
                    args: Prisma.Blend_ingredientsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBlend_ingredients>;
                };
                groupBy: {
                    args: Prisma.blend_ingredientsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Blend_ingredientsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.blend_ingredientsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Blend_ingredientsCountAggregateOutputType> | number;
                };
            };
        };
        blends: {
            payload: Prisma.$blendsPayload<ExtArgs>;
            fields: Prisma.blendsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.blendsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blendsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.blendsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blendsPayload>;
                };
                findFirst: {
                    args: Prisma.blendsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blendsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.blendsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blendsPayload>;
                };
                findMany: {
                    args: Prisma.blendsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blendsPayload>[];
                };
                create: {
                    args: Prisma.blendsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blendsPayload>;
                };
                createMany: {
                    args: Prisma.blendsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.blendsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blendsPayload>[];
                };
                delete: {
                    args: Prisma.blendsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blendsPayload>;
                };
                update: {
                    args: Prisma.blendsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blendsPayload>;
                };
                deleteMany: {
                    args: Prisma.blendsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.blendsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.blendsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blendsPayload>[];
                };
                upsert: {
                    args: Prisma.blendsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$blendsPayload>;
                };
                aggregate: {
                    args: Prisma.BlendsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBlends>;
                };
                groupBy: {
                    args: Prisma.blendsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BlendsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.blendsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BlendsCountAggregateOutputType> | number;
                };
            };
        };
        customers: {
            payload: Prisma.$customersPayload<ExtArgs>;
            fields: Prisma.customersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.customersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$customersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.customersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$customersPayload>;
                };
                findFirst: {
                    args: Prisma.customersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$customersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.customersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$customersPayload>;
                };
                findMany: {
                    args: Prisma.customersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$customersPayload>[];
                };
                create: {
                    args: Prisma.customersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$customersPayload>;
                };
                createMany: {
                    args: Prisma.customersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.customersCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$customersPayload>[];
                };
                delete: {
                    args: Prisma.customersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$customersPayload>;
                };
                update: {
                    args: Prisma.customersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$customersPayload>;
                };
                deleteMany: {
                    args: Prisma.customersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.customersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.customersUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$customersPayload>[];
                };
                upsert: {
                    args: Prisma.customersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$customersPayload>;
                };
                aggregate: {
                    args: Prisma.CustomersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomers>;
                };
                groupBy: {
                    args: Prisma.customersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.customersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomersCountAggregateOutputType> | number;
                };
            };
        };
        employees: {
            payload: Prisma.$employeesPayload<ExtArgs>;
            fields: Prisma.employeesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.employeesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$employeesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.employeesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$employeesPayload>;
                };
                findFirst: {
                    args: Prisma.employeesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$employeesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.employeesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$employeesPayload>;
                };
                findMany: {
                    args: Prisma.employeesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$employeesPayload>[];
                };
                create: {
                    args: Prisma.employeesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$employeesPayload>;
                };
                createMany: {
                    args: Prisma.employeesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.employeesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$employeesPayload>[];
                };
                delete: {
                    args: Prisma.employeesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$employeesPayload>;
                };
                update: {
                    args: Prisma.employeesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$employeesPayload>;
                };
                deleteMany: {
                    args: Prisma.employeesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.employeesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.employeesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$employeesPayload>[];
                };
                upsert: {
                    args: Prisma.employeesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$employeesPayload>;
                };
                aggregate: {
                    args: Prisma.EmployeesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEmployees>;
                };
                groupBy: {
                    args: Prisma.employeesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmployeesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.employeesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmployeesCountAggregateOutputType> | number;
                };
            };
        };
        farm_layouts: {
            payload: Prisma.$farm_layoutsPayload<ExtArgs>;
            fields: Prisma.farm_layoutsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.farm_layoutsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_layoutsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.farm_layoutsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_layoutsPayload>;
                };
                findFirst: {
                    args: Prisma.farm_layoutsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_layoutsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.farm_layoutsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_layoutsPayload>;
                };
                findMany: {
                    args: Prisma.farm_layoutsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_layoutsPayload>[];
                };
                create: {
                    args: Prisma.farm_layoutsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_layoutsPayload>;
                };
                createMany: {
                    args: Prisma.farm_layoutsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.farm_layoutsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_layoutsPayload>[];
                };
                delete: {
                    args: Prisma.farm_layoutsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_layoutsPayload>;
                };
                update: {
                    args: Prisma.farm_layoutsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_layoutsPayload>;
                };
                deleteMany: {
                    args: Prisma.farm_layoutsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.farm_layoutsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.farm_layoutsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_layoutsPayload>[];
                };
                upsert: {
                    args: Prisma.farm_layoutsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_layoutsPayload>;
                };
                aggregate: {
                    args: Prisma.Farm_layoutsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFarm_layouts>;
                };
                groupBy: {
                    args: Prisma.farm_layoutsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Farm_layoutsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.farm_layoutsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Farm_layoutsCountAggregateOutputType> | number;
                };
            };
        };
        farm_users: {
            payload: Prisma.$farm_usersPayload<ExtArgs>;
            fields: Prisma.farm_usersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.farm_usersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_usersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.farm_usersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_usersPayload>;
                };
                findFirst: {
                    args: Prisma.farm_usersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_usersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.farm_usersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_usersPayload>;
                };
                findMany: {
                    args: Prisma.farm_usersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_usersPayload>[];
                };
                create: {
                    args: Prisma.farm_usersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_usersPayload>;
                };
                createMany: {
                    args: Prisma.farm_usersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.farm_usersCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_usersPayload>[];
                };
                delete: {
                    args: Prisma.farm_usersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_usersPayload>;
                };
                update: {
                    args: Prisma.farm_usersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_usersPayload>;
                };
                deleteMany: {
                    args: Prisma.farm_usersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.farm_usersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.farm_usersUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_usersPayload>[];
                };
                upsert: {
                    args: Prisma.farm_usersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farm_usersPayload>;
                };
                aggregate: {
                    args: Prisma.Farm_usersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFarm_users>;
                };
                groupBy: {
                    args: Prisma.farm_usersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Farm_usersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.farm_usersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Farm_usersCountAggregateOutputType> | number;
                };
            };
        };
        farms: {
            payload: Prisma.$farmsPayload<ExtArgs>;
            fields: Prisma.farmsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.farmsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farmsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.farmsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farmsPayload>;
                };
                findFirst: {
                    args: Prisma.farmsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farmsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.farmsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farmsPayload>;
                };
                findMany: {
                    args: Prisma.farmsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farmsPayload>[];
                };
                create: {
                    args: Prisma.farmsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farmsPayload>;
                };
                createMany: {
                    args: Prisma.farmsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.farmsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farmsPayload>[];
                };
                delete: {
                    args: Prisma.farmsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farmsPayload>;
                };
                update: {
                    args: Prisma.farmsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farmsPayload>;
                };
                deleteMany: {
                    args: Prisma.farmsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.farmsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.farmsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farmsPayload>[];
                };
                upsert: {
                    args: Prisma.farmsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$farmsPayload>;
                };
                aggregate: {
                    args: Prisma.FarmsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFarms>;
                };
                groupBy: {
                    args: Prisma.farmsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FarmsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.farmsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FarmsCountAggregateOutputType> | number;
                };
            };
        };
        machines: {
            payload: Prisma.$machinesPayload<ExtArgs>;
            fields: Prisma.machinesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.machinesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$machinesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.machinesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$machinesPayload>;
                };
                findFirst: {
                    args: Prisma.machinesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$machinesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.machinesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$machinesPayload>;
                };
                findMany: {
                    args: Prisma.machinesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$machinesPayload>[];
                };
                create: {
                    args: Prisma.machinesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$machinesPayload>;
                };
                createMany: {
                    args: Prisma.machinesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.machinesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$machinesPayload>[];
                };
                delete: {
                    args: Prisma.machinesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$machinesPayload>;
                };
                update: {
                    args: Prisma.machinesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$machinesPayload>;
                };
                deleteMany: {
                    args: Prisma.machinesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.machinesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.machinesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$machinesPayload>[];
                };
                upsert: {
                    args: Prisma.machinesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$machinesPayload>;
                };
                aggregate: {
                    args: Prisma.MachinesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMachines>;
                };
                groupBy: {
                    args: Prisma.machinesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MachinesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.machinesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MachinesCountAggregateOutputType> | number;
                };
            };
        };
        order_items: {
            payload: Prisma.$order_itemsPayload<ExtArgs>;
            fields: Prisma.order_itemsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.order_itemsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$order_itemsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.order_itemsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$order_itemsPayload>;
                };
                findFirst: {
                    args: Prisma.order_itemsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$order_itemsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.order_itemsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$order_itemsPayload>;
                };
                findMany: {
                    args: Prisma.order_itemsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$order_itemsPayload>[];
                };
                create: {
                    args: Prisma.order_itemsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$order_itemsPayload>;
                };
                createMany: {
                    args: Prisma.order_itemsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.order_itemsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$order_itemsPayload>[];
                };
                delete: {
                    args: Prisma.order_itemsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$order_itemsPayload>;
                };
                update: {
                    args: Prisma.order_itemsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$order_itemsPayload>;
                };
                deleteMany: {
                    args: Prisma.order_itemsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.order_itemsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.order_itemsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$order_itemsPayload>[];
                };
                upsert: {
                    args: Prisma.order_itemsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$order_itemsPayload>;
                };
                aggregate: {
                    args: Prisma.Order_itemsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrder_items>;
                };
                groupBy: {
                    args: Prisma.order_itemsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Order_itemsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.order_itemsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Order_itemsCountAggregateOutputType> | number;
                };
            };
        };
        orders: {
            payload: Prisma.$ordersPayload<ExtArgs>;
            fields: Prisma.ordersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ordersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ordersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ordersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ordersPayload>;
                };
                findFirst: {
                    args: Prisma.ordersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ordersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ordersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ordersPayload>;
                };
                findMany: {
                    args: Prisma.ordersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ordersPayload>[];
                };
                create: {
                    args: Prisma.ordersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ordersPayload>;
                };
                createMany: {
                    args: Prisma.ordersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ordersCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ordersPayload>[];
                };
                delete: {
                    args: Prisma.ordersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ordersPayload>;
                };
                update: {
                    args: Prisma.ordersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ordersPayload>;
                };
                deleteMany: {
                    args: Prisma.ordersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ordersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ordersUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ordersPayload>[];
                };
                upsert: {
                    args: Prisma.ordersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ordersPayload>;
                };
                aggregate: {
                    args: Prisma.OrdersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrders>;
                };
                groupBy: {
                    args: Prisma.ordersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrdersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ordersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrdersCountAggregateOutputType> | number;
                };
            };
        };
        product_categories: {
            payload: Prisma.$product_categoriesPayload<ExtArgs>;
            fields: Prisma.product_categoriesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.product_categoriesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_categoriesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.product_categoriesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_categoriesPayload>;
                };
                findFirst: {
                    args: Prisma.product_categoriesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_categoriesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.product_categoriesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_categoriesPayload>;
                };
                findMany: {
                    args: Prisma.product_categoriesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_categoriesPayload>[];
                };
                create: {
                    args: Prisma.product_categoriesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_categoriesPayload>;
                };
                createMany: {
                    args: Prisma.product_categoriesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.product_categoriesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_categoriesPayload>[];
                };
                delete: {
                    args: Prisma.product_categoriesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_categoriesPayload>;
                };
                update: {
                    args: Prisma.product_categoriesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_categoriesPayload>;
                };
                deleteMany: {
                    args: Prisma.product_categoriesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.product_categoriesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.product_categoriesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_categoriesPayload>[];
                };
                upsert: {
                    args: Prisma.product_categoriesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_categoriesPayload>;
                };
                aggregate: {
                    args: Prisma.Product_categoriesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProduct_categories>;
                };
                groupBy: {
                    args: Prisma.product_categoriesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Product_categoriesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.product_categoriesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Product_categoriesCountAggregateOutputType> | number;
                };
            };
        };
        products: {
            payload: Prisma.$productsPayload<ExtArgs>;
            fields: Prisma.productsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.productsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.productsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                findFirst: {
                    args: Prisma.productsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.productsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                findMany: {
                    args: Prisma.productsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>[];
                };
                create: {
                    args: Prisma.productsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                createMany: {
                    args: Prisma.productsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.productsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>[];
                };
                delete: {
                    args: Prisma.productsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                update: {
                    args: Prisma.productsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                deleteMany: {
                    args: Prisma.productsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.productsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.productsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>[];
                };
                upsert: {
                    args: Prisma.productsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                aggregate: {
                    args: Prisma.ProductsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProducts>;
                };
                groupBy: {
                    args: Prisma.productsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.productsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductsCountAggregateOutputType> | number;
                };
            };
        };
        rack_assignments: {
            payload: Prisma.$rack_assignmentsPayload<ExtArgs>;
            fields: Prisma.rack_assignmentsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.rack_assignmentsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$rack_assignmentsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.rack_assignmentsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$rack_assignmentsPayload>;
                };
                findFirst: {
                    args: Prisma.rack_assignmentsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$rack_assignmentsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.rack_assignmentsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$rack_assignmentsPayload>;
                };
                findMany: {
                    args: Prisma.rack_assignmentsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$rack_assignmentsPayload>[];
                };
                create: {
                    args: Prisma.rack_assignmentsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$rack_assignmentsPayload>;
                };
                createMany: {
                    args: Prisma.rack_assignmentsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.rack_assignmentsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$rack_assignmentsPayload>[];
                };
                delete: {
                    args: Prisma.rack_assignmentsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$rack_assignmentsPayload>;
                };
                update: {
                    args: Prisma.rack_assignmentsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$rack_assignmentsPayload>;
                };
                deleteMany: {
                    args: Prisma.rack_assignmentsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.rack_assignmentsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.rack_assignmentsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$rack_assignmentsPayload>[];
                };
                upsert: {
                    args: Prisma.rack_assignmentsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$rack_assignmentsPayload>;
                };
                aggregate: {
                    args: Prisma.Rack_assignmentsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRack_assignments>;
                };
                groupBy: {
                    args: Prisma.rack_assignmentsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Rack_assignmentsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.rack_assignmentsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Rack_assignmentsCountAggregateOutputType> | number;
                };
            };
        };
        recurring_order_schedules: {
            payload: Prisma.$recurring_order_schedulesPayload<ExtArgs>;
            fields: Prisma.recurring_order_schedulesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.recurring_order_schedulesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_order_schedulesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.recurring_order_schedulesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_order_schedulesPayload>;
                };
                findFirst: {
                    args: Prisma.recurring_order_schedulesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_order_schedulesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.recurring_order_schedulesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_order_schedulesPayload>;
                };
                findMany: {
                    args: Prisma.recurring_order_schedulesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_order_schedulesPayload>[];
                };
                create: {
                    args: Prisma.recurring_order_schedulesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_order_schedulesPayload>;
                };
                createMany: {
                    args: Prisma.recurring_order_schedulesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.recurring_order_schedulesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_order_schedulesPayload>[];
                };
                delete: {
                    args: Prisma.recurring_order_schedulesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_order_schedulesPayload>;
                };
                update: {
                    args: Prisma.recurring_order_schedulesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_order_schedulesPayload>;
                };
                deleteMany: {
                    args: Prisma.recurring_order_schedulesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.recurring_order_schedulesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.recurring_order_schedulesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_order_schedulesPayload>[];
                };
                upsert: {
                    args: Prisma.recurring_order_schedulesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$recurring_order_schedulesPayload>;
                };
                aggregate: {
                    args: Prisma.Recurring_order_schedulesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRecurring_order_schedules>;
                };
                groupBy: {
                    args: Prisma.recurring_order_schedulesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Recurring_order_schedulesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.recurring_order_schedulesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Recurring_order_schedulesCountAggregateOutputType> | number;
                };
            };
        };
        supplies: {
            payload: Prisma.$suppliesPayload<ExtArgs>;
            fields: Prisma.suppliesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.suppliesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$suppliesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.suppliesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$suppliesPayload>;
                };
                findFirst: {
                    args: Prisma.suppliesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$suppliesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.suppliesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$suppliesPayload>;
                };
                findMany: {
                    args: Prisma.suppliesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$suppliesPayload>[];
                };
                create: {
                    args: Prisma.suppliesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$suppliesPayload>;
                };
                createMany: {
                    args: Prisma.suppliesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.suppliesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$suppliesPayload>[];
                };
                delete: {
                    args: Prisma.suppliesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$suppliesPayload>;
                };
                update: {
                    args: Prisma.suppliesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$suppliesPayload>;
                };
                deleteMany: {
                    args: Prisma.suppliesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.suppliesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.suppliesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$suppliesPayload>[];
                };
                upsert: {
                    args: Prisma.suppliesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$suppliesPayload>;
                };
                aggregate: {
                    args: Prisma.SuppliesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSupplies>;
                };
                groupBy: {
                    args: Prisma.suppliesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SuppliesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.suppliesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SuppliesCountAggregateOutputType> | number;
                };
            };
        };
        supply_categories: {
            payload: Prisma.$supply_categoriesPayload<ExtArgs>;
            fields: Prisma.supply_categoriesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.supply_categoriesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_categoriesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.supply_categoriesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_categoriesPayload>;
                };
                findFirst: {
                    args: Prisma.supply_categoriesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_categoriesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.supply_categoriesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_categoriesPayload>;
                };
                findMany: {
                    args: Prisma.supply_categoriesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_categoriesPayload>[];
                };
                create: {
                    args: Prisma.supply_categoriesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_categoriesPayload>;
                };
                createMany: {
                    args: Prisma.supply_categoriesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.supply_categoriesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_categoriesPayload>[];
                };
                delete: {
                    args: Prisma.supply_categoriesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_categoriesPayload>;
                };
                update: {
                    args: Prisma.supply_categoriesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_categoriesPayload>;
                };
                deleteMany: {
                    args: Prisma.supply_categoriesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.supply_categoriesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.supply_categoriesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_categoriesPayload>[];
                };
                upsert: {
                    args: Prisma.supply_categoriesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_categoriesPayload>;
                };
                aggregate: {
                    args: Prisma.Supply_categoriesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSupply_categories>;
                };
                groupBy: {
                    args: Prisma.supply_categoriesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Supply_categoriesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.supply_categoriesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Supply_categoriesCountAggregateOutputType> | number;
                };
            };
        };
        supply_purchases: {
            payload: Prisma.$supply_purchasesPayload<ExtArgs>;
            fields: Prisma.supply_purchasesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.supply_purchasesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_purchasesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.supply_purchasesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_purchasesPayload>;
                };
                findFirst: {
                    args: Prisma.supply_purchasesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_purchasesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.supply_purchasesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_purchasesPayload>;
                };
                findMany: {
                    args: Prisma.supply_purchasesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_purchasesPayload>[];
                };
                create: {
                    args: Prisma.supply_purchasesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_purchasesPayload>;
                };
                createMany: {
                    args: Prisma.supply_purchasesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.supply_purchasesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_purchasesPayload>[];
                };
                delete: {
                    args: Prisma.supply_purchasesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_purchasesPayload>;
                };
                update: {
                    args: Prisma.supply_purchasesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_purchasesPayload>;
                };
                deleteMany: {
                    args: Prisma.supply_purchasesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.supply_purchasesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.supply_purchasesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_purchasesPayload>[];
                };
                upsert: {
                    args: Prisma.supply_purchasesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_purchasesPayload>;
                };
                aggregate: {
                    args: Prisma.Supply_purchasesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSupply_purchases>;
                };
                groupBy: {
                    args: Prisma.supply_purchasesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Supply_purchasesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.supply_purchasesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Supply_purchasesCountAggregateOutputType> | number;
                };
            };
        };
        supply_usage: {
            payload: Prisma.$supply_usagePayload<ExtArgs>;
            fields: Prisma.supply_usageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.supply_usageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_usagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.supply_usageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_usagePayload>;
                };
                findFirst: {
                    args: Prisma.supply_usageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_usagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.supply_usageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_usagePayload>;
                };
                findMany: {
                    args: Prisma.supply_usageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_usagePayload>[];
                };
                create: {
                    args: Prisma.supply_usageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_usagePayload>;
                };
                createMany: {
                    args: Prisma.supply_usageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.supply_usageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_usagePayload>[];
                };
                delete: {
                    args: Prisma.supply_usageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_usagePayload>;
                };
                update: {
                    args: Prisma.supply_usageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_usagePayload>;
                };
                deleteMany: {
                    args: Prisma.supply_usageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.supply_usageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.supply_usageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_usagePayload>[];
                };
                upsert: {
                    args: Prisma.supply_usageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$supply_usagePayload>;
                };
                aggregate: {
                    args: Prisma.Supply_usageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSupply_usage>;
                };
                groupBy: {
                    args: Prisma.supply_usageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Supply_usageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.supply_usageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Supply_usageCountAggregateOutputType> | number;
                };
            };
        };
        tasks: {
            payload: Prisma.$tasksPayload<ExtArgs>;
            fields: Prisma.tasksFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.tasksFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tasksPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.tasksFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tasksPayload>;
                };
                findFirst: {
                    args: Prisma.tasksFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tasksPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.tasksFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tasksPayload>;
                };
                findMany: {
                    args: Prisma.tasksFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tasksPayload>[];
                };
                create: {
                    args: Prisma.tasksCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tasksPayload>;
                };
                createMany: {
                    args: Prisma.tasksCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.tasksCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tasksPayload>[];
                };
                delete: {
                    args: Prisma.tasksDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tasksPayload>;
                };
                update: {
                    args: Prisma.tasksUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tasksPayload>;
                };
                deleteMany: {
                    args: Prisma.tasksDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.tasksUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.tasksUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tasksPayload>[];
                };
                upsert: {
                    args: Prisma.tasksUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tasksPayload>;
                };
                aggregate: {
                    args: Prisma.TasksAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTasks>;
                };
                groupBy: {
                    args: Prisma.tasksGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TasksGroupByOutputType>[];
                };
                count: {
                    args: Prisma.tasksCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TasksCountAggregateOutputType> | number;
                };
            };
        };
        tenants: {
            payload: Prisma.$tenantsPayload<ExtArgs>;
            fields: Prisma.tenantsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.tenantsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tenantsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.tenantsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tenantsPayload>;
                };
                findFirst: {
                    args: Prisma.tenantsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tenantsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.tenantsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tenantsPayload>;
                };
                findMany: {
                    args: Prisma.tenantsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tenantsPayload>[];
                };
                create: {
                    args: Prisma.tenantsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tenantsPayload>;
                };
                createMany: {
                    args: Prisma.tenantsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.tenantsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tenantsPayload>[];
                };
                delete: {
                    args: Prisma.tenantsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tenantsPayload>;
                };
                update: {
                    args: Prisma.tenantsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tenantsPayload>;
                };
                deleteMany: {
                    args: Prisma.tenantsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.tenantsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.tenantsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tenantsPayload>[];
                };
                upsert: {
                    args: Prisma.tenantsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tenantsPayload>;
                };
                aggregate: {
                    args: Prisma.TenantsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTenants>;
                };
                groupBy: {
                    args: Prisma.tenantsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TenantsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.tenantsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TenantsCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const Blend_ingredientsScalarFieldEnum: {
    readonly id: "id";
    readonly blend_id: "blend_id";
    readonly product_id: "product_id";
    readonly percentage: "percentage";
    readonly timing_override: "timing_override";
};
export type Blend_ingredientsScalarFieldEnum = (typeof Blend_ingredientsScalarFieldEnum)[keyof typeof Blend_ingredientsScalarFieldEnum];
export declare const BlendsScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly description: "description";
    readonly created_at: "created_at";
};
export type BlendsScalarFieldEnum = (typeof BlendsScalarFieldEnum)[keyof typeof BlendsScalarFieldEnum];
export declare const CustomersScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly email: "email";
    readonly phone: "phone";
    readonly company_name: "company_name";
    readonly customer_type: "customer_type";
    readonly payment_terms: "payment_terms";
    readonly address: "address";
    readonly tags: "tags";
    readonly notes: "notes";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
};
export type CustomersScalarFieldEnum = (typeof CustomersScalarFieldEnum)[keyof typeof CustomersScalarFieldEnum];
export declare const EmployeesScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly first_name: "first_name";
    readonly last_name: "last_name";
    readonly email: "email";
    readonly phone: "phone";
    readonly position: "position";
    readonly status: "status";
    readonly hire_date: "hire_date";
    readonly hourly_rate: "hourly_rate";
    readonly notes: "notes";
    readonly created_at: "created_at";
};
export type EmployeesScalarFieldEnum = (typeof EmployeesScalarFieldEnum)[keyof typeof EmployeesScalarFieldEnum];
export declare const Farm_layoutsScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly canvas_data: "canvas_data";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
};
export type Farm_layoutsScalarFieldEnum = (typeof Farm_layoutsScalarFieldEnum)[keyof typeof Farm_layoutsScalarFieldEnum];
export declare const Farm_usersScalarFieldEnum: {
    readonly id: "id";
    readonly tenant_id: "tenant_id";
    readonly farm_id: "farm_id";
    readonly clerk_user_id: "clerk_user_id";
    readonly role: "role";
    readonly first_name: "first_name";
    readonly last_name: "last_name";
    readonly email: "email";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
};
export type Farm_usersScalarFieldEnum = (typeof Farm_usersScalarFieldEnum)[keyof typeof Farm_usersScalarFieldEnum];
export declare const FarmsScalarFieldEnum: {
    readonly tenant_id: "tenant_id";
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly logo_url: "logo_url";
    readonly brand_color: "brand_color";
    readonly contact_email: "contact_email";
    readonly contact_phone: "contact_phone";
    readonly address: "address";
    readonly settings: "settings";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type FarmsScalarFieldEnum = (typeof FarmsScalarFieldEnum)[keyof typeof FarmsScalarFieldEnum];
export declare const MachinesScalarFieldEnum: {
    readonly id: "id";
    readonly tenant_id: "tenant_id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly display_name: "display_name";
    readonly device_id: "device_id";
    readonly created_at: "created_at";
    readonly aws_iot_thing_name: "aws_iot_thing_name";
    readonly status: "status";
    readonly last_seen_at: "last_seen_at";
    readonly current_wifi_ssid: "current_wifi_ssid";
};
export type MachinesScalarFieldEnum = (typeof MachinesScalarFieldEnum)[keyof typeof MachinesScalarFieldEnum];
export declare const Order_itemsScalarFieldEnum: {
    readonly id: "id";
    readonly order_id: "order_id";
    readonly product_id: "product_id";
    readonly blend_id: "blend_id";
    readonly quantity_oz: "quantity_oz";
    readonly harvest_date: "harvest_date";
    readonly overage_percent: "overage_percent";
    readonly trays_needed: "trays_needed";
    readonly soak_date: "soak_date";
    readonly seed_date: "seed_date";
    readonly move_to_light_date: "move_to_light_date";
    readonly created_at: "created_at";
};
export type Order_itemsScalarFieldEnum = (typeof Order_itemsScalarFieldEnum)[keyof typeof Order_itemsScalarFieldEnum];
export declare const OrdersScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly customer_id: "customer_id";
    readonly order_number: "order_number";
    readonly status: "status";
    readonly notes: "notes";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type OrdersScalarFieldEnum = (typeof OrdersScalarFieldEnum)[keyof typeof OrdersScalarFieldEnum];
export declare const Product_categoriesScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly description: "description";
    readonly created_at: "created_at";
};
export type Product_categoriesScalarFieldEnum = (typeof Product_categoriesScalarFieldEnum)[keyof typeof Product_categoriesScalarFieldEnum];
export declare const ProductsScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly category_id: "category_id";
    readonly name: "name";
    readonly sku: "sku";
    readonly days_soaking: "days_soaking";
    readonly days_germination: "days_germination";
    readonly days_light: "days_light";
    readonly avg_yield_per_tray: "avg_yield_per_tray";
    readonly seed_weight: "seed_weight";
    readonly seed_unit: "seed_unit";
    readonly unit_cost: "unit_cost";
    readonly unit_price: "unit_price";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
};
export type ProductsScalarFieldEnum = (typeof ProductsScalarFieldEnum)[keyof typeof ProductsScalarFieldEnum];
export declare const Rack_assignmentsScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly rack_element_id: "rack_element_id";
    readonly level: "level";
    readonly order_item_id: "order_item_id";
    readonly tray_count: "tray_count";
    readonly assigned_at: "assigned_at";
    readonly assigned_by: "assigned_by";
    readonly is_active: "is_active";
    readonly removed_at: "removed_at";
};
export type Rack_assignmentsScalarFieldEnum = (typeof Rack_assignmentsScalarFieldEnum)[keyof typeof Rack_assignmentsScalarFieldEnum];
export declare const Recurring_order_schedulesScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly customer_id: "customer_id";
    readonly name: "name";
    readonly schedule_type: "schedule_type";
    readonly days_of_week: "days_of_week";
    readonly interval_days: "interval_days";
    readonly start_date: "start_date";
    readonly end_date: "end_date";
    readonly lead_time_days: "lead_time_days";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
};
export type Recurring_order_schedulesScalarFieldEnum = (typeof Recurring_order_schedulesScalarFieldEnum)[keyof typeof Recurring_order_schedulesScalarFieldEnum];
export declare const SuppliesScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly category_id: "category_id";
    readonly product_id: "product_id";
    readonly name: "name";
    readonly sku: "sku";
    readonly current_stock: "current_stock";
    readonly unit: "unit";
    readonly reorder_level: "reorder_level";
    readonly created_at: "created_at";
};
export type SuppliesScalarFieldEnum = (typeof SuppliesScalarFieldEnum)[keyof typeof SuppliesScalarFieldEnum];
export declare const Supply_categoriesScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly name: "name";
    readonly description: "description";
    readonly created_at: "created_at";
};
export type Supply_categoriesScalarFieldEnum = (typeof Supply_categoriesScalarFieldEnum)[keyof typeof Supply_categoriesScalarFieldEnum];
export declare const Supply_purchasesScalarFieldEnum: {
    readonly id: "id";
    readonly supply_id: "supply_id";
    readonly quantity: "quantity";
    readonly unit_cost: "unit_cost";
    readonly total_cost: "total_cost";
    readonly supplier: "supplier";
    readonly lot_number: "lot_number";
    readonly expiry_date: "expiry_date";
    readonly purchase_date: "purchase_date";
    readonly notes: "notes";
    readonly created_at: "created_at";
};
export type Supply_purchasesScalarFieldEnum = (typeof Supply_purchasesScalarFieldEnum)[keyof typeof Supply_purchasesScalarFieldEnum];
export declare const Supply_usageScalarFieldEnum: {
    readonly id: "id";
    readonly supply_id: "supply_id";
    readonly task_id: "task_id";
    readonly quantity: "quantity";
    readonly usage_type: "usage_type";
    readonly notes: "notes";
    readonly created_at: "created_at";
};
export type Supply_usageScalarFieldEnum = (typeof Supply_usageScalarFieldEnum)[keyof typeof Supply_usageScalarFieldEnum];
export declare const TasksScalarFieldEnum: {
    readonly id: "id";
    readonly farm_id: "farm_id";
    readonly order_item_id: "order_item_id";
    readonly title: "title";
    readonly type: "type";
    readonly due_date: "due_date";
    readonly status: "status";
    readonly priority: "priority";
    readonly completed_at: "completed_at";
    readonly completed_by: "completed_by";
    readonly completion_notes: "completion_notes";
    readonly actual_trays: "actual_trays";
    readonly seed_lot: "seed_lot";
    readonly created_at: "created_at";
};
export type TasksScalarFieldEnum = (typeof TasksScalarFieldEnum)[keyof typeof TasksScalarFieldEnum];
export declare const TenantsScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly slug: "slug";
    readonly contact_email: "contact_email";
    readonly contact_phone: "contact_phone";
    readonly settings: "settings";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type TenantsScalarFieldEnum = (typeof TenantsScalarFieldEnum)[keyof typeof TenantsScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const JsonNullValueInput: {
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const JsonNullValueFilter: {
    readonly DbNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly JsonNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
    readonly AnyNull: {
        "__#private@#private": any;
        _getNamespace(): string;
        _getName(): string;
        toString(): string;
    };
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
/**
 * Field references
 */
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'String[]'
 */
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
/**
 * Reference to a field of type 'Decimal'
 */
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
/**
 * Reference to a field of type 'Decimal[]'
 */
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
/**
 * Reference to a field of type 'Json'
 */
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
/**
 * Reference to a field of type 'QueryMode'
 */
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'DateTime[]'
 */
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'Int[]'
 */
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Reference to a field of type 'Float[]'
 */
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export type Datasource = {
    url?: string;
};
export type Datasources = {
    db?: Datasource;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null;
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: GlobalOmitConfig;
}
export type GlobalOmitConfig = {
    blend_ingredients?: Prisma.blend_ingredientsOmit;
    blends?: Prisma.blendsOmit;
    customers?: Prisma.customersOmit;
    employees?: Prisma.employeesOmit;
    farm_layouts?: Prisma.farm_layoutsOmit;
    farm_users?: Prisma.farm_usersOmit;
    farms?: Prisma.farmsOmit;
    machines?: Prisma.machinesOmit;
    order_items?: Prisma.order_itemsOmit;
    orders?: Prisma.ordersOmit;
    product_categories?: Prisma.product_categoriesOmit;
    products?: Prisma.productsOmit;
    rack_assignments?: Prisma.rack_assignmentsOmit;
    recurring_order_schedules?: Prisma.recurring_order_schedulesOmit;
    supplies?: Prisma.suppliesOmit;
    supply_categories?: Prisma.supply_categoriesOmit;
    supply_purchases?: Prisma.supply_purchasesOmit;
    supply_usage?: Prisma.supply_usageOmit;
    tasks?: Prisma.tasksOmit;
    tenants?: Prisma.tenantsOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
//# sourceMappingURL=prismaNamespace.d.ts.map