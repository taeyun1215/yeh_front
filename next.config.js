/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domain : ['yeh-bucket.s3.ap-northeast-2.amazonaws.com'],
    unoptimized : true
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