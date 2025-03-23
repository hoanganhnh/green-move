import { revalidatePath } from 'next/cache';
import * as React from 'react';

import PaymentDataTable from '@/app/dashboard/payments/payment-data-table';
import paymentService from '@/services/payment.service';
import rentalService from '@/services/rental.service';
import userService from '@/services/user.service';

// Server action to revalidate the page after data changes
async function revalidatePayments() {
  'use server';
  revalidatePath('/dashboard/payment');
}

async function PaymentDashboardPage() {
  const payments = await paymentService.getPayments();

  const paymentsWithDetails = await Promise.all(
    payments.map(async (p) => {
      const user = await userService.getUserById(p.user_id);
      const rental = await rentalService.getRental(p.rental_id);
      return {
        ...p,
        user,
        rental,
      };
    }),
  );

  return (
    <div>
      <PaymentDataTable
        data={paymentsWithDetails}
        totalPages={1}
        revalidateAction={revalidatePayments}
      />
    </div>
  );
}

export default PaymentDashboardPage;
