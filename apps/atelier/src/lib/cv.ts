import { getCollection, type CollectionEntry } from 'astro:content';

export type ExperienceEntry = CollectionEntry<'experience'>;
export type ProjectEntry = CollectionEntry<'projects'>;

/** Work history, most recent first (lowest `order` = newest role). */
export async function getExperience(): Promise<ExperienceEntry[]> {
  const entries = await getCollection('experience');
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Projects, curated order first. */
export async function getProjects(): Promise<ProjectEntry[]> {
  const entries = await getCollection('projects');
  return entries.sort((a, b) => a.data.order - b.data.order);
}
