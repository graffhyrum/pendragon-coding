export type SkillCategory = 'QA & Testing' | 'Leadership' | 'Engineering';

export type SkillProficiency = 'expert' | 'advanced' | 'intermediate';

export interface SkillData {
	imagePath: string;
	img_alt: string;
	title: string;
	skill_doc_link: string;
	category: SkillCategory;
	proficiency: SkillProficiency;
}
