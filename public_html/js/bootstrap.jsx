define(
[
    'react',
    'jsx!ViewController'
]
, function(
    React,
    ViewController 
) {
    var Bootstrap = {
        init: function() {
            React.render(
                <main className="ui page grid">
                    <ViewController />
                </main>
                , document.getElementsByClassName( 'react-container')[ 0 ]
            );
        },
        
    };

    return Bootstrap;
});
