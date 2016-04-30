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
                deleteButtonClass: this._deleteButtonClass,
                joinButtonClass: this._joinButtonClass,
                game: {}
            };
        },
        _joinButtonClass: 'ui right floated teal icon button',
        _joinButtonLoadingClass: 'ui right floated teal icon loading button',
        _deleteButtonClass: 'ui right floated black icon button',
        _deleteButtonLoadingClass: 'ui right floated black icon loading button',
        _generateMembers: function() {
            var html = [];

            for( var i = 0; i < this.props.members.length; i++ )
                html.push( <div key={this.props.members[i].id} className="ui label">{this.props.members[i].name}</div> );

            return html;
        },
        _goToGame: function() {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { view: 'Game', game: this.state.game },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
        },
        _joinGame: function() {
            this.setState({ joinButtonClass: this._joinButtonLoadingClass });

            var self = this;
            Socket.joinGame( { id: this.props.id }, function( data ) {
                if( data ) { // Successfully joined game
                    self.setState({ game: data });
                    self._goToGame();
                    console.log( 'Success' );
                } else // Failure
                    console.log( 'Failure' );
            });
        },
        _deleteGame: function() {
            this.setState({ deleteButtonClass: this._deleteButtonLoadingClass });
            Socket.deleteGame( { id: this.props.id }, function( data ) {
                if( data ) // Successfully deleted game
                    console.log( 'Success' );
                else // Failure
                    console.log( 'Failure' );
            });
        },
        render: function() {
            return(
                <div className="Lobbyitem ui clearing segment">
                    <h2>{this.props.name}</h2>
                    <button className={this.state.joinButtonClass} onClick={this._joinGame}>Join Game</button>
                    <button className={this.state.deleteButtonClass} onClick={this._deleteGame}>Delete Game</button>
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
