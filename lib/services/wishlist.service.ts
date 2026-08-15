import { db } from "../firebase";
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { getStringDate } from "../utils";

export interface WishlistEntry {
  id?: string;
  name: string;
  email: string;
  favoriteClass?: string;
  createdAt?: string;
}

const isMockMode =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "AIzaSyDummyKeyForBuildPurposesOnly" ||
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export class WishlistService {
  private collectionName = "wishlist";

  async addToWishlist(entry: WishlistEntry): Promise<void> {
    if (isMockMode) {
      const stored = localStorage.getItem("wishlist") || "[]";
      const list = JSON.parse(stored);
      list.push({
        ...entry,
        id: "mock-" + Date.now(),
        createdAt: getStringDate(new Date())
      });
      localStorage.setItem("wishlist", JSON.stringify(list));
      return;
    }

    try {
      const colRef = collection(db, this.collectionName);
      await addDoc(colRef, {
        name: entry.name,
        email: entry.email,
        favoriteClass: entry.favoriteClass || "Indeciso",
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao salvar na wishlist no Firebase: ", error);
      throw error;
    }
  }

  async getWishlist(): Promise<WishlistEntry[]> {
    if (isMockMode) {
      const stored = localStorage.getItem("wishlist") || "[]";
      return JSON.parse(stored);
    }

    try {
      const colRef = collection(db, this.collectionName);
      const querySnapshot = await getDocs(colRef);
      const list: WishlistEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          favoriteClass: data.favoriteClass || "Indeciso",
          createdAt: data.createdAt ? getStringDate(new Date(data.createdAt)) : getStringDate(new Date())
        });
      });
      
      // Sort by createdAt descending
      return list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Erro ao buscar a wishlist do Firebase: ", error);
      return [];
    }
  }
}
