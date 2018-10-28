import React from "react";
import { translate } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import GradientColorPicker from "../../FormFields/GradientColorPicker";

const renderColorPickerGradient = ({ t, i18n, tReady, input, label, meta: { error }, ...otherProps }) => {
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
                <GradientColorPicker {...input} />
            </Grid>
        </Grid>
    );
};

export default translate("translations")(renderColorPickerGradient);
