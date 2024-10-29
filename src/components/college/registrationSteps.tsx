import { Check } from "lucide-react";

interface RegistrationStepsProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: "College Details" },
  { id: 2, name: "File Upload" },
  { id: 3, name: "Payment" },
];

export function RegistrationSteps({ currentStep }: RegistrationStepsProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            <div
              className={`group flex flex-col border-l-4 py-2 pl-4 ${
                step.id < currentStep
                  ? "border-primary"
                  : step.id === currentStep
                  ? "border-primary"
                  : "border-muted"
              } md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0`}
            >
              <span
                className={`text-sm font-medium ${
                  step.id < currentStep
                    ? "text-primary"
                    : step.id === currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Step {step.id}
              </span>
              <span className="text-sm font-medium">{step.name}</span>
              {step.id < currentStep && (
                <Check className="ml-2 h-4 w-4 text-primary" />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
