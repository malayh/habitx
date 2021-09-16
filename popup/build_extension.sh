#!/bin/bash

export INLINE_RUNTIME_CHUNK=false
export GENERATE_SOURCEMAP=false

function build() {
    echo "Building react...";
    rm -rf ../static;
    
    react-scripts build && \
    mkdir ../static && \
    cp -r ./build/static/* ../static && \
    return 0 || return 1;
}

# function alter_dist() {
#     echo "Converting react app to chorme extension...";

#     # Convert src="/static/..." -> src="./static/...
#     sed -i -e 's/src="\//src=".\//g' ./dist/index.html;
    
#     # Convert href="/static/..." -> href="./static/...
#     sed -i -e 's/href="\//href=".\//g' ./dist/index.html;

# }

build
