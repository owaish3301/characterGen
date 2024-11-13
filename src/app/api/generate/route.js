import { Client } from "@gradio/client";
import { NextResponse } from "next/server";

export const maxDuration = 300; // Set max duration to 300 seconds for Vercel
export const dynamic = 'force-dynamic'; // Disable static optimization

export async function POST(req) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    const prompt = formData.get("prompt");
    const height = parseInt(formData.get("height"));
    const width = parseInt(formData.get("width"));

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 }
      );
    }

    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 280000); // 280 seconds
    });

    const client = await Client.connect("Kwai-Kolors/Kolors-Character-With-Flux");
    const resultPromise  = await client.predict("/character_gen", {
      prompt,
      person_img: image,
      seed: 0,
      randomize_seed: true,
      height,
      width,
    });
    const result = await Promise.race([resultPromise, timeoutPromise]);

    const imgBbBody = new FormData();
    imgBbBody.append('image', result.data[0].url)

    const requestOptions = {
        method: "POST",
        body: imgBbBody,
        redirect: "follow"
      };

    const imgResponsePromise = await fetch('https://api.imgbb.com/1/upload?key=646cdfd09de56f4b18f3803e5b2d400e', requestOptions);
    const imgResponse = await Promise.race([imgResponsePromise, timeoutPromise]);
    const imgData = await imgResponse.json();
    // console.log(imgData);
    const generatedImage = imgData.data.url


    return NextResponse.json({ 
      generatedImage: generatedImage,
      seed: result.data[1],
      response: result.data[2]
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}