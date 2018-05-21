import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const styles = {
    textField: {
        width: "100%"
    }
};

export default props => {
    const { t, address } = props;

    return (
        <Grid container spacing={8}>
            <Grid item xs={12}>
                <TextField
                    style={styles.textField}
                    label={t("City")}
                    value={address.city}
                    onChange={props.onChange("city")}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    style={styles.textField}
                    label={t("Country")}
                    value={address.country}
                    onChange={props.onChange("country")}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    style={styles.textField}
                    label={t("House number")}
                    value={address.house_number}
                    onChange={props.onChange("house_number")}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    style={styles.textField}
                    label={t("Postal code")}
                    value={address.postal_code}
                    onChange={props.onChange("postal_code")}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    style={styles.textField}
                    label={t("PO box")}
                    value={address.po_box}
                    onChange={props.onChange("po_box")}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    style={styles.textField}
                    label={t("Street")}
                    value={address.street}
                    onChange={props.onChange("street")}
                />
            </Grid>
        </Grid>
    );
};
