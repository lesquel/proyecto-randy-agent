import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  // Static export so we can place the build inside Capacitor's web assets
  output: 'export',
  // Ensure trailingSlash false keeps relative paths simple inside WebView
  trailingSlash: false
}

export default nextConfig
