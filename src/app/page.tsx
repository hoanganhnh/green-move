import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import { Button } from '@/components/ui/button';


export default function HomePage() {
  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <section className='bg-white container'>
        <Button>Hello world!</Button>
      </section>
        
    </main>
  );
}
