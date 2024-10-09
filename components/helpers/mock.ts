import { Position, SpotlightInfo, PickInfo, TrendingNowInfo, DiscoverInfo } from "@/types/model";

export const InstaMockUrls = [
  "https://www.instagram.com/p/C63AnxsvJ3P",
  "https://www.instagram.com/p/C8JY14bvA5v",
  "https://www.instagram.com/p/C8a3tQwPnyE/",
];

export const YoutubeMockUrls = [
  "https://www.youtube.com/watch?v=vz6dKkEiJzg&t=42s&pp=ygUFcHJhZGE%3D",
  "https://www.youtube.com/watch?v=krfcr9DtB4M&pp=ygURbG91cyB2dWl0dG9uIG1lbnM%3D",
  "https://www.youtube.com/watch?v=4kD2CrWB_6k&pp=ygUKZ3VjY2kgMjVzcw%3D%3D",
];

export const mockPicks: PickInfo[] = [
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2F00e24a660cded53b3f39193853b26f6ac78c8b7934b9b7153b4833b9cd76eb55?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
    title: "로제, Shevoke 선글라스와 The Row 의상으로 완벽한 스타일링",
    description:
      "블랙핑크의 로제가 Shevoke 선글라스와 The Row의 상의, 팬츠, 벨트를 매치한 세련된 룩을 선보였다. 그녀는 또한 Pharrel Williams가 디자인한 Tiffany & Co.의 반지와 귀걸이로 포인트를 주었다. 로제의 스타일링은 심플하면서도 고급스러운 분위기를 자아내며 많은 팬들의 주목을 받았다. 이번 룩은 로제의 패션 감각을 다시 한번 입증하는 계기가 되었다.",
    artist: "로제",
    items: [
      {
        pos: { left: "19.50%", top: "40.69%"},
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2Fe99a05ba5a9666606c542d251114d3b2f6b1ca7b172c3e63e7c48ad17f08a747?alt=media&token=899baf0b-7065-48f3-b5fd-ba5df74c05b6",
        name: "Silon Tortoise",
        affilateUrl: "https://shevoke.com/en-kr/products/silon-tortoise",
        brand: {
          logoUrl:
            "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/logos%2Fshevoke_logo?alt=media&token=29e4ad44-b9b0-4e0b-b835-4fb0bddf0ae0",
          name: "shevoke",
        },
      },
      {
        pos: { left: "41.75%", top: "53.44%"},
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2Ffive-row_ring_in_gold_with_diamonds?alt=media&token=da63dd70-2ca8-49f5-8375-bf0259e2f8c2",
        name: "Titan Ring in Gold with Diamonds",
        affilateUrl: "https://www.tiffany.com/jewelry/rings/tiffany-titan-by-pharrell-williams-five-row-ring-GRP12633/",
        brand: {
          logoUrl:
            "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/logos%2Ftiffany_%26_co_logo?alt=media&token=368f2c5c-24c8-4ad9-8eb5-c32c30f94d89",
          name: "tiffany_&_co",
        },
      }
    ],
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fjennie_mihara_yasuhiro_gentle_monster_coperni_ys?alt=media&token=adc7b948-3758-44a9-9c6f-516ad4cb10c0",
    title: "블랙핑크 제니, 독특한 스트리트 패션으로 시선 강탈",
    description:
      "제니가 독특한 스트리트 패션으로 다시 한번 패션 아이콘임을 입증했습니다. 그녀는 요지 야마모토의 'unfinished effect high neck jumper'와 코페르니의 와이드 카고 팬츠를 매치하여 트렌디하면서도 개성 넘치는 룩을 완성했습니다. 또한, 미하라 야스히로의 로우 스니커즈를 신어 캐주얼함을 더하며, 그녀만의 스타일을 강조했습니다.",
    artist: "제니",
    items: [
      {
        pos: { left: "47.25%", top: "98.75%"},
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2Fpeterson_og_sole_canvas_low?alt=media&token=1ef9f559-b8b1-4fb0-b05b-a5dd812b6368",
        name: "Peterson OG Sole Canvas Low",
        affilateUrl: "https://stockx.com/mihara-yasuhiro-peterson-og-sole-canvas-low-black",
        brand: {
          logoUrl:
            "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/logos%2Fmihara_yasuhiro_logo?alt=media&token=4c686e40-01d1-4221-9280-7000cb63bc45",
          name: "mihara_yasuhiro",
        },
      },
      {
        pos: { left: "49.50%", top: "71.44%"},
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2Fdenim_cargo_pants?alt=media&token=f63c5e85-41ac-48e8-a27c-8ef18c904035",
        name: "Denim Cargo Pants",
        affilateUrl: "https://www.mytheresa.com/kr/en/women/coperni-wide-leg-denim-cargo-pants-blue-p00862439",
        brand: {
          logoUrl:
            "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/logos%2Fcoperni_logo?alt=media&token=bc8de667-856a-43ba-8f4e-32d10f513f2a",
          name: "coperni",
        },
      },
    ],
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fff365767e619b4adc1a672287abc5dddb03b3f4d21ad0f47fbb52ed7001f7e33?alt=media&token=af2beccb-87dc-4b2f-93ef-ef4d0074c443",
    title: "도쿄돔 공연 속 하니 룩",
    description:
      "하니는 도쿄돔 공연에서 여름 느낌이 물씬 나는 Saint James 브랜드의 네이비 색상 Naval II 3/4 Sleeve T-Shirt를 입고 등장해 눈길을 끌었다.",
    artist: "하니",
    items: [
      {
        pos: { left: "39.46%", top: "32.35%"},
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2F959caabc49dcfd7d632c28766c7c948991b404ca9e6fc98faa7b7bbf5e5a2632?alt=media&token=3219dcf7-4534-4a7b-9837-00d996761e0f",
        name: "Naval II (090)",
        affilateUrl: "https://www.saint-james.co.kr/goods/detail.asp?gno=53338",
        brand: {
          logoUrl:
            "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/logos%2Fsaint_james_logo?alt=media&token=931150d0-fbfc-48ab-a70e-bdb5f4b717a2",
          name: "saint_james",
        },
      },
    ],
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fad32534e7ef6efe6ec3866fe611e8720afebd3a5fe2d33c7c6607c27345ebe66?alt=media&token=03ece03b-acc1-45d1-9472-e0d98fbdb8e3",
    title: "How Sweet 뮤비 속 민지",
    description:
      "뉴진스의 멤버 민지가 How Sweet 뮤직비디오 촬영 현장에서 독특한 스트릿 패션을 선보였습니다. 그녀는 The Great Alfred의 모자와 HERITAGEFLOSS의 상의를 착용하여 세련된 스타일을 완성했습니다.",
    artist: "민지",
    items: [
      {
        pos: { left: "44.65%", top: "33.80%"},
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2F66fd22bddca51d507823a5ca71cf8fdc6798132df80c80189a778f0be87e674e?alt=media&token=1c33e9f2-4637-4ed7-a4bb-7295af5e1ae0",
        name: "Codura Check Hooded Jacket",
        affilateUrl: "https://www.buyma.com/item/107006406/",
        brand: {
          logoUrl:
            "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/logos%2FHERITAGEFLOSS_logo?alt=media&token=fa3b5f01-12f9-4d55-8495-514e81c53c58",
          name: "HERITAGEFLOSS",
        },
      },
      {
        pos: { left: "62.68%", top: "14.15%"},
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2Fb7058a9852e9f201d4663efa4a76c0e8803b589561b80de755e0adb67b681417?alt=media&token=96e62837-fc36-4e8f-b261-766d0e178803",
        name: "POWER PRODUCTS CAP / WHITE-BLUE",
        affilateUrl: "https://thegreatalfred.com/product/detail.html?product_no=66&cate_no=48&display_group=1",
        brand: {
          logoUrl:
            "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/logos%2Fthe%20great%20alfred_logo?alt=media&token=015c4042-28bb-4d5c-af09-b77ac76f4ba5",
          name: "the great alfred",
        },
      }
    ],
  }
]

