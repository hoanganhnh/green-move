import * as React from 'react';

import NavBar from '@/components/layouts/nav/navbar';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}
