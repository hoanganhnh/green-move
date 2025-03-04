import React from 'react';

import Navbar from '@/components/layouts/nav/nav-bar';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}

export default RootLayout;
