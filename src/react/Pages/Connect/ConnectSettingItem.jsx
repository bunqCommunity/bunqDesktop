import React from "react";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = {
    formControl: {
        width: "100%"
    }
};

export default props => {
    const { t, checked, label, type, hidden, accessLevel } = props;

    // hide when access level is included in hidden array
    if (hidden && accessLevel) {
        if (hidden.includes(accessLevel)) {
            return null;
        }
    }

    return (
        <Grid item xs={12} sm={6}>
            <FormControlLabel
                style={styles.formControl}
                control={
                    <Switch
                        onChange={e => props.handleChangeDirect(type)(!checked)}
                        checked={checked}
                        value={type}
                        color="primary"
                    />
                }
                label={t(label)}
            />
        </Grid>
    );
};
