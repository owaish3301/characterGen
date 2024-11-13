"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [height, setHeight] = useState(768);
  const [width, setWidth] = useState(768);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("prompt", prompt);
      formData.append("height", height);
      formData.append("width", width);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 290000); // 290 seconds timeout


      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }
      // console.log(data)
      setGeneratedImage(data.generatedImage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">CloneYou</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Prompt
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border rounded p-2"
              required
              placeholder="Enter your prompt..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Height: {height}px
            </label>
            <input
              type="range"
              min="768"
              max="1024"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Width: {width}px
            </label>
            <input
              type="range"
              min="768"
              max="1024"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !image || !prompt}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>

        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {generatedImage && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Generated Image</h2>
            <div className="relative aspect-square w-full">
              <Image
                src={generatedImage}
                alt="Generated character"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}