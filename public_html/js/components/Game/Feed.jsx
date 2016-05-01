define(
[
    'react',
    'jsx!components/Game/Event'
]
, function(
    React,
    Event
) {
    var Feed = React.createClass({
        _createEvents: function() {
            var html = [];
            console.log( this.props.feed );
            console.log( this.props.user );
            for( var i = 0; i < this.props.feed.length; i++ )
                html.push( <Event key={i} feedEvent={this.props.feed[i]} user={this.props.user} /> );

            return html;
        },
        render: function() {
            return(
                <div className="Feed ui small feed">
                    <h4 className="ui header">Game Activity</h4>
                    {this._createEvents()}
                </div>
            );
        }
    });

    return Feed;
});
