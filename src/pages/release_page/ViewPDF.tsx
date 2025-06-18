import { useState, useEffect } from 'react';
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
    const handlePrint = async () => {
        if (!pdfUrl || !signed) return;
        
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'absolute';
        printFrame.style.top = '-1000px';
        printFrame.style.left = '-1000px';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = 'none';
        
        document.body.appendChild(printFrame);
        
        printFrame.onload = function() {
                try {
                    printFrame.contentWindow?.focus();
                    printFrame.contentWindow?.print();
                    
                    const cleanup = () => {
                        if (document.body.contains(printFrame)) {
                            document.body.removeChild(printFrame);
                        }
                    };
                    
                    if (printFrame.contentWindow) {
                        printFrame.contentWindow.onafterprint = cleanup;
                    }
                } catch (error) {
                    console.error('Print error:', error);
                    if (document.body.contains(printFrame)) {
                        document.body.removeChild(printFrame);
                    }
                }
        };
        
        printFrame.src = pdfUrl;
    };

    const handleRelease = async () => {
        if (!signed) return;
        
        console.log('Document released');
    };
 
    return (
        <div className="flex h-[100%] flex-col justify-between gap-6 w-[800px]">
            <div className="h-[450px]">
                {isLoading ? (
                    <div className="h-[500px] flex justify-center items-center border">
                        <p>Loading document...</p>
                    </div>
                ) : (
                    <div className="h-[440px]">
                        <iframe
                            src={`${pdfUrl}#toolbar=0&navpanes=0`}
                            width="100%"
                            height="500px"
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
            
            <div className="flex gap-4">
                {displaySign && (
                    <CustomButton
                        className='w-32'
                        type="default"
                        text={'Sign'}
                        onClick={handleSign}
                        disabled={isLoading}
                        icon={<></>}
                    />
                )}
                
                <CustomButton
                    className='w-32'
                    type="default"
                    text='Print'
                    onClick={handlePrint}
                    disabled={!signed || isLoading}
                    icon={<></>}
                />
                
                <CustomButton
                    className='w-32'
                    type="default"
                    text='Release'
                    onClick={handleRelease}
                    disabled={!signed || isLoading}
                    icon={<></>}
                />
            </div>
        </div>
    );
}
 
export default ViewPdf;