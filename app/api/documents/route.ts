import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { listingProvider } from '@/lib/listing-service';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    const { searchParams } = new URL(request.url);
    const documentType = searchParams.get('type');
    const transactionId = searchParams.get('transactionId');

    const where: any = {
      userId: mockUserId,
    };

    if (documentType && documentType !== 'all') {
      where.documentType = documentType;
    }

    if (transactionId) {
      where.transactionId = transactionId;
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        transaction: {
          include: {
            offer: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    // Get listing details for transactions
    const documentsWithDetails = await Promise.all(
      documents.map(async (doc) => {
        let address = null;
        if (doc.transaction?.offer) {
          const listing = await listingProvider.getListingById(doc.transaction.offer.listingId);
          address = listing?.address || `Listing ${doc.transaction.offer.listingId}`;
        }

        return {
          id: doc.id,
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
          fileSize: doc.fileSize,
          fileType: doc.fileType,
          documentType: doc.documentType,
          description: doc.description,
          uploadedAt: doc.uploadedAt.toISOString(),
          transaction: doc.transaction
            ? {
                id: doc.transaction.id,
                address: address || 'Unknown',
              }
            : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      documents: documentsWithDetails,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);

    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
