// src/app/api/imagekit/auth/route.ts
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

// Do not move this to a config file, it must be created on the server here.
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function GET(request: Request) {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error("Error getting ImageKit authentication parameters:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
