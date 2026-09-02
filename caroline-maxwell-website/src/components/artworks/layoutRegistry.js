import { lazy } from 'react';

export const artworkLayouts = {
  grid: lazy(() => import('./layouts/GridLayout')),
  featured: lazy(() => import('./layouts/FeaturedLayout')),
  subcategory_list: lazy(() => import('./layouts/SubcategoryListLayout')),
};

export function resolveArtworkLayout(layoutType) {
  return artworkLayouts[layoutType] || artworkLayouts.grid;
}
