import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ImageUpload({ value, onChange, accept = 'image/jpeg,image/png,image/webp', maxSize = 5 }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file) => {
        setError(null);
        
        // Validate file type
        const validTypes = accept.split(',');
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Please upload JPG, PNG, or WEBP.');
            return;
        }

        // Validate file size
        const maxSizeBytes = maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            setError(`File size exceeds ${maxSize}MB limit.`);
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('image', file);

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            const response = await fetch(route('admin.cms.banners.upload-image'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const data = await response.json();
            
            if (data.success) {
                onChange(data.url);
            } else {
                setError('Failed to upload image. Please try again.');
            }
        } catch (err) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleRemove = () => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            {value ? (
                // Preview mode
                <div className="relative group">
                    <div className="relative w-full h-64 bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700">
                        <img
                            src={value}
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Click the X button to remove this image</p>
                </div>
            ) : (
                // Upload mode
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDragging
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-800'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                            <p className="text-gray-300 font-medium">Uploading...</p>
                            <div className="w-48 h-2 bg-gray-700 rounded-full mt-3 overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-gray-500 text-sm mt-2">{uploadProgress}%</p>
                        </div>
                    ) : (
                        <>
                            <div className={`p-4 rounded-full mb-4 ${
                                isDragging ? 'bg-blue-500/20' : 'bg-gray-700'
                            }`}>
                                <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                            </div>
                            <p className="text-gray-300 font-medium mb-1">
                                {isDragging ? 'Drop your image here' : 'Upload banner image'}
                            </p>
                            <p className="text-gray-500 text-sm mb-4">
                                Drag & drop or click to browse
                            </p>
                            <p className="text-gray-600 text-xs">
                                Supports JPG, PNG, WEBP (max {maxSize}MB)
                            </p>
                        </>
                    )}
                </div>
            )}
            
            {error && (
                <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}
