import { db } from "../firebase";
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  query, 
  where,
  deleteDoc
} from "firebase/firestore";

export interface Campaign {
  id: string;
  name: string;
  desc: string;
  mestre: string; // mestre email
  jogadores: string[]; // players emails
  convites: string[]; // invited emails
}

export interface Invitation {
  id: string;
  campaignId: string;
  campaignName: string;
  mestreEmail: string;
  playerEmail: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

const isMockMode =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "AIzaSyDummyKeyForBuildPurposesOnly" ||
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export class CampaignService {
  private campaignsCol = "campaigns";
  private invitesCol = "invitations";

  // Helpers for local storage fallback
  private getLocalCampaigns(): Campaign[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("portal-campaigns");
    return stored ? JSON.parse(stored) : [];
  }

  private setLocalCampaigns(camps: Campaign[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem("portal-campaigns", JSON.stringify(camps));
  }

  private getLocalInvitations(): Invitation[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("portal-invitations");
    return stored ? JSON.parse(stored) : [];
  }

  private setLocalInvitations(invites: Invitation[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem("portal-invitations", JSON.stringify(invites));
  }

  // Fetch campaigns for the user (associated as GM or Player)
  async getCampaigns(userEmail: string): Promise<Campaign[]> {
    if (isMockMode) {
      const local = this.getLocalCampaigns();
      return local.filter(
        (c) => c.mestre === userEmail || c.jogadores.includes(userEmail)
      );
    }

    try {
      const colRef = collection(db, this.campaignsCol);
      const querySnapshot = await getDocs(colRef);
      const list: Campaign[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          name: data.name || "",
          desc: data.desc || "",
          mestre: data.mestre || "",
          jogadores: Array.isArray(data.jogadores) ? data.jogadores : [],
          convites: Array.isArray(data.convites) ? data.convites : [],
        });
      });

      // Filter by association on client side to avoid creating compound index on Firestore
      return list.filter(
        (c) => c.mestre === userEmail || c.jogadores.includes(userEmail)
      );
    } catch (error) {
      console.error("Erro ao carregar campanhas: ", error);
      return [];
    }
  }

