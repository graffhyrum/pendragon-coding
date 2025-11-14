export interface ContentTemplate {
	sections: Array<{
		title: string;
		subtitle: string;
		layoutMode?: 'single-column' | 'grid';
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
