"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface RegistrationProgressProps {
  currentStep: number;
  className?: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Account",
    description: "Email & Password",
  },
  {
    number: 2,
    title: "Business",
    description: "Company Details",
  },
  {
    number: 3,
    title: "Location",
    description: "Address & Info",
  },
];

export function RegistrationProgress({
  currentStep,
  className,
}: RegistrationProgressProps) {
  return (
    <div className={cn("w-full max-w-lg mx-auto", className)}>
      {/* Progress Bar */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full" />

        {/* Active Progress Line */}
        <div
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-gray-900 to-gray-700 transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isPending = currentStep < step.number;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center gap-2.5"
              >
                {/* Circle */}
                <div
                  className={cn(
                    "w-11 h-11 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all duration-300 shadow-sm",
                    {
                      "bg-black border-black text-white shadow-md": isCompleted,
                      "bg-white border-black text-black ring-4 ring-gray-100 shadow-lg":
                        isCurrent,
                      "bg-white border-gray-300 text-gray-400": isPending,
                    },
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Step Info */}
                <div className="text-center">
                  <p
                    className={cn(
                      "font-poppins text-xs font-semibold transition-colors",
                      {
                        "text-gray-900": isCurrent || isCompleted,
                        "text-gray-400": isPending,
                      },
                    )}
                  >
                    {step.title}
                  </p>
                  <p
                    className={cn(
                      "font-poppins text-[10px] transition-colors mt-0.5",
                      {
                        "text-gray-600": isCurrent || isCompleted,
                        "text-gray-400": isPending,
                      },
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
