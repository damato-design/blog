const path = require('path');
const fs = require('fs');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");

const PREVIEW_DIR = path.resolve(__dirname, '_site', 'img');

const MAX_CHARS = 19;
const LINE_REGEX = new RegExp(`(?:\\b)[\\w\\s]{1,${MAX_CHARS}}(?:\\W|$)`, 'g');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addFilter('splitlines', (text) => text.match(LINE_REGEX) || []);

  eleventyConfig.addPairedShortcode('aside', (children, feedback = 'info') => `<aside data-density-shift role="note" data-feedback="${feedback}">
  
  ${children}
  
  </aside>`);

  eleventyConfig.addPassthroughCopy({"src/public/*.(css|jpg|png|svg|webmanifest|ico)": '/'});
  eleventyConfig.addPassthroughCopy({"src/posts/images/*.(jpg|png|svg)": '/posts/images'});
  
  eleventyConfig.on('afterBuild', transformPreviews);

  return {
    // When a passthrough file is modified, rebuild the pages:
    passthroughFileCopy: true,
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site'
    }
  };
};

function transformPreviews() {
  fs.readdir(PREVIEW_DIR, (err, files = []) => {
    for(const filename of files) {
      if (path.extname(filename) !== '.svg') break;
      Image(path.join(PREVIEW_DIR, filename), {
        formats: ["jpeg"],
        outputDir: PREVIEW_DIR,
        filenameFormat: () => path.format({ ...path.parse(filename), base: '', ext: '.jpeg' })
      })
    }
  })
}
