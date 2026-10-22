import type { ImageMetadata } from 'astro';
import campusArchway from '@/assets/photos/campus-archway.jpg';
import chicagoRiver from '@/assets/photos/chicago-river.jpg';
import cuhkCampus from '@/assets/photos/cuhk-campus.jpg';
import dcCapitol from '@/assets/photos/dc-capitol.jpg';
import dcPillars from '@/assets/photos/dc-pillars.jpg';
import hanoiNight from '@/assets/photos/hanoi-night.jpg';
import hanoiOld from '@/assets/photos/hanoi-old.jpg';
import lisbonSunset from '@/assets/photos/lisbon-sunset.jpg';
import mumbaiMarine from '@/assets/photos/mumbai-marine.jpg';
import mumbaiNight from '@/assets/photos/mumbai-night.jpg';
import nycFinancial from '@/assets/photos/nyc-financial.jpg';
import oregonHighway from '@/assets/photos/oregon-highway.jpg';
import ruralGrader from '@/assets/photos/rural-grader.jpg';
import seoulSkyline from '@/assets/photos/seoul-skyline.jpg';
import shanghaiBund from '@/assets/photos/shanghai-bund.jpg';
import shanghaiNight from '@/assets/photos/shanghai-night.jpg';
import suzzalloInterior from '@/assets/photos/suzzallo-interior.jpg';
import uwCampus from '@/assets/photos/uw-campus.jpg';

export const photoAssets: Record<string, ImageMetadata> = {
  'campus-archway': campusArchway,
  'chicago-river': chicagoRiver,
  'cuhk-campus': cuhkCampus,
  'dc-capitol': dcCapitol,
  'dc-pillars': dcPillars,
  'hanoi-night': hanoiNight,
  'hanoi-old': hanoiOld,
  'lisbon-sunset': lisbonSunset,
  'mumbai-marine': mumbaiMarine,
  'mumbai-night': mumbaiNight,
  'nyc-financial': nycFinancial,
  'oregon-highway': oregonHighway,
  'rural-grader': ruralGrader,
  'seoul-skyline': seoulSkyline,
  'shanghai-bund': shanghaiBund,
  'shanghai-night': shanghaiNight,
  'suzzallo-interior': suzzalloInterior,
  'uw-campus': uwCampus,
};
