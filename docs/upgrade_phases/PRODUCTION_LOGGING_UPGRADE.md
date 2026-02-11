# Production Logging Upgrade

**Status:** Draft  
**Priority:** High  
**Estimated Effort:** 2-3 days  
**Target:** Improve production observability and debugging capabilities

## Problem Statement

Current logging implementation lacks actionable information in production:

**Current Issues:**
- Generic HTTP logs ("Request received", "Response sent") without business context
- Query operations only log at DEBUG level (invisible in production)
- No visibility into what data is being returned (counts, IDs, etc.)
- Missing correlation between operations and their outcomes
- No performance metrics for database queries
- Difficult to trace user actions through the system
- No structured business event logging

**Example of Current Uninformative Logs:**
```json
{
  "level": "info",
  "message": "Response sent",
  "statusCode": 200,
  "durationMs": 10.74,
  "url": "/trpc/machines.list?batch=1&input=%7B%220%22%3A%7B%7D%7D"
}
```

**What's Missing:**
- Which procedure was called?
- How many machines were returned?
- Were there any filters applied?
- What was the database query time?
- Any business logic decisions made?

## Research Summary

Based on industry best practices for production logging:

### Key Principles

1. **Structured Logging** - JSON format with consistent key-value pairs for queryability
2. **Appropriate Log Levels**
   - `ERROR`: Failures requiring immediate attention
   - `WARN`: Potential issues, business rule violations
   - `INFO`: Significant business events, procedure completions
   - `DEBUG`: Detailed diagnostic information (dev only)

3. **What to Log in Production**
   - Business events (order created, task completed)
   - Procedure calls with parameters and results
   - Performance metrics (duration, query counts)
   - Validation failures and business rule violations
   - Authentication/authorization events
   - External service calls
   - Data mutations with before/after context

4. **What NOT to Log**
   - Sensitive data (passwords, tokens, PII)
   - Excessive debug information
   - Every database query (only slow queries)
   - Redundant information already in context

5. **Observability Pillars**
   - **Logs**: What happened (events, errors)
   - **Metrics**: How much/how fast (counts, durations)
   - **Traces**: Request flow across services

### References

Content rephrased for compliance with licensing restrictions:

- Structured logging enables query-based debugging instead of grep-based text searching
- Production logs should focus on INFO/WARN/ERROR levels to reduce noise
- Include correlation IDs, tenant/user context, and timing in every log entry
- Middleware should standardize context propagation across all operations
- Log business events as structured data, not narrative text
- Performance metrics should track p95/p99 latencies, not just averages

## Proposed Solution

### Architecture Changes

```
┌─────────────────────────────────────────────────────────┐
│                    Request Entry                         │
│  - Correlation ID generation                            │
│  - Context extraction (user, tenant, farm)              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              tRPC Logging Middleware                     │
│  - Procedure name, type, input                          │
│  - Execution timing                                     │
│  - Result metadata (counts, IDs)                        │
│  - Error capture                                        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│           Domain Layer Logging                          │
│  - Business events (INFO)                               │
│  - Validation failures (WARN)                           │
│  - Data mutations (INFO with context)                   │
│  - Business rule decisions                              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Database Layer                              │
│  - Slow query logging (> 100ms)                         │
│  - Query counts per request                             │
└─────────────────────────────────────────────────────────┘
```

### Implementation Plan

#### Phase 1: tRPC Middleware Enhancement (4 hours)

**Goal:** Add procedure-level logging with business context

**Tasks:**
1. Create tRPC logging middleware
   - Capture procedure name, type (query/mutation)
   - Log input parameters (sanitized)
   - Track execution duration
   - Extract result metadata (counts, IDs)
   - Capture errors with context

2. Add result metadata extraction
   - Detect paginated responses (count items)
   - Detect array responses (count length)
   - Detect single entity responses (extract ID)
   - Detect mutations (extract created/updated IDs)

**Example Output:**
```json
{
  "level": "info",
  "message": "Procedure completed",
  "procedure": "machines.list",
  "type": "query",
  "durationMs": 10.74,
  "resultCount": 3,
  "tenantId": "297506f8-63c1-4248-98d4-ca32e3ff0acf",
  "farmId": "3d492b1a-f1d8-4cbf-897a-9346097fc8f8",
  "userId": "user_39J2et81SbUQn99XQ8h0nvmreRt"
}
```

