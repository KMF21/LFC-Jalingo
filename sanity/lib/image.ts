import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

// Deliberately a minimal local type, not imported from "sanity" or
// "@sanity/image-url" — this keeps sanity/lib/ (the public site's
// integration layer) fully independent of the Studio package, and
// @sanity/image-url's own SanityImageSource type doesn't resolve reliably
// under this project's moduleResolution: "bundler" setting anyway. This
// matches the shape of any Sanity image reference or inline image object.
type SanityImageLike = { asset?: { _ref?: string; _id?: string } } | string;

export function urlFor(source: SanityImageLike) {
  return builder.image(source);
}
