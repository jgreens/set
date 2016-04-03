define(
[
    'react',
    'jsx!components/Login/Login',
    'jsx!components/Register/Register'
]
, function(
    React,
    Login,
    Register
) {
    var ViewController = React.createClass({
        getInitialState: function() {
            return {
                'view': 'Login',
                'user': {
                    'id': -1,
                    'name': ''
                }
            };
        },
        componentWillMount: function() {
            window.addEventListener( 'ViewController', this._updateView, false );
        },
        _updateView: function( e ) {
            var currState = this.state;
            currState.view = e.detail.view;
            this.setState( currState );
        },
        _getView: function() {
            var view = [];

            switch( this.state.view ) {
                case 'Login':
                    view.push( <Login key="Login"/> );
                    break;
                case 'Register':
                    view.push( <Register key="Register"/> );
                    break;
                default:
                break;
            }

            return view;
        },
        render: function() {
            return(
                <div className="ViewController">
                    {this._getView()}
                </div>
            );
        }
    });

    return ViewController;
});
