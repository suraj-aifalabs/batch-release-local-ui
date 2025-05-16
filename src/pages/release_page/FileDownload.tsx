import { PDFDocument, StandardFonts } from 'pdf-lib';
import invoiceTemplate from './assets/InvoiceSimple-PDF-Template.pdf';
//import qaTemplate from '../../assets/qa certificate blank.pdf'


interface PDFData {
    patientName?: string;
    patientDOB?: string; // ISO string
    cquenceDIN?: string;
    cquenceOrderId?: string;
    patientWeight?: string;
    batchNumber?: string;
    coicBagId?: string;
    totalVolume?: string;
    productDose?: string;
    expirationDate?: string; // ISO string
    productNDC?: string;
    pccNumber?: string;
    nameAndAddress?: string;
    marketAuthorizationNumber?: string;
    country?: string;
    [key: string]: any; // allows extension for other keys
}

interface Point {
    key: keyof PDFData;
    x: number;
    y: number;
}

export async function generateFilledPDF({ data }: { data: PDFData }): Promise<Uint8Array> {
    const existingPdfBytes = await fetch('/TV-FRM-58719.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height } = firstPage.getSize();

    const points: Point[] = [
        { key: "patientName", x: 210, y: 187 },
        { key: "patientDOB", x: 210, y: 205 },
        { key: "cquenceDIN", x: 210, y: 220 },
        { key: "cquenceOrderId", x: 210, y: 237 },
        { key: "patientWeight", x: 210, y: 255 },
        { key: "batchNumber", x: 100, y: 315 },
        { key: "coicBagId", x: 215, y: 315 },
        { key: "totalVolume", x: 350, y: 315 },
        { key: "productDose", x: 450, y: 315 },
        { key: "expirationDate", x: 210, y: 335 },
        { key: "productNDC", x: 210, y: 365 },
        { key: "pccNumber", x: 210, y: 380 },
        { key: "nameAndAddress", x: 210, y: 420 },
        { key: "marketAuthorizationNumber", x: 210, y: 435 },
        { key: "country", x: 210, y: 450 }
    ];

    points.forEach(({ key, x, y }) => {
        const value = data[key];
        if (value) {
            let text = value;
            if (key === 'expirationDate' || key === 'patientDOB') {
                const date = new Date(value);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                text = `${day}/${month}/${year}`;
            }

            firstPage.drawText(text, {
                x,
                y: height - y,
                size: 7,
                font,
            });
        }
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}
