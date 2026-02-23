module.exports = function(eleventyConfig) {
  // Set input and output directories
  eleventyConfig.setUseGitIgnore(false);
  
  // Add current year filter
  eleventyConfig.addFilter("currentYear", () => {
    return new Date().getFullYear();
  });
  
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  
  // Set directories
  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};