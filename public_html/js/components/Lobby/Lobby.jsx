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
                self.setState({ 'users': data.users, 'games': data.games });
            });
        },
        componentWillUnmount: function() {
            Socket.endLobby(); // Clean up socket.io listener
        },
        componentDidMount: function() {
            $( '.pop' ).popup();
        },
        componentDidUpdate: function() {
            $( '.pop' ).popup();
        },
        _logout: function() {
            var self = this;
            Socket.logout( this.props.user, function( data ) {
                if( data ) // Successfully logged out 
                    self._goToLogin();
            });
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
                html.push( <LobbyItem key={this.state.games[i].id} id={this.state.games[i].id} name={this.state.games[i].name} members={this.state.games[i].members} started={this.state.games[i].started} finished={this.state.games[i].finished} /> );

            return html;
        },
        _generateMembers: function() {
            var html = [];

            if( typeof this.state.users == 'undefined' || this.state.users.length == 0 )
                return html;

            for( var i = 0; i < this.state.users.length; i++ ) {
                // Generating icon
                var seed = 0;
                var name = this.state.users[i];

                for( var j = 0; j < name.length; j++ )
                    seed += ( name.charCodeAt(j) * j * 37 );
                seed = seed.toString( 16 );
                var hash = '327b8763d4f0039dab25572ee873caaa';
                hash = hash.substring( 0, hash.length - seed.length ) + seed;
                var url = 'http://www.gravatar.com/avatar/' + hash + '?s=30&d=identicon&r=PG';

                html.push( <img src={url} className="ui pop avatar image" key={name} data-content={name} /> );
            }

            return html;
        },
        render: function() {
            return(
                <div className="Lobby ui grid container">
                    <div className="row">
                        <div className="six wide column">
                            <h1>Logged in as {this.props.user.name}</h1>
                        </div>
                        <div className="ten wide column" style={{ textAlign: 'right' }} >
                            {this._generateMembers()}
                        </div>
                    </div>
                    <div className="row" style={{ minHeight: '138px' }} >
                        <div className="column">
                            {this._generateItems()}
                        </div>
                    </div>
                    <div className="row">
                        <div className="column">
                            <button className="ui black right floated icon button" onClick={this._logout}>Log Out</button>
                            <CreateButton />
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Lobby;
});
