define(
[
    'react'
]
, function(
    React
) {
    var Register = React.createClass({
        getInitialState: function() {
            return {
                'username': '',
                'password': ''
            };
        },
        componentDidMount: function() {
            this._setSubmitListener();
        },
        _inputChange: function( e ) {
            var update = {};
            update[ e.target.name ] = e.target.value;
            this.setState( update );
        },
        _setSubmitListener: function() {
            var self = this;
            document.getElementById( 'submit' ).onclick = function() {
                console.log( self.state );
            };
        },
        _goToRegister: function( e ) {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { 'view': 'Register' },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
        },
        render: function() {
            return(
                <main className="ui page grid">
                    <div className="ui middle aligned center aligned grid">
                        <div className="column">
                            <h2 className="ui teal image header">
                                <div className="content">
                                    Register 
                                </div>
                            </h2>
                            <form className="ui large form">
                                <div className="ui segment">
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
                                    <div id="submit" className="ui fluid large teal submit button">Register</div>
                                </div>

                                <div className="ui error message"></div>

                            </form>

                            <div className="ui message">
                                Don&#39;t have an account? <a onClick={this._goToRegister}>Sign Up</a>
                            </div>
                        </div>
                    </div>
                </main>
            );
        }
    });

    return Register;
});
