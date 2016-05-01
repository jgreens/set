define(
[
    'react',
    'Socket',
    'jsx!components/Game/GameBoard'
]
, function(
    React,
    Socket,
    GameBoard
) {
    var Game = React.createClass({
        getInitialState: function() {
            return {
                cards: [],
                feed: [],
                scores: {}
            };
        },
        componentWillMount: function() {
            this._startGameListener();
        },
        componentWillUnmount: function() {
            this._endGameListener();
        },
        _startGameListener: function() {
            // Receives game updates
            var self = this;
            Socket.startGame( function( data ) {
                console.log( 'GAME UPDATE' );
                self.setState( data );
            });
        },
        _endGameListener: function() {
            Socket.endGame( this.props.user, function() {
                // Return to lobby    
                console.log( 'RETURN TO LOBBY' );
            });
        },
        render: function() {
            return(
                <div className="Game ui grid container">
                    <div className="row">
                        <div className="ten wide column">
                            <GameBoard cards={this.state.cards} />
                        </div>
                        <div className="six wide column">
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Game;
});
