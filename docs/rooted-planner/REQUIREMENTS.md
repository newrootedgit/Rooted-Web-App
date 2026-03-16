# Business Requirements - Rooted Planner

## Implementation Status

Current implementation coverage:

- implemented: product catalog, categories, blends, customers, orders, tasks, production views, farm layout
- partially implemented: rack assignment flows inside production/farm layout work
- not implemented yet: recurring orders, employees, supplies/inventory, reporting automation

## Introduction

Rooted Planner is a microgreen farm management application that enables farm operators to manage their complete production workflow from order creation to harvest completion. This document defines the business requirements and user interactions for the system.

## Glossary

- **Farm**: A microgreen production facility managed by the application
- **Product**: A microgreen variety (e.g., Arugula, Pea Shoots) with specific growing parameters
- **Blend**: A composite product made from multiple microgreen varieties
- **Order**: A customer request for specific products with target harvest dates
- **Task**: A production step in the growing workflow (SOAK, SEED, MOVE_TO_LIGHT, HARVEST)
- **Tray**: Physical growing container used in production
- **Rack**: Growing structure with multiple levels for tray placement

## User Roles

- **Farm Owner**: Full system access, can manage all settings and users
- **Farm Manager**: Can manage production, orders, and operational data
- **Farm Operator**: Can complete tasks and view production schedules
- **Admin**: Technical administrator with full operational access

---

## Product Management Requirements

### Requirement 1: Product Catalog Management

**User Story:** As a farm manager, I want to manage my microgreen varieties and their growing parameters, so that I can accurately plan production and calculate timing.

#### Business Rules

1. Users MUST be able to create microgreen products with the following required information:
   - Product name (MUST be unique within the farm)
   - Days for soaking seeds
   - Days for germination (dark/dome phase)
   - Days under grow lights
   - Average yield per tray in ounces

2. Users SHOULD be able to organize products into categories for better management

3. Users CAN add optional information including:
   - SKU code
   - Seed weight and unit
   - Unit cost and selling price
   - Growing notes and instructions

4. Users MUST be able to archive products that are no longer grown while preserving historical data

5. The system MUST prevent deletion of products that have been used in orders or tasks

### Requirement 2: Blend/Mix Management

**User Story:** As a farm manager, I want to create composite products from multiple varieties, so that I can offer mixed products to customers.

#### Business Rules

1. Users MUST be able to create blends with:
   - Blend name and description
   - Multiple ingredient products with percentage ratios
   - Ingredient percentages MUST total exactly 100%

2. The system MUST automatically calculate blend timing based on the longest-growing ingredient

3. Users CAN override individual ingredient timing if needed for specific blends

4. Users MUST be able to track actual yields per ingredient during harvest

5. The system SHOULD warn users when modifying a blend that has active orders

---

## Customer Management Requirements

### Requirement 3: Customer Relationship Management

**User Story:** As a farm manager, I want to manage my customer information and relationships, so that I can efficiently process orders and maintain customer records.

#### Business Rules

1. Users MUST be able to create customer records with:
   - Customer name (required)
   - Customer type (Retail, Wholesale, Restaurant, Farmers Market, Distributor)
   - Contact information (email, phone, company name)
   - Complete address information

2. Users SHOULD be able to set payment terms for each customer:
   - Due on Receipt, Net 7, Net 15, Net 30, Net 60

3. Users CAN add customer tags for categorization and filtering

4. Users CAN add notes and track customer status (active/inactive)

5. The system MUST prevent deletion of customers who have existing orders

6. Users SHOULD be able to search and filter customers by type, tags, or status

---

## Order Management Requirements

### Requirement 4: Order Processing

**User Story:** As a farm manager, I want to create and manage customer orders with automatic production scheduling, so that I can ensure timely delivery of fresh products.

#### Business Rules

1. Users MUST be able to create orders with:
   - Customer selection (required)
   - Multiple order items with product/blend, quantity in ounces, and target harvest date
   - Optional overage percentage (default 10%)
   - Order notes

2. The system MUST automatically calculate for each order item:
   - Number of trays needed based on product yield
   - Soak date, seed date, and move-to-light date based on product timing
   - Working backwards from the target harvest date

3. Users CAN create standalone orders without linking to a customer

4. The system MUST generate unique order numbers automatically

5. Users MUST be able to update order status through the workflow:
   - Pending → In Progress → Ready → Delivered → Cancelled

6. Users SHOULD be able to modify orders only when status is "Pending"

7. The system MUST prevent changes to orders that have completed tasks

### Requirement 5: Recurring Order Automation

**User Story:** As a farm manager, I want to set up recurring orders for regular customers, so that I can automate routine order creation and ensure consistent supply.

#### Business Rules

1. Users MUST be able to create recurring order schedules with:
   - Customer selection
   - Schedule type: Fixed days (e.g., every Tuesday) or intervals (e.g., every 7 days)
   - Start date and optional end date
   - Lead time in days (how far in advance to generate orders)

2. Users MUST be able to define template items for recurring orders:
   - Product/blend selection
   - Standard quantity
   - Overage percentage

3. The system MUST automatically generate orders based on the schedule and lead time

4. Users CAN skip specific dates with reasons (holidays, vacations)

5. Users SHOULD receive notifications when recurring orders are generated

6. Users MUST be able to modify or pause recurring schedules

---

## Production Workflow Requirements

### Requirement 6: Task Management

