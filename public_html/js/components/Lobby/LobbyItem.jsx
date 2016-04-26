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
                buttonClass: this._buttonClass
            };
        },
        _buttonClass: 'ui right floated black icon button',
        _buttonLoadingClass: 'ui right floated black icon loading button',
        _generateMembers: function() {
            var html = [];

            for( var i = 0; i < this.props.members.length; i++ )
                html.push( <div key={this.props.members[i].id} className="ui label">{this.props.members[i].name}</div> );

            return html;
        },
        _deleteGame: function() {
            this.setState({ buttonClass: this._buttonLoadingClass });
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
                    <button className="ui right floated green icon button">Join Game</button>
                    <button className={this.state.buttonClass} onClick={this._deleteGame}>Delete Game</button>
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