#### Phase 2: Domain Layer Logging Standards (6 hours)

**Goal:** Establish consistent logging patterns across all domains

**Tasks:**
1. Update command logging
   - Change from DEBUG to INFO for completion events
   - Add before/after context for mutations
   - Include affected entity IDs
   - Log business rule decisions

2. Update query logging
   - Remove DEBUG logs (redundant with middleware)
   - Keep only WARN logs for business issues
   - Add slow query warnings (> 100ms)

3. Create logging guidelines document
   - When to use each log level
   - What context to include
   - Sanitization requirements
   - Examples for common patterns

**Example Command Logging:**
```typescript
// Before
logger.debug('Creating product', { name: input.name });

// After
logger.info('Product created', {
  productId: product.id,
  name: product.name,
  categoryId: product.category_id,
  isActive: product.is_active
});
```

**Example Business Rule Logging:**
```typescript
// Validation failure
logger.warn('Cannot archive product with active orders', {
  productId: id,
  activeOrderCount: orderCount
});
```

#### Phase 3: Performance Monitoring (4 hours)

**Goal:** Track and alert on performance issues

**Tasks:**
1. Add slow query logging
   - Prisma middleware to track query duration
   - Log queries > 100ms threshold
   - Include query type and table

2. Add request performance tracking
   - Track p95/p99 latencies per procedure
   - Log slow requests (> 500ms)
   - Include breakdown (DB time, processing time)

3. Add database connection pool monitoring
   - Log pool exhaustion warnings
   - Track connection acquisition time

**Example Slow Query Log:**
```json
{
  "level": "warn",
  "message": "Slow database query",
  "durationMs": 234,
  "model": "Product",
  "operation": "findMany",
  "procedure": "products.list"
}
```

#### Phase 4: Error Context Enhancement (3 hours)

**Goal:** Improve error debugging with rich context

**Tasks:**
1. Enhance error handler logging
   - Include full request context
   - Add stack traces for 500 errors
   - Include user action context
   - Add correlation IDs

2. Add error aggregation metadata
   - Error type/code
   - Affected entity IDs
   - User impact (which user, which farm)

3. Create error response standards
   - Consistent error codes
   - User-friendly messages
   - Debug information (dev only)

#### Phase 5: Business Event Logging (3 hours)

**Goal:** Track key business events for analytics and auditing

**Tasks:**
1. Define business events to track
   - Order lifecycle (created, confirmed, completed, cancelled)
   - Task lifecycle (generated, started, completed)
   - Product changes (created, updated, archived)
   - Customer changes (created, updated, deactivated)
   - User actions (login, farm switch)

2. Create event logging helper
   - Consistent event structure
   - Automatic context inclusion
   - Event categorization

3. Add event logs to critical paths
   - Order creation flow
   - Task completion flow
   - Product management

**Example Business Event:**
```json
{
  "level": "info",
  "message": "Order created",
  "event": "order.created",
  "orderId": "uuid",
  "orderNumber": "ORD-001",
  "customerId": "uuid",
  "itemCount": 5,
  "totalAmount": 250.00,
  "deliveryDate": "2026-02-20",
  "tasksGenerated": 20
}
```

### Code Changes

#### 1. tRPC Logging Middleware

**File:** `apps/api/src/lib/trpc/trpc.ts`

```typescript
import { logger } from '../logger/index.js';

const loggingMiddleware = t.middleware(async ({ path, type, next, ctx, rawInput }) => {
  const start = Date.now();
  
  try {
    const result = await next();
    const duration = Date.now() - start;

    if (result.ok) {
      const meta = extractResultMetadata(result.data, path, type, duration, ctx);
      logger.info('Procedure completed', meta);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('Procedure failed', {
      procedure: path,
      type,
      durationMs: duration,
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: ctx.auth?.userId,
      tenantId: ctx.auth?.tenantId,
      farmId: ctx.auth?.farmId
    });
    throw error;
  }
});

function extractResultMetadata(data: unknown, path: string, type: string, duration: number, ctx: Context) {
  const meta: Record<string, unknown> = {
    procedure: path,
    type,
    durationMs: duration
  };

  // Add auth context
  if (ctx.auth?.userId) meta.userId = ctx.auth.userId;
  if (ctx.auth?.tenantId) meta.tenantId = ctx.auth.tenantId;
  if (ctx.auth?.farmId) meta.farmId = ctx.auth.farmId;

  // Extract result metadata
  if (data && typeof data === 'object') {
    // Paginated response
    if ('items' in data && Array.isArray(data.items)) {
      meta.resultCount = data.items.length;
      meta.hasMore = data.hasMore;
    }
    // Array response
    else if (Array.isArray(data)) {
      meta.resultCount = data.length;
    }
    // Single entity with ID
    else if ('id' in data) {
      meta.entityId = data.id;
    }
  }

  return meta;
}

// Apply to all procedures
export const publicProcedure = t.procedure.use(loggingMiddleware);
export const authedProcedure = t.procedure.use(loggingMiddleware).use(/* auth middleware */);
```

