define(
[
    'react',
    'Socket'
]
, function(
    React,
    Socket
) {
    var CreateButton = React.createClass({
        getInitialState: function() {
            return {
                'name': ''
            };
        },
        _createGame: function() {
            console.log( this.state.name );
            Socket.createGame( { name: this.state.name }, function( data ) {
                if( data ) // Successfully created game
                    console.log( 'Success' );
                else // Failure
                    console.log( 'Failure' );
            });
        },
        _inputChange: function( e ) {
            var update = {};
            update[ e.target.name ] = e.target.value;
            this.setState( update );
        },
        render: function() {
            return(
                <div className="CreateButton ui left action input">
                    <button className="ui teal labeled icon button" onClick={this._createGame}><i className="plus icon"></i>Create Game</button>
                    <input type="text" name="name" placeholder="Game Name" onChange={this._inputChange}></input>
                </div>
            );
        }
    });

    return CreateButton;
});
