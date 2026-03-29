export type OgType = 'website' | 'article';

export interface PageMetaProps {
	pageTitle: string;
	description?: string;
	ogType?: OgType;
}

export const SITE_CONFIG = {
	title: 'Joshua Pendragon',
	description:
		'Joshua Pendragon — SDET / QA Engineer. Portfolio, blog, and curated resources.',
} as const;
