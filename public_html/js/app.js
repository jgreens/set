require.config({
    paths: {
        'text': 'libs/text'
        , 'JSXTransformer': 'libs/JSXTransformer.mod'
        , 'jsx': 'libs/jsx'
        , 'react': 'libs/react'
        , 'react-dom': 'libs/react-dom'
        , 'director': 'libs/director.min'
        , 'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min'
        , 'semantic': '../semantic-ui/dist/semantic.min'
        , 'semantic-form': '../semantic-ui/dist/components/form.min'
    }
    , shim: {
        'JSXTransformer': {
            exports: 'JSXTransformer'
        }
        , 'jsx': [ 'text' ]
        , 'semantic': {
            deps: [
                'jquery'
            ]
        }
    }
    , jsx: {
        fileExtension: '.jsx'
    }
});

require(
[
    'jsx!bootstrap'
    , 'semantic'
]
, function(
    Bootstrap
    , semanticPlaceHolder 
) {
    Bootstrap.init();
});
