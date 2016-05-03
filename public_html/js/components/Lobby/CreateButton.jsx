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
            // Make sure it's not empty
            if( this.state.name == '' )
                return false;

            var self = this;
            Socket.createGame( { name: this.state.name }, function( data ) {
                if( data ) // Successfully created game
                    self._goToGame( data.id );
                else // Failure
                    console.log( 'Failure' );
            });
        },
        _enterCall: function( e ) {
            // Call click on enter
            if( e.keyCode == 13 )
                this._createGame();
        },
        _goToGame: function( id ) {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { view: 'Game', id: id },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
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
                    <input type="text" name="name" value={this.state.name} placeholder="Game Name" onKeyDown={this._enterCall} onChange={this._inputChange}></input>
                </div>
            );
        }
    });

    return CreateButton;
});
