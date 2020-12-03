export type PDFBook = {
    title: string;
    numPages: number;
    pages: PDFPage[];
    metadata: PDFMetaData;
};

export type PDFPage = {
    /** Номер страницы **/
    pageNum: number;
    /** Текст страницы **/
    textContent: string;
    /** Синтезированный текст в виде Base64 **/
    synthesizedAudio: string | null;
};

export type PDFMetaData = {
    /** Имя книги **/
    title: string;
};
