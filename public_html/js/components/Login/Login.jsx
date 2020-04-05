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
    var Login = React.createClass({
        getInitialState: function() {
            return {
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

                    Socket.login( self.state, function( data ) { // TODO: Get userId from callback and update state
                        self.setState({ 'segmentClass': 'ui segment' }); // Remove loader
                        self._goToLobby(data.nickname);
                    });
                }
            }).submit( function( e ) {
                e.preventDefault();
                return false;
            });
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
                <div className="Login ui middle aligned center aligned grid">
                    <div className="column">
                        <h2 className="ui teal image header">
                            <div className="content">
                                Welcome to Set!
                            </div>
                        </h2>
                        <form className="ui large form Login-form">
                            <div className={this.state.segmentClass}>
                                <div id="submit" className="ui fluid large teal submit button">Login</div>
                            </div>

                            <div className="ui error message"></div>
                        </form>
                    </div>
                </div>
            );
        }
    });

    return Login;
});
