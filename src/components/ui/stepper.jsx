"use client";

import * as React from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Step = ({ title, description, isCompleted, isActive, stepNumber }) => {
  return (
    <div className="flex items-center">
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2",
            isCompleted
              ? "border-primary bg-primary text-primary-foreground"
              : isActive
                ? "border-primary"
                : "border-muted",
          )}
        >
          {isCompleted ? (
            <Check className="h-4 w-4" />
          ) : (
            <span className="text-sm font-medium">{stepNumber}</span>
          )}
        </div>
      </div>
      <div className="ml-4">
        <p
          className={cn(
            "text-sm font-semibold",
            isActive || isCompleted ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {title}
        </p>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
    </div>
  );
};

export function Stepper({ steps, currentStep, onStepChange, hasControlButtons = true }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <Step
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              isCompleted={index < currentStep}
              isActive={index === currentStep}
            />

            {index < steps.length - 1 && (
              <ChevronRight className="text-muted-foreground hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </div>

      {hasControlButtons && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => onStepChange(currentStep - 1)}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => onStepChange(currentStep + 1)}
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
}
