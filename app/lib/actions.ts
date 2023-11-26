'use server';

import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['peding', 'paid']),
  date: z.string(),
});

const CreateInvoiceSchema = InvoiceSchema.omit({
  id: true,
  date: true,
});

export async function createInvoice(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());

  const { amount, customerId, status } = CreateInvoiceSchema.parse(rawFormData);

  const amountInCents = amount * 100;

  const [date] = new Date().toISOString().split('T');

  console.log({
    customerId,
    amountInCents,
    status,
    date,
  });

  await sql`INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;

  redirect('/dashboard/invoices');
}
