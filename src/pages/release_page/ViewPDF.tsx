import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { getPDF } from '@/services/apiService';
import CustomButton from '@/custom_components/CustomButton';

const ViewPdf = ({ batchNumber = "" }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [signed, setSigned] = useState(false);
    const [displaySign, setDisplaySign] = useState(true);
    const [checkException, setCheckException] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fillPdf = async () => {

            setIsLoading(true);
            try {
                const blobData = await getPDF({ batchNumber, exception: checkException, sign: false })

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

        const printWindow = window.open(pdfUrl);
        if (printWindow) {
            printWindow.onload = function () {
                printWindow.focus();
                printWindow.print();
            };
        } else {
            console.error("Popup blocked - please allow popups to print");
        }
    };

    const handleSign = async () => {
        setIsLoading(true);
        try {
            const blobData = await getPDF({ batchNumber, exception: checkException, sign: true })

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
        <div className="flex h-full flex-col w-[800px]">
            <div className="">
                {isLoading ? (
                    <p>Loading document...</p>
                ) : (
                    <div className="h-[440px]">
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="440px"
                            title="PDF Preview"
                            style={{ border: 'none' }}
                        />
                    </div>
                )}
            </div>


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
                    className='w-32'
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
                    className='w-32'
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

export default ViewPdf;