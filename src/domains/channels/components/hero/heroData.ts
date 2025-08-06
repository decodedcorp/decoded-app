export interface ChannelData {
  id: string;
  name: string;
  description?: string | null;
  owner_id: string;
  thumbnail_url?: string | null;
  subscriber_count?: number;
  content_count?: number;
  created_at?: string;
  updated_at?: string | null;
  is_subscribed?: boolean;
}

export const capsules: ChannelData[] = [
  {
    id: '1',
    name: 'Kazimir Malevich',
    thumbnail_url: 'https://randomuser.me/api/portraits/men/11.jpg',
    description: 'Pioneer of geometric abstraction and suprematism',
    owner_id: 'user1',
    subscriber_count: 12400,
    content_count: 45,
    created_at: '2024-01-15T10:00:00Z',
    is_subscribed: false,
  },
  {
    id: '2',
    name: 'Alexander Bogomazov',
    thumbnail_url: 'https://randomuser.me/api/portraits/men/12.jpg',
    description: 'Ukrainian avant-garde artist and theorist',
    owner_id: 'user2',
    subscriber_count: 8700,
    content_count: 32,
    created_at: '2024-02-20T14:30:00Z',
    is_subscribed: true,
  },
  {
    id: '3',
    name: 'Ilya Chashnik',
    thumbnail_url: 'https://randomuser.me/api/portraits/men/13.jpg',
    description: 'Constructivist artist and graphic designer',
    owner_id: 'user3',
    subscriber_count: 15200,
    content_count: 67,
    created_at: '2024-03-10T09:15:00Z',
    is_subscribed: false,
  },
  {
    id: '4',
    name: 'Moisey Feigin',
    thumbnail_url: 'https://randomuser.me/api/portraits/men/14.jpg',
    description: 'Russian painter and graphic artist',
    owner_id: 'user4',
    subscriber_count: 6900,
    content_count: 28,
    created_at: '2024-01-25T16:45:00Z',
    is_subscribed: false,
  },
  {
    id: '5',
    name: 'Naum Gabo',
    thumbnail_url: 'https://randomuser.me/api/portraits/men/15.jpg',
    description: 'Constructivist sculptor and theorist',
    owner_id: 'user5',
    subscriber_count: 11300,
    content_count: 53,
    created_at: '2024-02-05T11:20:00Z',
    is_subscribed: true,
  },
  {
    id: '6',
    name: 'El Lissitzky',
    thumbnail_url: 'https://randomuser.me/api/portraits/men/16.jpg',
    description: 'Russian artist, designer, and architect',
    owner_id: 'user6',
    subscriber_count: 18600,
    content_count: 89,
    created_at: '2024-03-15T13:10:00Z',
    is_subscribed: false,
  },
  {
    id: '7',
    name: 'Aristarkh Lentulov',
    thumbnail_url: 'https://randomuser.me/api/portraits/men/17.jpg',
    description: 'Russian avant-garde painter and stage designer',
    owner_id: 'user7',
    subscriber_count: 9100,
    content_count: 41,
    created_at: '2024-01-30T08:30:00Z',
    is_subscribed: false,
  },
  {
    id: '8',
    name: 'Ivan Puni',
    thumbnail_url: 'https://randomuser.me/api/portraits/men/18.jpg',
    description: 'Russian avant-garde artist and designer',
    owner_id: 'user8',
    subscriber_count: 7800,
    content_count: 35,
    created_at: '2024-02-12T15:45:00Z',
    is_subscribed: false,
  },
  {
    id: '9',
    name: 'Varvara Stepanova',
    thumbnail_url: 'https://randomuser.me/api/portraits/women/19.jpg',
    description: 'Russian constructivist artist and designer',
    owner_id: 'user9',
    subscriber_count: 13500,
    content_count: 62,
    created_at: '2024-03-01T12:00:00Z',
    is_subscribed: true,
  },
  {
    id: '10',
    name: 'Nadezhda Udaltsova',
    thumbnail_url: 'https://randomuser.me/api/portraits/women/20.jpg',
    description: 'Russian avant-garde painter and graphic artist',
    owner_id: 'user10',
    subscriber_count: 10200,
    content_count: 48,
    created_at: '2024-02-18T10:15:00Z',
    is_subscribed: false,
  },
  {
    id: '11',
    name: 'Adolf Milman',
    thumbnail_url: 'https://randomuser.me/api/portraits/men/21.jpg',
    description: 'Russian painter and graphic artist',
    owner_id: 'user11',
    subscriber_count: 5400,
    content_count: 23,
    created_at: '2024-01-08T14:20:00Z',
    is_subscribed: false,
  },
  {
    id: '12',
    name: 'Paul Mansouroff',
    thumbnail_url: 'https://randomuser.me/api/portraits/men/22.jpg',
    description: 'Russian painter and graphic designer',
    owner_id: 'user12',
    subscriber_count: 14700,
    content_count: 71,
    created_at: '2024-03-08T16:30:00Z',
    is_subscribed: false,
  },
];

// Hydration 에러 방지: row별로 capsules 배열을 그대로 복제해서 사용
export const HERO_ROWS = 4;
export const CAPSULES_PER_ROW = capsules.length * 2;
export const HERO_CAPSULE_ROWS = Array.from({ length: HERO_ROWS }).map(() =>
  capsules.concat(capsules).slice(0, CAPSULES_PER_ROW),
);
