define(
[
    'react'
]
, function(
    React
) {
    var Card = React.createClass({
        render: function() {
            return(
                <div className="Card column">
                    <div className="ui fluid card">
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
