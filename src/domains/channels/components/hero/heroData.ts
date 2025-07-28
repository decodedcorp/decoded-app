export interface ChannelData {
  name: string;
  img?: string;
  description: string;
  category: string;
  followers: string;
}

export const capsules: ChannelData[] = [
  {
    name: 'Kazimir Malevich',
    img: 'https://randomuser.me/api/portraits/men/11.jpg',
    description: 'Pioneer of geometric abstraction and suprematism',
    category: 'Art & Design',
    followers: '12.4K',
  },
  {
    name: 'Alexander Bogomazov',
    img: 'https://randomuser.me/api/portraits/men/12.jpg',
    description: 'Ukrainian avant-garde artist and theorist',
    category: 'Modern Art',
    followers: '8.7K',
  },
  {
    name: 'Ilya Chashnik',
    img: 'https://randomuser.me/api/portraits/men/13.jpg',
    description: 'Constructivist artist and graphic designer',
    category: 'Design',
    followers: '15.2K',
  },
  {
    name: 'Moisey Feigin',
    img: 'https://randomuser.me/api/portraits/men/14.jpg',
    description: 'Russian painter and graphic artist',
    category: 'Fine Arts',
    followers: '6.9K',
  },
  {
    name: 'Naum Gabo',
    img: 'https://randomuser.me/api/portraits/men/15.jpg',
    description: 'Constructivist sculptor and theorist',
    category: 'Sculpture',
    followers: '11.3K',
  },
  {
    name: 'El Lissitzky',
    img: 'https://randomuser.me/api/portraits/men/16.jpg',
    description: 'Russian artist, designer, and architect',
    category: 'Architecture',
    followers: '18.6K',
  },
  {
    name: 'Aristarkh Lentulov',
    img: 'https://randomuser.me/api/portraits/men/17.jpg',
    description: 'Russian avant-garde painter and stage designer',
    category: 'Theater Arts',
    followers: '9.1K',
  },
  {
    name: 'Ivan Puni',
    img: 'https://randomuser.me/api/portraits/men/18.jpg',
    description: 'Russian avant-garde artist and designer',
    category: 'Modern Art',
    followers: '7.8K',
  },
  {
    name: 'Varvara Stepanova',
    img: 'https://randomuser.me/api/portraits/women/19.jpg',
    description: 'Russian constructivist artist and designer',
    category: 'Fashion Design',
    followers: '13.5K',
  },
  {
    name: 'Nadezhda Udaltsova',
    img: 'https://randomuser.me/api/portraits/women/20.jpg',
    description: 'Russian avant-garde painter and graphic artist',
    category: 'Fine Arts',
    followers: '10.2K',
  },
  {
    name: 'Adolf Milman',
    img: 'https://randomuser.me/api/portraits/men/21.jpg',
    description: 'Russian painter and graphic artist',
    category: 'Illustration',
    followers: '5.4K',
  },
  {
    name: 'Paul Mansouroff',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    description: 'Russian painter and graphic designer',
    category: 'Graphic Design',
    followers: '14.7K',
  },
];

// Hydration 에러 방지: row별로 capsules 배열을 그대로 복제해서 사용
export const HERO_ROWS = 4;
export const CAPSULES_PER_ROW = capsules.length * 2;
export const HERO_CAPSULE_ROWS = Array.from({ length: HERO_ROWS }).map(() =>
  capsules.concat(capsules).slice(0, CAPSULES_PER_ROW),
);
