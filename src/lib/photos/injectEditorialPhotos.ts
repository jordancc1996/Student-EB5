import { getPhoto, getPlacementsForPath } from '@/data/photoRegistry';
import type { PhotoPlacement } from '@/lib/photos/types';

export function editorialPhotoMarkdown(filename: string, alt: string, layout: string): string {
  return `![${alt}](../../assets/photos/${filename} "${layout}")`;
}

export function injectEditorialPhotos(
  content: string,
  pagePath: string,
  extra: PhotoPlacement[] = [],
): string {
  const placements = [...getPlacementsForPath(pagePath), ...extra];
  if (placements.length === 0) return content;

  const lines = content.split('\n');
  const alreadyPresent = new Set(
    placements.filter((placement) => {
      const photo = getPhoto(placement.id);
      return photo ? content.includes(photo.filename) : false;
    }).map((placement) => placement.id),
  );

  const remaining = placements.filter((placement) => !alreadyPresent.has(placement.id));
  if (remaining.length === 0) return content;

  const firstH2 = lines.findIndex((line) => line.startsWith('## '));
  if (firstH2 === -1) {
    const blocks = remaining
      .map((placement) => {
        const photo = getPhoto(placement.id);
        if (!photo) return '';
        return editorialPhotoMarkdown(photo.filename, photo.alt, placement.layout);
      })
      .filter(Boolean);
    return `${content.trimEnd()}\n\n${blocks.join('\n\n')}\n`;
  }

  let insertAt = firstH2 + 1;
  while (insertAt < lines.length && lines[insertAt].trim() === '') insertAt += 1;
  if (insertAt < lines.length) insertAt += 1;

  const first = remaining[0];
  const firstPhoto = getPhoto(first.id);
  if (firstPhoto) {
    lines.splice(insertAt, 0, '', editorialPhotoMarkdown(firstPhoto.filename, firstPhoto.alt, first.layout), '');
  }

  if (remaining.length > 1) {
    const headingIndices = lines.reduce<number[]>((acc, line, index) => {
      if (line.startsWith('## ')) acc.push(index);
      return acc;
    }, []);
    const midHeading = headingIndices[Math.floor(headingIndices.length / 2)] ?? lines.length;
    const second = remaining[1];
    const secondPhoto = getPhoto(second.id);
    if (secondPhoto) {
      lines.splice(midHeading, 0, editorialPhotoMarkdown(secondPhoto.filename, secondPhoto.alt, second.layout), '');
    }
  }

  return lines.join('\n');
}
