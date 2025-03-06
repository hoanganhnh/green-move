import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import { Shell } from '@/components/common/shell';
import RootLayout from '@/components/layouts/root-layout';
import CarRental from '@/containers/car-rental';

export default function HomePage() {
  return (
    <RootLayout>
      <Head>
        <title>Green Move</title>
      </Head>
      <Shell>
        <CarRental />
      </Shell>
    </RootLayout>
  );
}
