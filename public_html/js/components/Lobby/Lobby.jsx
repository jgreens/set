define(
[
    'react',
    'jsx!components/Lobby/LobbyItem',
]
, function(
    React,
    LobbyItem
) {
    var Lobby = React.createClass({
        _goToRegister: function( e ) {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { 'view': 'Register' },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
        },
        members: [{ id: 1, name: 'Jonny' }, { id: 2, name: 'Akshay' }],
        render: function() {
            return(
                <div className="Lobby ui grid container">
                    <div className="row">
                        <div className="column">
                            <div className="ui fluid vertical menu">
                                <LobbyItem key='1' name='Game1' members={this.members} />
                                <LobbyItem key='2' name='Game2' members={this.members} />
                                <LobbyItem key='3' name='Game3' members={this.members} />
                                <LobbyItem key='4' name='Game4' members={this.members} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Lobby;
});
