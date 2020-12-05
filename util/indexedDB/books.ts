import { DB } from 'util/indexedDB/db';
import { PDFBook } from 'types';

export async function addBook(book: PDFBook) {
    // indexedDB is not supported on server side
    if (!process.browser) return;

    const db = await DB();

    db && db.add('books', book);
}

export async function getBook(id: number): Promise<PDFBook | null> {
    // indexedDB is not supported on server side
    if (!process.browser) return null;

    const db = await DB();

    if (!db) return null;

    const tx = db.transaction('books', 'readonly');
    const store = tx.objectStore('books');

    return store.get(id);
}

export async function getAllBooks(): Promise<PDFBook[]> {
    // indexedDB is not supported on server side
    if (!process.browser) return [];
    const db = await DB();

    return (db && db.getAllFromIndex('books', 'importedAt')) || [];
}
