import React from "react";
import { translate } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { HuePicker } from "react-color";

const renderColorPicker = ({ t, i18n, tReady, input, label, meta: { error }, ...otherProps }) => {
    const inputValue = input.value;
    const inputOnChange = input.onChange;

    return (
        <Grid container spacing={8}>
            <Grid item xs={12}>
                <Typography variant="body1" style={{ color: error ? "#ec2616" : "" }}>
                    {label}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {error && (
                    <Typography variant="body2" style={{ color: "#ec2616" }}>
                        {error}
                    </Typography>
                )}
            </Grid>

            <Grid item xs={12}>
                <Typography variant="body1">Left</Typography>
                <HuePicker width="100%" color={inputValue} />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1">Right</Typography>
                <HuePicker width="100%" color={inputValue} />
            </Grid>

            <Grid item xs={12}>
                <div style={{ width: "100%", height: 8, background: inputValue }} />
            </Grid>
        </Grid>
    );
};

export default translate("translations")(renderColorPicker);
