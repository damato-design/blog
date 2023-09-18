const fs = require('fs');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const PostCSSPlugin = require("eleventy-plugin-postcss");
const EleventyPluginOgImage = require('eleventy-plugin-og-image');
const externalLinks = require('eleventy-plugin-external-links');
const readingTime = require('reading-time');
const slug = require('slug');
const pluginMermaid = require("@kevingimbel/eleventy-plugin-mermaid");

const MAX_CHARS = 19;
const LINE_REGEX = new RegExp(`(?:\\b)['\\w\\s]{1,${MAX_CHARS}}(?:[^'\\w]|$)`, 'g');

function getShuffledIndicies(text) {
  return text
    .split('')
    .map((ch, i) => ch.trim() ? i : null)
    .filter((i) => typeof i === 'number')
    .sort(() => 0.5 - Math.random());
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(PostCSSPlugin);
  eleventyConfig.addPlugin(externalLinks);
  eleventyConfig.addPlugin(pluginMermaid);
  eleventyConfig.addPlugin(EleventyPluginOgImage, {
    getOutputFileSlug: ({ context }) => {
      return context?.page?.fileSlug || 'index';
    },
    satoriOptions: {
      fonts: [
        {
          name: 'Oooh Baby',
          data: fs.readFileSync('src/OoohBaby-Regular.ttf'),
          weight: 400,
          style: 'normal',
        },
      ],
    },
  });

  eleventyConfig.addFilter('splitlines', (text) => text.match(LINE_REGEX) || []);
  eleventyConfig.addFilter('readtime', (text) => {
    const {minutes} = readingTime(text);
    return `${Math.floor(minutes)} minute read`;
  });

  eleventyConfig.addFilter('slug', (text) => text && slug(text));
  eleventyConfig.addFilter('split', (text) => {
    const [first, second] = getShuffledIndicies(text);
    return text.split('').map((ch, i) => {
      const target = [first, second].includes(i) ? ` style="--n: ${i}"` : '';
      return `<span aria-hidden="true" ${target}>${ch}</span>`;
    }).join('');
  });

  eleventyConfig.addPairedShortcode('aside', (children, feedback = 'info') => `<aside data-density-shift role="note" data-feedback="${feedback}">
  <div class="aside-content">
  
  ${children}

  </div>
  </aside>`);

  eleventyConfig.addPairedShortcode('quote', (children, cite, display) => `<figure class="fig-quote">
  <blockquote cite="${cite}">
  
  ${children}

  </blockquote>
  <figcaption data-density-shift>
  — <a href="${cite}"><cite>${display || cite}</cite></a>
  </figcaption>
  </figure>`);

  eleventyConfig.addPassthroughCopy({"src/public/*": "/"});
  eleventyConfig.addPassthroughCopy({"src/posts/images/*.(jpg|png|svg)": '/posts/images'});
  

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
