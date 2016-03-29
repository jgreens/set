define(
[
    'react'
]
, function(
    React
) {

    var Bootstrap = {};

    Bootstrap.init = function() {
    };

    Bootstrap.Lobby = function() {
        React.render(
            <main className="ui page grid">
                <div className="row">
                    <div className="column">
                        <div class="bootstrap">
                        </div>
                    </div>
                </div>
            </main>
            , document.getElementsByClassName( 'react-container')[ 0 ]
        );
    };

    return Bootstrap;
});
