define(
[
    'react',
    'jsx!components/Game/GameBoard'
]
, function(
    React,
    GameBoard
) {
    var Game = React.createClass({
        getInitialState: function() {
            return {
                cards: [ '0011', '1011', '2012', '0010', '1101', '1021',
                         '0022', '2222', '1010', '1001', '1111', '2000' ]
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
                            <GameBoard cards={this.state.cards} />
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Game;
});
