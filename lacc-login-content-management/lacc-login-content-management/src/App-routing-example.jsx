// Add these routes to your existing App.jsx.
// This is an example. Merge it with your current website routes.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ArticleEditor from './pages/ArticleEditor';
import PublicArticles from './pages/PublicArticles';
import PublicArticleDetail from './pages/PublicArticleDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Your existing homepage route should stay here */}
        {/* <Route path="/" element={<Home />} /> */}

        <Route path="/articles" element={<PublicArticles />} />
        <Route path="/articles/:slug" element={<PublicArticleDetail />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/articles/:id"
          element={
            <ProtectedAdminRoute>
              <ArticleEditor />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
