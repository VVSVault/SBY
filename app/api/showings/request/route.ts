import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { listingProvider } from '@/lib/listing-service';

const resend = new Resend(process.env.RESEND_API_KEY);

const showingRequestSchema = z.object({
  listingId: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  note: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = showingRequestSchema.parse(body);

    // Get listing details
    const listing = await listingProvider.getListingById(validatedData.listingId);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1'; // This will be replaced with real auth

    // Create showing request in database
    const showingRequest = await prisma.showingRequest.create({
      data: {
        userId: mockUserId,
        listingId: validatedData.listingId,
        preferredDate: new Date(validatedData.preferredDate),
        preferredTime: validatedData.preferredTime,
        note: validatedData.note || '',
        status: 'requested',
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
        from: 'SoldByYou Showings <showings@soldbyyou.com>',
        to: 'showings@soldbyyou.com',
        subject: `New Showing Request - ${listing.address}`,
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
                  max-width: 600px;
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
                  <h1>New Showing Request</h1>
                </div>
                <div class="content">
                  <h2>Listing Details</h2>
                  <img src="${listing.photos[0] || ''}" alt="Property" class="listing-image" />

                  <div class="info-section">
                    <div class="info-label">Address:</div>
                    <div>${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}</div>
                  </div>

                  <div class="info-section">
                    <div class="info-label">Price:</div>
                    <div>$${listing.price.toLocaleString()}</div>
                  </div>

                  <div class="info-section">
                    <div class="info-label">Property Details:</div>
                    <div>${listing.beds} beds | ${listing.baths} baths | ${listing.sqft?.toLocaleString() || 'N/A'} sqft</div>
                  </div>

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

                  <h2>Showing Request Details</h2>

                  <div class="info-section">
                    <div class="info-label">Preferred Date:</div>
                    <div>${new Date(validatedData.preferredDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</div>
                  </div>

                  <div class="info-section">
                    <div class="info-label">Preferred Time:</div>
                    <div>${validatedData.preferredTime}</div>
                  </div>

                  ${validatedData.note ? `
                    <div class="info-section">
                      <div class="info-label">Additional Notes:</div>
                      <div>${validatedData.note}</div>
                    </div>
                  ` : ''}

                  <div style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:3000/buyer/showings" class="button">View All Showing Requests</a>
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
      // Don't fail the request if email fails - showing request is still saved
    }

    return NextResponse.json({
      success: true,
      showingRequest,
    });
  } catch (error) {
    console.error('Error creating showing request:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create showing request' },
      { status: 500 }
    );
  }
}
