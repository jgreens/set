require.config({
    paths: {
        'text': 'libs/text'
        , 'JSXTransformer': 'libs/JSXTransformer.mod'
        , 'jsx': 'libs/jsx'
        , 'react': 'libs/react'
        , 'director': 'libs/director.min'
        , 'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min'
        , 'firebase': '//cdn.firebase.com/js/client/2.1.0/firebase'
        , 'semantic': '../semantic-ui/dist/semantic.min'
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
    , 'firebase'
    , 'semantic'
]
, function(
    BootStrap
    , fbPlaceHolder
    , semanticPlaceHolder 
) {
    BootStrap.init();
});

