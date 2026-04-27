# Mobile Phone Responsiveness Plan

## Overview

This document proposes the most efficient way to make Rooted-Web-App usable on phones without creating and maintaining a separate mobile stylesheet or a second mobile component tree.

The recommendation is:

1. Keep a single design system and a single styling approach.
2. Make mobile the default layout baseline.
3. Use larger breakpoints only to enhance the desktop experience.
4. Introduce a small set of shared responsive primitives so each page does not reinvent mobile behavior.
5. Treat a few interaction-heavy surfaces as explicit exceptions instead of forcing full desktop parity on a phone.

This is the lowest-maintenance path for the current stack because the app already uses Tailwind CSS v4, shared tokens, and repeated layout patterns that can be standardized.

---

## Executive Recommendation

### Recommended approach

Adopt a **single responsive UI system** built around:

- Mobile-first Tailwind utilities
- A small set of core layout primitives (AppShell, PageHeader, ResponsiveFormGrid, ModalSurface), with additional primitives extracted as needed during page conversion
- Standard viewport breakpoints for responsive behavior, with container queries deferred until a real need arises
- A small set of screen capability rules for pointer, hover, viewport height, and safe areas
- Explicit "desktop-preferred" handling for the most complex tools

### What to avoid

Avoid:

- A separate `mobile.css`
- Separate `DesktopPage` and `MobilePage` files for ordinary CRUD screens
- Page-by-page breakpoint logic copied into every feature
- Forcing every dense desktop interaction to be fully editable on a phone

### Why this is the right fit here

The current codebase is already close to a good foundation:

- Tailwind CSS v4 is installed and used broadly in `src/`
- There is already a token layer in `shared/ui/styles/tokens.css`
- Most planner and machine screens are built from repeated patterns: page headers, tabs, search bars, tables, forms, cards, modals

The main problem is not that the app needs a second style system. The problem is that the current components were mostly authored from a desktop-first assumption.

---

## Current Codebase Findings

### Styling stack

The app currently mixes:

- Tailwind utilities in most React components
- Shared CSS variables in `shared/ui/styles/tokens.css`
- A smaller CSS-module layer, mainly around machine dashboard styles

This is manageable. The efficient move is to standardize on Tailwind + shared tokens for responsive behavior and only keep CSS modules where they already serve a narrow purpose.

### Desktop-first hotspots found in the repo

#### 1. App shell is fixed desktop structure

Evidence:

- `shared/ui/components/AppLayout/AppLayout.tsx`
- `shared/ui/components/Sidebar/Sidebar.tsx`
- `shared/ui/components/AppHeader/AppHeader.tsx`

Current behavior:

- Permanent `w-60` sidebar
- Desktop header spacing and height
- Main content padding fixed at `p-6`

Phone impact:

- Too much horizontal structure is reserved before page content even starts
- Navigation consumes space that should collapse into a drawer or similar temporary surface

#### 2. Many screens assume wide content areas

Evidence:

- `src/planner/products/ProductsPage.tsx`
- `src/planner/orders/components/OrderForm.tsx`
- `src/planner/recurring-schedules/RecurringScheduleForm.tsx`
- `src/planner/tasks/components/TaskCompletionForm.tsx`

Current behavior:

- Two-column and custom-width grids such as `grid-cols-[1fr_300px]`
- Wide modal layouts with large fixed paddings
- Inline action rows that assume desktop width

Phone impact:

- Inputs and buttons either wrap poorly or become cramped
- Important actions fall below the fold in awkward ways

#### 3. Dense table surfaces are common

Evidence:

- `src/planner/orders/components/OrderList.tsx`
- `src/planner/products/components/SkuList.tsx`
- `src/planner/products/components/BlendList.tsx`
- `src/planner/production/LogsView.tsx`

Current behavior:

- Several feature screens rely on plain tables

Phone impact:

- Some tables should become stacked cards or definition-list style rows
- Some truly dense tables should remain tables with horizontal scrolling rather than being fully restyled

#### 4. Some screens are interaction-heavy rather than merely wide

Evidence:

- `src/planner/production/calendar/CalendarView.tsx`
- `src/planner/production/calendar/CalendarGrid.tsx`
- `src/planner/farm-layout/components/LayoutEditor.tsx`
- `src/planner/farm-layout/components/CanvasArea.tsx`

Current behavior:

