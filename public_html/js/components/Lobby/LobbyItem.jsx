define(
[
    'react',
    'Socket'
]
, function(
    React,
    Socket
) {
    var LobbyItem = React.createClass({
        getInitialState: function() {
            return {
                joinButtonClass: this._joinButtonClass,
                game: {}
            };
        },
        _joinButtonClass: 'ui right floated teal icon button',
        _joinButtonLoadingClass: 'ui right floated teal icon loading button',
        _generateMembers: function() {
            var html = [];

            for( var i = 0; i < this.props.members.length; i++ )
                html.push( <div key={this.props.members[i].ClientId} className="ui label">{this.props.members[i].username}</div> );

            return html;
        },
        _goToGame: function( id ) {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { view: 'Game', id: this.props.id },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
        },
        _joinGame: function() {
            this.setState({ joinButtonClass: this._joinButtonLoadingClass });

            var self = this;
            Socket.joinGame( { id: this.props.id }, function( data ) {
                if( data ) { // Successfully joined game
                    self._goToGame( data.id );
                    console.log( 'Success' );
                } else { // Failure
                    console.log( 'Failure' );
                    this.setState({ joinButtonClass: this._joinButtonLoadingClass });
                }
            });
        },
        render: function() {
            return(
                <div className="Lobbyitem ui clearing segment">
                    <h2>{this.props.name}</h2>
                    <button className={this.state.joinButtonClass} onClick={this._joinGame}>Join Game</button>
                    <div className="extra">
                        Waiting:&nbsp;
                        {this._generateMembers()}
                    </div>
                </div>
            );
        }
    });

    return LobbyItem;
});
