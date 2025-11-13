import { DOMParser } from 'happy-dom';

export function createMockDocument(html: string) {
	const document = new DOMParser().parseFromString(html, 'text/html');
	return document;
}

export function expectElementExists(document: Document, selector: string) {
	const element = document.querySelector(selector);
	if (!element) {
		throw new Error(`Expected element with selector "${selector}" to exist`);
	}
	return element;
}

export function expectAttribute(
	element: Element,
	attribute: string,
	value?: string,
) {
	if (!element.hasAttribute(attribute)) {
		throw new Error(`Expected element to have attribute "${attribute}"`);
	}
	if (value !== undefined && element.getAttribute(attribute) !== value) {
		throw new Error(
			`Expected attribute "${attribute}" to have value "${value}", but got "${element.getAttribute(attribute)}"`,
		);
	}
}

export function expectClass(element: Element, className: string) {
	if (!element.classList.contains(className)) {
		throw new Error(`Expected element to have class "${className}"`);
	}
}

export function expectTextContent(element: Element, text: string) {
	if (!element.textContent?.includes(text)) {
		throw new Error(
			`Expected element text content to include "${text}", but got "${element.textContent}"`,
		);
	}
}
