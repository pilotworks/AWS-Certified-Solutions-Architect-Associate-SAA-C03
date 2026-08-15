export const SITE_URL = 'https://aws-saa-c03.pilotworks.dev';
export const AUTHOR_URL = 'https://github.com/phamtanminhtien';
export const AUTHOR_NAME = 'Pham Tan Minh Tien';
export const OG_IMAGE_PATH = '/og-image.png';

export function getModuleOgImagePath(moduleId: string): string {
  return `/og-images/modules/${moduleId}.png`;
}

export function getCanonicalUrl(path = '', siteUrl = SITE_URL): string {
  const normalizedPath = path && path !== '/' ? `/${path.replace(/^\/+/, '')}` : '';
  return `${siteUrl.replace(/\/$/, '')}${normalizedPath}`;
}

export function getOgImageUrl(siteUrl = SITE_URL, imagePath = OG_IMAGE_PATH): string {
  return `${siteUrl.replace(/\/$/, '')}${imagePath}`;
}
