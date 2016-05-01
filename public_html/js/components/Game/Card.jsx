define(
[
    'react'
]
, function(
    React
) {
    var Card = React.createClass({
        getInitialState: function() {
            return {
                selected: false,
                className: 'ui fluid card'
            };
        },
        _toggleSelected: function() {
            var selectCards = this.props.selectCards();
            if( this.state.selected ) {
                if( selectCards.remove( this.props.card ) )
                    this.setState({ selected: false, className: 'ui fluid card' });
            } else {
                if( selectCards.add( this.props.card ) )
                    this.setState({ selected: true, className: 'ui fluid teal card' });
            } 
        },
        render: function() {
            return(
                <div className="Card column" onClick={this._toggleSelected}>
                    <div className={this.state.className}>
                        <div className="content">
                            <img src={'img/cards/' + this.props.card + '.png'} style={{width: '100%'}} />
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Card;
});
