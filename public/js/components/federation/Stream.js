import React from 'react';
var front = require("../../../../cfg/front");


export default React.createClass({
    componentWillReceiveProps: function(nextProps) {
        var playerInstance = jwplayer("myElement");
        playerInstance.setup({
            file: `http://${front.ip}:${front.streamPort}/hls/${nextProps.channel}.m3u8`
        });
    },
    render: function () {
        return (
            <div className="container content-flex">
                <p>Идентификатор канала: {this.props.channel}</p>
                <div id="myElement" ></div>
            </div>
        );
    }
});