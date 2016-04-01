define(
[
    'react',
    'jsx!components/Login/Login'
]
, function(
    React,
    Login
) {

    var Bootstrap = {};

    Bootstrap.init = function() {
        React.render(
            <main className="ui page grid">
                <Login />
            </main>
            , document.getElementsByClassName( 'react-container')[ 0 ]
        );
    };

    return Bootstrap;
});
