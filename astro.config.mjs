import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// IMPORTANT : remplace cette URL par le domaine final pour que le sitemap
// et les balises canoniques/OG génèrent des URLs absolues correctes.
const SITE_URL = "https://www.mld-dev.com";

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  site: SITE_URL,
  integrations: [tailwind(), react(), sitemap()],
});
