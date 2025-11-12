export interface ContentTemplate {
	sections: Array<{
		title: string;
		subtitle: string;
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
