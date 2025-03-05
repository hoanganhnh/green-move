import React from 'react';

import NavBar from '@/components/layouts/nav/navbar';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <NavBar />
      {children}
    </main>
  );
}

export default RootLayout;
