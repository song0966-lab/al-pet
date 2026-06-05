import type { Artist, Exhibition, ArtworkWithTranslation, Section } from './types';

export const sampleExhibition: Exhibition = {
  id: 'single-exhibition',
  title: '머무는 시선의 기록',
  subtitle: '단일 전시를 위한 디지털 작품 안내',
  venue: '화이트룸 갤러리',
  startsAt: '2026-06-01',
  endsAt: '2026-06-30',
  heroImageUrl:
    'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=82',
  introduction:
    '작품 앞에서 잠시 멈추는 시간을 위해 만든 전시입니다. 관람객은 이미지와 작가의 문장을 따라가며 이번 전시의 흐름을 읽을 수 있습니다.',
  curatorNote:
    '이 전시는 작품과 관람자의 시선이 천천히 만나는 순간을 기록합니다. 각 작품의 표면, 재료, 문장을 따라가며 전시가 남기는 고요한 리듬을 경험해보세요.',
  isPublished: true,
  createdBy: 'curator@example.com',
  updatedBy: 'curator@example.com',
  createdAt: '2026-05-29T00:00:00.000Z',
  updatedAt: '2026-05-29T00:00:00.000Z'
};

export const sampleArtists: Artist[] = [
  {
    id: 'artist-kim',
    name: '김서연',
    bio: '빛과 표면의 변화를 회화로 기록하는 작가입니다.',
    profileImageUrl: '',
    displayOrder: 10
  },
  {
    id: 'artist-lee',
    name: '이도현',
    bio: '기억 속 공간과 색의 밀도를 다루는 작가입니다.',
    profileImageUrl: '',
    displayOrder: 20
  },
  {
    id: 'artist-jung',
    name: '정민서',
    bio: '식물, 표식, 작은 기록을 드로잉으로 옮기는 작가입니다.',
    profileImageUrl: '',
    displayOrder: 30
  }
];

export const sampleSections: Section[] = [
  {
    id: 'section-light',
    title: '빛의 이동',
    description: '시간에 따라 달라지는 빛과 공간의 감각을 다룹니다.',
    displayOrder: 10
  },
  {
    id: 'section-memory',
    title: '기억의 방',
    description: '개인적인 기억과 색의 밀도가 만나는 작품을 모았습니다.',
    displayOrder: 20
  }
];

export const sampleArtworks: ArtworkWithTranslation[] = [
  {
    id: 'artwork-slow-light',
    slug: 'slow-light',
    artistId: 'artist-kim',
    sectionId: 'section-light',
    artistName: '김서연',
    year: 2025,
    medium: '캔버스에 유채',
    dimensions: '90 x 120 cm',
    location: 'A-01',
    imageUrl:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1400&q=82',
    displayOrder: 10,
    isPublished: true,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-05-29T00:00:00.000Z',
    updatedAt: '2026-05-29T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '느린 빛',
      summary: '흰 벽을 따라 이동하는 오후의 색',
      body:
        '작품은 빛이 사라지는 속도를 회화의 리듬으로 옮깁니다. 겹겹이 얹힌 표면은 관람자의 움직임에 따라 부드럽게 다른 밀도를 드러내며, 고요한 공간 속에서도 시간이 흐르고 있음을 보여줍니다.',
      artistNote:
        '빛은 멈춘 것처럼 보이지만 언제나 조금씩 옮겨갑니다. 그 작은 이동을 붙잡고 싶었습니다.'
    }
  },
  {
    id: 'artwork-blue-room',
    slug: 'blue-room-study',
    artistId: 'artist-lee',
    sectionId: 'section-memory',
    artistName: '이도현',
    year: 2024,
    medium: '혼합 매체',
    dimensions: '60 x 80 cm',
    location: 'A-02',
    imageUrl:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=82',
    displayOrder: 20,
    isPublished: true,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-05-29T00:00:00.000Z',
    updatedAt: '2026-05-29T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '푸른 방을 위한 습작',
      summary: '기억 속 방의 온도를 색면으로 압축한 작업',
      body:
        '작가는 방이라는 닫힌 장소를 하나의 색으로 환원합니다. 화면의 푸른 면들은 서로 다른 높이로 쌓이며, 익숙한 공간을 낯선 감각의 장면으로 바꿉니다.',
      artistNote: '파란색은 이곳에서 차가움보다 오래 머문 감정에 가깝습니다.'
    }
  },
  {
    id: 'artwork-garden-index',
    slug: 'garden-index',
    artistId: 'artist-jung',
    sectionId: 'section-light',
    artistName: '정민서',
    year: 2026,
    medium: '종이에 잉크와 안료',
    dimensions: '42 x 59.4 cm',
    location: 'B-01',
    imageUrl:
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1400&q=82',
    displayOrder: 30,
    isPublished: false,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-05-29T00:00:00.000Z',
    updatedAt: '2026-05-29T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '정원의 색인',
      summary: '아직 공개 전인 작품',
      body:
        '식물의 이름, 잎의 방향, 햇빛의 각도를 작은 표식으로 기록한 드로잉 연작입니다.',
      artistNote: '정원은 풍경이기 전에 읽을 수 있는 문장이라고 생각했습니다.'
    }
  }
];
