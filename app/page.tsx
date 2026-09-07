'use client';

import { useState } from 'react';
import RunwayApp from './runway-app';
import TargoLanding from './targo-landing';

export default function Home() {
  const [showCockpit, setShowCockpit] = useState(false);

  if (showCockpit) {
    return <RunwayApp onBackToLanding={() => setShowCockpit(false)} />;
  }

  return <TargoLanding onOpenCockpit={() => setShowCockpit(true)} />;
}
