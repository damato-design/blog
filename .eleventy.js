const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPairedShortcode('aside', (children, feedback = 'info') => `<aside data-density-shift role="note" data-feedback="${feedback}">
  
  ${children}
  
  </aside>`);

  eleventyConfig.addPassthroughCopy({"src/public/*.(css|jpg|png|svg|webmanifest|ico)": '/'});

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
