import manifest from '../content/manifest.json';

export function getGalleryProjects() {
  return manifest.gallery;
}

export function getGalleryProject(slug) {
  return manifest.gallery.find((p) => p.id === slug) || null;
}

export function getFieldOffices() {
  return manifest.fieldOffices;
}

export function getFieldOffice(slug) {
  return manifest.fieldOffices.find((o) => o.id === slug) || null;
}

export function getAnimalCategories() {
  return manifest.animalReports;
}

export function getAnimalCategory(slug) {
  return manifest.animalReports.find((c) => c.id === slug) || null;
}