export const mockSpotlight: SpotlightInfo = {
  images: [
    {
      id: "14c7bec5466a25f5add82b7a5115a15b8537470766de8db71bad6ea40386b57e",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fjennie_mihara_yasuhiro_gentle_monster_coperni_ys?alt=media&token=adc7b948-3758-44a9-9c6f-516ad4cb10c0",
    },
    {
      id: "8b572e838b8593fcbfad460aec44ce51c8a40e932ee402f68740e4a9e8335957",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fjennie_airport_ck_gentle_monster_maison_marais_chanel?alt=media&token=380eb6fe-6c28-41a8-a6a2-e2c72aad33cb",
    },
    {
      id: "fec109ec3cd354a9f28f9898df8e03563528850f71c0394b3dda6f8dc015a702",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fjennie_chanel_jacquemus?alt=media&token=5e0a2683-3683-4761-924c-47bcd404eef9",
    },
  ],
  title: "제니 x 젠틀몬스터 스타일",
  description: "제니가 젠틀몬스터의 오리지널 패션을 선보였습니다. 젠틀몬스터의 패션은 심플하면서도 고급스러운 분위기를 자아내며 많은 팬들의 주목을 받았다.",
  artist: "제니",
  profileImgUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/artists%2Fjennie.jpeg?alt=media&token=2599768b-38b9-4c26-b04f-604b0a4166a5",
};

