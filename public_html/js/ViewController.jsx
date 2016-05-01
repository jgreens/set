define(
[
    'react',
    'jsx!components/Login/Login',
    'jsx!components/Register/Register',
    'jsx!components/Lobby/Lobby',
    'jsx!components/Game/Game'
]
, function(
    React,
    Login,
    Register,
    Lobby,
    Game
) {
    var ViewController = React.createClass({
        getInitialState: function() {
            return {
                'view': 'Login',
                'user': {
                    'id': -1,
                    'name': ''
                },
                'game': {}
            };
        },
        componentWillMount: function() {
            window.addEventListener( 'ViewController', this._updateView, false );
        },
        _updateView: function( e ) {
            var currState = this.state;

            currState.view = e.detail.view;
            if( e.detail.user )
                currState.user = e.detail.user;
            if( e.detail.game )
                currState.game = e.detail.game;

            this.setState( currState );
        },
        _getView: function() {
            var view = [];

            switch( this.state.view ) {
                case 'Login':
                    view.push( <Login key="Login" /> );
                    break;
                case 'Register':
                    view.push( <Register key="Register" /> );
                    break;
                case 'Lobby':
                    view.push( <Lobby key="Lobby" user={this.state.user} /> );
                    break;
                case 'Game':
                    view.push( <Game key="Game" user={this.state.user} game={this.state.game} /> );
                    break;
                default:
                    break;
            }

            return view;
        },
        render: function() {
            return(
                <div className="ViewController">
                    {this._getView()}
                </div>
            );
        }
    });

    return ViewController;
});
