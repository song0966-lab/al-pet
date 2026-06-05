export type ArtworkLocale = 'ko';

export type ArtworkTranslation = {
  locale: ArtworkLocale;
  title: string;
  summary: string;
  body: string;
  artistNote: string;
};

export type Artwork = {
  id: string;
  slug: string;
  artistId?: string | null;
  sectionId?: string | null;
  artistName: string;
  year: number;
  medium: string;
  dimensions: string;
  location: string;
  imageUrl: string;
  displayOrder: number;
  isPublished: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArtworkWithTranslation = Artwork & {
  translation: ArtworkTranslation;
};

export type ArtworkDraft = {
  slug: string;
  artistId?: string | null;
  sectionId?: string | null;
  artistName: string;
  year: number;
  medium: string;
  dimensions: string;
  location: string;
  imageUrl: string;
  displayOrder: number;
  isPublished: boolean;
  translation: ArtworkTranslation;
};

export type AdminSession = {
  email: string;
  mode: 'supabase' | 'demo';
};

export type Exhibition = {
  id: string;
  title: string;
  subtitle: string;
  venue: string;
  startsAt: string;
  endsAt: string;
  heroImageUrl: string;
  introduction: string;
  curatorNote: string;
  isPublished: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExhibitionDraft = {
  title: string;
  subtitle: string;
  venue: string;
  startsAt: string;
  endsAt: string;
  heroImageUrl: string;
  introduction: string;
  curatorNote: string;
  isPublished: boolean;
};

export type Artist = {
  id: string;
  name: string;
  bio: string;
  profileImageUrl: string;
  displayOrder: number;
};

export type Section = {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
};

export type QRLink = {
  id: string;
  artworkId: string;
  publicUrl: string;
  qrImageUrl: string | null;
  downloadedAt: string | null;
};

export type AdminUser = {
  id: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
};
