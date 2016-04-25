define(
[
    'react'
]
, function(
    React
) {
    var Modal = React.createClass({
        render: function() {
            return(
                <div className="Modal ui modal" id={this.props.modalId}>
                    <i className="close icon"></i>
                    <div className="header">
                        Start a New Game
                    </div>
                    <div className="image content">
                        <div className="description">
                            <form className="ui form">
                                <div className="field">
                                    <label>Game Name</label>
                                    <input type="text" name="game-name" placeholder="Game Name"></input>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="actions">
                        <div className="ui black deny button">
                            Cancel
                        </div>
                        <div className="ui positive right labeled icon button">
                            Create Game
                            <i className="checkmark icon"></i>
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Modal;
});
