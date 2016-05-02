define(
[
    'react',
    'Socket',
    'jsx!components/Game/GameBoard',
    'jsx!components/Game/Feed',
    'jsx!components/Game/Scoreboard'
]
, function(
    React,
    Socket,
    GameBoard,
    Feed,
    Scoreboard
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
            Socket.startGame( { id: this.props.id }, function( data ) {
                console.log( 'GAME UPDATE' );
                self.setState( data );
            });
        },
        _endGameListener: function() {
            Socket.endGame( { user: this.props.user, id: this.props.id }, function() {
                // Return to lobby    
                console.log( 'RETURN TO LOBBY' );
            });
        },
        _submitSet: function() {
            var selected = [];

            for( var key in this.state.selected )
                if( this.state.selected.hasOwnProperty( key ) )
                    selected.push( key );

            if( selected.length != 3 )
                return false;

            Socket.submitSet({ id: this.props.id, set: selected }, function( data ) {
                console.log( 'SUCCESSFUL SET' );
            });
        },
        _goToLobby: function() {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { 'view': 'Lobby', 'user': this.props.user },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
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
                        <div className="nine wide column">
                            <GameBoard cards={this.state.cards} selectCards={this._selectCards} />
                            <button className="huge fluid ui teal button" style={{marginTop: '25px'}} onClick={this._submitSet}>SET</button>
                        </div>
                        <div className="seven wide column">
                            <Scoreboard scores={this.state.scores} user={this.props.user} />
                            <div className="ui grid">
                                <div className="eight wide column">
                                    <button className="fluid ui teal button">Start Game</button>
                                </div>
                                <div className="eight wide column">
                                    <button className="fluid ui black button" onClick={this._goToLobby}>Return to Lobby</button>
                                </div>
                            </div>
                            <Feed feed={this.state.feed} user={this.props.user} />
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Game;
});
