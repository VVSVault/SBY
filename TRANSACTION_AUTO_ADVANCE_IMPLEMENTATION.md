# Transaction Auto-Advance Implementation

## Overview
Implemented a **task-driven auto-advance system** where completing required tasks automatically progresses transactions through stages. No manual "Next Stage" button in the buyer UI.

## How It Works

### Stage Configuration (`lib/transaction-stages.ts`)
Each of the 5 transaction stages has:
- **`id`**: Stage identifier (e.g., `under_contract`, `financing`)
- **`label`**: Display name (e.g., "Under Contract", "Financing")
- **`description`**: Brief explanation of the stage
- **`requiredTaskTitles`**: Array of task titles that must be completed to advance
- **`autoAdvanceOnComplete`**: Boolean (true for all stages except final "Closed")
- **`icon`**: Icon name for timeline display

### Stage Definitions

#### Stage 1: Under Contract
**Required Tasks:**
- Send Earnest Money Deposit

When completed → Auto-advances to **Inspection Period**

#### Stage 2: Inspection Period
**Required Tasks:**
- Schedule Home Inspection
- Review Title Report

When completed → Auto-advances to **Financing**

#### Stage 3: Financing
**Required Tasks:**
- Submit Loan Application
- Order Appraisal

When completed → Auto-advances to **Clear to Close**

#### Stage 4: Clear to Close
**Required Tasks:**
- Secure Homeowner's Insurance
- Review Closing Disclosure
- Complete Final Walkthrough
- Wire Closing Funds

When completed → Auto-advances to **Closed**

#### Stage 5: Closed
**Required Tasks:**
- Attend Closing

This is the final stage (no auto-advance)

## Auto-Advancement Logic

### API Endpoint: `/api/tasks/[id]`
When a task is marked complete:

1. **Check Current Stage**: Determine transaction's current status
2. **Fetch All Tasks**: Get all tasks for the transaction
3. **Check Required Tasks**: See if all required tasks for current stage are complete
4. **Auto-Advance**: If yes, update `transaction.status` to next stage
5. **Return Notification**: Include `advancedToStage` in API response

```typescript
// In app/api/tasks/[id]/route.ts
if (validatedData.completed) {
  const allTasks = await prisma.task.findMany({
    where: { transactionId: task.transactionId },
    select: { title: true, completed: true },
  });

  const nextStage = shouldAutoAdvance(
    task.transaction.status as TransactionStatus,
    allTasks
  );

  if (nextStage) {
    await prisma.transaction.update({
      where: { id: task.transactionId },
      data: { status: nextStage },
    });
    advancedToStage = nextStage;
  }
}
```

### Buyer UI Experience

1. **View Transaction**: See timeline with 5 stages
2. **Complete Tasks**: Check off tasks in the checklist
3. **Auto-Advance Notification**: When last required task is checked:
   - Transaction automatically moves to next stage
   - Alert shows: "🎉 All required tasks complete! Advanced to [Stage Name] stage."
   - Timeline updates immediately
4. **No Manual Button**: Buyer never sees "Advance to Next Stage" button

### Timeline Display
- Shows task completion progress: "2/2 tasks done" for active stage
- Displays task count for upcoming stages: "4 tasks"
- Completed stages show: "✓ Completed"
- Info banner explains: "Complete the required tasks for each stage to automatically progress"

## Admin Override (Future)
The status update endpoint (`/api/transactions/[id]/status`) still exists for:
- Manual corrections by admin staff
- Handling edge cases
- Future admin UI functionality

Currently not exposed in buyer-facing UI.

## Testing

### Test Scenario 1: Fresh Transaction (Under Contract)
1. Visit transaction detail page
2. Check "Send Earnest Money Deposit"
3. ✅ Should auto-advance to "Inspection Period"
4. Alert should show advancement notification

### Test Scenario 2: Financing Transaction
1. Visit financing-stage transaction (seeded with `seed-financing-transaction.ts`)
2. Note: 1/2 financing tasks complete
3. Check "Order Appraisal" task
4. ✅ Should auto-advance to "Clear to Close"

### Test Scenario 3: Clear to Close
1. Complete all 4 Clear to Close tasks:
   - Secure Homeowner's Insurance
   - Review Closing Disclosure
   - Complete Final Walkthrough
   - Wire Closing Funds
2. ✅ Should auto-advance to "Closed"

### Test Scenario 4: Unchecking Tasks
- Unchecking a task does NOT revert stage
- Transaction stays at current stage
- This prevents accidental stage regression

## Files Modified

### Backend
- ✅ `lib/transaction-stages.ts` - Stage configuration system
- ✅ `app/api/tasks/[id]/route.ts` - Auto-advance logic
- ✅ `prisma/seed-transaction.ts` - Aligned tasks with stages
- ✅ `prisma/seed-financing-transaction.ts` - Aligned tasks with stages

### Frontend
- ✅ `app/buyer/transactions/[id]/page.tsx`:
  - Removed `handleAdvanceStage` function
  - Removed manual "Advance to Next Stage" button
  - Updated `handleToggleTask` to show auto-advance notifications
  - Updated timeline to use `STAGE_DEFINITIONS`
  - Added task completion counters per stage
  - Added info banner explaining auto-advancement

## Benefits

### For Buyers
- **Intuitive**: Completing tasks = progress (clear cause-and-effect)
- **Automated**: No manual button clicks required
- **Transparent**: See exactly which tasks are needed for each stage
- **Motivating**: Visual progress as tasks are completed

### For Development
- **Centralized Config**: Single source of truth for stage definitions
- **Flexible**: Easy to adjust required tasks per stage
- **Maintainable**: Stage logic separated from UI components
- **Extensible**: Can add date-based rules, warnings, etc. in the future

## Future Enhancements

### Potential Additions:
1. **Date-Based Warnings**: Show alerts if inspection deadline approaching
2. **Task Grouping**: Visual grouping of tasks by stage in checklist
3. **Stage Descriptions**: Expandable info about what happens in each stage
4. **Progress Animations**: Celebrate stage advancements with animations
5. **Email Notifications**: Alert buyer when auto-advancement occurs
6. **Admin Dashboard**: Staff UI to manually override stages if needed

## Migration Notes

### If Updating Existing Transactions:
- Old transactions with manual status will continue to work
- New auto-advance only triggers on task completion
- No database migration needed (uses existing status field)
- Admin can still manually update status via API if needed
