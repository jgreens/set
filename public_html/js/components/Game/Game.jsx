define(
[
    'react'
]
, function(
    React
) {
    var Game = React.createClass({
        getInitialState: function() {
            return {
            };
        },
        _goToLogin: function( e ) {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { 'view': 'Login' },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
        },
        render: function() {
            return(
                <div className="Game ui grid container">
                    <div className="row">
                        <div className="column">
                            <div className="ui three column grid">
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui fluid card">
                                        <div className="content">
                                            <span className="header">CARD</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Game;
});
