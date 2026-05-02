import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { formatDate } from '../lib/helpers';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');

  async function loadArticles() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setArticles(data || []);
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function deleteArticle(id) {
    const ok = window.confirm('Delete this article permanently?');
    if (!ok) return;

    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      alert(error.message);
      return;
    }

    loadArticles();
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate('/');
  }

  return (
    <main className="admin-container">
      <div className="admin-topbar">
        <div>
          <h1>Content Manager</h1>
          <p>Create, edit, publish and delete website articles.</p>
        </div>

        <div className="admin-actions">
          <Link className="admin-button" to="/admin/articles/new">+ New Article</Link>
          <button className="admin-button secondary" onClick={signOut}>Sign out</button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Public link</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.category}</td>
                <td>
                  <span className={`status-pill ${article.status}`}>
                    {article.status}
                  </span>
                </td>
                <td>{formatDate(article.updated_at)}</td>
                <td>
                  {article.status === 'published' ? (
                    <Link to={`/articles/${article.slug}`}>View</Link>
                  ) : (
                    <span>Not public</span>
                  )}
                </td>
                <td>
                  <Link to={`/admin/articles/${article.id}`}>Edit</Link>
                  {' | '}
                  <button className="link-button" onClick={() => deleteArticle(article.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!articles.length && (
          <div className="empty-admin-state">
            <h2>No articles yet</h2>
            <p>Create your first article from the admin dashboard.</p>
          </div>
        )}
      </div>
    </main>
  );
}
