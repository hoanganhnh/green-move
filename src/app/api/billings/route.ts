import { NextRequest, NextResponse } from 'next/server';

import paymentService from '@/services/payment.service';
import rentalService from '@/services/rental.service';

import { Payment } from '@/types/payment.type';
import { Rental } from '@/types/rental.type';

interface BillingItem {
  rental: Rental;
  payment?: Payment;
}

export async function GET(request: NextRequest) {
  try {
    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    // Fetch rentals for the user
    const rentals = await rentalService.getRentals({
      user_id: parseInt(userId, 10),
    });

    if (!rentals || rentals.length === 0) {
      return NextResponse.json([]);
    }

    // For each rental, fetch the associated payment
    const billingItemsPromises = rentals.map(async (rental) => {
      try {
        // Get payments for this rental
        const payments = await paymentService.getPayments({
          rental_id: rental.id,
        });

        // Return billing item with rental and payment (if exists)
        return {
          rental,
          payment: payments.length > 0 ? payments[0] : undefined,
        };
      } catch (error) {
        // If there's an error fetching payment, just return the rental
        return { rental };
      }
    });

    const billingItems: BillingItem[] = await Promise.all(billingItemsPromises);

    return NextResponse.json(billingItems);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in billings API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing data' },
      { status: 500 },
    );
  }
}
