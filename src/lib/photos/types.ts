export type PhotoLayout = 'full' | 'wide' | 'left' | 'right' | 'portrait';

interface PhotoBase {
  id: string;
  filename: string;
  alt: string;
  containsRecognizablePeople: boolean;
}

export interface UnsplashPhotoRecord extends PhotoBase {
  unsplashId: string;
  unsplashUrl: string;
  photographer: string;
  profileUrl: string;
  source: 'unsplash';
  license: 'unsplash';
}

/** A photograph supplied for this site with no named photographer. */
export interface SuppliedPhotoRecord extends PhotoBase {
  source: 'supplied';
  license: 'supplied';
}

export type PhotoRecord = UnsplashPhotoRecord | SuppliedPhotoRecord;

export interface PhotoPlacement {
  id: string;
  layout: PhotoLayout;
}
