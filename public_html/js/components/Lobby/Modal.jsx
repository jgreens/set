define(
[
    'react',
    'Socket'
]
, function(
    React,
    Socket
) {
    var Modal = React.createClass({
        getInitialState: function() {
            return {
                'name': ''
            };
        },
        componentDidMount: function() {
            this._setModalListeners();
        },
        _setModalListeners: function() {
            console.log( 'here' );
            var modal = $( '#' + this.props.modalId );
            var self = this;
            modal.modal( 'setting', 'detachable', false );
            modal.modal({
                onApprove: function() {
                    self._createGame( modal );
                    return false;       
                }
            });
            console.log( 'here' );
        },
        _createGame: function( modal ) {
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
                <div className="Modal ui modal" id={this.props.modalId}>
                    <i className="close icon"></i>
                    <div className="header">
                        Start a New Game
                    </div>
                    <div className="image content">
                        <div className="description">
                            <form className="ui form">
                                <div className="field">
                                    <label>Game Name</label>
                                    <input type="text" name="name" placeholder="Game Name" onChange={this._inputChange}></input>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="actions">
                        <div className="ui black deny button">
                            Cancel
                        </div>
                        <div className="ui approve right labeled icon button green">
                            Create Game
                            <i className="checkmark icon"></i>
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Modal;
});
