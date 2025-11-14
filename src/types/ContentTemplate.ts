export interface ContentTemplate {
	sections: Array<{
		title: string;
		subtitle: string;
		layoutMode?: 'grid' | 'single-column';
		content: Array<{
			title: string;
			link: Link[];
			description: string;
		}>;
	}>;
}

interface Link {
	title?: string;
	href: string;
}
