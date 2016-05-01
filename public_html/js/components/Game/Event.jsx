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
            var className = ( this.props.user == obj.user ) ? 'current' : '';
            className += ' ' + obj.type;
            switch( obj.type ) {
                case 'chat':
                    content = obj.user + ': ' + obj.message;
                    break;
                case 'join':
                    content = obj.user + ' has joined the room.';
                    break;
                case 'leave':
                    content = obj.user + ' has left the room.';
                    break;
                case 'start':
                    content = 'The game has started.';
                    break;
                case 'end':
                    content = 'The game has ended.';
                    break;
                case 'set':
                    content = obj.user + ' has scored a set.';
                    break;
                case 'fail':
                    content = obj.user + ' has submitted an invalid set.';
                    break;
                default:
                    break;
            }
            return {
                content: content,
                className: className
            };
        },
        render: function() {
            return(
                <div className="Event event">
                    <div className="content">
                        <div className={this.state.className}>
                            {this.state.content}
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Event;
});
