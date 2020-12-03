import {PDFDocumentProxy} from 'pdfjs-dist';
import { PDFBook, PDFPage } from 'types';
import { convertDataURIToBinary, convertPageContentToText } from 'util/pdf';

let PDFJS: any = null;
if (process.browser) {
    PDFJS = require('pdfjs-dist');
    // PDFJS.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
    PDFJS.GlobalWorkerOptions.workerSrc = '/pdfjs/worker.js';
}

export async function convertPdfBase64ToBook(base64: string): Promise<PDFBook> {
    const loadingTask = PDFJS.getDocument(convertDataURIToBinary(base64));

    try {
        const pdfDocument: PDFDocumentProxy = await loadingTask.promise;
        const pdfMetatada: any = await pdfDocument.getMetadata(); // PDFMetadata не тот тип

        const pagesPromises: Promise<PDFPage>[] = Array(pdfDocument.numPages)
            .fill('')
            .map(async (v, pageIndex) => {
                const pageNum = pageIndex + 1;

                const pdfPage = await pdfDocument.getPage(pageNum);
                const pageTextContent = await pdfPage.getTextContent();

                return {
                    pageNum: pdfPage.pageNumber,
                    textContent: convertPageContentToText(pageTextContent),
                    synthesizedAudio: null,
                };
            });
        const pages = await Promise.all(
            (pagesPromises as unknown) as Promise<PDFPage>[],
        );

        return {
            title: 'Безымянная книга',
            numPages: pdfDocument.numPages,
            metadata: {
                title: pdfMetatada.info.Title,
            },
            pages,
        };
    } catch (reason: any) {
        console.log('Reason', reason);
        throw new Error(reason);
    }
}
