// MasonryGrid에서 사용하는 상수 분리

export const pastelColors = [
  'border-pink-200',
  'border-blue-200',
  'border-green-200',
  'border-yellow-200',
  'border-purple-200',
  'border-orange-200',
];

export const cardVariants = [
  'rounded-xl shadow-xl border border-zinc-800 bg-zinc-900 p-2',
  'rounded-2xl shadow-lg border border-zinc-700 bg-zinc-900 p-2',
  'rounded-lg shadow-md border border-zinc-900 bg-zinc-900 p-1',
  'rounded-xl shadow border border-zinc-700 bg-zinc-900 p-2',
  'rounded-2xl shadow-xl border border-zinc-900 bg-zinc-900 p-2',
];

export const ctaVariants = [
  {
    title: 'Recommended Artists',
    desc: 'Discover new styles and creators.',
    button: 'View Recommendations',
    iconType: 'recommend',
  },
  {
    title: 'Trending Now',
    desc: 'Check out the most popular items.',
    button: 'See Trending',
    iconType: 'trending',
  },
  {
    title: 'New Collection Open',
    desc: 'Explore the latest collections now.',
    button: 'View Collection',
    iconType: 'collection',
  },
  {
    title: 'Add New Channel',
    desc: 'Create your own channel and share your content.',
    button: 'Add Channel',
    iconType: 'add-channel',
  },
];

// ChannelHero에서 사용할 heroData (2차원 배열)
export const heroData = [
  [
    { name: 'Kazimir Malevich', avatarUrl: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { name: 'Alexander Bogomazov', avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { name: 'Ilya Chashnik', avatarUrl: 'https://randomuser.me/api/portraits/men/13.jpg' },
    { name: 'Moisey Feigin', avatarUrl: 'https://randomuser.me/api/portraits/men/14.jpg' },
    { name: 'Naum Gabo', avatarUrl: 'https://randomuser.me/api/portraits/men/15.jpg' },
  ],
  [
    { name: 'El Lissitzky', avatarUrl: 'https://randomuser.me/api/portraits/men/16.jpg' },
    { name: 'Aristarkh Lentulov', avatarUrl: 'https://randomuser.me/api/portraits/men/17.jpg' },
    { name: 'Ivan Puni', avatarUrl: 'https://randomuser.me/api/portraits/men/18.jpg' },
    { name: 'Varvara Stepanova', avatarUrl: 'https://randomuser.me/api/portraits/women/19.jpg' },
    { name: 'Nadezhda Udaltsova', avatarUrl: 'https://randomuser.me/api/portraits/women/20.jpg' },
  ],
  [
    { name: 'Adolf Milman', avatarUrl: 'https://randomuser.me/api/portraits/men/21.jpg' },
    { name: 'Paul Mansouroff', avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { name: 'Lyubov Popova', avatarUrl: 'https://randomuser.me/api/portraits/women/23.jpg' },
    { name: 'Olga Rozanova', avatarUrl: 'https://randomuser.me/api/portraits/women/24.jpg' },
    { name: 'Ivan Kliun', avatarUrl: 'https://randomuser.me/api/portraits/men/25.jpg' },
  ],
  [
    { name: 'Nina Genke', avatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg' },
    { name: 'Vera Pestel', avatarUrl: 'https://randomuser.me/api/portraits/women/27.jpg' },
    { name: 'Ksenia Boguslavskaya', avatarUrl: 'https://randomuser.me/api/portraits/women/28.jpg' },
    { name: 'Vladimir Tatlin', avatarUrl: 'https://randomuser.me/api/portraits/men/29.jpg' },
    { name: 'Mikhail Matyushin', avatarUrl: 'https://randomuser.me/api/portraits/men/30.jpg' },
  ],
];
