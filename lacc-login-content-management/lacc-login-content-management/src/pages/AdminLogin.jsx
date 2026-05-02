import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate('/admin');
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <h1>Admin Login</h1>
        <p>Login to manage Life After Climate Change content.</p>

        <label>
          Email
          <input
            type="email"
            value={email}
            placeholder="admin@email.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <div className="admin-error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  );
}
