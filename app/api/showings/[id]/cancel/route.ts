import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { reason } = body;

    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    // Update showing request status to cancelled
    const showing = await prisma.showingRequest.updateMany({
      where: {
        id,
        userId: mockUserId, // Ensure user owns this showing
      },
      data: {
        status: 'cancelled',
        cancellationReason: reason || 'Cancelled by buyer',
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
      message: 'Showing request cancelled',
    });
  } catch (error) {
    console.error('Error cancelling showing request:', error);
    return NextResponse.json(
      { error: 'Failed to cancel showing request' },
      { status: 500 }
    );
  }
}
