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
                'username': '',
                'password': '',
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
                fields: {
                    username: {
                        identifier: 'username',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter your username'
                            }
                        ]
                    },
                    password: {
                        identifier: 'password',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter your password'
                            }
                        ]
                    }
                },
                onSuccess: function() {
                    self.setState({ 'segmentClass': 'ui segment loading' }); // Dim and show loader while waiting for response

                    Socket.login( self.state, function( data ) { // TODO: Get userId from callback and update state
                        self.setState({ 'segmentClass': 'ui segment' }); // Remove loader
                        if( data ) // Successfully created account
                            self._goToLobby();
                        else // Failure
                            form.form( 'add errors', [ 'The username/password combination provided is not valid.' ] );
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
        _goToRegister: function( e ) {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { 'view': 'Register' },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
        },
        _goToLobby: function() {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { 'view': 'Lobby', 'user': { name: this.state.username, id: 99 } }, // TODO: Temporary ID
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
                                Login
                            </div>
                        </h2>
                        <form className="ui large form Login-form">
                            <div className={this.state.segmentClass}>
                                <div className="field">
                                    <div className="ui left icon input">
                                        <i className="user icon"></i>
                                        <input id="username" type="text" name="username" placeholder="Username" value={this.state.username} onChange={this._inputChange}></input>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="ui left icon input">
                                        <i className="lock icon"></i>
                                        <input id="password" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this._inputChange}></input>
                                    </div>
                                </div>
                                <div id="submit" className="ui fluid large teal submit button">Login</div>
                            </div>

                            <div className="ui error message"></div>
                        </form>

                        <div className="ui message">
                            Don&#39;t have an account? <a onClick={this._goToRegister}>Sign Up</a>
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Login;
});
