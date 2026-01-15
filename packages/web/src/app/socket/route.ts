import { NextResponse } from "next/server"

export function GET(request: Request) {
  // Get the URL from the request to determine the correct socket URL
  const url = new URL(request.url)
  const protocol = url.protocol === 'https:' ? 'https:' : 'http:'
  const host = url.host
  
  // For production deployments, use the same URL as the web app
  const socketUrl = `${protocol}//${host}`
  
  return NextResponse.json({
    url: socketUrl,
  })
}

export const dynamic = "force-dynamic"
