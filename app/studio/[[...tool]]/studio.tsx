"use client";

import { Studio as SanityStudio } from "sanity";
import config from "../../../sanity.config";

export function Studio() {
  return <SanityStudio config={config} />;
}