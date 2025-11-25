import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    // Get all transactions for user with tasks included
    const transactions = await prisma.transaction.findMany({
      where: {
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      transactions: transactions.map((t) => ({
        id: t.id,
        offerId: t.offerId,
        listingId: t.listingId,
        status: t.status,
        closingDate: t.closingDate?.toISOString() || null,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        offer: {
          id: t.offer.id,
          offerPrice: t.offer.offerPrice,
          status: t.offer.status,
        },
        tasks: t.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate?.toISOString() || null,
          completed: task.completed,
          completedAt: task.completedAt?.toISOString() || null,
          order: task.order,
        })),
      })),
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
