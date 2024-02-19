import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploadComponent: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Create URL for the first image file
      const fileUrl = acceptedFiles[0]
        ? URL.createObjectURL(acceptedFiles[0])
        : null;
      setImage(fileUrl);
    },
  });

  useEffect(() => {
    // Cleanup URL object to avoid memory leaks
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ddd",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag 'n' drop an image here, or click to select an image</p>
        )}
      </div>
      {image ? (
        // Render the image using an <img> tag
        <div
          className="h-32 w-32"
          style={{ backgroundImage: `url(${image})`, backgroundSize: "cover" }}
        ></div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default ImageUploadComponent;
