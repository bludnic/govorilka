import { TextContent } from 'pdfjs-dist';

export function convertPageContentToText(pageTextContent: TextContent): string {
    return pageTextContent.items.map((item) => item.str).join(' ');
}
