import { createContext, useContext, useState, useEffect } from 'react';
import { createDirectus, rest, authentication, readMe, createUser } from '@directus/sdk';
import Loading from '../Components/Loading/Loading';

// 1. Initialize Client
const client = createDirectus('https://api.wade-usa.com')
  .with(rest())
  .with(authentication('json')); // Using 'json' so it doesn't freeze the promise

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 2. Persistent Login Check
  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('directus_token');
      
      if (savedToken) {
          client.setToken(savedToken);
          try {
            const data = await client.request(readMe());
            setUser(data);
          } catch {
            // If readMe fails but we have a token, assume they are logged in but lack permissions
            setUser({ requires_permission_fix: true });
          }
      } else {
          setUser(null);
      }
      setLoading(false);
    };
    init();
  }, []);

  // 3. Auth Actions
  const register = (email: string, password: string, username: string) => client.request(createUser({ email, password, first_name: username, status: 'unverified', role:'a149f728-88c1-4828-86da-3540d675f1c7'}));
  const login = async (email: string, password: string) => {
    try {
      await client.login({ email, password });
      console.log("Login successful (Auth Context)");
      
      const token = await client.getToken();
      if (token) localStorage.setItem('directus_token', token);

      try {
        const userData = await client.request(readMe());
        setUser(userData);
      } catch (readError) {
        console.warn("Could not read user profile (check Directus permissions). Granting entry anyway.");
        setUser({ email, requires_permission_fix: true });
      }
      
    } catch (error) {
      console.error("AuthContext Login Error:", error);
      throw error;
    }
  };
  const logout = async () => { 
      try {
        await client.logout(); 
      } catch (error) {
        console.warn("Directus API logout failed, clearing local session anyway.");
      } finally {
        localStorage.removeItem('directus_token');
        setUser(null); 
      }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);