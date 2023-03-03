/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['yeh-bucket.s3.ap-northeast-2.amazonaws.com']
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/main",
        permanent: false
      }
    ]
  }
}

module.exports = nextConfig