import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { listingProvider } from '@/lib/listing-service';

const resend = new Resend(process.env.RESEND_API_KEY);

const createOfferSchema = z.object({
  listingId: z.string().min(1),
  offerPrice: z.number().min(1000),
  earnestMoney: z.number().min(0),
  financingType: z.enum(['cash', 'conventional', 'fha', 'va', 'other']),
  downPaymentPercent: z.number().min(0).max(100).optional(),
  preApproved: z.boolean(),
  inspectionContingency: z.boolean(),
  inspectionDays: z.number().min(0).max(30).optional(),
  appraisalContingency: z.boolean(),
  appraisalDays: z.number().min(0).max(30).optional(),
  financingContingency: z.boolean(),
  financingDays: z.number().min(0).max(45).optional(),
  targetClosingDate: z.string().optional().nullable(),
  sellerConcessions: z.string().max(500).optional(),
  additionalTerms: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createOfferSchema.parse(body);

    // Get listing details
    const listing = await listingProvider.getListingById(validatedData.listingId);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    // Create offer in database
    const offer = await prisma.offer.create({
      data: {
        userId: mockUserId,
        listingId: validatedData.listingId,
        offerPrice: validatedData.offerPrice,
        earnestMoney: validatedData.earnestMoney,
        financingType: validatedData.financingType,
        downPaymentPercent: validatedData.downPaymentPercent || null,
        preApproved: validatedData.preApproved,
        inspectionContingency: validatedData.inspectionContingency,
        inspectionDays: validatedData.inspectionDays || null,
        appraisalContingency: validatedData.appraisalContingency,
        appraisalDays: validatedData.appraisalDays || null,
        financingContingency: validatedData.financingContingency,
        financingDays: validatedData.financingDays || null,
        targetClosingDate: validatedData.targetClosingDate ? new Date(validatedData.targetClosingDate) : null,
        sellerConcessions: validatedData.sellerConcessions || null,
        additionalTerms: validatedData.additionalTerms || null,
        status: 'draft',
      },
    });

    // Get user details (mock for now)
    const user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
    };

    // Send email notification
    try {
      await resend.emails.send({
        from: 'SoldByYou Offers <offers@soldbyyou.com>',
        to: 'offers@soldbyyou.com',
        subject: `New Offer Submitted - ${listing.address}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                }
                .container {
                  max-width: 700px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background-color: #406f77;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
                }
                .content {
                  background-color: #f9f9f9;
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-top: none;
                }
                .listing-image {
                  width: 100%;
                  max-width: 500px;
                  height: auto;
                  border-radius: 8px;
                  margin: 15px 0;
                }
                .info-section {
                  background-color: white;
                  padding: 15px;
                  margin: 15px 0;
                  border-radius: 8px;
                  border-left: 4px solid #5DD5D9;
                }
                .info-label {
                  font-weight: bold;
                  color: #406f77;
                  margin-bottom: 5px;
                }
                .price-highlight {
                  font-size: 28px;
                  font-weight: bold;
                  color: #406f77;
                  margin: 10px 0;
                }
                .grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 15px;
                  margin: 15px 0;
                }
                .button {
                  display: inline-block;
                  background-color: #5DD5D9;
                  color: #333;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: bold;
                  margin: 15px 0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Offer Submitted</h1>
                </div>
                <div class="content">
                  <h2>Listing Details</h2>
                  <img src="${listing.photos[0] || ''}" alt="Property" class="listing-image" />

                  <div class="info-section">
                    <div class="info-label">Address:</div>
                    <div>${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}</div>
                  </div>

                  <div class="info-section">
                    <div class="info-label">List Price:</div>
                    <div>$${listing.price.toLocaleString()}</div>
                  </div>

                  <div class="info-section">
                    <div class="info-label">Property Details:</div>
                    <div>${listing.beds} beds | ${listing.baths} baths | ${listing.sqft?.toLocaleString() || 'N/A'} sqft</div>
                  </div>

                  <h2>Offer Details</h2>

                  <div class="price-highlight">
                    Offer Price: $${validatedData.offerPrice.toLocaleString()}
                  </div>

                  ${validatedData.offerPrice < listing.price
                    ? `<p style="color: #d97706; font-weight: bold;">
                        ${(((listing.price - validatedData.offerPrice) / listing.price) * 100).toFixed(1)}% below asking price
                      </p>`
                    : validatedData.offerPrice > listing.price
                    ? `<p style="color: #059669; font-weight: bold;">
                        ${(((validatedData.offerPrice - listing.price) / listing.price) * 100).toFixed(1)}% above asking price
                      </p>`
                    : `<p style="color: #059669; font-weight: bold;">At asking price</p>`
                  }

                  <div class="grid">
                    <div class="info-section">
                      <div class="info-label">Earnest Money:</div>
                      <div>$${validatedData.earnestMoney.toLocaleString()}</div>
                    </div>

                    <div class="info-section">
                      <div class="info-label">Financing Type:</div>
                      <div style="text-transform: capitalize;">${validatedData.financingType}</div>
                    </div>

                    ${validatedData.downPaymentPercent ? `
                      <div class="info-section">
                        <div class="info-label">Down Payment:</div>
                        <div>${validatedData.downPaymentPercent}% ($${Math.round((validatedData.offerPrice * validatedData.downPaymentPercent) / 100).toLocaleString()})</div>
                      </div>
                    ` : ''}

                    <div class="info-section">
                      <div class="info-label">Pre-Approved:</div>
                      <div>${validatedData.preApproved ? 'Yes' : 'No'}</div>
                    </div>
                  </div>

                  <h2>Contingencies</h2>

                  <div class="info-section">
                    <div class="info-label">Inspection:</div>
                    <div>${validatedData.inspectionContingency ? `Yes (${validatedData.inspectionDays} days)` : 'Waived'}</div>
                  </div>

                  <div class="info-section">
                    <div class="info-label">Appraisal:</div>
                    <div>${validatedData.appraisalContingency ? `Yes (${validatedData.appraisalDays} days)` : 'Waived'}</div>
                  </div>

                  ${validatedData.financingType !== 'cash' ? `
                    <div class="info-section">
                      <div class="info-label">Financing:</div>
                      <div>${validatedData.financingContingency ? `Yes (${validatedData.financingDays} days)` : 'Waived'}</div>
                    </div>
                  ` : ''}

                  ${validatedData.targetClosingDate ? `
                    <h2>Closing & Terms</h2>

                    <div class="info-section">
                      <div class="info-label">Target Closing Date:</div>
                      <div>${new Date(validatedData.targetClosingDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</div>
                    </div>
                  ` : ''}

                  ${validatedData.sellerConcessions ? `
                    <div class="info-section">
                      <div class="info-label">Seller Concessions:</div>
                      <div>${validatedData.sellerConcessions}</div>
                    </div>
                  ` : ''}

                  ${validatedData.additionalTerms ? `
                    <div class="info-section">
                      <div class="info-label">Additional Terms:</div>
                      <div>${validatedData.additionalTerms}</div>
                    </div>
                  ` : ''}

                  <h2>Buyer Information</h2>

                  <div class="info-section">
                    <div class="info-label">Name:</div>
                    <div>${user.name}</div>
                  </div>

                  <div class="info-section">
                    <div class="info-label">Email:</div>
                    <div>${user.email}</div>
                  </div>

                  <div class="info-section">
                    <div class="info-label">Phone:</div>
                    <div>${user.phone}</div>
                  </div>

                  <div style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:3000/buyer/offers/${offer.id}" class="button">View Full Offer</a>
                  </div>

                  <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                    This is an automated notification from SoldByYou Buyer Portal.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails - offer is still saved
    }

    return NextResponse.json({
      success: true,
      offer,
    });
  } catch (error) {
    console.error('Error creating offer:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