- 7-column week/month calendar grids
- Drag-and-drop scheduling
- Farm layout editor uses a fixed 1200x800 SVG canvas
- Canvas panning currently assumes middle-mouse interaction
- Layout editor height is hard-coded with `calc(100vh - 240px)`

Phone impact:

- These are not normal responsive problems
- They are interaction-model problems
- A phone-friendly version should simplify the experience rather than pretend a 7-column drag surface is comfortably editable on a small touch screen

#### 5. Modals are repeated and mostly desktop-sized

Evidence:

- `src/planner/products/components/ProductForm.tsx`
- `src/planner/customers/components/CustomerForm.tsx`
- `src/planner/products/components/BlendForm.tsx`
- `src/support/SupportWidget.tsx`

Current behavior:

- Repeated centered overlays
- Large internal padding
- `max-h-[90vh]` is common, but safe-area handling is absent

Phone impact:

- On mobile keyboards and browser chrome, these can feel cramped or clipped
- This should become one shared modal/sheet pattern

---

## Options Considered

### Option A. Separate mobile styles or duplicate mobile pages

#### Result

Rejected.

#### Reasoning

- Fast for one screen, expensive for the whole product
- Layout drift becomes permanent
- Every feature request turns into "desktop change plus mobile change"
- Bugs become harder to fix because there are two styling paths

### Option B. Pure breakpoint patching inside every existing page

#### Result

Partially viable, but not the best approach.

#### Reasoning

- Better than a second stylesheet
- Still creates repeated layout logic across pages
- Does not solve structural consistency
- The shell, forms, tables, and modals would still be handled ad hoc

### Option C. Single responsive system with shared primitives

#### Result

Recommended.

#### Reasoning

- One style system
- One token system
- One set of responsive rules
- Repeated patterns are solved once, then reused everywhere
- The few complex exceptions are handled intentionally instead of forcing desktop parity

---

## Research Summary

The guidance below is based on current official documentation and standards reviewed on **March 27, 2026**.

### 1. Mobile-first should be the default

Tailwind's responsive model is mobile-first. The efficient pattern is:

- Unprefixed classes define the phone layout
- `md:`, `lg:`, and above progressively enhance larger screens

Implication for this repo:

- Most existing components should be inverted from desktop-first assumptions to mobile-first defaults
- This reduces the need for separate phone styles because the "base" version becomes the phone version

### 2. Container queries are important for reusable components

Viewport breakpoints alone are not enough for a system like this because components appear in different shells and widths.

Container queries are especially useful for:

- Cards that may appear in sidebars, panels, or full-width pages
- Header/action groups
- Form sections
- Small data displays inside split layouts

Implication for this repo:

- Use viewport breakpoints for app-shell changes
- Use container queries for component-level changes
- This avoids every feature hardcoding viewport logic

### 3. Dynamic viewport units and safe areas matter on phones

Phone browsers change usable viewport height when chrome and keyboards appear. Using `vh` blindly leads to clipped layouts.

Implication for this repo:

- Replace hard assumptions about `100vh` in interactive layouts with dynamic viewport-aware primitives
- Build modal, page, and bottom-action surfaces with safe-area padding support

### 4. Touch and coarse pointers need different affordances

Hover-heavy or tiny-target interactions degrade on touch devices.

Implication for this repo:

- Buttons, tabs, filters, and row actions should assume coarse pointer support
- Touch targets should be comfortably tappable
- Hover should enhance, not carry the interaction

### 5. Drag surfaces need explicit touch handling

Touch drag/drop usually needs more deliberate gesture handling than desktop pointer use.

Implication for this repo:

- The production calendar and farm layout editor should not be treated like ordinary responsive pages
- Either simplify the interaction model on phone or present a limited mobile mode

### 6. Accessibility guidance supports larger targets

WCAG target-size guidance reinforces the need to avoid tight action clusters on phones.

Implication for this repo:

- Standardize compact actions around a minimum tap-size rule
- Avoid rows that place multiple tiny action buttons side by side on mobile

---

## Recommended Architecture

### Principle 1. One design system, not two

Keep:

- Existing tokens
- Tailwind as the primary responsive layer
- Shared UI primitives

Do not create:

- Mobile-only pages for CRUD screens
- Separate desktop and mobile color, spacing, or type scales

### Principle 2. Responsive behavior belongs in shared primitives

