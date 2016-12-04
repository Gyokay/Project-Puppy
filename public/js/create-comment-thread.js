$(function() {
    const minCommentLength = 1,
        maxCommentLength = 300,
        msgError = 'The {0} must be between {1} and {2} characters long!',
        errorHtmlTag = '<p class=\'error alert\'>{0}</p>';

    let errors = [];

    $('#submitComment').submit(function(e) {
        // Get value
        let comment = $('#commentInput').val();

        // Remove errors if any
        $('.error').remove();

        // Validate on submit
        validateLength(minCommentLength, maxCommentLength, comment.length, 'Comment');

        // Show errors
        if (Array.from(errors).length > 0) {
            e.preventDefault();

            errors.forEach(function(error) {
                $('.pageTitle').after(stringFormat(errorHtmlTag, [error]));
            });

            errors = [];
        }
    });

    // Helper functions
    function validateLength(minLen, maxLen, val, elementName) {
        if ((maxLen < val) || (val < minLen)) {
            errors.push(stringFormat(msgError, [elementName, minLen, maxLen]));
        }
    }

    function stringFormat(source, params) {
        $.each(params, function(i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    }
});