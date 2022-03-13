const withTM = require('next-transpile-modules')([
  '@babylonjs/core',
  '@babylonjs/gui',
  '@babylonjs/inspector',
  '@babylonjs/loaders',
  'react-babylonjs',
])

module.exports = withTM()

// Doesn't work, but it should be something like that in Next 12:
//
// const nextConfig = {
//   modern: true,
//   experimental: { esmExternals: true },
// }
//
// module.exports = nextConfig
