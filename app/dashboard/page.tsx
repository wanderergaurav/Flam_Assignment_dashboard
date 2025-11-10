'use client';
import React from 'react';
import DataProvider from '../../components/providers/DataProvider';
import Dashboard from '../../components/ui/Dashboard';

export default function DashboardPage() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  );
}
