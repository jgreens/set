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
                scores: {},
                selected: {}
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
        _selectCards: function() {
            var cardManip = {};
            var self = this;
            cardManip.count = function() {
                var count = 0;

                for( var key in self.state.selected )
                    if( self.state.selected.hasOwnProperty( key ) )
                        count++;

                return count;
            };
            cardManip.add = function( card ) {
                // Only select if less than three cards currently selected
                if( cardManip.count() < 3 ) {
                    var selected = self.state.selected;
                    selected[card] = true;
                    self.setState({ selected: selected });

                    return true;
                }

                return false;
            };
            cardManip.remove = function( card ) {
                var selected = self.state.selected;
                delete selected[card];
                self.setState({ selected: selected });

                return true;
            };

            return cardManip;
        },
        render: function() {
            return(
                <div className="Game ui grid container">
                    <div className="row">
                        <div className="eight wide column">
                            <GameBoard cards={this.state.cards} selectCards={this._selectCards} />
                            <button className="huge fluid ui teal button" style={{marginTop: '25px'}}>SET</button>
                        </div>
                        <div className="two wide column">
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
