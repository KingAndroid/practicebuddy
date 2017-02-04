import { ModuleWithProviders }  from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StickerGalleryComponent } from './sticker-gallery.component';

const StickerGalleryRoutes: Routes = [
  { path: "sticker-gallery/:id", component: StickerGalleryComponent }
];
export const stickerGalleryRouting: ModuleWithProviders = RouterModule.forChild(StickerGalleryRoutes);