import ViewPdf from './ViewPdf';

const ReleasePage = () => {

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignSelf: 'center', marginTop: '20px', justifyContent: 'center' }}>
                    <ViewPdf />
                </div>
            </div >
        </div>
    )
}

export default ReleasePage
