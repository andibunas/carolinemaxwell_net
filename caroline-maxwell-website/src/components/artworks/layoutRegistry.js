import { lazy } from 'react';

export const artworkLayouts = {
  grid: lazy(() => import('./layouts/GridLayout')),
  featured: lazy(() => import('./layouts/FeaturedLayout')),
  stacked: lazy(() => import('./layouts/StackedLayout')),
};

/**
 * Projects whose children are artworks (as opposed to sub-projects) are
 * always shown as a full stacked list — image, name, medium, size, date,
 * write-up all in place — with no click-through to a separate page.
 * layout_type ("grid" / "featured") only applies when browsing a listing
 * of sub-projects.
 */
export function resolveArtworkLayout(project) {
  const childType = project.children?.[0]?.type;
  if (childType === 'artwork') return artworkLayouts.stacked;
  return artworkLayouts[project.layout_type] || artworkLayouts.grid;
}
