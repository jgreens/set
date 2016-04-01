define(
[
    'react'
]
, function(
    React
) {
    var Login = React.createClass({
        getInitialState: function() {
            return {
                'username': '',
                'password': ''
            };
        },
        componentDidMount: function() {
            this._setInputListener();
            this._setButtonListener();
        },
        _setInputListener: function() {
            var inputs = document.getElementsByTagName( 'input' );
            var self = this;
            for( var i = 0; i < inputs.length; i++ ) {
                inputs[i].onkeyup = function( e ) {
                    var update = {};
                    update[ this.name ] = this.value;
                    self.setState( update );
                }
            }
        },
        _setButtonListener: function() {
            var self = this;
            document.getElementById( 'submit' ).onclick = function() {
                console.log( self.state );
            };
        },
        render: function() {
            return(
                <main className="ui page grid">
                    <div className="ui middle aligned center aligned grid">
                        <div className="column">
                            <h2 className="ui teal image header">
                                <div className="content">
                                    Log-in to your account
                                </div>
                            </h2>
                            <form className="ui large form">
                                <div className="ui segment">
                                    <div className="field">
                                        <div className="ui left icon input">
                                            <i className="user icon"></i>
                                            <input id="username" type="text" name="username" placeholder="Username"></input>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="ui left icon input">
                                            <i className="lock icon"></i>
                                            <input id="password" type="password" name="password" placeholder="Password"></input>
                                        </div>
                                    </div>
                                    <div id="submit" className="ui fluid large teal submit button">Login</div>
                                </div>

                                <div className="ui error message"></div>

                            </form>

                            <div className="ui message">
                                New to us? <a href="#">Sign Up</a>
                            </div>
                        </div>
                    </div>
                </main>
            );
        }
    });

    return Login;
});
