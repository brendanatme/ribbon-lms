/**
 * Seed data for the "WordPress for Beginners" course.
 *
 * A conceptual, hands-on tour of self-hosted WordPress (WordPress.org) and the
 * modern block editor, modelled on the syllabus of the best beginner courses:
 * setup → dashboard → content → media → themes → plugins → users/SEO/security
 * → maintenance → light customization. Most lessons are prose, lists, and
 * tables; the final module introduces a little code (rendered as highlighted
 * ```php blocks).
 *
 * Shapes come from `seed-types.ts`; `seed.ts` turns this into nested rows.
 */
import type { SeedCourse } from './seed-types';

export const wordpressCourse: SeedCourse = {
  title: 'WordPress for Beginners',
  description:
    'Build and run a real website with WordPress — the CMS behind 40%+ of the web. From hosting and the dashboard to the block editor, themes, plugins, SEO, security, and a first taste of custom code. Every lesson ends with a quick quiz.',
  modules: [
    /* ===================================================================== */
    {
      title: '1 · Getting Started',
      lessons: [
        {
          title: 'What Is WordPress?',
          durationMin: 7,
          content: `**WordPress** is a free, open-source **content management system (CMS)** — software
that lets you create and manage a website without writing code. It powers
**over 40%** of all websites on the internet, from personal blogs to major
news sites and online stores.

A few facts that shape everything else:

- It launched in **2003** as a blogging tool and grew into a CMS for *any* kind of site.
- It is **open source**, released under the **GPL** license — free to use, change, and share.
- It is written in **PHP** and stores your content in a **database** (MySQL/MariaDB).
- A huge ecosystem of **themes** (look) and **plugins** (features) extends it.

> "CMS" simply means the software handles the hard parts — storing your content,
> generating pages, managing users — so you can focus on writing and design.

You don't need to be a developer to build a professional site with WordPress.
That's the whole point: most of your work happens in a friendly admin screen.`,
          quiz: {
            title: 'What Is WordPress? — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What kind of software is WordPress?',
                options: [
                  { text: 'A content management system (CMS)', correct: true },
                  { text: 'A web browser' },
                  { text: 'A programming language' },
                  { text: 'An operating system' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Roughly what share of all websites run on WordPress?',
                options: [
                  { text: 'Over 40%', correct: true },
                  { text: 'About 5%' },
                  { text: 'About 90%' },
                ],
              },
              {
                type: 'TEXT',
                prompt:
                  'WordPress is free, open-source software released under which license? (three-letter acronym)',
                answer: 'GPL',
              },
              {
                type: 'TEXT',
                prompt: 'WordPress is written primarily in which programming language?',
                answer: 'PHP',
              },
            ],
          },
        },
        {
          title: 'WordPress.org vs WordPress.com & Getting Set Up',
          durationMin: 9,
          content: `One of the most confusing things for beginners is that "WordPress" comes in two
flavours:

| | WordPress.org | WordPress.com |
|---|---|---|
| What it is | The free software you install yourself | A hosting service that runs the software for you |
| Hosting | You choose your own host | Included (by Automattic) |
| Cost | Free software; you pay for hosting + domain | Free tier; paid plans for more features |
| Control | Full — any theme, any plugin, custom code | Limited on lower plans |
| Best for | Full ownership and flexibility | The quickest, hands-off start |

This course focuses on **self-hosted WordPress.org**, because it gives you the
full picture and complete control.

## What you need for a self-hosted site

1. A **domain name** (e.g. \`yoursite.com\`).
2. **Web hosting** — a server that runs **PHP** and a **MySQL/MariaDB** database.
3. **WordPress itself**, which is free to download.

Most hosts offer a **one-click installer**, and a manual install is famously
quick — the original "**5-minute install**." Once installed, you manage
everything from the **admin area**, reached by adding \`/wp-admin\` to your site's
address:

\`\`\`text
https://yoursite.com/wp-admin
\`\`\``,
          quiz: {
            title: 'Setup — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which statement about WordPress.org is correct?',
                options: [
                  {
                    text: 'It is the self-hosted software you install on your own hosting',
                    correct: true,
                  },
                  { text: 'It is a paid hosting service that runs WordPress for you' },
                  { text: 'It is a mobile app for writing posts' },
                ],
              },
              {
                type: 'MULTIPLE_CHOICE',
                prompt:
                  'What do you need to run a self-hosted WordPress site? (select all that apply)',
                options: [
                  { text: 'A domain name', correct: true },
                  { text: 'Web hosting (PHP + a database)', correct: true },
                  { text: 'The WordPress software', correct: true },
                  { text: 'A paid desktop application' },
                ],
              },
              {
                type: 'TEXT',
                prompt:
                  "Which path do you add to a site's URL to reach the admin login? example.com/____",
                answer: 'wp-admin',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Where does WordPress store your posts, pages, and settings?',
                options: [
                  { text: 'In a database (MySQL/MariaDB)', correct: true },
                  { text: 'Inside image files' },
                  { text: "In the visitor's browser" },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '2 · The Dashboard & Settings',
      lessons: [
        {
          title: 'Touring the Dashboard',
          durationMin: 8,
          content: `After logging in at \`/wp-admin\`, you land on the **Dashboard** — mission control
for your site. The main pieces:

- **Admin menu (left):** every section lives here — Posts, Media, Pages,
  Comments, Appearance, Plugins, Users, Tools, Settings.
- **Admin bar (top):** a dark bar shown when you're logged in, with quick links
  like **+ New** and a shortcut to view your live site.
- **Work area (center):** where you edit whatever you've selected.
- **Screen Options & Help (top right):** toggle which panels show and read
  contextual help on most screens.

> The admin bar appears for logged-in users on both the dashboard *and* the
> front end of your site, making it easy to jump back to editing.

Your own account lives under **Users → Profile**, where you set your display
name, color scheme, and password. Spend a minute clicking through the left menu —
that mental map makes everything later feel familiar.`,
          quiz: {
            title: 'Dashboard — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Where do the main sections (Posts, Pages, Plugins, Settings…) appear?',
                options: [
                  { text: 'In the admin menu down the left side', correct: true },
                  { text: 'Only inside the block editor' },
                  { text: 'On the public homepage' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What is the "admin bar"?',
                options: [
                  {
                    text: 'The bar shown to logged-in users with quick admin links',
                    correct: true,
                  },
                  { text: 'A paid upgrade for the dashboard' },
                  { text: 'The list of installed plugins' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which dashboard control lets you show or hide panels on a screen?',
                options: [
                  { text: 'Screen Options', correct: true },
                  { text: 'Permalinks' },
                  { text: 'The Media Library' },
                ],
              },
            ],
          },
        },
        {
          title: 'Essential Settings',
          durationMin: 9,
          content: `Before adding content, visit **Settings** and get a few basics right.

## Settings → General

Set your **Site Title** and **Tagline**, your **WordPress Address / Site
Address** (URLs), timezone, and date format.

## Settings → Reading

Choose what your homepage shows:

- **Your latest posts** — a classic blog feed, *or*
- **A static page** — pick a Page as the front page (common for business sites).

This is also where you can discourage search engines while building (remember to
**uncheck** it before launch!).

## Settings → Permalinks

A **permalink** is the permanent URL of a post or page. The default uses ugly
\`?p=123\` IDs. Switch to the **Post name** option for clean, readable, SEO-friendly
links:

\`\`\`text
https://yoursite.com/hello-world/        ← Post name (recommended)
https://yoursite.com/?p=123              ← default, avoid
\`\`\`

> Set your permalink structure **early**. Changing it later alters every URL and
> can break links unless you add redirects.`,
          quiz: {
            title: 'Settings — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Under Settings → Reading, what can you choose for your homepage?',
                options: [
                  { text: 'Your latest posts or a static page', correct: true },
                  { text: 'Only a slideshow' },
                  { text: 'The plugin list' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which permalink setting gives clean, SEO-friendly URLs?',
                options: [
                  { text: 'Post name', correct: true },
                  { text: 'Plain (?p=123)' },
                  { text: 'Numeric' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Why should you choose your permalink structure early?',
                options: [
                  {
                    text: 'Changing it later alters every URL and can break links',
                    correct: true,
                  },
                  { text: 'It cannot be changed once the site is live' },
                  { text: 'It controls your theme colors' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '3 · Creating Content',
      lessons: [
        {
          title: 'Posts vs Pages',
          durationMin: 8,
          content: `WordPress has two core content types, and knowing the difference is essential.

| | Posts | Pages |
|---|---|---|
| Purpose | Timely, blog-style entries | Timeless, standalone content |
| Order | Reverse-chronological (newest first) | Not dated; standalone |
| Organization | Use **categories** and **tags** | Hierarchical (parent/child) |
| In RSS feed? | Yes | No |
| Examples | News, articles, updates | About, Contact, Privacy Policy |

A simple rule of thumb:

- Use a **post** for anything that's part of an ongoing stream — articles, news, updates.
- Use a **page** for content that rarely changes and stands on its own — your *About* or *Contact* page.

> Both are edited with the same block editor. The difference is how WordPress
> *organizes and displays* them, not how you write them.`,
          quiz: {
            title: 'Posts vs Pages — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt:
                  "A timeless, standalone item like an 'About' or 'Contact' screen is called a ____ (singular).",
                answer: 'page',
              },
              {
                type: 'TEXT',
                prompt:
                  'A dated, blog-style entry shown newest-first and organized with categories and tags is called a ____ (singular).',
                answer: 'post',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which content type can be organized with categories and tags?',
                options: [{ text: 'Posts', correct: true }, { text: 'Pages' }, { text: 'Neither' }],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which would you create for your company’s "Contact Us" screen?',
                options: [
                  { text: 'A page', correct: true },
                  { text: 'A post' },
                  { text: 'A plugin' },
                ],
              },
            ],
          },
        },
        {
          title: 'The Block Editor',
          durationMin: 11,
          content: `Since WordPress 5.0 (2018), content is built with the **block editor**, codenamed
**Gutenberg**. Every piece of content — a paragraph, heading, image, list,
button, gallery — is a **block** you add, arrange, and configure.

## Working with blocks

- Click the **+ (block inserter)** to add a block, or just start typing for a paragraph.
- Type **/** in an empty block to search (e.g. \`/image\`, \`/heading\`, \`/list\`).
- Select a block to see its settings in the **right-hand sidebar** (and a floating toolbar).
- Drag blocks, or use the **list view** (top-left outline icon) to reorder them.

## Blocks you'll use constantly

- **Paragraph** and **Heading** (H1–H6 for structure)
- **Image**, **Gallery**, and **Cover** (image with overlaid text)
- **List**, **Quote**, **Button**, and **Columns** for layout

> **Patterns** are ready-made groups of blocks you can drop in. **Synced
> patterns** (formerly "reusable blocks") stay identical everywhere they're
> used — edit once, update everywhere.

The block model is what lets you build rich layouts visually, with no HTML.`,
          quiz: {
            title: 'Block editor — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt: 'What is the project codename of the WordPress block editor?',
                answer: 'Gutenberg',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'In the block editor, what is a "block"?',
                options: [
                  {
                    text: 'A single piece of content (paragraph, image, heading…) you add and arrange',
                    correct: true,
                  },
                  { text: 'A banned IP address' },
                  { text: 'A type of hosting plan' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'Typing which character in an empty block lets you quickly search for a block type?',
                options: [
                  { text: '/ (slash)', correct: true },
                  { text: '@ (at sign)' },
                  { text: '# (hash)' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What do "synced patterns" (formerly reusable blocks) let you do?',
                options: [
                  {
                    text: 'Reuse the same block group everywhere and edit it in one place',
                    correct: true,
                  },
                  { text: 'Automatically translate your site' },
                  { text: 'Back up your database' },
                ],
              },
            ],
          },
        },
        {
          title: 'The Publishing Workflow',
          durationMin: 8,
          content: `Writing is only half the job — the **Publish** panel controls *when* and *how*
content goes live.

- **Save draft:** keep working privately; nothing is public yet.
- **Preview:** see exactly how it will look on the live site.
- **Publish:** make it public immediately.
- **Schedule:** set a future date/time and WordPress publishes it for you.
- **Visibility:** **Public**, **Private** (logged-in editors only), or
  **Password protected**.

## Revisions

WordPress automatically saves **revisions** as you edit. Open the revision
history to compare versions side by side and **restore** an earlier one — a
safety net if you change your mind.

> Status flow: a post moves from **Draft → (Pending Review) → Published**. You
> can switch a published post back to draft at any time to take it offline.`,
          quiz: {
            title: 'Publishing — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'How do you make a post go live automatically at a future date?',
                options: [
                  { text: 'Use Schedule and set a date/time', correct: true },
                  { text: 'Email it to WordPress' },
                  { text: 'Delete the draft' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which visibility option limits a post to people with a shared secret?',
                options: [
                  { text: 'Password protected', correct: true },
                  { text: 'Public' },
                  { text: 'Scheduled' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What do revisions let you do?',
                options: [
                  { text: 'Compare and restore earlier versions of your content', correct: true },
                  { text: 'Speed up your site' },
                  { text: 'Translate content automatically' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '4 · Organizing Content',
      lessons: [
        {
          title: 'Categories & Tags',
          durationMin: 8,
          content: `Posts are organized with two built-in **taxonomies**: categories and tags.

- **Categories** are broad groupings, and they're **hierarchical** — a category
  can have child sub-categories (e.g. *Recipes → Desserts*). Every post should
  have at least one; WordPress falls back to "Uncategorized".
- **Tags** are specific keywords, and they're **flat** (no hierarchy). A post
  about a chocolate cake might be tagged \`chocolate\`, \`baking\`, \`birthday\`.

| | Categories | Tags |
|---|---|---|
| Structure | Hierarchical (parent/child) | Flat |
| Quantity | A few broad buckets | Many specific keywords |
| Required? | Effectively yes (a default exists) | Optional |

> Think of categories as the **table of contents** and tags as the **index** at
> the back of a book.

Good organization helps visitors browse related content — and helps search
engines understand your site's structure.`,
          quiz: {
            title: 'Categories & Tags — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which is hierarchical (can have parent/child relationships)?',
                options: [
                  { text: 'Categories', correct: true },
                  { text: 'Tags' },
                  { text: 'Neither' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Tags are best described as…',
                options: [
                  { text: 'Flat, specific keywords', correct: true },
                  { text: 'Broad hierarchical buckets' },
                  { text: 'A type of theme' },
                ],
              },
              {
                type: 'TEXT',
                prompt:
                  'If you remove a post from every category, WordPress assigns it to which default category?',
                answer: 'Uncategorized',
              },
            ],
          },
        },
        {
          title: 'The Media Library',
          durationMin: 9,
          content: `The **Media Library** (Media menu) stores everything you upload — images, video,
audio, PDFs. You can upload there directly, or add media right inside a post via
an Image or Gallery block.

## Things that matter

- **Alt text:** a short text description of an image. It's read by screen readers
  and used by search engines — **always add it** for meaningful images.
- **Image sizes:** WordPress automatically creates several sizes (thumbnail,
  medium, large) from each upload so the right size is served in each spot.
- **Featured image:** a single representative image for a post or page (often
  shown at the top and in post listings). Set it in the editor's sidebar.

> Large images are the #1 cause of slow pages. **Resize and compress** before
> uploading — don't drop a 6000-pixel camera photo straight onto a page.

File names and alt text are also small SEO wins: descriptive \`red-bicycle.jpg\`
beats \`IMG_4821.jpg\`.`,
          quiz: {
            title: 'Media — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt:
                  'What is the term for the text description of an image used by screen readers and SEO? (two words)',
                answer: 'alt text',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What is a "featured image"?',
                options: [
                  {
                    text: 'A single representative image for a post, shown in listings and often at the top',
                    correct: true,
                  },
                  { text: 'An image that costs extra to use' },
                  { text: 'The site logo, set under Settings' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Why resize and compress images before uploading?',
                options: [
                  { text: 'Large images are a top cause of slow pages', correct: true },
                  { text: 'WordPress rejects images over 1 MB' },
                  { text: 'Alt text only works on small images' },
                ],
              },
            ],
          },
        },
        {
          title: 'Menus & Navigation',
          durationMin: 8,
          content: `Your **navigation menu** is how visitors move around your site. You build menus
yourself and decide exactly what they contain and in what order.

In a **block theme**, menus are edited with the **Navigation block** in the Site
Editor. In a **classic theme**, you use **Appearance → Menus**. Either way you
can add:

- **Pages** (About, Contact…)
- **Posts** and **Category** archives
- **Custom links** to any URL (internal or external)

Menus can be assigned to **locations** a theme provides — commonly a primary
header menu and a footer menu — and items can be **nested** to create dropdown
sub-menus.

> A clear, shallow menu (a handful of top-level items) helps both visitors and
> search engines understand what your site is about. Don't cram everything into
> the header.`,
          quiz: {
            title: 'Menus — quick check',
            questions: [
              {
                type: 'MULTIPLE_CHOICE',
                prompt: 'What can you add to a WordPress navigation menu? (select all that apply)',
                options: [
                  { text: 'Pages', correct: true },
                  { text: 'Category archives', correct: true },
                  { text: 'Custom links to any URL', correct: true },
                  { text: 'Other people’s passwords' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'In a classic theme, where do you build menus?',
                options: [
                  { text: 'Appearance → Menus', correct: true },
                  { text: 'Settings → Permalinks' },
                  { text: 'Tools → Import' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'How do you create a dropdown sub-menu?',
                options: [
                  { text: 'Nest menu items underneath a parent item', correct: true },
                  { text: 'Install a separate database' },
                  { text: 'Switch to WordPress.com' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '5 · Appearance & Themes',
      lessons: [
        {
          title: 'Understanding Themes',
          durationMin: 9,
          content: `A **theme** controls how your site **looks** — its layout, colors, fonts, and the
templates used for pages, posts, the header, and the footer. You can switch
themes without losing your content: your posts and pages stay put while the
"skin" changes.

## Two kinds of themes

- **Block themes** (the modern approach) support **full-site editing**: you edit
  the header, footer, and every template visually in the **Site Editor**, using
  blocks. The **Twenty Twenty-Four / Twenty Twenty-Five** default themes are
  block themes.
- **Classic themes** are configured through the **Customizer** and **widgets**,
  and rely on PHP template files. You'll still encounter many of these.

> Content lives in the database; **appearance** lives in the theme. That
> separation is why you can redesign a site without rewriting it.

Browse thousands of free, vetted themes in the official **WordPress.org theme
directory**, or install a premium theme you've purchased.`,
          quiz: {
            title: 'Themes — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does a theme primarily control?',
                options: [
                  {
                    text: "Your site's appearance — layout, colors, fonts, templates",
                    correct: true,
                  },
                  { text: 'Your database password' },
                  { text: 'Which posts are published' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'If you switch themes, what happens to your posts and pages?',
                options: [
                  { text: 'They stay — only the appearance changes', correct: true },
                  { text: 'They are permanently deleted' },
                  { text: 'They turn into plugins' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which kind of theme supports full-site editing in the Site Editor?',
                options: [
                  { text: 'Block themes', correct: true },
                  { text: 'Classic themes' },
                  { text: 'Parent-only themes' },
                ],
              },
            ],
          },
        },
        {
          title: 'Installing & Customizing Themes',
          durationMin: 9,
          content: `Go to **Appearance → Themes → Add New** to browse and install themes from the
WordPress.org directory, or upload a \`.zip\` you purchased. **Activate** a theme
to make it live; **Live Preview** lets you try before committing.

## Customizing

- **Block themes:** **Appearance → Editor** opens the **Site Editor**, where you
  change global **styles** (colors, typography) and edit **templates** and
  **template parts** (header, footer) with blocks.
- **Classic themes:** **Appearance → Customize** opens the **Customizer** for
  options like the site logo, colors, and menus, with a live preview.

## Add custom CSS (no theme files needed)

Small style tweaks can go in **Additional CSS** (in the Customizer / global
styles), which survives theme updates:

\`\`\`css
.site-title {
  letter-spacing: 1px;
  text-transform: uppercase;
}
\`\`\`

> For bigger code changes, don't edit the theme directly — you'd lose your work
> on the next update. Use a **child theme** instead (covered in the final module).`,
          quiz: {
            title: 'Customizing themes — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Where do you install a new theme?',
                options: [
                  { text: 'Appearance → Themes → Add New', correct: true },
                  { text: 'Settings → General' },
                  { text: 'Tools → Site Health' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'In a block theme, which tool edits global styles, templates, and template parts?',
                options: [
                  { text: 'The Site Editor (Appearance → Editor)', correct: true },
                  { text: 'The Media Library' },
                  { text: 'The Permalinks screen' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Why put small tweaks in "Additional CSS" instead of editing theme files?',
                options: [
                  { text: 'It survives theme updates', correct: true },
                  { text: 'It makes the site load slower on purpose' },
                  { text: 'CSS cannot be written in theme files' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '6 · Extending with Plugins',
      lessons: [
        {
          title: 'What Are Plugins?',
          durationMin: 8,
          content: `If themes change how your site **looks**, **plugins** change what it **does**.
A plugin is a self-contained add-on that bolts new **functionality** onto
WordPress — **without editing core files**.

Want a contact form, an online store, advanced SEO tools, an image gallery,
or multilingual content? There's a plugin for that. The official
**WordPress.org plugin directory** offers tens of thousands of free plugins,
and many premium plugins exist too.

\`\`\`text
Theme   → how the site looks
Plugin  → what the site can do
\`\`\`

> Because plugins add code that runs on your site, only install ones you need
> from sources you trust — quality and security vary. More on vetting shortly.

The plugin model is a big reason WordPress can be a blog, a shop, a forum, or a
membership site — all from the same core software.`,
          quiz: {
            title: 'Plugins intro — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt:
                  'A self-contained add-on that extends what WordPress can do, without editing core files, is called a ____ (singular).',
                answer: 'plugin',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What is the difference between a theme and a plugin?',
                options: [
                  {
                    text: 'A theme controls appearance; a plugin adds functionality',
                    correct: true,
                  },
                  { text: 'A theme adds functionality; a plugin controls appearance' },
                  { text: 'There is no difference' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Where can you find tens of thousands of free, vetted plugins?',
                options: [
                  { text: 'The official WordPress.org plugin directory', correct: true },
                  { text: 'The Settings → General screen' },
                  { text: 'The Media Library' },
                ],
              },
            ],
          },
        },
        {
          title: 'Essential Plugin Categories',
          durationMin: 9,
          content: `You don't need many plugins, but a few categories cover what most sites need.
Aim for **a handful of well-maintained plugins**, not dozens.

- **SEO** — tools to optimize titles, meta descriptions, and sitemaps
  (e.g. *Yoast SEO*, *Rank Math*).
- **Caching / performance** — generate static copies of pages to load faster
  (e.g. *WP Super Cache*, *W3 Total Cache*, *WP Rocket*).
- **Backups** — scheduled, off-site backups you can restore
  (e.g. *UpdraftPlus*, *Jetpack VaultPress*).
- **Security** — firewalls, login protection, malware scans
  (e.g. *Wordfence*, *Sucuri*).
- **Forms** — contact and other forms (e.g. *WPForms*, *Contact Form 7*).
- **Anti-spam** — **Akismet** filters spam comments and ships with WordPress.

> Each active plugin is more code to load and maintain. **Fewer, better
> plugins** beats a long list of overlapping ones.

Don't install all of these on day one — add a plugin when you have a real need
it solves.`,
          quiz: {
            title: 'Plugin categories — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt:
                  'Which anti-spam plugin ships bundled with WordPress to filter spam comments?',
                answer: 'Akismet',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'A caching plugin primarily helps with…',
                options: [
                  { text: 'Performance — making pages load faster', correct: true },
                  { text: 'Spelling and grammar' },
                  { text: 'Choosing a domain name' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What is the recommended approach to the number of plugins?',
                options: [
                  { text: 'A handful of well-maintained plugins you actually need', correct: true },
                  { text: 'As many as possible, for more features' },
                  { text: 'Exactly one plugin, never more' },
                ],
              },
            ],
          },
        },
        {
          title: 'Installing & Managing Plugins Safely',
          durationMin: 9,
          content: `Install plugins from **Plugins → Add New**: search the directory, click
**Install Now**, then **Activate**. To add a premium plugin, **Upload Plugin**
with its \`.zip\`.

## Vet before you install

From the directory listing, check:

- **Last updated** — avoid plugins untouched for a year or more.
- **Active installations** and **ratings** — popular, well-reviewed plugins are safer bets.
- **"Tested up to"** — confirms compatibility with your WordPress version.

## Keep them healthy

- **Update** plugins promptly — updates fix bugs and **security holes**.
- **Deactivate** to switch a plugin off while keeping its settings; **Delete** to
  remove it entirely. Deactivating alone still leaves the files on your site.
- Remove plugins you no longer use — less code means less risk and less to maintain.

> Outdated plugins are a leading cause of hacked WordPress sites. Treat updates as
> routine maintenance, and always have a backup before a big one.`,
          quiz: {
            title: 'Managing plugins — quick check',
            questions: [
              {
                type: 'MULTIPLE_CHOICE',
                prompt:
                  'Which signals help you judge whether a plugin is safe to install? (select all that apply)',
                options: [
                  { text: 'When it was last updated', correct: true },
                  { text: 'Number of active installations and ratings', correct: true },
                  { text: 'The "Tested up to" WordPress version', correct: true },
                  { text: 'The color of its icon' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What is the difference between deactivating and deleting a plugin?',
                options: [
                  {
                    text: 'Deactivating turns it off but keeps its files/settings; deleting removes it entirely',
                    correct: true,
                  },
                  { text: 'They are exactly the same' },
                  { text: 'Deleting only hides it from the menu' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Why update plugins promptly?',
                options: [
                  { text: 'Updates fix bugs and security vulnerabilities', correct: true },
                  { text: 'It changes your domain name' },
                  { text: 'It is required to log in' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '7 · Users, SEO & Security',
      lessons: [
        {
          title: 'User Roles & Capabilities',
          durationMin: 9,
          content: `WordPress has a built-in **roles** system so you can let others help without
handing over full control. Each role grants a set of **capabilities**.

| Role | Can do… |
|---|---|
| **Administrator** | Everything — settings, themes, plugins, and users |
| **Editor** | Publish and manage **all** posts/pages, including others' |
| **Author** | Publish and manage **their own** posts |
| **Contributor** | Write and manage their own drafts, but **cannot publish** |
| **Subscriber** | Manage their own profile and read content |

> Give each person the **least** privilege they need. Most contributors don't
> need to be administrators — and every extra admin is an extra security risk.

You manage people under **Users**, where you can add accounts, change roles, and
reset passwords. On a multi-author blog, the Editor and Author roles keep
publishing organized and safe.`,
          quiz: {
            title: 'User roles — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt:
                  'Which role has full control over the entire site, including settings and plugins?',
                answer: 'Administrator',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which role can write and edit their own posts but cannot publish them?',
                options: [
                  { text: 'Contributor', correct: true },
                  { text: 'Editor' },
                  { text: 'Administrator' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What is the difference between an Editor and an Author?',
                options: [
                  {
                    text: "An Editor manages everyone's posts; an Author manages only their own",
                    correct: true,
                  },
                  { text: 'An Author can install plugins; an Editor cannot' },
                  { text: 'There is no difference' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What principle should guide which role you assign someone?',
                options: [
                  { text: 'Least privilege — the minimum access they need', correct: true },
                  { text: 'Always grant Administrator to be safe' },
                  { text: 'Roles should be assigned at random' },
                ],
              },
            ],
          },
        },
        {
          title: 'SEO Basics',
          durationMin: 9,
          content: `**SEO** (Search Engine Optimization) helps people find your site through search
engines. WordPress is SEO-friendly out of the box, and a few habits go a long way.

- **Readable permalinks** — use the **Post name** structure (Module 2).
- **Good titles & meta descriptions** — a clear, compelling title and summary for
  each post; an SEO plugin (Yoast, Rank Math) makes these easy to edit.
- **Heading structure** — one main **H1**, then **H2/H3** sub-headings so the page
  is logically organized for readers and crawlers.
- **Image alt text** — describe images (also an accessibility win).
- **Internal links** — link between related posts to help discovery.
- **XML sitemap** — a machine-readable list of your pages for search engines.
  Modern WordPress generates one automatically (and SEO plugins enhance it).

> SEO isn't a trick — it's making your content clear, fast, and well-structured.
> Write for humans first; search engines reward the same things readers like.`,
          quiz: {
            title: 'SEO — quick check',
            questions: [
              {
                type: 'MULTIPLE_CHOICE',
                prompt: 'Which of these are good on-page SEO habits? (select all that apply)',
                options: [
                  { text: 'Readable, "Post name" permalinks', correct: true },
                  { text: 'Clear titles and meta descriptions', correct: true },
                  { text: 'Descriptive image alt text', correct: true },
                  { text: 'Hiding all your text in tiny gray font' },
                ],
              },
              {
                type: 'TEXT',
                prompt:
                  'What is the term (acronym) for optimizing a site to rank well in search engines?',
                answer: 'SEO',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What is an XML sitemap?',
                options: [
                  {
                    text: 'A machine-readable list of your pages that helps search engines crawl your site',
                    correct: true,
                  },
                  { text: 'A drawing of your office floor plan' },
                  { text: 'A type of backup file' },
                ],
              },
            ],
          },
        },
        {
          title: 'Security Essentials',
          durationMin: 9,
          content: `WordPress's popularity makes it a target, but most sites are compromised through
**avoidable** weaknesses. A handful of habits cover the basics.

- **Keep everything updated** — WordPress core, themes, and plugins. Outdated code
  is the **single most common** way sites get hacked.
- **Strong, unique passwords** and **two-factor authentication** for every account.
- **Least-privilege roles** — don't make everyone an administrator.
- **Use HTTPS** — install an SSL certificate (most hosts offer free ones) so
  traffic is encrypted; your address shows \`https://\`.
- **Limit login attempts** — slow down brute-force guessing (a security plugin can do this).
- **Take regular backups** — so you can recover quickly if the worst happens.

> Security is layered: no single step is enough, but together — updates, strong
> auth, HTTPS, least privilege, and backups — they stop the vast majority of attacks.

Consider a reputable security plugin (Wordfence, Sucuri) to add a firewall and
malware scanning on top of these fundamentals.`,
          quiz: {
            title: 'Security — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What is the single most common cause of hacked WordPress sites?',
                options: [
                  { text: 'Outdated core, themes, or plugins', correct: true },
                  { text: 'Using the block editor' },
                  { text: 'Having too few posts' },
                ],
              },
              {
                type: 'MULTIPLE_CHOICE',
                prompt: 'Which habits improve WordPress security? (select all that apply)',
                options: [
                  { text: 'Keeping core, themes, and plugins updated', correct: true },
                  { text: 'Strong passwords and two-factor authentication', correct: true },
                  { text: 'Serving the site over HTTPS', correct: true },
                  { text: 'Sharing one admin password with everyone' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does HTTPS provide for your site?',
                options: [
                  { text: 'Encrypted traffic between the visitor and your server', correct: true },
                  { text: 'Faster image editing' },
                  { text: 'Automatic blog post writing' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '8 · Maintenance & Performance',
      lessons: [
        {
          title: 'Backups & Updates',
          durationMin: 8,
          content: `A live site needs routine care. The two pillars are **backups** and **updates**.

## Backups

A backup is a saved copy of your **files** *and* your **database**. With a recent
backup you can recover from a bad update, a hack, or a host failure.

- Use a backup **plugin** (UpdraftPlus, Jetpack VaultPress) or your host's backup feature.
- Store copies **off-site** (cloud storage), not just on the same server.
- **Automate** them on a schedule, and occasionally **test** that a restore works.

## Updates

WordPress shows update notices for core, themes, and plugins. Keeping current is
both a **security** and a **stability** practice.

> **Golden rule:** take a **backup before any significant update**. If something
> breaks, you can roll back in minutes instead of scrambling.

For busy sites, many people test updates on a **staging** copy first, then apply
them to the live site once everything looks good.`,
          quiz: {
            title: 'Backups & updates — quick check',
            questions: [
              {
                type: 'MULTIPLE_CHOICE',
                prompt:
                  'A complete WordPress backup includes which of the following? (select all that apply)',
                options: [
                  { text: 'Your files', correct: true },
                  { text: 'Your database', correct: true },
                  { text: "Your visitors' browsers" },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What should you always do before a significant update?',
                options: [
                  { text: 'Take a backup', correct: true },
                  { text: 'Delete all your plugins' },
                  { text: 'Change your domain name' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Why store backups off-site (e.g. in cloud storage)?',
                options: [
                  {
                    text: 'If the server itself fails, an on-server backup could be lost too',
                    correct: true,
                  },
                  { text: 'Off-site backups load pages faster' },
                  { text: 'WordPress refuses on-server backups' },
                ],
              },
            ],
          },
        },
        {
          title: 'Performance & Caching',
          durationMin: 9,
          content: `A fast site keeps visitors happy and ranks better. Speed comes from a few
compounding improvements.

- **Caching** — store ready-made copies of pages so the server doesn't rebuild
  them on every visit. A **caching plugin** (WP Super Cache, W3 Total Cache,
  WP Rocket) is one of the biggest, easiest wins.
- **Optimize images** — resize and compress before uploading; consider modern
  formats like WebP. (Recall: big images are the top cause of slow pages.)
- **Use a CDN** — a Content Delivery Network serves your files from servers near
  each visitor, cutting load times globally.
- **Good hosting** — quality hosting and an up-to-date **PHP** version make a real
  difference; managed WordPress hosts tune the stack for you.
- **Lean plugins & theme** — every active plugin and heavy theme adds weight.

> Measure, don't guess: tools like the built-in **Site Health** screen and
> external speed tests show where the time actually goes.`,
          quiz: {
            title: 'Performance — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt:
                  'What technique stores ready-made copies of pages so the server need not rebuild them each visit? (one word)',
                answer: 'caching',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does a CDN (Content Delivery Network) do?',
                options: [
                  { text: 'Serves your files from servers close to each visitor', correct: true },
                  { text: 'Writes your blog posts for you' },
                  { text: 'Encrypts your passwords' },
                ],
              },
              {
                type: 'MULTIPLE_CHOICE',
                prompt: 'Which steps improve site performance? (select all that apply)',
                options: [
                  { text: 'Using a caching plugin', correct: true },
                  { text: 'Optimizing and compressing images', correct: true },
                  { text: 'Quality hosting with an up-to-date PHP version', correct: true },
                  { text: 'Installing as many plugins as possible' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '9 · Going Further: Customization',
      lessons: [
        {
          title: 'Where Custom Code Lives',
          durationMin: 10,
          content: `Eventually you may want to go beyond what themes and plugins offer. WordPress
has clear, safe places for custom code — and one big rule: **never edit core
WordPress files or a parent theme directly**, because updates overwrite them.

## The key files

- **\`wp-config.php\`** — your site's main configuration: database credentials,
  secret keys, table prefix, and debug settings. It lives at the WordPress root.
- **\`functions.php\`** — a theme file where you add custom PHP. To keep changes
  safe across updates, put it in a **child theme**.
- **Additional CSS** — for purely visual tweaks, no PHP needed (Module 5).

\`\`\`php
<?php
// wp-config.php — connection details + handy dev setting
define( 'DB_NAME', 'my_wordpress_db' );
define( 'DB_USER', 'db_user' );
define( 'DB_PASSWORD', 'super-secret' );
define( 'DB_HOST', 'localhost' );

$table_prefix = 'wp_';

// Show errors while developing (turn OFF on a live site)
define( 'WP_DEBUG', true );
\`\`\`

## Child themes

A **child theme** inherits everything from its parent but lets you override
styles and functions in your own files. Because your changes live in the child,
updating the parent theme **won't wipe them out**.

> Rule of thumb: visual tweak → Additional CSS; behavior/PHP → child theme's
> \`functions.php\`; configuration → \`wp-config.php\`. Never the core files.`,
          quiz: {
            title: 'Custom code — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt:
                  "What is the filename (with extension) of WordPress's main configuration file that stores database credentials?",
                answer: 'wp-config.php',
              },
              {
                type: 'TEXT',
                prompt:
                  'What is the filename (with extension) of the theme file where you add custom PHP functions?',
                answer: 'functions.php',
              },
              {
                type: 'TEXT',
                prompt:
                  'To customize a theme without losing changes when the parent updates, you create a ____ theme.',
                answer: 'child',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Why should you never edit core WordPress files directly?',
                options: [
                  { text: 'Updates overwrite them, erasing your changes', correct: true },
                  { text: 'Core files are encrypted and unreadable' },
                  { text: 'It instantly deletes your database' },
                ],
              },
            ],
          },
        },
        {
          title: 'Hooks & Shortcodes',
          durationMin: 11,
          content: `WordPress is extensible thanks to **hooks** — points where your code can plug in.
There are two kinds:

- **Actions** let you **run code** at a specific moment (e.g. when the footer is
  printed). You attach a function with \`add_action()\`.
- **Filters** let you **modify a value** before WordPress uses it (e.g. tweak post
  content before it's displayed). You attach a function with \`add_filter()\`.

\`\`\`php
<?php
// functions.php (in your child theme)

// An ACTION: run code when the footer renders.
add_action( 'wp_footer', function () {
    echo '<p>Built with WordPress.</p>';
} );

// A FILTER: append a note to the end of every post's content.
add_filter( 'the_content', function ( $content ) {
    return $content . '<p><em>Thanks for reading!</em></p>';
} );
\`\`\`

## Shortcodes

A **shortcode** is a small tag in square brackets that WordPress replaces with
dynamic output. Register one with \`add_shortcode()\`:

\`\`\`php
<?php
// Register [current_year]; outputs the year, e.g. 2026.
add_shortcode( 'current_year', function () {
    return date( 'Y' );
} );
\`\`\`

Now typing \`[current_year]\` in any post or page prints the current year.

> Actions *do* something, filters *change* something, and shortcodes *insert*
> something. Together they're how themes and plugins extend WordPress — and now
> you can read what they're doing.`,
          quiz: {
            title: 'Hooks & shortcodes — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What is the difference between an action and a filter?',
                options: [
                  {
                    text: 'An action runs code at a point; a filter modifies a value before it is used',
                    correct: true,
                  },
                  { text: 'An action modifies a value; a filter runs code at a point' },
                  { text: 'They are two names for the same thing' },
                ],
              },
              {
                type: 'TEXT',
                prompt:
                  'Which function registers a new shortcode? (just the function name, no parentheses)',
                answer: 'add_shortcode',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'Given the lesson’s example, what does typing `[current_year]` in a post output?',
                options: [
                  { text: 'The current year (e.g. 2026)', correct: true },
                  { text: 'The literal text [current_year]' },
                  { text: 'A list of all posts' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which function attaches your code to an action hook?',
                options: [
                  { text: 'add_action()', correct: true },
                  { text: 'add_filter()' },
                  { text: 'add_menu()' },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
};
