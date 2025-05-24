import React, { useEffect, useState, ChangeEvent } from 'react';
import { fetchGalleryImages, createGalleryImage, deleteGalleryImageById, uploadProductImage } from '../../integrations/supabase/admin';
import { useToast } from '../../hooks/use-toast';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      const imgs = await fetchGalleryImages();
      setImages(imgs);
    } catch (error) {
      toast({
        title: 'Error loading gallery images',
        description: error.message || 'Failed to load images',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select one or more images to upload.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileName = `gallery/${Date.now()}-${file.name}`;
        // Upload to storage
        const publicUrl = await uploadProductImage(file, fileName);
        // Save metadata to DB
        await createGalleryImage(publicUrl, file.name);
      }
      toast({
        title: 'Upload successful',
        description: `${selectedFiles.length} image(s) uploaded successfully.`,
      });
      setSelectedFiles(null);
      await loadGalleryImages();
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }
    try {
      await deleteGalleryImageById(id);
      toast({
        title: 'Image deleted',
        description: 'The image has been deleted successfully.',
      });
      await loadGalleryImages();
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gallery Manager</h1>

      <div className="mb-6">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="mb-2"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="px-4 py-2 bg-kimcom-600 text-white rounded hover:bg-kimcom-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="relative rounded-lg overflow-hidden shadow group">
            <img
              src={img.image_url}
              alt={img.alt_text || 'Gallery image'}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kimcom-800/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-white font-semibold">{img.alt_text || 'No description'}</span>
            </div>
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              title="Delete image"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
