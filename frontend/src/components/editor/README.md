# Image Upload Functionality

This directory contains components for uploading images to AWS S3 via the backend API.

## Components

### ImageUploader

A reusable component that provides a button and dialog for uploading images.

```jsx
import ImageUploader from "./components/editor/ImageUploader";

// In your component
const MyComponent = () => {
  const handleImageUploaded = (imageUrl) => {
    console.log("Image uploaded:", imageUrl);
    // Do something with the image URL
  };

  return <ImageUploader onImageUploaded={handleImageUploaded} />;
};
```

### RichTextEditor

The rich text editor component has been enhanced to include image upload functionality.

```jsx
import RichTextEditor from "./components/editor/RichTextEditor";

// In your component
const MyComponent = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      // Other extensions...
    ],
    content: "<p>Initial content</p>",
  });

  return <RichTextEditor editor={editor} />;
};
```

## Custom Hook

### useImageUpload

A custom hook that provides image upload functionality.

```jsx
import useImageUpload from "./hooks/useImageUpload";

// In your component
const MyComponent = () => {
  const { uploadImage, isUploading, error, uploadedImageUrl, reset } =
    useImageUpload();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        console.log("Image uploaded:", imageUrl);
        // Do something with the image URL
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {isUploading && <p>Uploading...</p>}
      {error && <p>Error: {error}</p>}
      {uploadedImageUrl && <img src={uploadedImageUrl} alt="Uploaded" />}
    </div>
  );
};
```

## Backend Integration

The image upload functionality integrates with the backend API endpoint:

```
POST /api/questions/image
```

This endpoint requires authentication and expects a multipart/form-data request with an `image` field containing the image file.

## Environment Variables

The backend uses the following environment variables for AWS S3 configuration:

```
ACCESS_KEY=your-aws-access-key
SECRET_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
BUCKET_NAME=your-s3-bucket-name
```

These should be defined in the backend `.env` file.

## Testing

You can test the image upload functionality by visiting:

```
/test/image-upload
```

This page demonstrates both methods of using the image upload functionality:

1. Using the `ImageUploader` component
2. Using the `useImageUpload` hook directly
