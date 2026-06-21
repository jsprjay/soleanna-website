/**
 * Core, rarely-changing club info + links.
 * Edit here once and it updates everywhere on the site.
 */

export const club = {
  name: "Soleanna Run Club",
  shortName: "SRC",
  tagline: "Building a community of winners",
  location: "Hoboken, NJ",
  blurb:
    "Run & Athletics club based out of Northern New Jersey. Focused on " +
    "building community and self empowerment through running, health, and wellness.",

  /** The weekly recurring meetup. */
  recurring: {
    title: "Track Tuesdays",
    day: "Every Tuesday",
    time: "7:30 PM",
    location: "Weehawken Waterfront Field",
    note: "Our weekly run. No pace requirement — just show up and run with us.",
  },

  links: {
    shop: "https://shopsoleanna.com/",
    instagram: "https://www.instagram.com/soleannarunclub/",
    instagramHandle: "@soleannarunclub",
    linktree: "https://linktr.ee/Soleannarunclub",
  },
} as const;