  // Get campaign details by ID
  async getCampaignById(id: string): Promise<Campaign | null> {
    if (isMockMode) {
      const local = this.getLocalCampaigns();
      return local.find((c) => c.id === id) || null;
    }

    try {
      const docRef = doc(db, this.campaignsCol, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || "",
          desc: data.desc || "",
          mestre: data.mestre || "",
          jogadores: Array.isArray(data.jogadores) ? data.jogadores : [],
          convites: Array.isArray(data.convites) ? data.convites : [],
        };
      }
      return null;
    } catch (error) {
      console.error("Erro ao obter campanha por ID: ", error);
      return null;
    }
  }

  // Create Campaign
  async createCampaign(name: string, desc: string, mestreEmail: string): Promise<Campaign> {
    const newCamp: Campaign = {
      id: "camp-" + Date.now(),
      name,
      desc,
      mestre: mestreEmail,
      jogadores: [],
      convites: [],
    };

    if (isMockMode) {
      const local = this.getLocalCampaigns();
      local.push(newCamp);
      this.setLocalCampaigns(local);
      return newCamp;
    }

    try {
      const colRef = collection(db, this.campaignsCol);
      const docRef = await addDoc(colRef, {
        name: newCamp.name,
        desc: newCamp.desc,
        mestre: newCamp.mestre,
        jogadores: newCamp.jogadores,
        convites: newCamp.convites,
      });
      return { ...newCamp, id: docRef.id };
    } catch (error) {
      console.error("Erro ao criar campanha: ", error);
      throw error;
    }
  }

  // Invite player to a campaign
  async invitePlayer(
    campaignId: string,
    playerEmail: string,
    mestreEmail: string,
    campaignName: string
  ): Promise<void> {
    // 1. Create invitation record
    const newInvite: Invitation = {
      id: "inv-" + Date.now(),
      campaignId,
      campaignName,
      mestreEmail,
      playerEmail,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (isMockMode) {
      // Update invitation
      const invites = this.getLocalInvitations();
      invites.push(newInvite);
      this.setLocalInvitations(invites);

      // Update campaign convites list
      const camps = this.getLocalCampaigns();
      const updated = camps.map((c) => {
        if (c.id === campaignId) {
          if (!c.convites.includes(playerEmail)) {
            return { ...c, convites: [...c.convites, playerEmail] };
          }
        }
        return c;
      });
      this.setLocalCampaigns(updated);
      return;
    }

    try {
      // Create invitation in Firestore
      const invitesColRef = collection(db, this.invitesCol);
      await addDoc(invitesColRef, {
        campaignId: newInvite.campaignId,
        campaignName: newInvite.campaignName,
        mestreEmail: newInvite.mestreEmail,
        playerEmail: newInvite.playerEmail,
        status: newInvite.status,
        createdAt: newInvite.createdAt,
      });

      // Add to campaign pending invites list
      const campRef = doc(db, this.campaignsCol, campaignId);
      const campSnap = await getDoc(campRef);
      if (campSnap.exists()) {
        const data = campSnap.data();
        const currentConvites = Array.isArray(data.convites) ? data.convites : [];
        if (!currentConvites.includes(playerEmail)) {
          await updateDoc(campRef, {
            convites: [...currentConvites, playerEmail],
          });
        }
      }
    } catch (error) {
      console.error("Erro ao enviar convite: ", error);
      throw error;
    }
  }

  // Remove player from campaign
  async removePlayer(campaignId: string, playerEmail: string): Promise<void> {
    if (isMockMode) {
      const camps = this.getLocalCampaigns();
      const updated = camps.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            jogadores: c.jogadores.filter((j) => j !== playerEmail),
          };
        }
        return c;
      });
      this.setLocalCampaigns(updated);
      return;
    }

    try {
      const campRef = doc(db, this.campaignsCol, campaignId);
      const campSnap = await getDoc(campRef);
      if (campSnap.exists()) {
        const data = campSnap.data();
        const currentJogadores = Array.isArray(data.jogadores) ? data.jogadores : [];
        await updateDoc(campRef, {
          jogadores: currentJogadores.filter((j) => j !== playerEmail),
        });
      }
    } catch (error) {
      console.error("Erro ao remover jogador: ", error);
      throw error;
    }
  }

  // Get pending invitations for a user
  async getPendingInvitations(userEmail: string): Promise<Invitation[]> {
    if (isMockMode) {
      const invites = this.getLocalInvitations();
      return invites.filter((i) => i.playerEmail === userEmail && i.status === "pending");
    }

    try {
      const invitesColRef = collection(db, this.invitesCol);
      const querySnapshot = await getDocs(invitesColRef);
      const list: Invitation[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          campaignId: data.campaignId || "",
          campaignName: data.campaignName || "",
          mestreEmail: data.mestreEmail || "",
          playerEmail: data.playerEmail || "",
          status: data.status || "pending",
          createdAt: data.createdAt || "",
        });
      });
      return list.filter((i) => i.playerEmail === userEmail && i.status === "pending");
    } catch (error) {
      console.error("Erro ao obter convites pendentes: ", error);
      return [];
    }
  }

  // Accept Invitation
  async acceptInvitation(invitationId: string, campaignId: string, playerEmail: string): Promise<void> {
    if (isMockMode) {
      // 1. Update invitation status
      const invites = this.getLocalInvitations();
      const updatedInvites = invites.map((i) => 
        i.id === invitationId ? { ...i, status: "accepted" as const } : i
      );
      this.setLocalInvitations(updatedInvites);

      // 2. Add player to campaign, remove from convites
      const camps = this.getLocalCampaigns();
      const updatedCamps = camps.map((c) => {
        if (c.id === campaignId) {
          const players = [...c.jogadores];
          if (!players.includes(playerEmail)) {
            players.push(playerEmail);
          }
          return {
            ...c,
            jogadores: players,
            convites: c.convites.filter((cv) => cv !== playerEmail),
          };
        }
        return c;
      });
      this.setLocalCampaigns(updatedCamps);
      return;
    }

    try {
      // 1. Update invitation status in Firestore (or delete it)
      const inviteRef = doc(db, this.invitesCol, invitationId);
      await updateDoc(inviteRef, { status: "accepted" });

      // 2. Update campaign players list in Firestore
      const campRef = doc(db, this.campaignsCol, campaignId);
      const campSnap = await getDoc(campRef);
      if (campSnap.exists()) {
        const data = campSnap.data();
        const currentJogadores = Array.isArray(data.jogadores) ? data.jogadores : [];
        const currentConvites = Array.isArray(data.convites) ? data.convites : [];
        
        if (!currentJogadores.includes(playerEmail)) {
          currentJogadores.push(playerEmail);
        }

        await updateDoc(campRef, {
          jogadores: currentJogadores,
          convites: currentConvites.filter((c) => c !== playerEmail),
        });
      }
    } catch (error) {
      console.error("Erro ao aceitar convite: ", error);
      throw error;
    }
  }

  // Decline Invitation
  async declineInvitation(invitationId: string, campaignId: string, playerEmail: string): Promise<void> {
    if (isMockMode) {
      // 1. Update invitation status
      const invites = this.getLocalInvitations();
      const updatedInvites = invites.map((i) => 
        i.id === invitationId ? { ...i, status: "declined" as const } : i
      );
      this.setLocalInvitations(updatedInvites);

      // 2. Remove player email from campaign convites
      const camps = this.getLocalCampaigns();
      const updatedCamps = camps.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            convites: c.convites.filter((cv) => cv !== playerEmail),
          };
        }
        return c;
      });
      this.setLocalCampaigns(updatedCamps);
      return;
    }

    try {
      // 1. Update invitation status in Firestore
      const inviteRef = doc(db, this.invitesCol, invitationId);
      await updateDoc(inviteRef, { status: "declined" });

      // 2. Remove player from campaign pending invites list
      const campRef = doc(db, this.campaignsCol, campaignId);
      const campSnap = await getDoc(campRef);
      if (campSnap.exists()) {
        const data = campSnap.data();
        const currentConvites = Array.isArray(data.convites) ? data.convites : [];
        await updateDoc(campRef, {
          convites: currentConvites.filter((c) => c !== playerEmail),
        });
      }
    } catch (error) {
      console.error("Erro ao recusar convite: ", error);
      throw error;
    }
  }
}
