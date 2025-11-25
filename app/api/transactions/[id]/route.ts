import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    // Get transaction by ID
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: mockUserId,
      },
      include: {
        offer: true,
        tasks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      transaction: {
        id: transaction.id,
        offerId: transaction.offerId,
        listingId: transaction.listingId,
        status: transaction.status,
        closingDate: transaction.closingDate?.toISOString() || null,
        createdAt: transaction.createdAt.toISOString(),
        updatedAt: transaction.updatedAt.toISOString(),
        offer: {
          id: transaction.offer.id,
          offerPrice: transaction.offer.offerPrice,
          earnestMoney: transaction.offer.earnestMoney,
          financingType: transaction.offer.financingType,
          targetClosingDate: transaction.offer.targetClosingDate?.toISOString() || null,
          status: transaction.offer.status,
        },
        tasks: transaction.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate?.toISOString() || null,
          completed: task.completed,
          completedAt: task.completedAt?.toISOString() || null,
          order: task.order,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}
