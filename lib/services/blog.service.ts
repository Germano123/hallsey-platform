import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getStringDate } from "../utils";

export interface Article {
  id?: string;
  title: string;
  category: string;
  date: string;
  author: string;
  excerpt: string;
  content: string[];
  image: string;
  readTime: string;
  status?: "posted" | "draft" | "scheduled";
  views?: number;
}

const isMockMode = false;

export class BlogService {
  private collectionName = "articles";

  async getArticles(): Promise<Article[]> {
    if (isMockMode) {
      return [];
    }

    try {
      const colRef = collection(db, this.collectionName);
      const querySnapshot = await getDocs(colRef);
      const list: Article[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          title: data.title,
          category: data.category,
          date: data.date,
          author: data.author,
          excerpt: data.excerpt,
          content: Array.isArray(data.content) ? data.content : [data.content],
          image: data.image,
          readTime: data.readTime,
          status: data.status || "posted",
          views: Number(data.views) || 0
        });
      });

      return list;
    } catch (error) {
      console.error("Erro ao carregar notícias do Firebase: ", error);
      return [];
    }
  }

  async addArticle(article: Omit<Article, "id" | "date">): Promise<void> {
    const newArticle: Article = {
      ...article,
      id: "art-" + Date.now(),
      date: getStringDate(new Date()),
      status: article.status || "posted",
      views: article.views || 0
    };

    if (isMockMode) {
      return;
    }

    try {
      const colRef = collection(db, this.collectionName);
      await addDoc(colRef, {
        title: newArticle.title,
        category: newArticle.category,
        date: newArticle.date,
        author: newArticle.author,
        excerpt: newArticle.excerpt,
        content: newArticle.content,
        image: newArticle.image,
        readTime: newArticle.readTime,
        status: newArticle.status,
        views: newArticle.views
      });
    } catch (error) {
      console.error("Erro ao salvar artigo no Firebase: ", error);
      throw error;
    }
  }
}
