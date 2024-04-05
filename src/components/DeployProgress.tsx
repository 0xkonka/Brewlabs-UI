import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";
import { CheckCircle, CircleEqual, Loader2, RefreshCcw, XCircle } from "lucide-react";
import { Button } from "@components/ui/button";

export type DeployStep = {
  name: string;
  description: string;
  status: DeployStatus;
};

type DeployStatus = "complete" | "current" | "upcoming" | "failed";

type UpdateDeployStatus = {
  setStepsFn: Dispatch<SetStateAction<DeployStep[]>>;
  targetStep: string;
  updatedStatus: DeployStatus;
  updatedDescription?: string;
};

// Helper fn to set the status and description of a deploy step
export const updateDeployStatus = ({
  setStepsFn,
  targetStep,
  updatedStatus,
  updatedDescription,
}: UpdateDeployStatus) => {
  setStepsFn((prevDeploySteps) =>
    prevDeploySteps.map((step) =>
      step.name === targetStep
        ? { ...step, status: updatedStatus, description: updatedDescription || step.description }
        : step
    )
  );
};

type DeployStepProps = {
  step: DeployStep;
  onError: () => void;
  isLastItem?: boolean;
};

const DeployStep = ({ step, onError, isLastItem }: DeployStepProps) => {
  const { status, name, description } = step;

  return (
    <div
      className={twMerge(
        status === "upcoming" && "opacity-50",
        status === "failed" && "text-red-500",
        status === "complete" && "text-teal-300"
      )}
    >
      {!isLastItem && (
        <div>
          {status === "complete" && (
            <div
              aria-hidden="true"
              className="line-grow absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-teal-400"
            />
          )}
        </div>
      )}
      <div className="group relative flex min-h-[60px] items-start">
        <span className="flex h-9 items-center">
          <span
            className={twMerge(
              status === "current" && "ring-gray-400",
              status === "upcoming" && "ring-gray-400",
              status === "failed" && "text-red-200 ring-destructive",
              status === "complete" && "text-teal-100 ring-teal-300",
              "animate__animated animate__zoomIn relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 ring"
            )}
          >
            {status === "failed" && <XCircle className="h-5 w-5" aria-hidden="true" />}
            {status === "complete" && <CheckCircle className="h-5 w-5" aria-hidden="true" />}
            {status === "upcoming" && <CircleEqual className="h-5 w-5" aria-hidden="true" />}
            {status === "current" && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
          </span>
        </span>

        <span className="animate__animated animate__fadeIn animate__delay-1s ml-4 flex min-w-0 flex-col">
          <h5 className={twMerge(status === "current" && "animate-pulse", "text-sm font-medium")}>{name}</h5>
          <p className="text-sm text-gray-200">{description}</p>
        </span>
      </div>
      {status === "failed" && (
        <Button size="sm" variant="secondary" className="mt-4" onClick={onError}>
          Failed, please try again. <RefreshCcw className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

type DeployProgressProps = {
  onError: () => void;
  onSuccess: () => void;
  deploySteps: DeployStep[];
};

const DeployProgress = ({ onError, onSuccess, deploySteps }: DeployProgressProps) => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const allItemsComplete = deploySteps.every((step) => step.status === "complete");
    setIsComplete(allItemsComplete);

    if (allItemsComplete) {
      // Wait 2 seconds before calling the onSuccess callback
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  }, [deploySteps, onSuccess]);

  return (
    <div aria-label="Progress" className="mx-auto w-fit max-w-sm">
      <h2 className="my-4 text-center text-3xl">{isComplete ? "Deployed!" : "Deploying..."}</h2>
      <ol role="list" className=" p-6">
        {deploySteps.map((step, stepIdx) => (
          <li key={step.name} className={twMerge(stepIdx !== deploySteps.length - 1 ? "pb-10" : "", "relative")}>
            <DeployStep step={step} onError={onError} isLastItem={stepIdx === deploySteps.length - 1} />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default DeployProgress;
