define(
[
    'react',
    'react-dom',
    'jsx!ViewController'
]
, function(
    React,
    ReactDOM,
    ViewController 
) {
    var Bootstrap = {
        init: function() {
            ReactDOM.render(
                <div className="bootstrap">
                    <ViewController />
                </div>
                , document.getElementsByClassName( 'react-container')[ 0 ]
            );
        },
        
    };

    return Bootstrap;
});
