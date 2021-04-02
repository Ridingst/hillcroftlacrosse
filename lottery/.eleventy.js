
const production = process.env.PRODUCTION || false

if(!production){
  console.log('Not production so loading env variables from dotenv...')
  require('dotenv').config({ path: './.env.development' })
} else {
  console.log('Picking envs from .env.production')
  require('dotenv').config({ path: './.env.production' })
}

const now = String(Date.now())
const htmlmin = require('html-minifier')


module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false)

  eleventyConfig.addWatchTarget('./_tmp/style.css')

  eleventyConfig.addPassthroughCopy({ './_tmp/style.css': './style.css' })

  eleventyConfig.addPassthroughCopy({
    './node_modules/alpinejs/dist/alpine.js': './js/alpine.js',
    './node_modules/@kingshott/iodine/dist/iodine.min.js': './js/iodine.js'
  })

  // Copy `images/` to `_site/images`
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addShortcode('version', function () {
    return now
  })

  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith('.html')
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      })
      return minified
    }

    return content
  })
}
