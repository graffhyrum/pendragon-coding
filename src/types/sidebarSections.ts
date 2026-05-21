export type SidebarSections = Array<{
	title: string;
	content: Array<{
		title: string;
		link: Array<{ title?: string; href: string }>;
	}>;
}>;
