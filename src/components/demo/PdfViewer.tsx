import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core'; 
import '@react-pdf-viewer/core/lib/styles/index.css'; 
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const PdfViewer = ({pdfFileUrl}:any) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
        <div>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={pdfFileUrl}
                // plugins={[defaultLayoutPluginInstance]} 
                />
            </Worker>
        </div>
    );
};

export default PdfViewer;


const PdfViewerWithToolbar = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const pdfFileUrl = 'https://example.com/sample.pdf';

    return (
        <div style={{ height: '100vh' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                <Viewer 
                    fileUrl={pdfFileUrl} 
                    plugins={[defaultLayoutPluginInstance]} 
                />
            </Worker>
        </div>
    );
};

