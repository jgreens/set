define(
[
    'react',
    'Socket',
    'jsx!components/Lobby/LobbyItem',
]
, function(
    React,
    Socket,
    LobbyItem
) {
    var Lobby = React.createClass({
        getInitialState: function() {
            return {
                'games': []
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
        _goToRegister: function( e ) {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { 'view': 'Register' },
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
                </div>
            );
        }
    });

    return Lobby;
});
