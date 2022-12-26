function showDraft(data) {
    const isDraft = data?.draft;
    const isFuture = data.page?.date > new Date();
    return !isDraft && !isFuture;
}

module.exports = function () {
    return {
        eleventyComputed: {
            eleventyExcludeFromCollections: function(data) {
                return showDraft(data) ? data.eleventyExcludeFromCollections : true;
            },
            permalink: function (data) {
                return showDraft(data) ? data.permalink : false;
            }
        }
    }
}