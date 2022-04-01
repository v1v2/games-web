const withTM = require('next-transpile-modules')([
  //'@react-three/postprocessing'
])

module.exports = withTM({
  reactStrictMode: true,
  experimental: { esmExternals: 'loose', reactRoot: 'concurrent' },
  rewrites: async () => [
    { source: '/platformer', destination: '/01-platformer/index.html' },
    { source: '/city', destination: '/02-city/index.html' },
  ],
})