Start with the highest-leverage primitives first, then extract additional ones as pages are converted:

#### Core primitives (build before converting any pages)

- `AppShell` — overall page frame with sidebar/drawer, content padding, safe areas
- `PageHeader` — title + action buttons that stack on narrow screens
- `ResponsiveFormGrid` — form layout that collapses from multi-column to single-column
- `ModalSurface` — modal that becomes a bottom sheet on phone

#### Extract-as-needed primitives (build when a pattern repeats during page conversion)

- `ActionBar` — row of buttons/actions that wraps cleanly
- `FilterBar` — search/filter controls that stack on narrow screens
- `ResponsiveDataSurface` — wrapper for tables/cards/loading/empty states
- `SplitPanel` — side-by-side layout that stacks on mobile
- `SectionCard` — grouped content card with consistent spacing

The point is to make responsive behavior a product capability, not a page-level improvisation. But avoid building all primitives upfront — extract them when a pattern repeats across two or more pages during conversion.

### Principle 3. Use viewport breakpoints only for major shell changes

Use viewport breakpoints for:

- Sidebar vs drawer
- Main-content padding
- Desktop split-pane activation
- Calendar detail rail visibility

Do not use viewport breakpoints as the only responsive tool for every component.

### Principle 4. Defer container queries until a real need arises

Container queries let a component switch layout based on its own width rather than the full viewport. However, components in this app do not currently live in variable-width containers — standard viewport breakpoints will cover the vast majority of cases.

Defer container queries until a specific component genuinely needs them (e.g., a card that appears in both a sidebar and a full-width page). Do not build container-query infrastructure upfront.

Potential future candidates if the need arises:

- Header title + actions in variable-width panels
- Card metadata rows
- Inline stat groups
- Form field rows inside modal bodies

### Principle 5. Explicitly classify screens by mobile strategy

Every screen should be classified into one of three buckets:

#### Bucket A. Fully responsive CRUD

Examples:

- Products
- Customers
- Orders
- Tasks
- Team
- Recurring schedules
- Machines dashboard

Strategy:

- Same components
- Same styling system
- Mobile-first layout adjustments only

#### Bucket B. Dense data surfaces

Examples:

- SKU lists
- Logs
- Blend ingredient tables

Strategy:

- Same data layer
- Shared table/card primitives
- Decide case-by-case between "card on mobile" and "scroll container on mobile"

#### Bucket C. Desktop-preferred interactive tools

Examples:

- Production week/month calendar editing
- Farm layout editor

Strategy:

- Preserve desktop experience
- Provide a simplified phone mode or read-only mode
- Do not try to compress desktop interaction density into a tiny touch target matrix

---

## Screen Classification for This Repo

| Area | Mobile strategy | Why |
|------|-----------------|-----|
| App shell | Responsive shell | Standard layout problem |
| Machines dashboard | Responsive cards | Mostly content + actions |
| Products / Customers / Orders / Tasks / Team | Responsive CRUD | Good fit for shared primitives |
| Product/Order/Recurring modals | Responsive form surfaces | Repeated pattern; easy to standardize |
| SKU / Logs / Blend tables | Hybrid | Some should stack, some should scroll |
| Production calendar day view | Responsive | Can work as a list or single-column schedule |
| Production calendar week/month | Desktop-preferred | 7-column drag grid is not phone-friendly |
| Farm layout editor | Desktop-preferred | Fixed canvas + drag/pan is not phone-native |

---

## Phased Plan

## Phase 0. Define the mobile contract

### Goal

Make a small number of binding decisions so implementation can start without ongoing debate about scope.

### Default decisions (adopt unless there is a specific reason to override)

- **Target**: phones only (320px–430px). Tablets are a separate later milestone.
- **Browsers**: iPhone Safari and Android Chrome.
- **Production calendar**: day/agenda view is the phone workflow. Week/month editing is desktop-preferred for v1.
- **Farm layout editor**: read-only preview on phone. Editing remains desktop-only for v1.
- **Tap targets**: minimum 44×44px touch area, consistent with WCAG target-size guidance.
- **Navigation**: sidebar collapses to a drawer/sheet on phone.
- **Modals**: become bottom sheets on phone with safe-area padding.

### Tasks

- Review the default decisions above and confirm or override
- Mark each screen as Bucket A, B, or C using the classification table in this document
- Resolve any disagreements before Phase 1 starts

