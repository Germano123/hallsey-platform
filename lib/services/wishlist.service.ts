import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export interface WishlistEntry {
  id?: string;
  name: string;
  email: string;
  favoriteClass?: string;
  createdAt?: string; // Raw ISO String
}

const isMockMode = false;

export class WishlistService {
  private collectionName = "wishlist";

  async addToWishlist(entry: WishlistEntry): Promise<void> {
    if (isMockMode) {
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
      return [];
    }

    try {
      const colRef = collection(db, this.collectionName);
      const querySnapshot = await getDocs(colRef);
      const list: WishlistEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          name: data.name || "",
          email: data.email || "",
          favoriteClass: data.favoriteClass || "Indeciso",
          createdAt: data.createdAt || new Date().toISOString()
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
