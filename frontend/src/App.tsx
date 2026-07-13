import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { DocumentUpload } from './pages/DocumentUpload';
import { SemanticSearch } from './pages/SemanticSearch';
import { KnowledgeGraph } from './pages/KnowledgeGraph';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/upload" element={<DashboardLayout><DocumentUpload /></DashboardLayout>} />
          <Route path="/search" element={<DashboardLayout><SemanticSearch /></DashboardLayout>} />
          <Route path="/graph" element={<DashboardLayout><KnowledgeGraph /></DashboardLayout>} />
          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
