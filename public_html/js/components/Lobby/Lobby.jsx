define(
[
    'react',
    'jquery',
    'Socket',
    'jsx!components/Lobby/LobbyItem',
    'jsx!components/Lobby/CreateButton',
]
, function(
    React,
    $,
    Socket,
    LobbyItem,
    CreateButton
) {
    var Lobby = React.createClass({
        getInitialState: function() {
            return {
                'games': [],
                'modalId': 'createGame'
            };
        },
        componentWillMount: function() {
            var self = this;
            Socket.startLobby( function( data ) {
                self.setState({ 'games': data });
            });
        },
        componentWillUnmount: function() {
            Socket.endLobby(); // Clean up socket.io listener
        },
        _goToLogin: function( e ) {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { 'view': 'Login' },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
        },
        _generateItems: function() {
            var html = [];
            for( var i = 0; i < this.state.games.length; i++ )
                html.push( <LobbyItem key={this.state.games[i].id} name={this.state.games[i].name} members={this.state.games[i].members} /> );

            return html;
        },
        members: [{ id: 1, name: 'Jonny' }, { id: 2, name: 'Akshay' }],
        render: function() {
            return(
                <div className="Lobby ui grid container">
                    <div className="row">
                        <div className="column">
                            <h1>Logged in as {this.props.user.name}</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column">
                            {this._generateItems()}
                        </div>
                    </div>
                    <div className="row">
                        <div className="column">
                            <button className="ui black icon button" onClick={this._goToLogin}>Log Out</button>
                            <CreateButton />
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Lobby;
});
