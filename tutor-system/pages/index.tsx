import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra user đã login chưa
    const user = localStorage.getItem('user');
    
    if (user) {
      const userData = JSON.parse(user);
      // Redirect tới dashboard theo role
      if (userData.role === 'student') {
        router.push('/student/dashboard');
      } else if (userData.role === 'tutor') {
        router.push('/tutor/dashboard');
      }
    } else {
      // Chưa login -> redirect tới login
      router.push('/login');
    }
  }, [router]);

  return null;
}