### Reasoning

This phase should take hours, not weeks. The decisions above cover the questions that would otherwise block implementation. Override only where there is a concrete business reason.

### Deliverables

- Confirmed screen classification
- Confirmed mobile shell behavior
- Confirmed exception policy for desktop-preferred tools

---

## Phase 1. Build the responsive shell once

### Goal

Fix the highest-leverage issue first: the layout shell.

### Tasks

- Replace the permanent phone sidebar with a drawer or sheet presentation
- Keep the same nav data source used by desktop sidebar
- Reduce default phone paddings in shell and content areas
- Make the header height and spacing responsive
- Ensure `SupportWidget` placement does not collide with nav or bottom actions
- Add safe-area padding support for top and bottom pinned UI

### Plan

- Introduce a single `AppShell` pattern
- Desktop keeps current sidebar layout
- Phone uses the same navigation items in a temporary surface
- Main content spacing becomes tokenized instead of page-specific

### Reasoning

If the shell remains desktop-only, every page will keep feeling broken no matter how many local fixes are added.

### Success criteria

- All planner and machine pages are reachable and readable on phone
- Navigation does not permanently consume horizontal space on phone
- Header and content spacing no longer feel desktop-scaled on small screens

---

## Phase 2. Standardize the repeated responsive primitives

### Goal

Solve recurring patterns once and remove page-specific improvisation.

### Tasks

- Build the four core primitives: `AppShell` (if not completed in Phase 1), `PageHeader`, `ResponsiveFormGrid`, `ModalSurface`
- These cover the patterns that repeat across Products, Orders, Tasks, Team, and Recurring
- Normalize spacing, stacking rules, and action placement within these primitives
- Do **not** build `ActionBar`, `FilterBar`, `ResponsiveDataSurface`, `SplitPanel`, or `SectionCard` yet — extract them in Phase 3 or 4 only if the pattern repeats

### Plan

- Build the core primitives first, then immediately begin converting pages (Phase 3) to validate them
- Extract additional primitives only when a pattern is duplicated across two or more page conversions

### Reasoning

This is the phase that prevents "two styles." Once these primitives exist, later feature work stays on the same system.

### Success criteria

- New CRUD screens can be built from the same primitives
- Mobile fixes stop requiring ad hoc page rewrites
- Common surfaces behave consistently across the app

---

## Phase 3. Convert straightforward CRUD screens

### Goal

Make the largest set of day-to-day screens genuinely usable on phone.

### Tasks

- Apply the new shell/primitives to:
- Machines dashboard
- Products
- Customers
- Orders
- Tasks
- Team
- Recurring schedules
- Convert search/filter rows to stacked or wrapped layouts
- Convert multi-column forms to one-column mobile defaults
- Move primary actions to more stable and reachable positions on phone
- Reduce overly large modal padding and improve scroll behavior

### Plan

- Start with the planner pages that use the same header/filter/list/form pattern
- Then apply the same rules to machine flows and support flows

### Reasoning

These screens share enough structure that work done on one will carry directly to the others.

### Success criteria

- A phone user can create, edit, search, and review standard records without zooming or horizontal scrolling
- Modals remain usable when the phone keyboard is open

---

## Phase 4. Handle dense data intentionally

### Goal

Avoid bad mobile tables without over-engineering two independent UIs.

### Tasks

- Audit each table-like surface and decide:
- stack into cards on phone
- keep as table with horizontal scroll
- split summary and detail into separate screens
- Introduce one shared mobile pattern for simple record rows
- Introduce one shared horizontal-scroll table wrapper for genuinely dense admin data

### Plan

Use this decision rule:

- If the row is mostly labels and a few values, convert to stacked cards on phone
- If the table is truly dense and comparison-heavy, keep the table and make scrolling explicit

### Reasoning

Trying to convert every table into cards is as bad as forcing every table to stay a table. Use one rule set, not one universal transformation.

### Success criteria

- No critical table becomes unusable on phone
- The team uses a repeatable rule to choose between card and table patterns

---

## Phase 5. Simplify desktop-preferred tools instead of faking full parity

### Goal

Make phone behavior honest and useful for complex tools.

### Tasks

