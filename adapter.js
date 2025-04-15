// Cloudflare Pages adapter for Next.js
module.exports = function() {
  return {
    name: 'cloudflare-pages-adapter',
    async setup(build) {
      build.onResolve({ filter: /^next\/dist\/server\/next-server$/ }, args => {
        return { path: require.resolve('next/dist/server/next-server') }
      })
    }
  }
}
