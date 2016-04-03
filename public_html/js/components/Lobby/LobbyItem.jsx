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
                <div className="LobbyItem item">
                    <div className="content">
                        <h3 className="header">{this.props.name}</h3>
                        <div className="extra">
                            Members:&nbsp;
                            <div className="ui right floated primary button">
                                Join Game
                                <i className="right chevron icon"></i>
                            </div>
                            {this._generateMembers()}
                        </div>
                    </div>
                </div>
            );
        }
    });

    return LobbyItem;
});
