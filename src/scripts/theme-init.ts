import {
	DARK_CLASS,
	THEME_EXPLICIT_KEY,
	THEME_STORAGE_KEY,
} from '../utils/theme';

export type ThemeMode = 'light' | 'dark';

export type StorageLike = {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
};

export function migrateStaleThemeKeys(storage: StorageLike): void {
	const stored = storage.getItem(THEME_STORAGE_KEY);
	if (
		(stored === 'light' || stored === 'dark') &&
		storage.getItem(THEME_EXPLICIT_KEY) !== 'true'
	) {
		storage.setItem(THEME_EXPLICIT_KEY, 'true');
	}
}

export function resolveTheme(
	storage: StorageLike,
	prefersDark: boolean,
): ThemeMode {
	migrateStaleThemeKeys(storage);

	if (storage.getItem(THEME_EXPLICIT_KEY) === 'true') {
		const stored = storage.getItem(THEME_STORAGE_KEY);
		return stored === 'dark' ? 'dark' : 'light';
	}

	return prefersDark ? 'dark' : 'light';
}

export function applyTheme(root: HTMLElement, theme: ThemeMode): void {
	if (theme === 'dark') {
		root.classList.add(DARK_CLASS);
	} else {
		root.classList.remove(DARK_CLASS);
	}
}

export function persistTheme(storage: StorageLike, theme: ThemeMode): void {
	storage.setItem(THEME_STORAGE_KEY, theme);
	storage.setItem(THEME_EXPLICIT_KEY, 'true');
}

export function oppositeTheme(theme: ThemeMode): ThemeMode {
	return theme === 'dark' ? 'light' : 'dark';
}

export function buildHeadInlineScript(): string {
	return `(function(){
var SK='${THEME_STORAGE_KEY}';
var EK='${THEME_EXPLICIT_KEY}';
var DC='${DARK_CLASS}';
function migrate(){
  var s=localStorage.getItem(SK);
  if((s==='light'||s==='dark')&&localStorage.getItem(EK)!=='true'){
    localStorage.setItem(EK,'true');
  }
}
function resolve(){
  migrate();
  if(localStorage.getItem(EK)==='true'){
    return localStorage.getItem(SK)==='dark'?'dark':'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
}
function apply(t){
  if(t==='dark'){document.documentElement.classList.add(DC);}
  else{document.documentElement.classList.remove(DC);}
}
var theme=resolve();
apply(theme);
if(localStorage.getItem(EK)!=='true'){
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(e){
    if(localStorage.getItem(EK)==='true'){return;}
    apply(e.matches?'dark':'light');
  });
}
})();`;
}

export function setupThemeToggle(): void {
	const button = document.getElementById('theme-toggle');
	if (!button) {
		return;
	}

	const isDark = document.documentElement.classList.contains(DARK_CLASS);
	button.setAttribute('aria-checked', isDark ? 'true' : 'false');

	const newButton = button.cloneNode(true) as HTMLButtonElement;
	button.parentNode?.replaceChild(newButton, button);

	newButton.addEventListener('click', function (this: HTMLButtonElement) {
		const current = document.documentElement.classList.contains(DARK_CLASS)
			? 'dark'
			: 'light';
		const next = oppositeTheme(current);
		persistTheme(localStorage, next);
		applyTheme(document.documentElement, next);
		this.setAttribute('aria-checked', next === 'dark' ? 'true' : 'false');
	});
}
