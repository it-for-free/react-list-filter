import React from 'react';
import PropTypes from 'prop-types';
import TextLinearProgress from './TextLinearProgress';

function MainProgress(props) {

    return (
        <TextLinearProgress
            text={props.text} />
    );
}

MainProgress.propTypes = {
    text: PropTypes.string,
};

export default MainProgress;
