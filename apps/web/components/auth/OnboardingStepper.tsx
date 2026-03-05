import { Check } from "lucide-react"

interface OnboardingStepperProps {
  currentStep: number
  totalSteps: number
}

export function OnboardingStepper({ currentStep, totalSteps }: OnboardingStepperProps) {
  return (
    <div className="flex items-center justify-center w-full mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm transition-colors duration-300 ${
                isActive
                  ? "border-purple-600 bg-purple-600 text-white"
                  : isCompleted
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-gray-300 text-gray-400 dark:border-gray-700"
              }`}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={`w-12 h-1 mx-2 rounded-full transition-colors duration-300 ${
                  isCompleted ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-800"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
