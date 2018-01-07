#!/bin/bash -xe
# See http://tldp.org/LDP/abs/html/options.html
# -x -> Print each command to stdout before executing it, expand commands
# -e -> Abort script at first error, when a command exits with non-zero status
#   (except in until or while loops, if-tests, list constructs)

if ! hash gh-pages 2> /dev/null; then
    yarn global add gh-pages
fi

gh-pages --add \
    --dist . \
    --src "{browser/*,docs/*}" \
    --repo "https://$GH_TOKEN@github.com/booleanapp/elastic-muto.git" \
    --message "docs: Build docs for $(npm run -s print-version)"