**User Story:** As a farm operator, I want to see and complete production tasks in the correct sequence, so that I can efficiently manage the growing workflow.

#### Business Rules

1. The system MUST automatically generate tasks for each order item:
   - SOAK task (soak seeds before planting)
   - SEED task (plant seeds in trays)
   - MOVE_TO_LIGHT task (transfer trays to grow racks)
   - HARVEST task (harvest ready microgreens)

2. Users MUST be able to view tasks in specialized views:
   - Calendar view (timeline of all tasks)
   - Seeding view (focus on planting tasks)
   - Transplant view (moving trays to light)
   - Harvest view (ready-to-harvest items)

3. Users MUST be able to complete tasks by recording:
   - Completion date and time
   - Person who completed the task
   - Actual number of trays processed
   - Seed lot number for traceability
   - Completion notes

4. The system SHOULD flag overdue tasks for attention

5. Users CAN modify task due dates if needed for operational flexibility

6. The system MUST maintain a complete log of all task completions for audit purposes

### Requirement 7: Farm Layout and Rack Management

**User Story:** As a farm manager, I want to visually manage my farm layout and track where products are growing, so that I can optimize space utilization and locate specific trays.

#### Business Rules

1. Users MUST be able to create visual farm layouts with:
   - Canvas-based editor for drawing farm elements
   - Walls, tables, sinks, walkways, and custom shapes
   - Grow racks with configurable levels and tray capacity

2. Users MUST be able to assign order items to specific rack levels during the MOVE_TO_LIGHT task

3. The system MUST track rack occupancy and show visual indicators of space utilization

4. Users SHOULD be able to see what's growing on each rack level

5. Users CAN customize colors and labels for better organization

6. The system MUST automatically clear rack assignments when harvest tasks are completed

---

## Employee Management Requirements

### Requirement 8: Team Management

**User Story:** As a farm owner, I want to manage my team members and their access levels, so that I can control who can perform different operations.

#### Business Rules

1. Users MUST be able to create employee records with:
   - Name and contact information
   - Position (Admin, Farm Manager, Salesperson, Farm Operator)
   - Employment status (Active, On Leave, Terminated)
   - Hire date and optional hourly rate

2. The system MUST enforce role-based permissions:
   - Farm Owners CAN access all features
   - Farm Managers CAN manage production and orders but not system settings
   - Farm Operators CAN complete tasks and view schedules only

3. Users SHOULD be able to assign tasks to specific employees

4. The system MUST track who completed each task for accountability

5. Users CAN link employee records to user accounts for system access

---

## Inventory Management Requirements

### Requirement 9: Supplies Tracking

**User Story:** As a farm manager, I want to track my seed inventory and supplies, so that I can ensure adequate stock for production and manage costs.

#### Business Rules

1. Users MUST be able to manage supply categories:
   - Seeds, Grow Media, Packaging, Cleaning Supplies, etc.

2. Users MUST be able to create supply records with:
   - Supply name and SKU
   - Current stock level and unit of measure
   - Link to product varieties (for seeds)

3. Users MUST be able to record purchases with:
   - Quantity, unit cost, and total cost
   - Supplier information
   - Lot number and expiry date
   - Purchase date

4. Users SHOULD be able to log usage:
   - Production usage (linked to tasks)
   - Waste and adjustments
   - Usage notes

5. The system SHOULD alert users when stock levels are low

6. Users CAN generate supply usage reports for cost analysis

---

## System Configuration Requirements

### Requirement 10: Farm Settings

**User Story:** As a farm owner, I want to configure my farm settings and preferences, so that the system works according to my operational needs.

#### Business Rules

1. Users MUST be able to configure farm information:
   - Farm name and branding (logo, brand color)
   - Contact information and business address
   - Timezone for accurate scheduling

2. Users MUST be able to set unit preferences:
   - Weight units (oz, g, lb, kg)
   - Length units (in, ft, cm, m)

3. Users SHOULD be able to customize default values:
   - Default overage percentage for orders
   - Default lead times for recurring orders
   - Task reminder settings

4. The system MUST apply farm settings consistently across all features

5. Users CAN backup and restore farm data for data protection

---

## Reporting and Analytics Requirements

### Requirement 11: Production Analytics

**User Story:** As a farm manager, I want to view production reports and analytics, so that I can optimize operations and track performance.

#### Business Rules

1. Users SHOULD be able to view production metrics:
   - Task completion rates and timing
   - Actual vs. planned yields
   - Product performance analysis
   - Employee productivity

2. Users CAN generate reports for specific date ranges

3. Users SHOULD be able to export data for external analysis

4. The system MUST track key performance indicators:
   - Order fulfillment rates
   - Average production cycle times
   - Customer satisfaction metrics

5. Users CAN set up automated report delivery (future enhancement)

---

## Data Management Requirements

### Requirement 12: Data Integrity and Security

**User Story:** As a farm owner, I want my farm data to be secure and properly isolated from other farms, so that I can trust the system with sensitive business information.

#### Business Rules

1. The system MUST ensure complete data isolation between farms

2. Users MUST only be able to access data belonging to their assigned farm

3. The system MUST maintain audit logs of all significant actions

4. Users SHOULD be able to export their data at any time

5. The system MUST provide secure authentication and session management

6. Users CAN manage their own profile information and preferences

This requirements document defines the business logic and user interactions for the Rooted Planner application, focusing on the operational needs of microgreen farm management.
