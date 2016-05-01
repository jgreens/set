define(
[
    'react',
    'jsx!components/Game/Card'
]
, function(
    React,
    Card
) {
    var GameBoard = React.createClass({
        getInitialState: function() {
            return {
            };
        },
        _generateCards: function() {
            var html = [];

            for( var i = 0; i < this.props.cards.length; i++ )
                html.push( <Card key={this.props.cards[i]} card={this.props.cards[i]} selectCards={this.props.selectCards} /> );

            return html;
        },
        render: function() {
            return(
                <div className="GameBoard ui three column grid">
                    {this._generateCards()}
                </div>
            );
        }
    });

    return GameBoard;
});
