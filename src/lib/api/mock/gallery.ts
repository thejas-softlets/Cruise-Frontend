import type { GalleryItem } from "@/types";

import { media } from "./media";

/**
 * Curated gallery — every item now shows a real photo from the media audit;
 * the category taxonomy matches GalleryItem.category for filtering.
 */
export const MOCK_GALLERY: GalleryItem[] = [
  { id: "g-01", category: "vessels", media: media("Summer Cruise houseboat underway", "/images/gallery/gallery-01-vessel-underway.webp"), caption: "Summer Cruise underway" },
  { id: "g-02", category: "vessels", media: media("Green Horizon upper deck", "/images/gallery/gallery-02-gh-upper-deck.webp"), caption: "Green Horizon's upper deck" },
  { id: "g-03", category: "vessels", media: media("Crew casting off at Pengkalan Gawi jetty", "/images/gallery/gallery-03-casting-off.webp"), caption: "Casting off at Gawi" },
  { id: "g-04", category: "rooms", media: media("Master suite with lake view", "/images/gallery/gallery-04-master-suite.webp"), caption: "Master suite, Summer Cruise" },
  { id: "g-05", category: "rooms", media: media("Family room bunks", "/images/gallery/gallery-05-family-bunks.webp"), caption: "Family room bunks" },
  { id: "g-06", category: "rooms", media: media("Panorama suite balcony", "/images/gallery/gallery-06-panorama-balcony.webp"), caption: "Panorama suite balcony" },
  { id: "g-07", category: "lake", media: media("Morning mist over Kenyir Lake", "/images/gallery/gallery-07-morning-mist.webp"), caption: "Morning mist" },
  { id: "g-08", category: "lake", media: media("Lasir waterfall pool", "/images/gallery/gallery-08-lasir-pool.webp"), caption: "Lasir falls" },
  { id: "g-09", category: "lake", media: media("Rainforest islands at sunset", "/images/gallery/gallery-09-sunset-islands.webp"), caption: "Islands at sunset" },
  { id: "g-10", category: "experiences", media: media("Kayaks on the Tembat river", "/images/gallery/gallery-10-tembat-kayak.webp"), caption: "Tembat drift" },
  { id: "g-11", category: "experiences", media: media("Ancient limestone formations inside Gua Bewah", "/images/real/bewah-cave-formations.webp", 1920, 1280), caption: "Bewah cave walk" },
  { id: "g-12", category: "experiences", media: media("Stand-up paddleboarding at dawn on Kenyir Lake", "/images/real/paddle-board-dawn.webp", 1920, 1280), caption: "Dawn paddleboarding" },
  { id: "g-13", category: "guests", media: media("Guests swimming off the deck", "/images/gallery/gallery-13-deck-swim.webp"), caption: "Deck swim" },
  { id: "g-14", category: "guests", media: media("Alfresco dinner served on the open top deck", "/images/gallery/gallery-14-deck-dinner.webp"), caption: "Sunset deck dining" },
  { id: "g-15", category: "guests", media: media("Stargazing under the dark Kenyir night sky", "/images/real/sc-stargazing.webp", 1920, 1280), caption: "Stargazing by night" },
];