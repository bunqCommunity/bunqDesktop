import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";

import ClearIcon from "@material-ui/icons/Clear";
import CopyIcon from "@material-ui/icons/FileCopy";
import CopyToClipboardWrap from "../../Components/CopyToClipboardWrap";

const styles = {
    root: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%"
    },
    input: {
        marginLeft: 8,
        flex: 1
    },
    iconButton: {
        padding: 10
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4
    }
};

const LinkPreviewField = props => {
    const { classes, value, reset } = props;

    const copyLink = () => {};

    return (
        <Paper className={classes.root} elevation={1}>
            <InputBase value={value} className={classes.input} />

            <IconButton onClick={reset} className={classes.iconButton} aria-label="Clear values">
                <ClearIcon />
            </IconButton>
            <Divider className={classes.divider} />
            <IconButton onClick={copyLink} color="primary" className={classes.iconButton} aria-label="Copy the link">
                <CopyToClipboardWrap text={value}>
                    <CopyIcon />
                </CopyToClipboardWrap>
            </IconButton>
        </Paper>
    );
};

LinkPreviewField.propTypes = {
    classes: PropTypes.object.isRequired,

    value: PropTypes.string.isRequired,
    reset: PropTypes.func.isRequired
};

export default withStyles(styles)(LinkPreviewField);
