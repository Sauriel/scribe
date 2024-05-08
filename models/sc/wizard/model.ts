declare type WizardStep = {
  icon: string;
  name: string;
  header: string;
}

declare type UpdateProgressFunction = (index: number, progress: number) => void;

export {
  WizardStep,
  UpdateProgressFunction
}