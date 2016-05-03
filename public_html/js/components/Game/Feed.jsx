define(
[
    'react',
    'Socket',
    'jsx!components/Game/Event'
]
, function(
    React,
    Socket,
    Event
) {
    var Feed = React.createClass({
        getInitialState: function() {
            return {
                segmentStyles: {
                    marginTop: '15px',
                    height: '280px',
                    overflowY: 'scroll'
                },
                chat: ''
            };
        },
        componentDidUpdate: function() {
            var scrollBox = document.getElementsByClassName( 'Feed' )[0].children[0];
            scrollBox.scrollTop = scrollBox.scrollHeight; 
        },
        _enterCall: function( e ) { 
            // Call click on enter
            if( e.keyCode == 13 )
                this._submitChat();
        },
        _submitChat: function() {
            Socket.sendChat({ message: this.state.chat, user: this.props.user.name, id: this.props.id, type: 'chat' });
            this.setState({ chat: '' });
        },
        _inputChange: function( e ) {
            var update = {};
            update[ e.target.name ] = e.target.value;
            this.setState( update );
        },
        _createEvents: function() {
            var html = [];
            for( var i = 0; i < this.props.feed.length; i++ )
                html.push( <Event key={i} feedEvent={this.props.feed[i]} user={this.props.user.name} /> );

            return html;
        },
        render: function() {
            return(
                <div className="Feed">
                    <div className="ui segment" style={this.state.segmentStyles}>
                        <div className="ui small feed">
                            {this._createEvents()}
                        </div>
                    </div>
                    <div className="ui fluid action input">
                        <input type="text" name="chat" value={this.state.chat} onChange={this._inputChange} onKeyDown={this._enterCall} />
                        <div className="ui button" onClick={this._submitChat}>Send</div>
                    </div>
                </div>
            );
        }
    });

    return Feed;
});
