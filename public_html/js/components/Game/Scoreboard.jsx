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

            var reversed = {};
            var list = [];
            for( var key in scores ) {
                if( typeof reversed[scores[key]] == 'undefined' ) {
                    reversed[scores[key]] = [];
                    list.push(scores[key]);
                }
                reversed[scores[key]].push({ name: key, score: scores[key] });
            }
            list.sort(function(a,b){return b-a});

            for( var i = 0; i < list.length; i++ ) {
                var sameScore = reversed[list[i]];
                for( var j = 0; j < sameScore.length; j++ ) {
                    var score = reversed[list[i]][j];
                    var className = ( score.name == user.name ) ? 'ui small teal label' : 'ui small label';
                    html.push( 
                        <div key={score.name} className="item">
                            <div className={className}>{score.score}</div>
                            {score.name}
                        </div>
                    );
                }
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
