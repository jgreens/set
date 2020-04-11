define(
[
    'react',
    'jquery',
    'Socket'
]
, function(
    React,
    $,
    Socket
) {
    var LobbyItem = React.createClass({
        getInitialState: function() {
            var joinText = this.props.started ? 'Join Ongoing Game' : 'Join New Game';
            if( this.props.finished )
                joinText = 'Join Finished Game';

            return {
                joinButtonClass: this._joinButtonClass,
                joinText: joinText 
            };
        },
        componentWillReceiveProps: function( newProps ) {
            var joinText = newProps.started ? 'Join Ongoing Game' : 'Join New Game';
            if( newProps.finished )
                joinText = 'Join Finished Game';

            this.setState({ joinText: joinText });
        },
        componentDidMount: function() {
            $( '.pop' ).popup();
        },
        componentDidUpdate: function() {
            $( '.pop' ).popup();
        },
        _joinButtonClass: 'ui right floated teal icon button',
        _joinButtonLoadingClass: 'ui right floated teal icon loading button',
        _generateMembers: function() {
            var html = [];

            for( var i = 0; i < this.props.members.length; i++ ) {
                // Generating icon
                var seed = 0;
                var name = ( typeof this.props.members[i] == 'string' ) ? this.props.members[i] : this.props.members[i].username;

                for( var j = 0; j < name.length; j++ )
                    seed += ( name.charCodeAt(j) * j * 37 );
                seed = seed.toString( 16 );
                var hash = '327b8763d4f0039dab25572ee873caaa';
                hash = hash.substring( 0, hash.length - seed.length ) + seed;
                var url = 'http://www.gravatar.com/avatar/' + hash + '?s=30&d=identicon&r=PG';

                html.push( <img src={url} className="ui pop avatar image" key={name} data-content={name} /> );
            }

            return html;
        },
        _goToGame: function( id ) {
            var customEvent = new CustomEvent( 'ViewController',  {
                detail: { view: 'Game', id: this.props.id },
                bubbles: true
            });
            window.dispatchEvent( customEvent );
        },
        _joinGame: function() {
            this.setState({ joinButtonClass: this._joinButtonLoadingClass });

            var self = this;
            Socket.joinGame( { id: this.props.id }, function( data ) {
                if( data ) { // Successfully joined game
                    self._goToGame( data.id );
                    console.log( 'Success' );
                } else { // Failure
                    console.log( 'Failure' );
                    this.setState({ joinButtonClass: this._joinButtonLoadingClass });
                }
            });
        },
        render: function() {
            return(
                <div className="Lobbyitem ui clearing segment">
                    <h2>{this.props.name}</h2>
                    <button className={this.state.joinButtonClass} onClick={this._joinGame}>{this.state.joinText}</button>
                    <div className="extra">
                        {this._generateMembers()}
                    </div>
                </div>
            );
        }
    });

    return LobbyItem;
});
