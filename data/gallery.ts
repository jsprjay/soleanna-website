/**
 * ── PHOTO COLLAGE ─────────────────────────────────────────────────
 * Photos shown in the "On the road" collage on the home page.
 *
 * To use real photos: drop image files into `public/photos/` and set
 * each tile's `src` to its path (e.g. "/photos/track-tuesday.jpg").
 * Tiles without a `src` render a branded placeholder, so the collage
 * always looks complete — fill them in as photos come through.
 *
 * `span` controls the tile's size in the mosaic (Tailwind grid classes).
 * Keep ~7 tiles so the layout packs neatly.
 * ──────────────────────────────────────────────────────────────────
 */

export interface Photo {
  /** Image path under /public, e.g. "/photos/crew.jpg". Optional. */
  src?: string;
  /** Accessible description of the photo. */
  alt: string;
  /** Short label shown on the tile. */
  caption: string;
  /** Grid sizing — first tile is the large feature tile. */
  span: string;
}

export const galleryPhotos: Photo[] = [
  {
    caption: "Track Tuesdays",
    alt: "Soleanna runners on the track at golden hour",
    span: "col-span-2 row-span-2 md:col-span-2 md:row-span-2",
  },
  {
    caption: "Sunset miles",
    alt: "The group running along the Weehawken waterfront at sunset",
    span: "col-span-2 md:col-span-2",
  },
  {
    caption: "Post-run coffee",
    alt: "Members hanging out with coffee after a run",
    span: "md:col-span-1",
  },
  {
    caption: "Race day",
    alt: "Soleanna members at a local race",
    span: "md:col-span-1",
  },
  {
    caption: "The crew",
    alt: "Group photo of the Soleanna Run Club crew",
    span: "md:col-span-1",
  },
  {
    caption: "Soleanna FC",
    alt: "Soleanna FC after a soccer match",
    span: "md:col-span-1",
  },
  {
    caption: "Good vibes",
    alt: "Members celebrating together",
    span: "col-span-2 md:col-span-2",
  },
];
