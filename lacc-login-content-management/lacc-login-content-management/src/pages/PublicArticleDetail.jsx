import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { formatDate } from '../lib/helpers';

export default function PublicArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function loadArticle() {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      setArticle(data || null);
    }

    loadArticle();
  }, [slug]);

  if (!article) {
    return (
      <main className="article-detail-page">
        <h1>Article not found</h1>
        <Link to="/articles">Back to articles</Link>
      </main>
    );
  }

  return (
    <main className="article-detail-page">
      <span>{article.category}</span>
      <h1>{article.title}</h1>
      <p className="article-date">{formatDate(article.published_at)}</p>

      {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}

      <article className="article-body">
        {article.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>

      {article.linkedin_url && (
        <p>
          <a href={article.linkedin_url} target="_blank" rel="noreferrer">
            Read original article on LinkedIn →
          </a>
        </p>
      )}
    </main>
  );
}
