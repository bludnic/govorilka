export type PDFBook = {
    title: string;
    numPages: number;
    pages: PDFPage[];
    metadata: PDFMetaData;
    /** Дата импорта PDF файла **/
    importedAt: Date;
    /** Дата импорта в виде числа (timestamp) **/
    id: number;
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
