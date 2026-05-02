import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        setLoggedIn(false);
        setAllowed(false);
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      const { data } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      setAllowed(Boolean(data));
      setLoading(false);
    }

    checkAccess();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  if (loading) return <div className="admin-loading">Checking admin access...</div>;

  if (!loggedIn) return <Navigate to="/admin/login" replace />;

  if (!allowed) {
    return (
      <main className="admin-container">
        <h1>Access denied</h1>
        <p>You are logged in, but your user is not added in the admins table.</p>
        <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      </main>
    );
  }

  return children;
}
