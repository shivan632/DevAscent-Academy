'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AboutSection from '../../components/AboutSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pt-20">
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}
