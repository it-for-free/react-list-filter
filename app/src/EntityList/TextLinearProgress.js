import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

function TextLinearProgress(props) {

    return (
        <Box p={1}>
            {/* <LinearProgress /> */}
            <Box p={2}>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                >
                    <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                            {props.text}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            {/* <LinearProgress color="secondary" /> */}
        </Box>
    );
}

TextLinearProgress.propTypes = {
    text: PropTypes.string,
};

export default TextLinearProgress;
