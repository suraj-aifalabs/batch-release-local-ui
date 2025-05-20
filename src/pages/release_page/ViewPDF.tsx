import React, { useState, useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { saveAs } from 'file-saver';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import { generateFilledPDF } from './FileDownload';
import { Button } from '@/components/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import { Checkbox } from "@/components/ui/checkbox"

interface Printer {
    name: string;
    [key: string]: any;
}

interface Props {
    data: {
        country: string;
        [key: string]: any;
    };
    email: string;
    username: string;
}

export function FillAndPreviewPDF({ username, email, data }: Props) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [signed, setSigned] = useState(false)
    const [displaySign, setDisplaySign] = useState(true)
    const [checkException, setException] = useState('')
    useEffect(() => {
        const fillPdf = async () => {
            const mergedData = { ...data, username, email, signedBy: username, signedAt: new Date().toISOString(), exception: checkException };
            const pdfBytes = await generateFilledPDF({ data: mergedData });
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        };

        fillPdf();

        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [data, checkException]);


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



    const handlePrint = async () => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            let regionCode = await getRegionFromCoords(latitude, longitude);
            regionCode = typeof regionCode === 'string' ? regionCode.toUpperCase() : undefined;

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


    const handleSign = async () => {
        setSigned(true)
        setDisplaySign(false)

        const mergedData = { ...data, username, email, signedBy: username, signedAt: new Date().toISOString(), exception: checkException };
        const pdfBytes = await generateFilledPDF({ data: mergedData }); // 👈 wrap inside 'data'
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
    };

    return (
        <div className="flex flex-col w-[800px] ">
            {pdfUrl ? (
                <div className="h-[80vh] w-full max-w-[830px] border border-gray-300 overflow-hidden mb-3">
                    <Worker workerUrl={pdfWorker}>
                        <Viewer fileUrl={pdfUrl} />
                    </Worker>
                </div>
            ) : (
                <p>Generating PDF preview...</p>
            )}
            <div className='flex flex-col gap-2.5'>
                <div className="flex  items-center space-x-2">
                    <Checkbox id="terms" checked={checkException === 'false'}
                        onCheckedChange={() => setException('false')} />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Release without Exception
                    </label>
                </div>
                <div className="flex  items-center space-x-2">
                    <Checkbox id="terms" checked={checkException === 'true'}
                        onCheckedChange={() => setException('true')} />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Release with Exception
                    </label>
                </div>

            </div>
            {displaySign &&
                <Button onClick={handleSign}>Sign</Button>}

            {
                signed &&
                <Button onClick={handlePrint}>Print</Button>
            }


            <ToastContainer />
        </div >
    );
}