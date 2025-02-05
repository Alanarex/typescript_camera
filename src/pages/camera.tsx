import { useRef, useEffect, useState } from "react";

interface Photo {
  id: number;
  dataUrl: string;
}

const CameraComponent = () => {
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [nextId, setNextId] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = stream;
        videoPlayerRef.current.style.display = "block";
        console.log("Camera initialized");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (videoPlayerRef.current && context) {
      canvas.width = videoPlayerRef.current.videoWidth;
      canvas.height = videoPlayerRef.current.videoHeight;
      context.drawImage(
        videoPlayerRef.current,
        0,
        0,
        canvas.width,
        canvas.height
      );
      const imageDataURL = canvas.toDataURL("image/png");
      const newPhoto: Photo = { id: nextId, dataUrl: imageDataURL };
      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      setNextId(nextId + 1);

      // Save photos to localStorage
      localStorage.setItem("photos", JSON.stringify(updatedPhotos));
      localStorage.setItem("nextId", JSON.stringify(nextId + 1));

      // Show notification
      if (Notification.permission === "granted") {
        new Notification("Photo Taken", {
          body: `Photo ID: ${newPhoto.id}`,
          icon: imageDataURL,
        });
      }
      console.log("Photo captured and saved");
    }
  };

  const handleDelete = (id: number) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    setPhotos(updatedPhotos);
    localStorage.setItem("photos", JSON.stringify(updatedPhotos));
  };

  const handleClearAll = () => {
    setPhotos([]);
    localStorage.removeItem("photos");
    localStorage.removeItem("nextId");
  };

  useEffect(() => {
    initializeMedia();

    // Request notification permission
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Load photos from localStorage
    const savedPhotos = localStorage.getItem("photos");
    const savedNextId = localStorage.getItem("nextId");
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
      console.log("Photos loaded from localStorage");
    }
    if (savedNextId) {
      setNextId(JSON.parse(savedNextId));
      console.log("Next ID loaded from localStorage");
    }

    return () => {
      if (videoPlayerRef.current) {
        const stream = videoPlayerRef.current.srcObject as MediaStream;
        stream?.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  return (
    <>
      <button onClick={handleCapture}>Capture</button>
      <button onClick={handleClearAll} style={{ marginLeft: '10px' }}>Clear All</button>
      <video
        className="!w-full"
        ref={videoPlayerRef}
        id="player"
        autoPlay
        style={{ display: "block" }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ textAlign: 'center' }}>
            <img src={photo.dataUrl} alt={`Captured ${photo.id}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            <div>
              <button onClick={() => setSelectedPhoto(photo)}>Open</button>
              <button onClick={() => handleDelete(photo.id)} style={{ color: 'red', marginLeft: '5px' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {selectedPhoto && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedPhoto(null)}>&times;</span>
            <img src={selectedPhoto.dataUrl} alt={`Captured ${selectedPhoto.id}`} style={{ width: '100%' }} />
          </div>
        </div>
      )}
    </>
  );
};

export default CameraComponent;