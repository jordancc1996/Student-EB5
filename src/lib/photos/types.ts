export type PhotoLayout = 'full' | 'wide' | 'left' | 'right' | 'portrait';

export interface PhotoRecord {
  id: string;
  filename: string;
  unsplashId: string;
  unsplashUrl: string;
  photographer: string;
  profileUrl: string;
  source: 'unsplash';
  license: 'unsplash';
  alt: string;
  containsRecognizablePeople: boolean;
}

export interface PhotoPlacement {
  id: string;
  layout: PhotoLayout;
}
