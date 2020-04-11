define(
[
    'react',
    'Socket',
    'jsx!components/Title/Title',
    'jsx!components/Lobby/Lobby',
    'jsx!components/Game/Game'
]
, function(
    React,
    Socket,
    Title,
    Lobby,
    Game
) {
    var ViewController = React.createClass({
        getInitialState: function() {
            return {
                'view': 'Title',
                'user': {
                    'id': -1,
                    'name': ''
                },
                'game': {}
            };
        },
        componentWillMount: function() {
            // On disconnect
            Socket.listenForError( function() {
                window.location.reload();
            });
            window.addEventListener( 'ViewController', this._updateView, false );
        },
        _updateView: function( e ) {
            var currState = this.state;

            currState.view = e.detail.view;
            if( e.detail.user )
                currState.user = e.detail.user;
            if( e.detail.id )
                currState.id = e.detail.id;

            this.setState( currState );
        },
        _getView: function() {
            var view = [];

            switch( this.state.view ) {
                case 'Title':
                    view.push( <Title key="Title" /> );
                    break;
                case 'Lobby':
                    view.push( <Lobby key="Lobby" user={this.state.user} /> );
                    break;
                case 'Game':
                    view.push( <Game key="Game" user={this.state.user} id={this.state.id} /> );
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
