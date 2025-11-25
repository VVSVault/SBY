import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const notesSchema = z.object({
  showingNotes: z.string().max(2000),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Validate request body
    const validatedData = notesSchema.parse(body);

    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    // Update showing request notes
    const showing = await prisma.showingRequest.updateMany({
      where: {
        id,
        userId: mockUserId, // Ensure user owns this showing
      },
      data: {
        showingNotes: validatedData.showingNotes,
      },
    });

    if (showing.count === 0) {
      return NextResponse.json(
        { error: 'Showing request not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Showing notes updated',
    });
  } catch (error) {
    console.error('Error updating showing notes:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update showing notes' },
      { status: 500 }
    );
  }
}
