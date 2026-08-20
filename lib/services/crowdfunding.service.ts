import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface CrowdfundingMeta {
  currentFunding: number;
  targetFunding: number;
  backerCount: number;
  daysRemaining: number;
}

const isMockMode = false;

const defaultMeta: CrowdfundingMeta = {
  currentFunding: 42850,
  targetFunding: 50000,
  backerCount: 432,
  daysRemaining: 18,
};

export class CrowdfundingService {
  private docRefPath = "admin/crowdfunding";

  // Get current crowdfunding configurations
  async getMeta(): Promise<CrowdfundingMeta> {
    if (isMockMode) {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("crowdfunding-meta");
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (e) {}
        }
        localStorage.setItem("crowdfunding-meta", JSON.stringify(defaultMeta));
      }
      return defaultMeta;
    }

    try {
      const docRef = doc(db, "admin", "crowdfunding");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          currentFunding: Number(data.currentFunding) || defaultMeta.currentFunding,
          targetFunding: Number(data.targetFunding) || defaultMeta.targetFunding,
          backerCount: Number(data.backerCount) || defaultMeta.backerCount,
          daysRemaining: Number(data.daysRemaining) || defaultMeta.daysRemaining,
        };
      } else {
        // Initialize doc in Firestore
        await setDoc(docRef, defaultMeta);
        return defaultMeta;
      }
    } catch (error) {
      console.error("Erro ao carregar metas de crowdfunding: ", error);
      return defaultMeta;
    }
  }

  // Update crowdfunding configurations
  async updateMeta(meta: CrowdfundingMeta): Promise<void> {
    if (isMockMode) {
      if (typeof window !== "undefined") {
        localStorage.setItem("crowdfunding-meta", JSON.stringify(meta));
      }
      return;
    }

    try {
      const docRef = doc(db, "admin", "crowdfunding");
      await setDoc(docRef, {
        currentFunding: meta.currentFunding,
        targetFunding: meta.targetFunding,
        backerCount: meta.backerCount,
        daysRemaining: meta.daysRemaining,
      });
    } catch (error) {
      console.error("Erro ao salvar metas de crowdfunding: ", error);
      throw error;
    }
  }
}
