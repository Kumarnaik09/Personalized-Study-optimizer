import React, { useState } from 'react';

export default function PdfUploader({ onUploadComplete }) {
    const [isHovering, setIsHovering] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleDragOver = (e) => { e.preventDefault(); setIsHovering(true); };
    const handleDragLeave = () => setIsHovering(false);

    const handleDrop = async (e) => {
        e.preventDefault(); setIsHovering(false);
        if (e.dataTransfer.files.length > 0) handleFileSelected(e.dataTransfer.files[0]);
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) handleFileSelected(e.target.files[0]);
    };

    const handleFileSelected = async (file) => {
        if (file.type !== 'application/pdf') { setError('Please upload a valid PDF file.'); return; }
        setError(''); setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('http://localhost:8000/api/upload-pdf', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Failed to parse PDF.');
            onUploadComplete(await res.json(), file.name);
        } catch (err) {
            setError('Upload failed. Make sure the backend server is running on port 8000.');
        } finally { setIsUploading(false); }
    };

    return (
        <div className="uploader-page">
            <div className="uploader-hero">
                <h1>Personalized Study Optimizer</h1>
                <p>Upload your study material PDF to auto-generate smart flashcards with mnemonics and a personalised assessment quiz.</p>
            </div>

            <div
                className={`drop-zone${isHovering ? ' hovering' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('pdf-upload').click()}
            >
                <input id="pdf-upload" type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />

                {isUploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="spinner" />
                        <p style={{ fontWeight: 600, color: 'var(--slate-700)', fontSize: '1.1rem' }}>Analysing PDF with AI…</p>
                    </div>
                ) : (
                    <>
                        <div className="drop-icon">☁️</div>
                        <h3>Drag &amp; Drop your PDF here</h3>
                        <p>or click to browse from your computer</p>
                        <span className="badge-fmt">📄 Supported format: .pdf</span>
                    </>
                )}
            </div>

            {error && <div className="error-box">{error}</div>}
        </div>
    );
}
