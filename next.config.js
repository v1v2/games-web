const withTM = require('next-transpile-modules')([
  //'@react-three/postprocessing'
])

module.exports = withTM({
  reactStrictMode: true,
  experimental: { esmExternals: 'loose', reactRoot: 'concurrent' },
})
