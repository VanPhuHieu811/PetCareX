import React from 'react';

export const StepCircle = ({ num, label, sub, active, isDone }) => (
  <div className="flex flex-col items-center bg-[#f4f7fe] px-4 relative z-10">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all duration-500 ${
      isDone 
        ? 'bg-blue-600 text-white' 
        : active 
          ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
          : 'bg-slate-200 text-slate-500'
    }`}>
      {isDone ? '✓' : num}
    </div>
    <p className={`text-sm font-bold ${active || isDone ? 'text-slate-800' : 'text-slate-400'}`}>{label}</p>
    <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{sub}</p>
  </div>
);

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-center items-center mb-12 relative max-w-2xl mx-auto">
      {/* Đường kẻ ngang phía sau */}
      <div className="absolute w-full h-0.5 bg-slate-200 top-5 z-0"></div>
      
      <div className="flex justify-between w-full z-10">
        {steps.map((step, index) => (
          <StepCircle 
            key={index}
            num={index + 1}
            label={step.label}
            sub={step.sub}
            active={currentStep === index + 1}
            isDone={currentStep > index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Stepper;