import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { formatDate } from '../lib/helpers';

export default function PublicArticles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function loadArticles() {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      setArticles(data || []);
    }

    loadArticles();
  }, []);

  return (
    <main className="articles-page">
      <h1>Latest Articles</h1>

      <div className="article-grid">
        {articles.map((article) => (
          <article className="article-card" key={article.id}>
            <span>{article.category}</span>
            <h2>
              <Link to={`/articles/${article.slug}`}>{article.title}</Link>
            </h2>
            <p>{article.excerpt}</p>
            <small>{formatDate(article.published_at)}</small>
          </article>
        ))}
      </div>
    </main>
  );
}
