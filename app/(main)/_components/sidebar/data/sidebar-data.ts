export const SIDEBAR_DATA = {
  tags: ['#Aespa', '#SM', '#Prada', '#Prada'],
  
  mainImages: [
    { 
      src: '/images/related/karina01.jpg', 
      alt: 'Karina 1',
      title: 'Next Level : Karina',
      subtitle: 'The Face of Future K-POP'
    },
    { 
      src: '/images/related/karina02.jpeg', 
      alt: 'Karina 2',
      title: '봄이 왔나봐',
      subtitle: '카리나와 함께 봄 나들이'
    },
  ],
  
  baseItem: {
    id: 1,
    label: 'BOTTOM',
    brand: 'PRADA',
    name: 'LOW-RISE PANTS',
    imageUrl: '/images/items/item01.jpg',
    links: [
      {
        url: 'https://decoded.style/',
        imageUrl: '/images/brand/prada.png',
        title: 'Prada',
        description: "Prada's signature utilitarian cut meets Y2K cool",
      },
      {
        url: 'https://decoded.style/',
        imageUrl: '/images/related/karina01.jpg',
        title: 'Karina',
        description: "Karina's signature utilitarian cut meets Y2K cool",
      },
    ],
  },
  
  get items() {
    return Array.from({ length: 4 }).map((_, i) => ({
      ...this.baseItem,
      id: i + 1,
    }));
  },
  
  comments: [
    {
      id: 1,
      user: {
        name: 'Kiyori',
        badge: 'K-pop expert',
        avatar: '/images/kiyori.png',
      },
      text: 'Karina effortlessly blends futuristic flair with classic K-pop elegance.',
      thumbsUp: 33,
      thumbsDown: 0,
    },
    {
      id: 2,
      user: {
        name: 'Kiyori',
        badge: 'K-pop expert',
        avatar: '/images/kiyori.png',
      },
      text: 'Karina effortlessly blends futuristic flair with classic K-pop elegance.',
      thumbsUp: 33,
      thumbsDown: 0,
    },
  ],
  
  description: `From futuristic silhouettes to effortless streetwear, Karina continues
to redefine what it means to be a K-pop fashion icon. In this curated
moment, every detail speaks — the cut, the texture, the energy. Zoom
in, take a closer look, and uncover the layers behind her style.
Because with Karina, it's never just an outfit — it's a statement.`,
}; 