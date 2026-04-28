import type { TooltipRenderProps } from 'react-joyride';
import { X } from 'lucide-react';

export function RootedTourTooltip({
  backProps,
  closeProps,
  index,
  isLastStep,
  primaryProps,
  size,
  skipProps,
  step,
  tooltipProps,
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      className="relative w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-border bg-card p-4 text-card-foreground shadow-lg"
      aria-labelledby={step.title ? 'rooted-tour-title' : undefined}
      aria-describedby="rooted-tour-content"
    >
      <button
        {...closeProps}
        type="button"
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X size={16} />
      </button>

      <div className="pr-8">
        {step.title && (
          <h2 id="rooted-tour-title" className="text-base font-semibold text-foreground">
            {step.title}
          </h2>
        )}
        <div id="rooted-tour-content" className="mt-2 text-sm leading-6 text-muted-foreground">
          {step.content}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex items-center gap-3">
          {!isLastStep && (
            <button
              {...skipProps}
              type="button"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip
            </button>
          )}
          <span className="text-xs font-medium text-muted-foreground">
            {index + 1} of {size}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              {...backProps}
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              Back
            </button>
          )}
          <button
            {...primaryProps}
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isLastStep ? step.locale.last : step.locale.next}
          </button>
        </div>
      </div>
    </div>
  );
}
