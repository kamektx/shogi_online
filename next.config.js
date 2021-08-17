const urlPrefix = "/shogi"

module.exports = {
  reactStrictMode: true,
  assetPrefix: urlPrefix,
  basePath: urlPrefix,
  trailingSlash: true,
  publicRuntimeConfig: { urlPrefix },  // ★コレ
}
