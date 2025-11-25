/**
 * Transaction Stage Configuration
 *
 * Defines the 5 stages of a real estate transaction and which tasks
 * must be completed to auto-advance through each stage.
 */

export type TransactionStatus =
  | 'under_contract'
  | 'inspection_period'
  | 'financing'
  | 'clear_to_close'
  | 'closed';

export interface StageDefinition {
  id: TransactionStatus;
  label: string;
  description: string;
  /**
   * Task titles that belong to this stage.
   * When ALL tasks in this array are completed, auto-advance to next stage.
   */
  requiredTaskTitles: string[];
  /**
   * If true, completing all required tasks will auto-advance to next stage.
   * Set to false for final stage (Closed).
   */
  autoAdvanceOnComplete: boolean;
  /**
   * SVG icon component for timeline display
   */
  icon: string;
}

export const STAGE_DEFINITIONS: StageDefinition[] = [
  {
    id: 'under_contract',
    label: 'Under Contract',
    description: 'Initial contract execution and earnest money deposit',
    requiredTaskTitles: [
      'Send Earnest Money Deposit',
    ],
    autoAdvanceOnComplete: true,
    icon: 'document',
  },
  {
    id: 'inspection_period',
    label: 'Inspection Period',
    description: 'Home inspection and due diligence',
    requiredTaskTitles: [
      'Schedule Home Inspection',
      'Review Title Report',
    ],
    autoAdvanceOnComplete: true,
    icon: 'search',
  },
  {
    id: 'financing',
    label: 'Financing',
    description: 'Loan application, appraisal, and underwriting',
    requiredTaskTitles: [
      'Submit Loan Application',
      'Order Appraisal',
    ],
    autoAdvanceOnComplete: true,
    icon: 'dollar',
  },
  {
    id: 'clear_to_close',
    label: 'Clear to Close',
    description: 'Final preparations for closing',
    requiredTaskTitles: [
      'Secure Homeowner\'s Insurance',
      'Review Closing Disclosure',
      'Complete Final Walkthrough',
      'Wire Closing Funds',
    ],
    autoAdvanceOnComplete: true,
    icon: 'check-circle',
  },
  {
    id: 'closed',
    label: 'Closed',
    description: 'Transaction complete - you own the home!',
    requiredTaskTitles: [
      'Attend Closing',
    ],
    autoAdvanceOnComplete: false, // Final stage - no auto-advance
    icon: 'checkmark',
  },
];

/**
 * Get the stage definition for a given status
 */
export function getStageDefinition(status: TransactionStatus): StageDefinition | undefined {
  return STAGE_DEFINITIONS.find(stage => stage.id === status);
}

/**
 * Get the next stage after the current status
 */
export function getNextStage(currentStatus: TransactionStatus): StageDefinition | null {
  const currentIndex = STAGE_DEFINITIONS.findIndex(stage => stage.id === currentStatus);
  if (currentIndex === -1 || currentIndex >= STAGE_DEFINITIONS.length - 1) {
    return null;
  }
  return STAGE_DEFINITIONS[currentIndex + 1];
}

/**
 * Get all stages up to and including the current status
 */
export function getCompletedStages(currentStatus: TransactionStatus): StageDefinition[] {
  const currentIndex = STAGE_DEFINITIONS.findIndex(stage => stage.id === currentStatus);
  if (currentIndex === -1) return [];
  return STAGE_DEFINITIONS.slice(0, currentIndex);
}

/**
 * Check if all required tasks for a stage are completed
 */
export function areStageTasksComplete(
  stage: StageDefinition,
  completedTaskTitles: string[]
): boolean {
  return stage.requiredTaskTitles.every(requiredTitle =>
    completedTaskTitles.includes(requiredTitle)
  );
}

/**
 * Determine if transaction should auto-advance to next stage
 *
 * @param currentStatus - Current transaction status
 * @param allTasks - All tasks for the transaction
 * @returns Next stage to advance to, or null if no advancement needed
 */
export function shouldAutoAdvance(
  currentStatus: TransactionStatus,
  allTasks: Array<{ title: string; completed: boolean }>
): TransactionStatus | null {
  const currentStage = getStageDefinition(currentStatus);
  if (!currentStage) return null;
  if (!currentStage.autoAdvanceOnComplete) return null;

  const completedTaskTitles = allTasks
    .filter(task => task.completed)
    .map(task => task.title);

  // Check if current stage's required tasks are all complete
  const currentStageComplete = areStageTasksComplete(currentStage, completedTaskTitles);
  if (!currentStageComplete) return null;

  const nextStage = getNextStage(currentStatus);
  if (!nextStage) return null;

  return nextStage.id;
}
