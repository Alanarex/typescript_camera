import { useRef, useEffect, useState } from "react";

interface Photo {
  id: number;
  dataUrl: string;
}

const CameraComponent = () => {
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [nextId, setNextId] = useState(1);

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
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (videoPlayerRef.current && context && canvas) {
      context.drawImage(
        videoPlayerRef.current,
        0,
        0,
        canvas.width,
        videoPlayerRef.current.videoHeight /
          (videoPlayerRef.current.videoWidth / canvas.width)
      );
      const imageDataURL = canvas.toDataURL("image/png");
      const newPhoto: Photo = { id: nextId, dataUrl: imageDataURL };
      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      setNextId(nextId + 1);

      // Save photos to localStorage
      localStorage.setItem("photos", JSON.stringify(updatedPhotos));
      localStorage.setItem("nextId", JSON.stringify(nextId + 1));

      canvas.style.display = "block";

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
      <video
        className="!w-full"
        ref={videoPlayerRef}
        id="player"
        autoPlay
        style={{ display: "block" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div>
        {photos.map((photo) => (
          <img key={photo.id} src={photo.dataUrl} alt={`Captured ${photo.id}`} />
        ))}
      </div>
    </>
  );
};

export default CameraComponent;