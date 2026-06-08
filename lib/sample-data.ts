import type { Artist, Exhibition, ArtworkWithTranslation, Section } from './types';

export const sampleExhibition: Exhibition = {
  id: 'single-exhibition',
  title: '머무는 시선의 기록',
  subtitle: '단일 전시를 위한 디지털 작품 안내',
  venue: '화이트룸 갤러리',
  startsAt: '2026-06-01',
  endsAt: '2026-06-30',
  viewingHours: '10:00 - 18:00',
  visitorNotice: '작품 앞에서 잠시 머물며 천천히 감상해주세요.',
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
  },
  {
    id: 'artist-cho',
    name: '조현아',
    bio: '유리와 반사면에 남는 기억을 설치와 사진으로 다룹니다.',
    profileImageUrl: '',
    displayOrder: 40
  },
  {
    id: 'artist-park',
    name: '박은솔',
    bio: '일상의 낮은 풍경을 색면과 작은 선으로 번역합니다.',
    profileImageUrl: '',
    displayOrder: 50
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
  },
  {
    id: 'artwork-layered-afternoon',
    slug: 'layered-afternoon',
    artistId: 'artist-kim',
    sectionId: 'section-light',
    artistName: '김서연',
    year: 2026,
    medium: '캔버스에 아크릴',
    dimensions: '100 x 80 cm',
    location: 'A-03',
    imageUrl:
      'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1400&q=82',
    displayOrder: 30,
    isPublished: true,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-05-29T00:00:00.000Z',
    updatedAt: '2026-05-29T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '겹쳐진 오후',
      summary: '시간이 겹치는 벽면의 색을 기록한 회화',
      body:
        '겹겹의 색면은 한낮에서 저녁으로 옮겨가는 빛의 변화를 담습니다. 화면의 가장 밝은 부분은 지나간 시간의 흔적처럼 남아 관람자의 시선을 천천히 붙잡습니다.',
      artistNote: '오후는 사라지는 시간이 아니라 여러 겹으로 남는 시간이라고 느꼈습니다.'
    }
  },
  {
    id: 'artwork-hidden-line-map',
    slug: 'hidden-line-map',
    artistId: 'artist-jung',
    sectionId: 'section-light',
    artistName: '정민서',
    year: 2025,
    medium: '종이에 흑연과 잉크',
    dimensions: '50 x 70 cm',
    location: 'B-02',
    imageUrl:
      'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=1400&q=82',
    displayOrder: 40,
    isPublished: true,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-05-29T00:00:00.000Z',
    updatedAt: '2026-05-29T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '숨은 선의 지도',
      summary: '보이지 않는 이동 경로를 선으로 남긴 드로잉',
      body:
        '작품은 전시장 안에서 관람자가 무의식적으로 지나가는 길을 상상하며 그린 지도입니다. 얇은 선들은 서로 엇갈리고 끊기며, 하나의 완성된 길보다 머뭇거리는 움직임을 드러냅니다.',
      artistNote: '선은 길이기도 하지만 망설임이 남긴 자국이기도 합니다.'
    }
  },
  {
    id: 'artwork-glass-surface-memory',
    slug: 'glass-surface-memory',
    artistId: 'artist-cho',
    sectionId: 'section-memory',
    artistName: '조현아',
    year: 2026,
    medium: '유리, 사진, 빛',
    dimensions: '가변 설치',
    location: 'B-03',
    imageUrl:
      'https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&w=1400&q=82',
    displayOrder: 50,
    isPublished: true,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-05-29T00:00:00.000Z',
    updatedAt: '2026-05-29T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '유리 표면의 기억',
      summary: '반사되는 표면에 남는 장면을 다룬 설치',
      body:
        '유리 표면은 작품 앞의 사람과 뒤편의 공간을 동시에 비춥니다. 관람자는 작품을 보는 동안 자신이 서 있는 위치와 지나온 장면을 함께 마주하게 됩니다.',
      artistNote: '반사는 사라지는 장면을 잠깐 붙잡아두는 가장 얇은 표면입니다.'
    }
  },
  {
    id: 'artwork-low-garden',
    slug: 'low-garden',
    artistId: 'artist-park',
    sectionId: 'section-memory',
    artistName: '박은솔',
    year: 2024,
    medium: '리넨에 아크릴',
    dimensions: '72 x 91 cm',
    location: 'C-01',
    imageUrl:
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1400&q=82',
    displayOrder: 60,
    isPublished: true,
    createdBy: 'curator@example.com',
    updatedBy: 'curator@example.com',
    createdAt: '2026-05-29T00:00:00.000Z',
    updatedAt: '2026-05-29T00:00:00.000Z',
    translation: {
      locale: 'ko',
      title: '낮은 정원',
      summary: '발아래 풍경을 낮은 시선으로 그린 회화',
      body:
        '작품은 눈높이를 낮추었을 때 보이는 작은 식물과 그림자를 다룹니다. 화면 곳곳의 짧은 붓질은 바닥 가까이에서 자라는 것들의 느린 리듬을 보여줍니다.',
      artistNote: '작은 풍경은 가까이 다가갔을 때 비로소 하나의 장소가 됩니다.'
    }
  }
];
