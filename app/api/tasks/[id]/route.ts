import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { shouldAutoAdvance, type TransactionStatus } from '@/lib/transaction-stages';

const updateTaskSchema = z.object({
  completed: z.boolean(),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Validate request body
    const validatedData = updateTaskSchema.parse(body);

    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    // Verify task belongs to user's transaction
    const task = await prisma.task.findFirst({
      where: {
        id,
      },
      include: {
        transaction: true,
      },
    });

    if (!task || task.transaction.userId !== mockUserId) {
      return NextResponse.json(
        { error: 'Task not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        completed: validatedData.completed,
        completedAt: validatedData.completed ? new Date() : null,
      },
    });

    // Auto-advance transaction stage if all required tasks are complete
    let advancedToStage: string | null = null;

    if (validatedData.completed) {
      // Fetch all tasks for this transaction to check if we should auto-advance
      const allTasks = await prisma.task.findMany({
        where: {
          transactionId: task.transactionId,
        },
        select: {
          title: true,
          completed: true,
        },
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

    return NextResponse.json({
      success: true,
      task: {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        dueDate: updatedTask.dueDate?.toISOString() || null,
        completed: updatedTask.completed,
        completedAt: updatedTask.completedAt?.toISOString() || null,
        order: updatedTask.order,
      },
      advancedToStage, // Inform client if we auto-advanced
    });
  } catch (error) {
    console.error('Error updating task:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
