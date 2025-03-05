import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import { Shell } from '@/components/common/shell';
import RootLayout from '@/components/layouts/root-layout';

export default function HomePage() {
  return (
    <RootLayout>
      <Head>
        <title>Hi</title>
      </Head>
      <Shell></Shell>
    </RootLayout>
  );
}
