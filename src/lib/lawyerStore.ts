'use client';

import { Lawyer } from './types';
import { DEMO_LAWYERS } from './mockData';

const LAWYERS_STORAGE_KEY = 'casekeeper_lawyers_directory';

export interface AdvocateRegistrationInput {
  fullName: string;
  barNumber: string;
  barCouncil: string;
  practiceCourt: string;
  city: string;
  state?: string;
  experienceYears?: number;
  phone: string;
  email: string;
  practiceAreas?: string[];
  bio?: string;
}

// Initial directory with realistic advocates
const INITIAL_LAWYERS: (Lawyer & { isDummy?: boolean; isRegisteredUser?: boolean })[] = DEMO_LAWYERS.map((l) => ({
  ...l,
  isDummy: true,
  isRegisteredUser: false
}));

export function getLawyersDirectory(): (Lawyer & { isDummy?: boolean; isRegisteredUser?: boolean })[] {
  if (typeof window === 'undefined') return INITIAL_LAWYERS;
  try {
    const raw = localStorage.getItem(LAWYERS_STORAGE_KEY);
    let directory: (Lawyer & { isDummy?: boolean; isRegisteredUser?: boolean })[] = INITIAL_LAWYERS;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        directory = parsed;
      }
    }

    // Auto-sync: if casekeeper_lawyer_profile exists, sync the active registered advocate's fields!
    try {
      const profileRaw = localStorage.getItem('casekeeper_lawyer_profile');
      if (profileRaw) {
        const savedProf = JSON.parse(profileRaw);
        if (savedProf) {
          const normalize = (s?: string) => (s || '').toLowerCase().replace(/^adv\.\s*/i, '').trim();
          const regIdx = directory.findIndex(l => 
            (l.isRegisteredUser === true) || 
            (l.id.startsWith('lawyer-reg-')) || 
            (savedProf.name && normalize(l.name) === normalize(savedProf.name)) ||
            (savedProf.barNumber && l.barNumber && l.barNumber.toLowerCase() === savedProf.barNumber.toLowerCase())
          );

          if (regIdx !== -1) {
            const current = directory[regIdx];
            let changed = false;
            const newExp = savedProf.experienceYears !== undefined && !isNaN(Number(savedProf.experienceYears)) && Number(savedProf.experienceYears) > 0
              ? Number(savedProf.experienceYears)
              : current.experienceYears;

            if (current.experienceYears !== newExp) {
              current.experienceYears = newExp;
              changed = true;
            }
            if (savedProf.bio && current.bio !== savedProf.bio) {
              current.bio = savedProf.bio;
              changed = true;
            }
            if (savedProf.city && current.city !== savedProf.city) {
              current.city = savedProf.city;
              changed = true;
            }
            if (savedProf.name && current.name !== savedProf.name) {
              current.name = savedProf.name.startsWith('Adv.') ? savedProf.name : `Adv. ${savedProf.name}`;
              changed = true;
            }
            if (savedProf.phone && current.phone !== savedProf.phone) {
              current.phone = savedProf.phone;
              changed = true;
            }
            if (savedProf.practiceAreas) {
              const areas = Array.isArray(savedProf.practiceAreas) 
                ? savedProf.practiceAreas 
                : savedProf.practiceAreas.split(',').map((s: string) => s.trim()).filter(Boolean);
              if (areas.length > 0 && JSON.stringify(current.practiceAreas) !== JSON.stringify(areas)) {
                current.practiceAreas = areas;
                changed = true;
              }
            }
            if (changed) {
              localStorage.setItem(LAWYERS_STORAGE_KEY, JSON.stringify(directory));
            }
          }
        }
      }
    } catch (err) {}

    return directory;
  } catch (e) {
    console.error('Failed to load lawyers directory', e);
    return INITIAL_LAWYERS;
  }
}

export function saveLawyersDirectory(lawyers: (Lawyer & { isDummy?: boolean; isRegisteredUser?: boolean })[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LAWYERS_STORAGE_KEY, JSON.stringify(lawyers));
    window.dispatchEvent(new Event('lawyers_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save lawyers directory', e);
  }
}

export function getLawyerById(id: string): (Lawyer & { isDummy?: boolean; isRegisteredUser?: boolean }) | undefined {
  const all = getLawyersDirectory();
  return all.find((l) => l.id === id);
}

/**
 * Registers a new real advocate and adds them to the public directory.
 * As new real advocates register, dummy/placeholder advocates are removed one-by-one.
 */