- Define a phone-first production experience around day or agenda view
- Treat week/month drag grids as tablet/desktop-preferred unless later mobile design proves otherwise
- Define the phone behavior of task detail and rescheduling
- Define farm layout phone behavior as one of:
- read-only preview
- limited selection/details mode
- desktop-required editing
- Revisit drag interactions only after the simpler phone mode is accepted

### Plan

- Production calendar:
- Phone default should be day or agenda workflow
- Week/month views should not be the primary phone interaction surface
- Farm layout:
- Phone should prioritize viewing, selecting, and understanding a layout
- Editing should remain desktop-preferred for the first release unless there is a strong business requirement

### Reasoning

This is the single biggest place teams waste time in responsive retrofits. Not every desktop interaction should become a compressed phone interaction.

### Success criteria

- Users can still complete the most important production tasks on phone
- The app does not expose obviously frustrating drag-heavy surfaces as if they were phone-optimized

---

## Phase 6. QA and regression guardrails

### Goal

Prevent the app from drifting back into desktop-only layouts.

### Tasks

- Add a visual/manual QA checklist for representative phone widths
- Test with long names, long IDs, and large data sets
- Test keyboard-open states for forms and modals
- Test safe-area behavior on notched devices
- Test touch targets and sticky actions
- Test Bluetooth-related machine flows on the actual target mobile browsers

### Plan

- Add a release checklist for phone widths
- Require responsive verification for any page that introduces a new header/filter/list/form/table pattern

### Reasoning

Without guardrails, responsive quality regresses feature by feature.

### Success criteria

- New features inherit the system instead of reintroducing desktop-only assumptions

---

## Concrete Tasks by Area

## Shell

- Convert permanent sidebar into responsive shell behavior
- Make header spacing and logo/action density responsive
- Standardize content paddings by breakpoint
- Handle safe-area padding for bottom-fixed elements

## Forms and modals

- Standardize modal width, padding, height, and keyboard behavior
- Default to one-column forms on phone
- Move secondary controls below primary inputs when width is constrained
- Keep form actions reachable without excessive scrolling

## Lists and tables

- Build a shared "card list on phone" pattern
- Build a shared "scrollable data table" wrapper for dense tables
- Move row actions out of cramped inline clusters when needed

## Planner tabs and filters

- Make tab rows wrap or scroll intentionally
- Convert filter bars to stacked/wrapped groups
- Keep the most important filters visible first on phone

## Production and layout tools

- Introduce explicit phone behavior for calendar
- Introduce explicit phone behavior for farm layout
- Do not try to preserve every desktop gesture as-is

---

## Implementation Rules

These rules are the key to not managing two different styles.

1. Unprefixed classes should represent the phone layout.
2. `md:` and above should only enhance.
3. Shared primitives own responsive behavior, not feature pages.
4. Use container queries for local adaptation inside reusable components.
5. Allow different behavior only when the interaction model genuinely changes.
6. If markup branches are necessary, branch in one primitive, not across every page.
7. Tables should follow a documented rule, not a one-off decision per screen.
8. Desktop-preferred tools should be marked intentionally, not accidentally left broken on phone.

---

## Illustrative Code Snippets

These snippets are examples of the target patterns. They are not proposed as immediate code changes in this document.

### 1. Mobile-first shell pattern

```tsx
<div className="min-h-dvh bg-background">
  <AppHeader />
  <div className="flex">
    <aside className="hidden lg:block lg:w-60">
      <Sidebar />
    </aside>

    <main className="min-w-0 flex-1 px-3 py-4 sm:px-4 lg:px-6">
      {children}
    </main>
  </div>

  <MobileNavDrawer className="lg:hidden" />
</div>
```

### 2. Shared header that stacks on narrow containers

```tsx
<section className="@container">
  <div className="flex flex-col gap-3 @md:flex-row @md:items-center @md:justify-between">
    <div className="min-w-0">
      <h1 className="text-xl font-semibold sm:text-2xl">Orders</h1>
      <p className="text-sm text-muted-foreground">Create, review, and schedule orders.</p>
    </div>

    <div className="flex flex-wrap gap-2">
      <Button variant="secondary">Filter</Button>
      <Button>New Order</Button>
    </div>
  </div>
</section>
```

### 3. Responsive form grid without a separate mobile form

```tsx
<form className="grid grid-cols-1 gap-3 md:grid-cols-2">
  <Field className="md:col-span-2" />
  <Field />
  <Field />
  <Field className="md:col-span-2" />
</form>
```

