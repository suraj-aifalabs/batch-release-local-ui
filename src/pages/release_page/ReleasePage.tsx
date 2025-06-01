import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { FillAndPreviewPDF } from './ViewPDF';
import { useLocation, useNavigate } from 'react-router-dom';

const ReleasePage = () => {
    const location = useLocation()
    const { username, email } = location.state || {}
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [view, setView] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (username === "") {

            navigate('/setting')
        }
    }, username)

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
                                username={username}
                                email={email}
                            />
                        </div>
                    )
                }

            </div >
        </div>
    )
}

export default ReleasePage
