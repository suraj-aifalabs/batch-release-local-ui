import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { getPDF } from '@/services/apiService';
import CustomButton from '@/custom_components/CustomButton';

export function FillAndPreviewPDF() {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [signed, setSigned] = useState(false);
    const [displaySign, setDisplaySign] = useState(true);
    const [checkException, setCheckException] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fillPdf = async () => {

            setIsLoading(true);
            try {
                const blobData = await getPDF({ exception: checkException })

                const blob = new Blob([blobData], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            } catch (error) {
                console.error('Error loading PDF:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fillPdf();

        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [checkException]);

    const handlePrint = async () => {
        if (!pdfUrl) return;

        navigator.geolocation.getCurrentPosition(async () => {
            let regionCode = "US";
            regionCode = typeof regionCode === 'string' ? regionCode?.toUpperCase() : "";

            if (!regionCode || "US" !== regionCode) {
                console.error("Cannot Print");
            } else {
                const printWindow = window.open(pdfUrl, '_blank');
                if (printWindow) {
                    printWindow.onload = function () {
                        printWindow.focus();
                        printWindow.print();
                    };
                } else {
                    console.error("Popup blocked - please allow popups to print");
                }
            }
        }, (err) => {
            console.error("Geolocation error:", err);
        });
    };

    const handleSign = async () => {
        setIsLoading(true);
        try {
            const blobData = await getPDF({ exception: checkException, sign: true })

            const blob = new Blob([blobData], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            setSigned(true);
            setDisplaySign(false);
        } catch (error) {
            console.error('Error signing document:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-[800px]">
            {isLoading ? (
                <div className="h-[80vh] w-full max-w-[830px] border border-gray-300 overflow-hidden mb-3 flex justify-center items-center">
                    <p>Loading document...</p>
                </div>
            ) : pdfUrl ? (
                <div className="h-[80vh] w-full max-w-[830px] border border-gray-300 mb-3">
                    <iframe
                        src={pdfUrl}
                        width="100%"
                        height="100%"
                        title="PDF Preview"
                        style={{ border: 'none' }}
                    />
                </div>
            ) : (
                <div className="h-[80vh] w-full max-w-[830px] border border-gray-300 overflow-hidden mb-3 flex justify-center items-center">
                    <p>Select an option to preview document</p>
                </div>
            )}

            {displaySign && (
                <div className='flex flex-col gap-2.5 m-1'>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="no-exception"
                            checked={checkException === false}
                            onCheckedChange={() => {
                                setCheckException(false);
                            }}
                        />
                        <label
                            htmlFor="no-exception"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Release without Exception
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="with-exception"
                            checked={checkException === true}
                            onCheckedChange={() => {
                                setCheckException(true);
                            }}
                        />
                        <label
                            htmlFor="with-exception"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Release with Exception
                        </label>
                    </div>
                </div>
            )}

            {displaySign && (
                <CustomButton
                    type="default"
                    text={isLoading ? 'Signing...' : 'Sign'}
                    onClick={handleSign}
                    disabled={isLoading}
                    icon={<></>}
                >
                </CustomButton>
            )}

            {signed && (
                <CustomButton
                    type="default"
                    text='Print'
                    onClick={() => handlePrint()}
                    disabled={isLoading}
                    icon={<></>}
                >
                </CustomButton>
            )}
        </div>
    );
}