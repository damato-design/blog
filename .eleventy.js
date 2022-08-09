const path = require('path');
const fs = require('fs');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");
const externalLinks = require('eleventy-plugin-external-links');
const readingTime = require('reading-time');
const slug = require('slug');
const pluginMermaid = require("@kevingimbel/eleventy-plugin-mermaid");

const PREVIEW_DIR = path.resolve(__dirname, '_site', 'img');

const MAX_CHARS = 19;
const LINE_REGEX = new RegExp(`(?:\\b)['\\w\\s]{1,${MAX_CHARS}}(?:[^'\\w]|$)`, 'g');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(externalLinks);
  eleventyConfig.addPlugin(pluginMermaid);
  eleventyConfig.addFilter('splitlines', (text) => text.match(LINE_REGEX) || []);
  eleventyConfig.addFilter('readtime', (text) => {
    const {minutes} = readingTime(text);
    return `${Math.floor(minutes)} min read`;
  });

  eleventyConfig.addFilter('slug', (text) => slug(text));

  eleventyConfig.addPairedShortcode('aside', (children, feedback = 'info') => `<aside data-density-shift role="note" data-feedback="${feedback}">
  
  ${children}
  
  </aside>`);

  eleventyConfig.addPairedShortcode('quote', (children, cite, display) => `<figure class="fig-quote">
  <blockquote cite="${cite}">
  
  ${children}

  </blockquote>
  <figcaption data-density-shift>
  — <a href="${cite}"><cite>${display || cite}</cite></a>
  </figcaption>
  </figure>`);

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
