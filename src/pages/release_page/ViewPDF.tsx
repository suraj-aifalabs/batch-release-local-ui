import React, { useState, useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { saveAs } from 'file-saver';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import axios from 'axios';
import { generateFilledPDF } from './FileDownload';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ToastContainer, toast } from 'react-toastify';
interface Printer {
    name: string;
    [key: string]: any;
}

interface Props {
    data: {
        country: string;
        [key: string]: any;
    };
}

export function FillAndPreviewPDF({ data }: Props) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [print, setPrint] = useState<string>('Select');
    const [printerList, setPrinterList] = useState<Printer[]>([]);

    useEffect(() => {
        const fillPdf = async () => {
            const pdfBytes = await generateFilledPDF({ data });
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        };

        fillPdf();

        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [data]);

    // const handleDownload = async () => {
    //     const pdfBytes = await generateFilledPDF({ data });
    //     const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    //     saveAs(blob, 'filled-template.pdf');
    // };

    async function getRegionFromCoords(lat: number, lon: number): Promise<void> {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const geoData = await res.json();
            console.log("address", geoData.address)
            return geoData.address.country_code;
            console.log('Country:', geoData.address.country);
            console.log('Region/State:', geoData.address.state);
        } catch (err) {
            console.error('Error in getting region from coords', err);
        }
    }

    const getPrinterList = async () => {
        const lang = navigator.language || (navigator as any).userLanguage;
        const regionCode = lang.split('-')[1];

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            await getRegionFromCoords(latitude, longitude);
        });

        if (data.country !== regionCode) {
            setPrinterList([]);
        } else {
            try {
                const res = await axios.get(
                    `http://localhost:3003/getPrinters?country=${data.country}`
                );
                setPrinterList(res.data.data || []);
            } catch (error) {
                console.error('Failed to fetch printers:', error);
                setPrinterList([]);
            }
        }
    };

    useEffect(() => {
        if (open) {
            getPrinterList();
        }
    }, [open]);

    const handlePrint = async () => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            let regionCode = await getRegionFromCoords(latitude, longitude);
            regionCode = typeof regionCode === 'string' ? regionCode.toUpperCase() : undefined;

            console.log("countryCode", regionCode);
            console.log("data country", data.country);

            if (!regionCode || data.country?.toUpperCase() !== regionCode) {
                toast.error("Cannot Print");
            } else {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = pdfUrl;
                document.body.appendChild(iframe);

                iframe.onload = function () {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                };
            }
        }, (err) => {
            console.error("Geolocation error:", err);
            toast.error("Unable to determine location");
        });
    };

    // const handlePrinter = async () => {



    //     const pdfBytes = await generateFilledPDF({ data });
    //     const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    //     // Convert to base64 safely
    //     const toBase64 = (blob: Blob): Promise<string> => {
    //         return new Promise((resolve, reject) => {
    //             const reader = new FileReader();
    //             reader.onloadend = () => {
    //                 const base64data = (reader.result as string).split(',')[1]; // Remove the data URL prefix
    //                 resolve(base64data);
    //             };
    //             reader.onerror = reject;
    //             reader.readAsDataURL(blob);
    //         });
    //     };

    //     const base64 = await toBase64(blob);


    //     try {
    //         await axios.post('http://localhost:3003/print', {
    //             printerName: print,
    //             fileBase64: base64,
    //         });
    //     } catch (error) {
    //         console.error('Print failed:', error);
    //     }
    // };


    return (
        <div className="flex flex-col w-[800px] ">
            {pdfUrl ? (
                <div className="h-[90vh] w-full max-w-[830px] border border-gray-300 overflow-hidden mb-3">
                    <Worker workerUrl={pdfWorker}>
                        <Viewer fileUrl={pdfUrl} />
                    </Worker>
                </div>
            ) : (
                <p>Generating PDF preview...</p>
            )}

            <Button onClick={handlePrint}>Print</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-7xl h-[95vh] w-[150vw] p-0 flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="px-4 pt-4">Select Printer & Preview</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-grow border border-gray-300 overflow-hidden">
                        <div className="flex-grow">
                            <Worker workerUrl={pdfWorker}>
                                <Viewer fileUrl={pdfUrl ?? ''} />
                            </Worker>
                        </div>


                    </div>

                    <div className="flex flex-row items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <Label htmlFor="printer-select" className="p-2">Printers</Label>
                            <Select value={print} onValueChange={setPrint}>
                                <SelectTrigger id="printer-select" className="w-[200px]">
                                    <SelectValue placeholder="Select printer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {printerList.length > 0 ? (
                                        printerList.map((p) => (
                                            <SelectItem key={p.name} value={p.name}>
                                                {p.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <span>No Printers Availabel</span>

                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* <Button onClick={handlePrinter}>Print</Button> */}
                    </div>

                </DialogContent>
            </Dialog>
            <ToastContainer />
        </div>
    );
}