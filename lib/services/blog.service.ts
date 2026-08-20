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

const defaultArticles: Article[] = [
  {
    id: "1",
    title: "O Segredo dos Cartões NFC: Como funcionam na mesa?",
    category: "Desenvolvimento",
    date: "12 de Agosto, 2026",
    author: "Mestre Germano",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop",
    excerpt: "Entenda a tecnologia por trás dos cartões físicos de madeira e metal e como eles se integram ao VTT e fichas virtuais em tempo real.",
    content: [
      "A grande novidade da Biblioteca da 5ª Avenida é a fusão do tátil com o digital. Mas como isso funciona de forma prática para os jogadores?",
      "Cada apoiador receberá cartões físicos colecionáveis impressos em madeira ecológica ou metal escovado. Dentro de cada um, há um micro-chip NFC passivo ultratermo (não precisa carregar bateria). Ao encostar o cartão na parte traseira do seu celular (onde fica a câmera NFC) ou num leitor USB no computador, o portal do jogador identifica a chave criptográfica única do cartão.",
      "Em menos de 1 segundo, o portal invoca o feitiço ou equipa o item diretamente na sua ficha. Se você encostar o cartão 'Grimório do Aprendiz', seu personagem ganha os feitiços listados e os bônus de Sabedoria instantaneamente, sem precisar preencher dados manuais. É rápido, físico e adiciona uma sensação tátil indescritível à mesa!",
      "Além disso, no VTT (Mesa Virtual) integrado, o Mestre da Mesa visualiza o holograma ou miniatura do item conjurado na tela de todos os participantes. Seus amigos saberão exatamente qual item lendário você acabou de invocar!"
    ],
    status: "posted",
    views: 245
  },
  {
    id: "2",
    title: "Revelação de Classe: O Encadernador de Almas",
    category: "Mecânicas",
    date: "08 de Agosto, 2026",
    author: "Guardiã Aurora",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop",
    excerpt: "Apresentamos a classe focada na criação de proteções de páginas maciças e controle do campo de batalha com barreiras literárias.",
    content: [
      "Os Encadernadores de Almas são os ferreiros da Biblioteca. Em vez de ferro e fogo, eles manipulam pergaminhos, couros e fios místicos para estruturar armas e barreiras protetoras.",
      "No jogo, essa classe atua como a linha de frente do grupo. Suas habilidades giram em torno de 'fechar' tomos no meio de combate para selar inimigos ou 'abrir' proteções grossas de pergaminho maciço. Eles podem costurar feitiços em roupas e conceder escudos mágicos aos seus aliados.",
      "A principal mecânica exclusiva é o 'Tomo de Proteção': um livro físico que o jogador carrega e pode converter em escudo pesado de energia se o livro estiver aberto. Seus cartões NFC específicos liberam tipos de costura diferentes: costura de ferro, de linho élfico e de ouro rúnico.",
      "Se você gosta de defender seus aliados com táticas defensivas imersivas e ama a arte da encadernação clássica, essa classe é perfeita para você!"
    ],
    status: "posted",
    views: 189
  },
  {
    id: "3",
    title: "Financiamento Coletivo: Primeira Meta Batida com Sucesso!",
    category: "Comunidade",
    date: "01 de Agosto, 2026",
    author: "Ordem dos Guardiões",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop",
    excerpt: "Graças ao apoio de mais de 400 guardiões, batemos a meta inicial de financiamento! Veja as metas estendidas e os novos brindes.",
    content: [
      "É com imensa alegria e gratidão que anunciamos que batemos a meta base de R$ 40.000 iniciando as campanhas!",
      "Graças a esse suporte incrível, a tiragem básica do Livro de Regras Físico Capa Dura está 100% garantida! Agora, estamos mirando as metas estendidas para enriquecer ainda mais a entrega do projeto.",
      "A próxima meta é a de R$ 50.000, que adicionará um marcador de páginas de metal exclusivo em forma de chave da biblioteca para todos os apoiadores físicos, além do aplicativo oficial de celular ganhar suporte a sons ambientais dinâmicos conforme o capítulo jogado.",
      "Se você ainda não compartilhou a campanha, chame seu grupo! O sucesso desse RPG depende de nossa união nas estantes!"
    ],
    status: "posted",
    views: 312
  },
  {
    id: "4",
    title: "Mecânicas de Combate em Bibliotecas Sombrias",
    category: "Mecânicas",
    date: "20 de Agosto, 2026",
    author: "Mestre Germano",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop",
    excerpt: "Ideias preliminares para regras de fuga e confinamento ao lutar contra Bibliófagos de grande porte.",
    content: [
      "Lutar dentro de setores restritos exige atenção redobrada com as estantes móveis...",
      "Ao conjurar em corredores apertados, a propagação sonora mística pode ativar sensores rúnicos hostis. Lembrem-se de usar magias de silêncio!"
    ],
    status: "draft",
    views: 0
  },
  {
    id: "5",
    title: "Entrevista com o Ilustrador Visual dos Textos-Mundo",
    category: "Comunidade",
    date: "25 de Agosto, 2026",
    author: "Ordem dos Guardiões",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop",
    excerpt: "Bate-papo exclusivo sobre a concepção visual dos Textos-Mundo e a criação das larvas sombrias.",
    content: [
      "A criação artística partiu da premissa de que cada folha rasgada cria um vazio gravitacional no cenário...",
      "Revelaremos a arte completa do livro de regras no dia oficial do kick-off no Catarse."
    ],
    status: "scheduled",
    views: 0
  }
];

export class BlogService {
  private collectionName = "articles";

  async getArticles(): Promise<Article[]> {
    if (isMockMode) {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("blog-articles");
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (e) {}
        }
        localStorage.setItem("blog-articles", JSON.stringify(defaultArticles));
      }
      return defaultArticles;
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

      if (list.length === 0) {
        return defaultArticles;
      }
      return list;
    } catch (error) {
      console.error("Erro ao carregar notícias do Firebase: ", error);
      return defaultArticles;
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
      const articles = await this.getArticles();
      const newList = [newArticle, ...articles];
      localStorage.setItem("blog-articles", JSON.stringify(newList));
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
