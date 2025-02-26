import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTrash, faCamera } from '@fortawesome/free-solid-svg-icons';
import '../styles/Gallery.css'; // Import the CSS file for styling

const Gallery = () => {
    const navigate = useNavigate();
    const [photos, setPhotos] = useState<any[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        // Load photos from local storage or other storage
        const storedPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
        const photoData = storedPhotos.map((photoId: string) => JSON.parse(localStorage.getItem(photoId) || '{}'));
        setPhotos(photoData);
    }, []);

    const handlePhotoClick = (photo: any) => {
        setSelectedPhoto(photo);
        setShowModal(true);
    };

    const handleDeletePhoto = (photoId: string) => {
        const updatedPhotos = photos.filter(p => p.id !== photoId);
        setPhotos(updatedPhotos);
        localStorage.setItem('photos', JSON.stringify(updatedPhotos.map(p => p.id)));
        localStorage.removeItem(photoId);
        setShowModal(false);
    };

    const handleDeleteAllPhotos = () => {
        setPhotos([]);
        localStorage.removeItem('photos');
        photos.forEach(photo => localStorage.removeItem(photo.id));
        localStorage.removeItem('lastPhoto');
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="gallery-page">
            {photos.length === 0 ? (
                <p>No photos found.</p>
            ) : (
                <div className="photo-grid">
                    {photos.map(photo => (
                        <img
                            key={photo.id}
                            src={photo.dataUrl}
                            alt="Gallery"
                            className="photo-thumbnail"
                            onClick={() => handlePhotoClick(photo)}
                        />
                    ))}
                </div>
            )}
            <button className="delete-all-button" onClick={handleDeleteAllPhotos}>
                <FontAwesomeIcon icon={faTrash} /> Delete All Photos
            </button>
            <button className="back-to-camera-button" onClick={() => navigate('/camera')}>
                <FontAwesomeIcon icon={faCamera} /> Back to Camera
            </button>
            {showModal && selectedPhoto && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="info-delete-container">
                                <div className="info-button">
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <div className="tooltip">
                                        <p><strong>ID:</strong> {selectedPhoto.id}</p>
                                        <p><strong>City:</strong> {selectedPhoto.city}</p>
                                        <p><strong>Country:</strong> {selectedPhoto.country}</p>
                                        <p><strong>Longitude:</strong> {selectedPhoto.longitude}</p>
                                        <p><strong>Latitude:</strong> {selectedPhoto.latitude}</p>
                                        <p><strong>Hour:</strong> {selectedPhoto.hour}</p>
                                    </div>
                                </div>
                                <button className="delete-button" onClick={() => handleDeletePhoto(selectedPhoto.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                            <span className="close" onClick={handleCloseModal}>&times;</span>
                        </div>
                        <img src={selectedPhoto.dataUrl} alt="Selected" className="modal-photo" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
