import React from 'react';
import { Check } from 'lucide-react';

interface StepWizardProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export const StepWizard: React.FC<StepWizardProps> = ({ currentStep, totalSteps, labels }) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full" />
        
        {/* Active Progress */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {labels.map((label, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={label} className="flex flex-col items-center">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 z-10
                    ${isActive ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200' : ''}
                    ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-white border-slate-300 text-slate-400' : ''}
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span 
                  className={`
                    mt-2 text-xs font-medium transition-colors duration-300
                    ${isActive ? 'text-indigo-700' : 'text-slate-400'}
                  `}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};