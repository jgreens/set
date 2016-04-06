define(
[
    'react'
]
, function(
    React
) {
    var LobbyItem = React.createClass({
        _generateMembers: function() {
            var html = [];

            for( var i = 0; i < this.props.members.length; i++ )
                html.push( <div key={this.props.members[i].id} className="ui label">{this.props.members[i].name}</div> );

            return html;
        },
        render: function() {
            return(
                <div className="LobbyItem ui clearing segment">
                    <h2>{this.props.name}</h2>
                    <button className="ui right floated blue icon button">Join Game<i className="right chevron icon"></i></button>
                    <div className="extra">
                        Waiting:&nbsp;
                        {this._generateMembers()}
                    </div>
                </div>
            );
        }
    });

    return LobbyItem;
});