### 4. Safe-area-aware modal or sheet body

```tsx
<div className="fixed inset-0 z-50 bg-black/50">
  <div className="fixed inset-x-0 bottom-0 max-h-[min(85dvh,48rem)] rounded-t-2xl border border-border bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
    {children}
  </div>
</div>
```

### 5. Card-on-phone, table-on-desktop decision pattern

```tsx
<>
  <div className="space-y-3 md:hidden">
    {rows.map((row) => (
      <RecordCard key={row.id} row={row} />
    ))}
  </div>

  <div className="hidden md:block overflow-x-auto">
    <table className="w-full min-w-[48rem]">
      ...
    </table>
  </div>
</>
```

This is acceptable when the interaction pattern genuinely differs. The important rule is to centralize this in a reusable primitive rather than re-inventing it across every feature.

### 6. Coarse-pointer-friendly action sizing

```tsx
<button className="min-h-11 min-w-11 px-3 py-2 rounded-md">
  Save
</button>
```

### 7. Desktop-preferred editor guardrail

```tsx
{isPhone ? (
  <LayoutPreview
    layout={layout}
    message="Editing the farm layout is available on larger screens."
  />
) : (
  <LayoutEditor layout={layout} />
)}
```

For this repo, this is more honest and maintainable than pretending the current SVG editor is phone-optimized.

---

## Reasoning for the Hard Calls

### Why not force full calendar week/month editing on phone?

- The current interaction depends on 7-column density and drag/drop precision
- The detail panel is already split out on larger screens
- A day or agenda workflow is much more likely to be usable on phone

### Why not force full farm layout editing on phone?

- The current editor assumes a large fixed canvas
- It uses panning/zooming and pointer-based manipulation
- Compressing that into a phone UI is a separate product-design project, not a simple responsive pass

### Why accept some conditional rendering at all?

Because "no two styles" should mean:

- no second design system
- no duplicated page styling burden
- no parallel maintenance of desktop and mobile pages for normal screens

It does **not** need to mean zero conditional rendering when the interaction model fundamentally differs.

---

## Biggest Risks

1. Treating every page as a local breakpoint cleanup instead of building shared primitives first.
2. Trying to preserve desktop interaction density on phone for calendar and farm layout.
3. Converting every table into cards even when horizontal-scroll tables are the better choice.
4. Leaving modal behavior inconsistent across features.
5. Shipping phone layouts without testing actual mobile browser behavior for Bluetooth-related machine flows.

---

## Decision Summary

If the goal is to make this app usable on a phone **without constantly managing two different styles**, the efficient path is:

- Build one responsive shell
- Build one shared set of responsive primitives
- Make mobile the default baseline
- Use container queries to keep components reusable
- Keep dense/complex desktop tools as deliberate exceptions with simplified phone behavior

That approach fits the current codebase, minimizes maintenance cost, and gives the team a stable system for future features.

---

## Open Questions — Default Answers Provided

The following questions previously blocked implementation. Phase 0 now provides default answers. Override only if there is a concrete business reason.

| Question | Default answer |
|----------|---------------|
| Phone only or phone + tablet? | **Phone only** for v1. Tablet is a later milestone. |
| Production calendar fully editable on phone? | **No.** Day/agenda view is the phone workflow. Week/month editing is desktop-preferred. |
| Farm layout editor editable on phone? | **No.** Read-only preview on phone. Editing stays desktop-only for v1. |
| Which mobile browsers? | **iPhone Safari and Android Chrome.** |

---

## References

Reviewed on 2026-03-27.

- Tailwind CSS responsive design: https://tailwindcss.com/docs/responsive-design
- Tailwind CSS breakpoints: https://tailwindcss.com/docs/breakpoints
- Tailwind CSS hover, focus, pointer, and media-state variants: https://tailwindcss.com/docs/hover-focus-and-other-states
- MDN CSS container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries
- MDN viewport concepts and viewport-relative sizing: https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Viewport_concepts
- MDN `env()` for safe-area values: https://developer.mozilla.org/en-US/docs/Web/CSS/env
- MDN `touch-action`: https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
- WCAG 2.2 target size minimum: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2 target size enhanced: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
- dnd-kit sensors overview: https://docs.dndkit.com/api-documentation/sensors
