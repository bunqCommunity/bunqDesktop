import React from "react";
import { translate } from "react-i18next";
import { withStyles } from "material-ui/styles";
import { FormControl } from "material-ui/Form";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import { IconButton } from "material-ui";
import Check from "material-ui-icons/Check";
import NotInterested from "material-ui-icons/NotInterested";

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        width: "100%"
    },
    withoutLabel: {
        marginTop: theme.spacing.unit * 3
    }
});

class RedirectUrl extends React.Component {
    render() {
        const {
            classes,
            setRedirectUrl,
            redirectUrlError,
            redirectUrl,
            handleChange,
            handleToggle
        } = this.props;

        return (
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="redirectUrl">
                    {this.props.t(
                        "Set a redirect url for the user after the payment is completed?"
                    )}
                </InputLabel>
                <Input
                    className={classes.input}
                    id="redirectUrl"
                    disabled={!setRedirectUrl}
                    error={redirectUrlError === true}
                    value={redirectUrl}
                    onChange={handleChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onMouseDown={handleToggle}
                                onClick={handleToggle}
                            >
                                {setRedirectUrl ? <Check /> : <NotInterested />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        );
    }
}

export default withStyles(styles)(translate("translations")(RedirectUrl));