#### 2. Domain Logging Standards

**Pattern for Commands:**
```typescript
// Create operations
export async function createProduct(ctx: Context, input: CreateProductInput) {
  // No entry log needed (middleware handles it)
  
  // Validation warnings
  const existing = await checkDuplicate(ctx.prisma, input.name);
  if (existing) {
    logger.warn('Duplicate product name', { 
      name: input.name,
      existingId: existing.id 
    });
    throw new TRPCError({ code: 'CONFLICT', message: 'Product name already exists' });
  }

  const product = await ctx.prisma.product.create({ data: input });

  // Success event
  logger.info('Product created', {
    productId: product.id,
    name: product.name,
    categoryId: product.category_id
  });

  return product;
}

// Update operations
export async function updateProduct(ctx: Context, input: UpdateProductInput) {
  const existing = await ctx.prisma.product.findUnique({ where: { id: input.id } });
  
  const product = await ctx.prisma.product.update({
    where: { id: input.id },
    data: input
  });

  // Log what changed
  logger.info('Product updated', {
    productId: product.id,
    changes: getChangedFields(existing, product)
  });

  return product;
}

// Delete/Archive operations
export async function archiveProduct(ctx: Context, id: string) {
  // Check business rules
  const orderCount = await ctx.prisma.orderItem.count({
    where: { product_id: id, order: { status: { in: ['PENDING', 'CONFIRMED'] } } }
  });

  if (orderCount > 0) {
    logger.warn('Cannot archive product with active orders', {
      productId: id,
      activeOrderCount: orderCount
    });
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot archive product with active orders' });
  }

  await ctx.prisma.product.update({
    where: { id },
    data: { is_active: false }
  });

  logger.info('Product archived', { productId: id });
}
```

**Pattern for Queries:**
```typescript
// Simple queries - no logging needed (middleware handles it)
export async function listProducts(ctx: Context, input: ListProductsInput) {
  return ctx.prisma.product.findMany({
    where: buildFilters(input)
  });
}

// Complex queries with business logic
export async function getProductAvailability(ctx: Context, productId: string) {
  const availability = await calculateAvailability(ctx.prisma, productId);
  
  if (availability.stock < availability.reserved) {
    logger.warn('Product oversold', {
      productId,
      stock: availability.stock,
      reserved: availability.reserved,
      deficit: availability.reserved - availability.stock
    });
  }

  return availability;
}
```

#### 3. Slow Query Monitoring

**File:** `apps/api/src/lib/db/index.ts`

```typescript
import { PrismaClient } from '../../generated/prisma/client.js';
import { logger } from '../logger/index.js';
import { getLogContext } from '../logger/logger.js';

const SLOW_QUERY_THRESHOLD_MS = 100;

export const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' }
  ]
});

// Slow query logging
prisma.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;

  if (duration > SLOW_QUERY_THRESHOLD_MS) {
    const context = getLogContext();
    logger.warn('Slow database query', {
      durationMs: duration,
      model: params.model,
      operation: params.action,
      procedure: context?.procedure
    });
  }

  return result;
});

// Error logging
prisma.$on('error', (e) => {
  logger.error('Database error', {
    message: e.message,
    target: e.target
  });
});
```

#### 4. Business Event Helper

**File:** `apps/api/src/lib/logger/events.ts`

```typescript
import { logger } from './index.js';

export type BusinessEvent = 
  | 'order.created'
  | 'order.confirmed'
  | 'order.completed'
  | 'order.cancelled'
  | 'task.generated'
  | 'task.started'
  | 'task.completed'
  | 'product.created'
  | 'product.updated'
  | 'product.archived'
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deactivated';

export function logBusinessEvent(
  event: BusinessEvent,
  message: string,
  data: Record<string, unknown>
) {
  logger.info(message, {
    event,
    ...data
  });
}
```

