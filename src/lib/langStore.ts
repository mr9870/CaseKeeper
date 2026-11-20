'use client';

export type AppLanguage = 'EN' | 'HI';

const LANG_KEY = 'casekeeper_preferred_lang';

export function getAppLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'EN';
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === 'HI' ? 'HI' : 'EN';
  } catch {
    return 'EN';
  }
}

export function setAppLanguage(lang: AppLanguage): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANG_KEY, lang);
    window.dispatchEvent(new CustomEvent('casekeeper_lang_changed', { detail: lang }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to set language:', e);
  }
}