export const mockTrendingNow: TrendingNowInfo[] = [
  {
    name: "streetwear",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fstreetwear.jpg?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
  },
  {
    name: "sneakers",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fsneakers.jpg?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
  },
  {
    name: "newjeans",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Ffashion.jpg?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
  },
  {
    name: "blackpink",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fstyle.jpg?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
  },
  {
    name: "kpop",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fkpop.jpg?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
  },
  {
    name: "prada",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fkpop.jpg?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
  },
  {
    name: "gucci",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fkpop.jpg?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
  },
  {
    name: "lisa",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fkpop.jpg?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
  },
  {
    name: "jennie",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fkpop.jpg?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
  },
  {
    name: "jisoo",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fkpop.jpg?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
  },
  {
    name: "rose",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/images%2Fkpop.jpg?alt=media&token=5df9a578-921a-4783-9f9d-1bf022f18d8a",
  }
];

export const mockDiscover: DiscoverInfo[] = [
  {
    section: "#블랙핑크 아이템",
    items: [
      {
        name: "Silon Tortoise",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2Fe99a05ba5a9666606c542d251114d3b2f6b1ca7b172c3e63e7c48ad17f08a747?alt=media&token=899baf0b-7065-48f3-b5fd-ba5df74c05b6",
        brand: "shevoke",
      },
      {
        name: "Titan Ring in Gold with Diamonds",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2Ffive-row_ring_in_gold_with_diamonds?alt=media&token=da63dd70-2ca8-49f5-8375-bf0259e2f8c2",
        brand: "tiffany_&_co",
      },
      {
        name: "Peterson OG Sole Canvas Low",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2Fpeterson_og_sole_canvas_low?alt=media&token=1ef9f559-b8b1-4fb0-b05b-a5dd812b6368",
        brand: "mihara_yasuhiro",
      },
      {
        name: "Denim Cargo Pants",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2Fdenim_cargo_pants?alt=media&token=f63c5e85-41ac-48e8-a27c-8ef18c904035",
        brand: "coperni",
      },
    ]
  },
  {
    section: "#뉴진스 아이템",
    items: [
      {
        name: "Codura Check Hooded Jacket",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/tagged-d87d8.appspot.com/o/items%2F66fd22bddca51d507823a5ca71cf8fdc6798132df80c80189a778f0be87e674e?alt=media&token=1c33e9f2-4637-4ed7-a4bb-7295af5e1ae0",
        brand: "HERITAGEFLOSS",
      },
    ]
  }
]