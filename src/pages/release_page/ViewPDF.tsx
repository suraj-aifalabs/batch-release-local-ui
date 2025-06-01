import React, { useState, useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import { Button } from '@/components/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import { Checkbox } from "@/components/ui/checkbox"
import axios from 'axios';
import { batchURL } from '@/services/apiCalls';

interface Props {
    username: string;
    email: string;
}

export function FillAndPreviewPDF({ username, email }: Props) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [signed, setSigned] = useState(false)
    const [displaySign, setDisplaySign] = useState(true)
    const [checkException, setException] = useState('')
    const [disableSign, setDisableSign] = useState(true)
    useEffect(() => {
        const fillPdf = async () => {
            const response = await axios.post(
                batchURL,
                { exception: checkException },
                { responseType: 'blob' }
            );

            const blob = new Blob([response.data], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        };

        fillPdf();

        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [checkException]);



    const handlePrint = async () => {
        navigator.geolocation.getCurrentPosition(async () => {
            let regionCode = "US";
            regionCode = typeof regionCode === 'string' ? regionCode?.toUpperCase() : "";

            if (!regionCode || "US" !== regionCode) {
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
        const response = await axios.post(
            batchURL,
            { username, email, exception: checkException },
            { responseType: 'blob' }
        );

        const blob = new Blob([response.data], { type: 'application/pdf' });
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
                <div className="h-[80vh] w-full max-w-[830px] border border-gray-300 overflow-hidden mb-3 flex justify-center ">
                    <p className='flex flex-col self-center'>Loading preview...</p>
                </div>
            )}
            {displaySign &&
                <div className='flex flex-col gap-2.5 m-1'>
                    <div className="flex  items-center space-x-2">
                        <Checkbox id="terms" checked={checkException === 'false'}
                            onCheckedChange={() => { setException('false'); setDisableSign(false) }} />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Release without Exception
                        </label>
                    </div>
                    <div className="flex  items-center space-x-2">
                        <Checkbox id="terms" checked={checkException === 'true'}
                            onCheckedChange={() => { setException('true'); setDisableSign(false) }} />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Release with Exception
                        </label>
                    </div>

                </div>}
            {displaySign &&
                <Button onClick={handleSign} disabled={disableSign}>Sign</Button>}

            {
                signed &&
                <Button onClick={handlePrint}>Print</Button>
            }


            <ToastContainer />
        </div >
    );
}