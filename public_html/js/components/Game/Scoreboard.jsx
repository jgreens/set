define(
[
    'react'
]
, function(
    React
) {
    var Scoreboard = React.createClass({
        _generateScoreboard: function() {
            var html = [];
            var scores = this.props.scores;
            var user = this.props.user;

            for( var key in scores ) {
                var className = ( key == user.name ) ? 'ui small teal label' : 'ui small label';
                html.push( 
                    <div key={key} className="item">
                        <div className={className}>{scores[key]}</div>
                        {key}
                    </div>
                );
            }

            return html;
        },
        render: function() {
            return(
                <div className="ui fluid vertical menu">
                    <div className="item active">
                        Scoreboard
                    </div>
                    {this._generateScoreboard()}
                </div>
            );
        }
    });

    return Scoreboard;
});
