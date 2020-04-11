define(
[
    'react',
    'Socket',
    'semantic-form'
]
, function(
    React,
    Socket,
    SemanticForm
) {
    var Title = React.createClass({
        getInitialState: function() {
            return {
                'nickname': '',
                'segmentClass': 'ui segment'
            };
        },
        componentDidMount: function() {
            this._setFormValidation();
        },
        _setFormValidation: function() {
            var self = this;

            var form = $('.ui.form');
            form.form({
                onSuccess: function() {
                    self.setState({ 'segmentClass': 'ui segment loading' }); // Dim and show loader while waiting for response

                    Socket.enter( self.state, function( data ) { // TODO: Get userId from callback and update state
                        self.setState({ 'segmentClass': 'ui segment' }); // Remove loader

                        if (data.success) {
                            self._goToLobby(data.nickname);
                        }
                    });
                }
            }).submit( function( e ) {
                e.preventDefault();
                return false;
            });
        },
        _inputChange: function( e ) {
            var update = {};
            update[ e.target.name ] = e.target.value;
            this.setState( update );
        },
        _goToLobby: function(nickname) {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { 'view': 'Lobby', 'user': { name: nickname } },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
        },
        render: function() {
            return(
                <div className="Title ui middle aligned center aligned grid">
                    <div className="column">
                        <h2 className="ui teal image header">
                            <div className="content">
                                Welcome to Set!
                            </div>
                        </h2>
                        <form className="ui large form Title-form">
                            <div className={this.state.segmentClass}>
                                <div className="field">
                                    <div className="ui left icon input">
                                        <i className="user icon"></i>
                                        <input id="nickname" type="text" name="nickname" placeholder="Nickname (optional)" value={this.state.nickname} onChange={this._inputChange}></input>
                                    </div>
                                </div>
                                <div id="submit" className="ui fluid large teal submit button">Enter</div>
                            </div>

                            <div className="ui error message"></div>
                        </form>
                    </div>
                </div>
            );
        }
    });

    return Title;
});
