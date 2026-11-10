import sanitize from 'sanitize-html';

// Server-side cleaning for HTML that comes from the backend (question
// explanations, exam syllabi) and is rendered with dangerouslySetInnerHTML in
// Server Components. Keeps the formatting editors use; drops scripts, event
// handlers and javascript: URLs. Client Components that fetch in the browser
// use DOMPurify instead.
const OPTIONS: sanitize.IOptions = {
    allowedTags: [...sanitize.defaults.allowedTags, 'img', 'span', 'sup', 'sub', 'u', 's', 'del', 'ins', 'mark', 'small', 'font'],
    allowedAttributes: {
        '*': ['class', 'style', 'title', 'lang', 'dir'],
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'alt', 'width', 'height', 'loading'],
        td: ['colspan', 'rowspan', 'align'],
        th: ['colspan', 'rowspan', 'align', 'scope'],
        font: ['color', 'size', 'face'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
};

export function sanitizeHtml(html: string | null | undefined): string {
    return html ? sanitize(html, OPTIONS) : '';
}
