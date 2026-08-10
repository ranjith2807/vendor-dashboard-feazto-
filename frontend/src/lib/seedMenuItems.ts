/**
 * seedMenuItems.ts
 * Seeding is disabled — vendors add their own items manually.
 */
import type { MenuItem } from '../data/menuStore'

export async function seedMenuIfEmpty(
  _email: string,
  _currentItems: MenuItem[],
): Promise<MenuItem[]> {
  return []
}
