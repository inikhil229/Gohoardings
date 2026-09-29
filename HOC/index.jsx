import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withAuth(Component) {
  return function ProtectedRoute({ ...props }) {
    const router = useRouter();
    const userIsAuthenticated = typeof window !== 'undefined' && localStorage.getItem(`newgohuser`) !== null;

    useEffect(() => { 
      if (!userIsAuthenticated) {
        router.push('/');
      }
    }, [userIsAuthenticated, router]);

    return <Component {...props} />;
  };
}