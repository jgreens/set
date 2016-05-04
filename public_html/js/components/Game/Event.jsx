define(
[
    'react'
]
, function(
    React
) {
    var Event = React.createClass({
        getInitialState: function() {
            var obj = this.props.feedEvent;
            var content = '';
            var className = ( this.props.user == obj.username ) ? 'current' : '';
            className += ' ' + obj.msgType;
            switch( obj.msgType ) {
                case 'chat':
                    content = obj.username + ': ' + obj.data;
                    break;
                case 'create':
                    content = obj.username + ' has created the game';
                    break;
                case 'join':
                    content = obj.username + ' has joined the room';
                    break;
                case 'leave':
                    content = obj.username + ' has left the room';
                    break;
                case 'start':
                    content = 'The game has started';
                    break;
                case 'end':
                    content = 'The game has ended';
                    break;
                case 'set':
                    content = obj.username + ' has scored a set (+1)';
                    break;
                case 'fail':
                    content = obj.username + ' has submitted an invalid set (-1)';
                    break;
                default:
                    break;
            }
            return {
                content: content,
                className: className,
                obj: obj,
                cardStyle: {
                    width: '38px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                    marginRight: '8px',
                    marginTop: '5px',
                    padding: '1px'
                }
            };
        },
        _beforeHTML: function() {
            var html = [];

            switch( this.state.obj.msgType ) {
                case 'chat':
                    // Generating icon
                    var seed = 0;
                    var name = this.state.obj.username;

                    for( var j = 0; j < name.length; j++ )
                        seed += ( name.charCodeAt(j) * j * 37 );
                    seed = seed.toString( 16 );
                    var hash = '327b8763d4f0039dab25572ee873caaa';
                    hash = hash.substring( 0, hash.length - seed.length ) + seed;
                    var url = 'http://www.gravatar.com/avatar/' + hash + '?s=30&d=identicon&r=PG';

                    html.push( <img src={url} key={name} className="ui avatar image" /> );
                    break;  
                default:
                    break;
            }

            return html;
        },
        _afterHTML: function() {
            var html = [];

            switch( this.state.obj.msgType ) {
                case 'set':
                case 'fail':
                    var cards = JSON.parse( this.state.obj.data );
                    html.push( <br key={'br'} /> );
                    for( var i = 0; i < cards.length; i++ )
                        html.push( <img key={cards[i]} src={'img/cards/'+cards[i]+'.png'} style={this.state.cardStyle} /> );
                default:
                    break;
            }

            return html;
        },
        render: function() {
            return(
                <div className="Event event">
                    <div className="content">
                        <div className={this.state.className}>
                            {this._beforeHTML()}
                            {this.state.content}
                            {this._afterHTML()}
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Event;
});