### Configuration Changes

**File:** `apps/api/.env`

```env
# Logging
LOG_LEVEL=info  # production
# LOG_LEVEL=debug  # development

# Performance thresholds
SLOW_QUERY_THRESHOLD_MS=100
SLOW_REQUEST_THRESHOLD_MS=500
```

### Testing Strategy

#### Unit Tests
- Test metadata extraction from different response types
- Test sanitization of sensitive data
- Test error context capture

#### Integration Tests
- Verify logs are emitted for each procedure type
- Verify context propagation through middleware stack
- Verify slow query detection

#### Manual Testing
- Review production logs for readability
- Verify no sensitive data leakage
- Confirm log volume is manageable
- Test log querying in production log aggregator

### Rollout Plan

1. **Development Environment** (Day 1)
   - Implement changes
   - Verify log output locally
   - Adjust log levels and thresholds

2. **Staging Environment** (Day 2)
   - Deploy to staging
   - Generate realistic traffic
   - Review log volume and quality
   - Tune thresholds

3. **Production Deployment** (Day 3)
   - Deploy during low-traffic period
   - Monitor log volume
   - Watch for performance impact
   - Adjust if needed

### Success Metrics

**Before:**
- Generic HTTP logs only
- No visibility into business operations
- Difficult to debug production issues
- No performance monitoring

**After:**
- Every procedure logged with context
- Business events tracked
- Performance issues visible
- Easy to trace user actions
- Queryable structured logs

**Quantitative Metrics:**
- Mean time to debug (MTTD): Reduce by 50%
- Log query success rate: > 90%
- Slow query detection: 100% of queries > 100ms
- Error context completeness: 100%

### Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Excessive log volume | High costs, performance impact | Set appropriate log levels, sample high-frequency events |
| Sensitive data leakage | Security/compliance violation | Comprehensive sanitization, code review |
| Performance overhead | Slower response times | Async logging, minimal processing in hot path |
| Log storage costs | Budget overrun | Set retention policies, use log levels effectively |

### Future Enhancements

**Phase 6: Metrics & Tracing (Future)**
- Add Prometheus metrics export
- Implement OpenTelemetry tracing
- Add custom dashboards
- Set up alerting rules

**Phase 7: Log Aggregation (Future)**
- Integrate with CloudWatch/Datadog/New Relic
- Create saved queries for common issues
- Set up automated alerts
- Build operational dashboards

## Documentation Updates

1. Update `docs/STYLE.md` with logging guidelines
2. Create `docs/LOGGING.md` with examples
3. Update `docs/AGENT.md` with logging patterns
4. Add logging section to onboarding docs

## Appendix: Log Level Guidelines

### ERROR
- Application crashes
- Database connection failures
- External service failures
- Unhandled exceptions
- Data corruption

### WARN
- Business rule violations
- Validation failures
- Slow queries (> 100ms)
- Deprecated API usage
- Resource constraints (pool exhaustion)
- Recoverable errors

### INFO
- Procedure completions
- Business events (order created, task completed)
- Data mutations (create, update, delete)
- Authentication events
- Configuration changes
- Startup/shutdown events

### DEBUG (Development Only)
- Detailed execution flow
- Variable values
- Query parameters
- Intermediate calculations
- Cache hits/misses

### HTTP (Infrastructure)
- Request/response metadata
- Status codes
- Response times
- Request IDs

## References

- [Better Stack: Node.js Logging Best Practices](https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/)
- [Better Stack: Structured Logging](https://betterstack.com/community/guides/logging/structured-logging/)
- [Better Stack: Log Levels Explained](https://betterstack.com/community/guides/logging/log-levels-explained/)
- [Merge.dev: API Logging Best Practices](https://www.merge.dev/blog/api-logging-best-practices)
- [Observability Engineering Principles](https://www.oreonit.com/devops/how-to-implement-effective-logging-strategies-for-better-observability/)

---

**Next Steps:**
1. Review and approve this plan
2. Create implementation tasks
3. Begin Phase 1: tRPC Middleware Enhancement
4. Follow phased rollout plan
