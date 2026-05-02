import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { slugify, toTags } from '../lib/helpers';

const emptyArticle = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Science',
  tags: '',
  linkedin_url: '',
  status: 'draft',
};

export default function ArticleEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [article, setArticle] = useState(emptyArticle);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;

    async function loadArticle() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setArticle({
        ...data,
        tags: (data.tags || []).join(', '),
      });
    }

    loadArticle();
  }, [id, isNew]);

  function updateField(field, value) {
    setArticle((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !prev.slug ? { slug: slugify(value) } : {}),
    }));
  }

  async function saveArticle(nextStatus = article.status) {
    setError('');

    if (!article.title.trim() || !article.content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSaving(true);

    const { data: sessionData } = await supabase.auth.getSession();

    const payload = {
      title: article.title.trim(),
      slug: article.slug || slugify(article.title),
      excerpt: article.excerpt || null,
      content: article.content.trim(),
      category: article.category,
      tags: toTags(article.tags),
      linkedin_url: article.linkedin_url || null,
      status: nextStatus,
      published_at: nextStatus === 'published' ? new Date().toISOString() : null,
      author_id: sessionData?.session?.user?.id || null,
    };

    let result;

    if (isNew) {
      result = await supabase.from('articles').insert(payload).select().single();
    } else {
      result = await supabase.from('articles').update(payload).eq('id', id).select().single();
    }

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    navigate('/admin');
  }

  return (
    <main className="admin-container">
      <Link to="/admin">← Back to dashboard</Link>

      <div className="admin-topbar">
        <div>
          <h1>{isNew ? 'New Article' : 'Edit Article'}</h1>
          <p>Write, save as draft, or publish to the public website.</p>
        </div>

        <div className="admin-actions">
          <button className="admin-button secondary" onClick={() => saveArticle('draft')} disabled={saving}>
            Save Draft
          </button>
          <button className="admin-button" onClick={() => saveArticle('published')} disabled={saving}>
            Publish
          </button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <section className="article-editor-grid">
        <div className="editor-main">
          <label>
            Title
            <input
              value={article.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Article title"
            />
          </label>

          <label>
            Slug
            <input
              value={article.slug}
              onChange={(e) => updateField('slug', slugify(e.target.value))}
              placeholder="article-url-slug"
            />
          </label>

          <label>
            Excerpt
            <textarea
              rows="3"
              value={article.excerpt || ''}
              onChange={(e) => updateField('excerpt', e.target.value)}
              placeholder="Short article summary"
            />
          </label>

          <label>
            Content
            <textarea
              rows="18"
              value={article.content}
              onChange={(e) => updateField('content', e.target.value)}
              placeholder="Write your article here..."
            />
          </label>
        </div>

        <aside className="editor-side">
          <label>
            Category
            <select
              value={article.category}
              onChange={(e) => updateField('category', e.target.value)}
            >
              <option>Science</option>
              <option>Policy</option>
              <option>Action</option>
              <option>Tech</option>
            </select>
          </label>

          <label>
            Tags
            <input
              value={article.tags || ''}
              onChange={(e) => updateField('tags', e.target.value)}
              placeholder="climate, adaptation, heat"
            />
          </label>

          <label>
            LinkedIn Article URL
            <input
              value={article.linkedin_url || ''}
              onChange={(e) => updateField('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/..."
            />
          </label>

          <label>
            Status
            <select
              value={article.status}
              onChange={(e) => updateField('status', e.target.value)}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </label>
        </aside>
      </section>
    </main>
  );
}
