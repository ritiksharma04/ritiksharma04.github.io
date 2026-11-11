# Ritik Sharma — portfolio and blog

This site is being migrated to Astro. Astro builds the pages into static files for GitHub Pages.

## Run locally

Use Node.js 22.23.4 or newer, then run these commands from the repository root:

\`\`\`sh
npm install
npm run dev
\`\`\`

The development server prints a local URL, usually http://localhost:4321. Build the static site with \`npm run build\`; generated files go into \`dist/\`.

## Update portfolio content

Edit the JSON files in \`src/data/\`:

- \`profile.json\` and \`social-links.json\`: profile details and contact links
- \`experience.json\`, \`skills.json\`, \`projects.json\`, \`education.json\`: homepage content
- \`now.json\`: current learning focus

Replace \`public/resume.pdf\` to update the résumé. Put site images in \`public/images/\`.

Project entries live in `src/data/projects.json`. Published entries appear on `/projects/` and receive a detail route at `/projects/<id>/`; set `published` to `false` while a project still needs verified details. The optional `details` fields drive the architecture, data, API, and reflection sections, so adding a project does not require editing the page layout.

## Add a blog post

Create a Markdown file in \`src/content/blog/\`, for example \`my-post.md\`:

\`\`\`md
---
title: "My post title"
description: "A short summary of the post."
pubDate: 2026-11-11
---

Write the post in Markdown.
\`\`\`

The content collection checks the required title, description, and publication date when building. Add optional `category`, `tags`, and `updatedDate` fields to show those details. Set `draft: true` to keep a post out of the site and RSS feed until it is ready. MDX is also supported, and fenced code blocks get syntax highlighting. Add diagrams as images in the Markdown post.

The blog includes tag archive pages, estimated reading time, a table of contents for longer posts, related posts that share tags, Pagefind search, RSS at `/rss.xml`, and the sitemap generated at build time. To build locally, run `npm run build` and then `npx pagefind --site dist`. The GitHub Pages workflow runs both commands when it deploys.

`src/pages/now.astro` is the short current-learning page. Update `src/data/now.json` when that focus changes. A reading list and /uses page are not included until there are specific books or tools to list.

The first post in `src/content/blog/` is a short learning-log introduction based on details Ritik shared. Review it before the site is published.

## GitHub Pages deployment

The `main` branch deploys through the official Astro GitHub Action. The `public/CNAME` file is copied into the published site to keep `ritiksharma.xyz` attached. In the GitHub repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** before the first deployment. The workflow does not run for `astro-migration`; merge the reviewed changes into `main` when ready.
