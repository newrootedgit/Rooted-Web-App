import * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "./prismaNamespace.js";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   *
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Blend_ingredients
   * const blend_ingredients = await prisma.blend_ingredients.findMany()
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options?: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Blend_ingredients
 * const blend_ingredients = await prisma.blend_ingredients.findMany()
 * ```
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = Prisma.PrismaClientOptions['omit'], in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
       */
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
     */
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
     */
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.blend_ingredients`: Exposes CRUD operations for the **blend_ingredients** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Blend_ingredients
  * const blend_ingredients = await prisma.blend_ingredients.findMany()
  * ```
  */
    get blend_ingredients(): Prisma.blend_ingredientsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.blends`: Exposes CRUD operations for the **blends** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Blends
      * const blends = await prisma.blends.findMany()
      * ```
      */
    get blends(): Prisma.blendsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.customers`: Exposes CRUD operations for the **customers** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Customers
      * const customers = await prisma.customers.findMany()
      * ```
      */
    get customers(): Prisma.customersDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.employees`: Exposes CRUD operations for the **employees** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Employees
      * const employees = await prisma.employees.findMany()
      * ```
      */
    get employees(): Prisma.employeesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.farm_layouts`: Exposes CRUD operations for the **farm_layouts** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Farm_layouts
      * const farm_layouts = await prisma.farm_layouts.findMany()
      * ```
      */
    get farm_layouts(): Prisma.farm_layoutsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.farm_users`: Exposes CRUD operations for the **farm_users** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Farm_users
      * const farm_users = await prisma.farm_users.findMany()
      * ```
      */
    get farm_users(): Prisma.farm_usersDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.farms`: Exposes CRUD operations for the **farms** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Farms
      * const farms = await prisma.farms.findMany()
      * ```
      */
    get farms(): Prisma.farmsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.machines`: Exposes CRUD operations for the **machines** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Machines
      * const machines = await prisma.machines.findMany()
      * ```
      */
    get machines(): Prisma.machinesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.order_items`: Exposes CRUD operations for the **order_items** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Order_items
      * const order_items = await prisma.order_items.findMany()
      * ```
      */
    get order_items(): Prisma.order_itemsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.orders`: Exposes CRUD operations for the **orders** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Orders
      * const orders = await prisma.orders.findMany()
      * ```
      */
    get orders(): Prisma.ordersDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.product_categories`: Exposes CRUD operations for the **product_categories** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Product_categories
      * const product_categories = await prisma.product_categories.findMany()
      * ```
      */
    get product_categories(): Prisma.product_categoriesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.products`: Exposes CRUD operations for the **products** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Products
      * const products = await prisma.products.findMany()
      * ```
      */
    get products(): Prisma.productsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.rack_assignments`: Exposes CRUD operations for the **rack_assignments** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Rack_assignments
      * const rack_assignments = await prisma.rack_assignments.findMany()
      * ```
      */
    get rack_assignments(): Prisma.rack_assignmentsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.recurring_order_schedules`: Exposes CRUD operations for the **recurring_order_schedules** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Recurring_order_schedules
      * const recurring_order_schedules = await prisma.recurring_order_schedules.findMany()
      * ```
      */
    get recurring_order_schedules(): Prisma.recurring_order_schedulesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.supplies`: Exposes CRUD operations for the **supplies** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Supplies
      * const supplies = await prisma.supplies.findMany()
      * ```
      */
    get supplies(): Prisma.suppliesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.supply_categories`: Exposes CRUD operations for the **supply_categories** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Supply_categories
      * const supply_categories = await prisma.supply_categories.findMany()
      * ```
      */
    get supply_categories(): Prisma.supply_categoriesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.supply_purchases`: Exposes CRUD operations for the **supply_purchases** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Supply_purchases
      * const supply_purchases = await prisma.supply_purchases.findMany()
      * ```
      */
    get supply_purchases(): Prisma.supply_purchasesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.supply_usage`: Exposes CRUD operations for the **supply_usage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Supply_usages
      * const supply_usages = await prisma.supply_usage.findMany()
      * ```
      */
    get supply_usage(): Prisma.supply_usageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.tasks`: Exposes CRUD operations for the **tasks** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Tasks
      * const tasks = await prisma.tasks.findMany()
      * ```
      */
    get tasks(): Prisma.tasksDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.tenants`: Exposes CRUD operations for the **tenants** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Tenants
      * const tenants = await prisma.tenants.findMany()
      * ```
      */
    get tenants(): Prisma.tenantsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(dirname: string): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map