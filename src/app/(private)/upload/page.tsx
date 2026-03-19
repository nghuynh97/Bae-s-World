import { ImageUploader } from "@/components/upload/image-uploader";

export default function UploadPage() {
  return (
    <div className="py-8 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Upload Photos
        </h1>
        <p className="text-text-secondary mt-1">
          Test the upload pipeline
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-text-primary">
          Public Upload
        </h2>
        <ImageUploader bucket="public-images" folder="test" />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-text-primary">
          Private Upload
        </h2>
        <ImageUploader bucket="private-images" folder="test" />
      </section>
    </div>
  );
}
