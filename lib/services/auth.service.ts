import {
  IAuthService,
  RegisterData,
  User,
  LoggedUser,
  Credentials,
} from "@/lib/interfaces/auth.interface";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getStringDate } from "../utils";

const isMockMode =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "AIzaSyDummyKeyForBuildPurposesOnly" ||
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export class AuthService implements IAuthService {
  private collectionRef = "users";

  async getOrCreateUser(uid: string): Promise<User> {
    if (isMockMode) {
      const isMockAdmin = uid.includes("admin") || uid.includes("teste");
      return {
        uid,
        role: isMockAdmin ? "admin" : "user",
        isAdmin: isMockAdmin,
        createdAt: getStringDate(new Date()),
        updatedAt: getStringDate(new Date()),
        name: isMockAdmin ? "Administrador Teste" : "Jogador Guardião",
        email: isMockAdmin ? "admin@template.com" : "guardiao@template.com",
      };
    }

    try {
      const userRef = doc(db, this.collectionRef, uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // create new user
        const newUser: User = {
          uid,
          role: "user",
          isAdmin: false,
          createdAt: getStringDate(new Date()),
          updatedAt: getStringDate(new Date()),
        };

        await setDoc(userRef, newUser);
        return newUser;
      }

      // user already exists
      return userSnap.data() as User;
    } catch (error) {
      console.error("Erro ao buscar/criar usuário: ", error);
      return {} as User;
    }
  }

  async login(credentials: Credentials): Promise<LoggedUser | null> {
    if (isMockMode) {
      const isMockAdmin = credentials.email.includes("admin") || credentials.email.includes("teste");
      const mockUser: LoggedUser = {
        uid: "mock-uid-" + credentials.email,
        role: isMockAdmin ? "admin" : "user",
        isAdmin: isMockAdmin,
        createdAt: getStringDate(new Date()),
        updatedAt: getStringDate(new Date()),
        name: credentials.email.split("@")[0].toUpperCase(),
        email: credentials.email,
        accessToken: "mock-token-" + Date.now(),
      };
      localStorage.setItem("mvp-user", JSON.stringify(mockUser));
      return mockUser;
    }

    try {
      const loggedUser = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const accessToken = await loggedUser.user.getIdToken();
      const user = await this.getOrCreateUser(loggedUser.user.uid);
      return { ...user, accessToken };
    } catch (error) {
      console.log("Something went wrong in login: ", error);
      throw new Error();
    }
  }

  async register(credentials: RegisterData): Promise<User> {
    if (isMockMode) {
      const isMockAdmin = credentials.email.includes("admin") || credentials.email.includes("teste");
      const mockUser: User = {
        uid: "mock-uid-" + credentials.email,
        role: isMockAdmin ? "admin" : "user",
        isAdmin: isMockAdmin,
        createdAt: getStringDate(new Date()),
        updatedAt: getStringDate(new Date()),
        name: credentials.name || credentials.email.split("@")[0].toUpperCase(),
        email: credentials.email,
      };
      const loggedUser: LoggedUser = {
        ...mockUser,
        accessToken: "mock-token-" + Date.now(),
      };
      localStorage.setItem("mvp-user", JSON.stringify(loggedUser));
      return loggedUser;
    }

    try {
      const loggedUser = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      const accessToken = await loggedUser.user.getIdToken();
      const user = await this.getOrCreateUser(loggedUser.user.uid);
      return { ...user, accessToken };
    } catch (error) {
      console.log("Something went wrong in register: ", error);
      throw new Error();
    }
  }

  async resetPasswordRequest(email: string): Promise<{ message: string }> {
    return { message: "null" };
  }

  async logout(): Promise<void> {
    if (isMockMode) {
      localStorage.removeItem("mvp-user");
      return;
    }
    await signOut(auth);
    return;
  }

  async refreshToken(): Promise<void> {
    return;
  }
}
