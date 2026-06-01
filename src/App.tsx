import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ClassifyPage } from './components/classification/ClassifyPage';
import { PredictPage } from './components/prediction/PredictPage';
import { KnowledgePointPage } from './components/knowledge/KnowledgePointPage';
import type { TabId } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'classify' && <ClassifyPage />}
      {activeTab === 'predict' && <PredictPage />}
      {activeTab === 'knowledge' && <KnowledgePointPage />}
    </AppShell>
  );
}

export default App;
