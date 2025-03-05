import { bcms } from '~/bcms-client';
import type { BlogEntry, BlogEntryMetaItem } from '~/bcms/types/ts';
import { EntryContentParsedItem } from '@thebcms/types';
import { ClientConfig } from '@thebcms/client';

export type BlogResponse = {
    item: {
        meta: BlogEntryMetaItem;
        content: EntryContentParsedItem[];
    };
    otherBlogs: BlogEntry[];
    bcms: ClientConfig;
    slugs: Record<string, string>; // All language slugs
};

export default defineEventHandler(async (event) => {
    const blogs = (await bcms.entry.getAll('blog')) as BlogEntry[];
    const slug = getRouterParam(event, 'slug');

    // Find the blog post regardless of language
    const blog = blogs.find((entry) =>
        Object.values(entry.meta).some((meta) => meta?.slug === slug)
    );

    if (!blog) {
        throw createError({ statusCode: 404, message: `Blog "${slug}" not found` });
    }

    // Collect all slugs for this post in different languages
    const slugs: Record<string, string> = {};
    Object.entries(blog.meta).forEach(([lang, meta]) => {
        if (meta?.slug) {
            slugs[lang] = meta.slug;
        }
    });

    // Default language (fallback)
    const defaultLang = 'en';
    const lang = getCookie(event, 'locale') || defaultLang;

    return {
        item: {
            meta: blog.meta[lang] as BlogEntryMetaItem,
            content: blog.content[lang] as EntryContentParsedItem[],
        },
        otherBlogs: blogs.filter((e) => e.meta[lang]?.slug !== slug),
        bcms: bcms.getConfig(),
        slugs, // Include all language slugs
    };
});
