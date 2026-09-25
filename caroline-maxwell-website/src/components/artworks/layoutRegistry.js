import { lazy } from 'react';

export const artworkLayouts = {
  grid: lazy(() => import('./layouts/GridLayout')),
  featured: lazy(() => import('./layouts/FeaturedLayout')),
  stacked: lazy(() => import('./layouts/StackedLayout')),
  carousel: lazy(() => import('./layouts/CarouselLayout')),
};

/**
 * Projects whose children are artworks (as opposed to sub-projects) are
 * always shown as a full stacked list — image, name, medium, size, date,
 * write-up all in place — with no click-through to a separate page —
 * unless layout_type is "carousel", which shows them as auto-rotating
 * carousels instead. layout_type ("grid" / "featured") otherwise only
 * applies when browsing a listing of sub-projects.
 */
export function resolveArtworkLayout(project) {
  const childType = project.children?.[0]?.type;
  if (childType === 'artwork') {
    return project.layout_type === 'carousel' ? artworkLayouts.carousel : artworkLayouts.stacked;
  }
  if (project.layout_type === 'carousel') return artworkLayouts.grid;
  return artworkLayouts[project.layout_type] || artworkLayouts.grid;
}
