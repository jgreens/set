define(
[
    'react',
    'Socket'
]
, function(
    React,
    Socket
) {
    var Register = React.createClass({
        getInitialState: function() {
            return {
                'username': '',
                'password': '',
                'confirmPassword': '',
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
                                prompt : 'Please choose a username'
                            },
                            {
                                type   : 'maxLength[16]',
                                prompt : 'Your username must be less than 16 characters'
                            }

                        ]
                    },
                    password: {
                        identifier: 'password',
                        rules: [
                            {
                                type   : 'minLength[6]',
                                prompt : 'Your password must be at least 6 characters'
                            },
                            {
                                type   : 'maxLength[20]',
                                prompt : 'Your password must be less than 20 characters'
                            }
                        ]
                    },
                    confirmPassword: {
                        identifier: 'confirmPassword',
                        rules: [
                            {
                                type   : 'match[password]',
                                prompt : 'Your chosen password and confirmed password don\'t match.'
                            }
                        ]
                    }
                },
                onSuccess: function() {
                    self.setState({ 'segmentClass': 'ui segment loading' }); // Dim and show loader while waiting for response

                    Socket.register( self.state, function( data ) {
                        console.log( data );
                        self.setState({ 'segmentClass': 'ui segment' }); // Remove loader

                        if( data.success ) // Successfully created account
                            self._goToLogin();
                        else // Failure
                            form.form( 'add errors', [ data.message ] );
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
        _goToLogin: function( e ) {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { 'view': 'Login' },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
        },
        render: function() {
            return(
                <div className="Register ui middle aligned center aligned grid">
                    <div className="column">
                        <h2 className="ui teal image header">
                            <div className="content">
                                Register 
                            </div>
                        </h2>
                        <form className="ui large form">
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
                                <div className="field">
                                    <div className="ui left icon input">
                                        <i className="lock icon"></i>
                                        <input id="confirmPassword" type="password" name="confirmPassword" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this._inputChange}></input>
                                    </div>
                                </div>
                                <div id="submit" className="ui fluid large teal submit button">Register</div>
                            </div>

                            <div className="ui error message"></div>

                        </form>

                        <div className="ui message">
                            Already have an account? <a onClick={this._goToLogin}>Login</a>
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Register;
});