export function registerNewAdvocate(input: AdvocateRegistrationInput): Lawyer {
  const currentDirectory = getLawyersDirectory();

  const formattedName = input.fullName.trim().startsWith('Adv.')
    ? input.fullName.trim()
    : `Adv. ${input.fullName.trim()}`;

  const stateFromCourt = input.practiceCourt.includes('Delhi')
    ? 'Delhi'
    : input.practiceCourt.includes('Bombay') || input.practiceCourt.includes('Mumbai')
    ? 'Maharashtra'
    : input.practiceCourt.includes('Punjab') || input.practiceCourt.includes('Haryana')
    ? 'Punjab'
    : input.practiceCourt.includes('Bengal') || input.practiceCourt.includes('Calcutta')
    ? 'West Bengal'
    : input.state || 'Delhi';

  const newAdvocate: Lawyer & { isDummy?: boolean; isRegisteredUser?: boolean } = {
    id: `lawyer-reg-${Date.now()}`,
    name: formattedName,
    title: `Advocate — ${input.practiceCourt || 'High Court of Delhi'}`,
    barNumber: input.barNumber.trim(),
    verified: true,
    city: input.city.trim() || 'New Delhi',
    state: stateFromCourt,
    experienceYears: input.experienceYears !== undefined && !isNaN(Number(input.experienceYears)) && Number(input.experienceYears) > 0
      ? Number(input.experienceYears)
      : 10,
    languages: ['English', 'Hindi'],
    practiceAreas: input.practiceAreas && input.practiceAreas.length > 0
      ? input.practiceAreas
      : ['Civil Litigation', 'Consumer Protection', 'Constitutional Law', 'Property & RERA'],
    rating: 5.0,
    reviewsCount: 1,
    bio: input.bio || `Bar Council certified practitioner practicing before ${input.practiceCourt}. Enrolled under ${input.barCouncil} with verified registration number ${input.barNumber}.`,
    phone: input.phone.trim(),
    email: input.email.trim(),
    isDummy: false,
    isRegisteredUser: true,
  };

  // Check if this advocate is already in the directory by barNumber or email
  const existingIndex = currentDirectory.findIndex(
    (l) => l.barNumber.toLowerCase() === newAdvocate.barNumber.toLowerCase() ||
           l.email.toLowerCase() === newAdvocate.email.toLowerCase()
  );

  let updatedList: (Lawyer & { isDummy?: boolean; isRegisteredUser?: boolean })[];

  if (existingIndex !== -1) {
    // Update existing registered advocate and bring them to the top
    const filtered = currentDirectory.filter((_, idx) => idx !== existingIndex);
    updatedList = [newAdvocate, ...filtered];
  } else {
    // Add new real advocate to the very top
    // Find the last dummy advocate and remove it so dummy advocates are phased out one-by-one!
    const dummyIndex = currentDirectory.findIndex((l) => l.isDummy === true);
    if (dummyIndex !== -1) {
      // Remove one dummy advocate
      const withoutOneDummy = currentDirectory.filter((_, idx) => idx !== dummyIndex);
      updatedList = [newAdvocate, ...withoutOneDummy];
    } else {
      updatedList = [newAdvocate, ...currentDirectory];
    }
  }

  saveLawyersDirectory(updatedList);
  return newAdvocate;
}

export function resetLawyersDirectory(): void {
  saveLawyersDirectory(INITIAL_LAWYERS);
}

/**
 * Updates an advocate's details in the public directory and saves changes.
 */
export function updateLawyerProfileInDirectory(updated: {
  id?: string;
  barNumber?: string;
  email?: string;
  name?: string;
  title?: string;
  city?: string;
  state?: string;
  experienceYears?: number;
  practiceAreas?: string[];
  bio?: string;
  phone?: string;
  languages?: string[];
}): boolean {
  const currentDirectory = getLawyersDirectory();
  if (!currentDirectory || currentDirectory.length === 0) return false;

  const normalizeName = (s?: string) => (s || '').toLowerCase().replace(/^adv\.\s*/i, '').trim();

  // Find index by ID, barNumber, email, or normalized name
  let index = currentDirectory.findIndex(l => {
    if (updated.id && l.id === updated.id) return true;
    if (updated.barNumber && l.barNumber && l.barNumber.trim().toLowerCase() === updated.barNumber.trim().toLowerCase()) return true;
    if (updated.email && l.email && l.email.trim().toLowerCase() === updated.email.trim().toLowerCase()) return true;
    if (updated.name && l.name && normalizeName(l.name) === normalizeName(updated.name)) return true;
    return false;
  });

  // If no exact match found, match the first registered user or the top directory entry
  if (index === -1) {
    index = currentDirectory.findIndex(l => l.isRegisteredUser === true || l.id.startsWith('lawyer-reg-'));
  }
  if (index === -1) {
    index = 0; // Top card is the active advocate
  }

  const existing = currentDirectory[index];
  const newExp = updated.experienceYears !== undefined && !isNaN(Number(updated.experienceYears))
    ? Number(updated.experienceYears)
    : existing.experienceYears;

  currentDirectory[index] = {
    ...existing,
    name: updated.name ? (updated.name.trim().startsWith('Adv.') ? updated.name.trim() : `Adv. ${updated.name.trim()}`) : existing.name,
    title: updated.title || existing.title,
    barNumber: updated.barNumber || existing.barNumber,
    city: updated.city || existing.city,
    state: updated.state || existing.state,
    experienceYears: newExp,
    practiceAreas: (updated.practiceAreas && updated.practiceAreas.length > 0) ? updated.practiceAreas : existing.practiceAreas,
    bio: updated.bio || existing.bio,
    phone: updated.phone || existing.phone,
    email: updated.email || existing.email,
    languages: updated.languages || existing.languages,
    isRegisteredUser: true,
  };

  saveLawyersDirectory([...currentDirectory]);
  return true;
}
