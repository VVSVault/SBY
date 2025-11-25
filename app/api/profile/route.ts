import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
});

const updateNotificationsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  notificationTypes: z.string().optional().nullable(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export async function GET(request: NextRequest) {
  try {
    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    const user = await prisma.user.findUnique({
      where: { id: mockUserId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        emailNotifications: true,
        smsNotifications: true,
        notificationTypes: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // TODO: Get authenticated user (for now, using mock user)
    const mockUserId = 'user-1';

    const body = await request.json();
    const { type, ...data } = body;

    // Handle different update types
    if (type === 'profile') {
      const validatedData = updateProfileSchema.parse(data);

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email,
          NOT: { id: mockUserId },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: mockUserId },
        data: validatedData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          emailNotifications: true,
          smsNotifications: true,
          notificationTypes: true,
        },
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
      });
    } else if (type === 'notifications') {
      const validatedData = updateNotificationsSchema.parse(data);

      const updatedUser = await prisma.user.update({
        where: { id: mockUserId },
        data: validatedData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          emailNotifications: true,
          smsNotifications: true,
          notificationTypes: true,
        },
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
      });
    } else if (type === 'password') {
      const validatedData = updatePasswordSchema.parse(data);

      // Get current user with password
      const user = await prisma.user.findUnique({
        where: { id: mockUserId },
        select: { id: true, password: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Verify current password if it exists
      if (user.password) {
        const isValid = await bcrypt.compare(
          validatedData.currentPassword,
          user.password
        );

        if (!isValid) {
          return NextResponse.json(
            { error: 'Current password is incorrect' },
            { status: 400 }
          );
        }
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

      await prisma.user.update({
        where: { id: mockUserId },
        data: { password: hashedPassword },
      });

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully',
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid update type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating profile:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
