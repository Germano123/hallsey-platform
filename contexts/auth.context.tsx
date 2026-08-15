"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react"
import { User, IAuthService, Credentials, RegisterData } from "@/lib/interfaces/auth.interface"
import { AuthService } from "@/lib/services/auth.service"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType extends IAuthService {
  user: User | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_TOKEN = "mvp-token";

const isMockMode =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "AIzaSyDummyKeyForBuildPurposesOnly" ||
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useStudio must be used within a StudioProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const authService: IAuthService = useMemo(() => new AuthService(), []);

  useEffect(() => {
    // check if has data in session storage
    const unsubscribe = checkAuthUser();
    return () => unsubscribe();
  }, [])

  const checkAuthUser = () => {
    setLoading(true);

    if (isMockMode) {
      const storedUser = localStorage.getItem("mvp-user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // usuário deslogado
        setUser(null);
        setLoading(false);
        return;
      }

      // Dados básicos vindos do Auth
      const authUser = {
        uid: firebaseUser.uid,
        // photoURL: firebaseUser.photoURL,
      };

      const user = await authService.getOrCreateUser(firebaseUser.uid);
      setUser({ ...authUser, ...user });

      setLoading(false);
    });

    return unsubscribe;
  };

  const login = useCallback(
    async (credentials: Credentials): Promise<User | null> => {
      try {
        const loggedUser = await authService.login(credentials);
        if (loggedUser == null) return null;
        // set user
        localStorage.setItem(AUTH_TOKEN, JSON.stringify(loggedUser.accessToken));
        setUser(loggedUser);
        return loggedUser;
      } catch (error) {
        console.log("Something went wrong in the context: " + error)      
        return null
      }
    },
    [authService]
  );

  const register = useCallback(
    async (userdata: RegisterData): Promise<User> => {
      try {
        const res = await authService.register(userdata);
        // set user
        localStorage.setItem(AUTH_TOKEN, JSON.stringify(res));
        setUser(res);
        return res;
      } catch (error) {
        console.log("Something went wrong in the context: " + error)      
        return {} as User;
      }
    },
    [authService]
  );

  const logout = useCallback(
    async () => {
      await authService.logout();
      if (isMockMode) {
        localStorage.removeItem(AUTH_TOKEN);
        setUser(null);
      }
    },
    [authService]
  );

  const refreshToken = useCallback(
    async (): Promise<void> => {
      return await authService.refreshToken();
    },
    [authService]
  );

  const getOrCreateUser = useCallback(
    async (uid: string): Promise<User> => {
      return await authService.getOrCreateUser(uid);
    },
    [authService]
  );

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        refreshToken,
        getOrCreateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
