import React from "react";
import { withStyles } from "@material-ui/core/styles";

import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Check from "@material-ui/icons/Check";
import NotInterested from "@material-ui/icons/NotInterested";

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        width: "calc(100% - 16px)"
    },
    withoutLabel: {
        marginTop: theme.spacing.unit * 3
    }
});

class MinimumAge extends React.Component {
    render() {
        const {
            classes,
            targetType,
            setMinimumAge,
            minimumAgeError,
            minimumAge,
            handleChange,
            handleToggle,
            t
        } = this.props;

        if (targetType === "BUNQME") {
            return null;
        }

        return (
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="minimumAge">{t("Set a minimum age?")}</InputLabel>
                <Input
                    className={classes.input}
                    id="minimumAge"
                    type="number"
                    inputProps={{
                        min: 12,
                        max: 100,
                        step: 1
                    }}
                    disabled={!setMinimumAge}
                    error={minimumAgeError}
                    value={minimumAge}
                    onChange={handleChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onMouseDown={handleToggle} onClick={handleToggle}>
                                {setMinimumAge ? <Check /> : <NotInterested />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        );
    }
}

export default withStyles(styles)(MinimumAge);
