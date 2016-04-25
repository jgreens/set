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
                        Profile Picture
                    </div>
                    <div className="image content">
                        <div className="description">
                            <div className="ui header">We've auto-chosen a profile image for you.</div>
                            <p>We've grabbed the following image from the <a href="https://www.gravatar.com" target="_blank">gravatar</a> image associated with your registered e-mail address.</p>
                            <p>Is it okay to use this photo?</p>
                        </div>
                    </div>
                    <div className="actions">
                        <div className="ui black deny button">
                            Nope
                        </div>
                        <div className="ui positive right labeled icon button">
                            Yep, that's me
                            <i className="checkmark icon"></i>
                        </div>
                    </div>
                </div>
            );
        }
    });

    return Modal;
});
