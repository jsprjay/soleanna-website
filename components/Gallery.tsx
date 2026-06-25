import Image from "next/image";
import Link from "next/link";
import SunLogo from "./SunLogo";
import { club } from "@/data/club";
import { galleryPhotos, type Photo } from "@/data/gallery";

/** Brand tints cycled across placeholder tiles for variety. */
const tints = [
  "from-brand-orange to-brand-orange-deep",
  "from-brand-cyan to-brand-dark",
  "from-brand-dark to-brand-orange-deep",
  "from-brand-orange-deep to-brand-dark",
];

function Tile({ photo, index }: { photo: Photo; index: number }) {
  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl ${photo.span}`}
    >
      {photo.src ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        // Branded stand-in until a real photo is dropped in
        <div
          className={`absolute inset-0 bg-linear-to-br ${tints[index % tints.length]}`}
        >
          <SunLogo className="absolute -bottom-6 -right-6 h-28 w-28 text-brand-cream/15" />
        </div>
      )}

      {/* Caption + legibility scrim */}
      <div className="absolute inset-0 bg-linear-to-t from-brand-dark/70 via-transparent to-transparent" />
      <figcaption className="absolute bottom-3 left-3 text-xs font-bold uppercase tracking-[0.15em] text-brand-cream drop-shadow">
        {photo.caption}
      </figcaption>
    </figure>
  );
}

export default function Gallery() {
  return (
    <section id="gallery" className="bg-brand-dark text-brand-cream">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange">
              On the road
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-tight sm:text-6xl">
              Moments from the club
            </h2>
          </div>
          <Link
            href={club.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start rounded-full border border-brand-cream/30 px-5 py-2.5 text-sm font-bold transition hover:border-brand-orange hover:text-brand-orange md:self-auto"
          >
            More on {club.links.instagramHandle}
          </Link>
        </div>

        <div className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[170px] md:grid-cols-4">
          {galleryPhotos.map((photo, i) => (
            <Tile key={photo.caption} photo={photo} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
