import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import { FillAndPreviewPDF } from './ViewPDF';

const ReleasePage = () => {
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [view, setView] = useState(true)
    const qaData = {
        "_id": "670cb671eb96e6534cd889da",
        "stage": "ATLAS",
        "status": "Ready for Sign",
        "cequenceId_Hashed": "2119fdc4d0c0444318bfc5a7e8e2ac7c:351e4e7960f9a3a377a0e28e9ae103e5a4aa47f73cb2f7c1ff4f790409444edd9a7fab1b23a029faf789b11f115fa3ea",
        "patientName": "Sanjay",
        "patientDOB": "2024-10-14T06:13:05.105Z",
        "patientWeight": "78",
        "cquenceDIN": "DIN00777",
        "cquenceOrderId": "ORD15",
        "country": "IN",
        "coicBagId": "COIC883",
        "batchNumber": "B114AF",
        "createdAt": "2024-10-14T06:13:05.105Z",
        "updatedAt": "2024-10-14T06:14:55.512Z",
        "__v": 0,
        "pccNumber": "PCC8787",
        "totalVolume": "100",
        "productDose": "10mg",
        "marketAuthorizationNumber": "123564",
        "nameAndAddress": "David Laid Seattle WA 90878",
        "productNDC": "123",
        "expirationDate": "2024-10-14T06:13:05.105Z"
    }



    const handleViewPDF = () => {
        console.log("in handle view");
        setView(false)
        setShowPdfViewer(true);
    };
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
                {view &&
                    <Button onClick={handleViewPDF} style={{ width: '200px', display: 'flex', alignSelf: 'center', marginTop: '10px', justifyContent: 'center' }}>
                        View PDF
                    </Button>
                }
                {
                    showPdfViewer && (
                        <div style={{ display: 'flex', alignSelf: 'center', marginTop: '20px', justifyContent: 'center' }}>
                            <FillAndPreviewPDF

                                data={qaData}

                            />
                        </div>
                    )
                }

            </div >
        </div>
    )
}

export default ReleasePage
