export type ContentKind = 'testimonial' | 'default';

export interface Link {
	title?: string;
	href: string;
}

export interface ContentTemplate {
	sections: Array<{
		title: string;
		subtitle: string;
		layoutMode?: 'grid' | 'single-column';
		contentKind: ContentKind;
		content: Array<{
			title: string;
			link: Link[];
			description: string;
		}>;
	}>;
}
