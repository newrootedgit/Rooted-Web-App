-- Per-machine labor savings configuration: minutes saved per hour of motor runtime
ALTER TABLE machines
  ADD COLUMN IF NOT EXISTS labor_minutes_saved_per_hour INTEGER;
