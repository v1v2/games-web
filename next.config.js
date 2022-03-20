const withTM = require('next-transpile-modules')(['@react-three/postprocessing'])

module.exports = withTM({ experimental: { esmExternals: 'loose' } })
