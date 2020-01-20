import React from "react";
import DateTimePicker from "material-ui-pickers/DateTimePicker";

import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = {
    textField: {
        width: "100%"
    },
    formControl: {
        width: "100%"
    }
};

export default props => {
    const { t, handleChangeDirect } = props;

    return (
        <Grid item xs={12}>
            <Grid container spacing={8}>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        style={styles.formControl}
                        control={
                            <Switch
                                checked={props.setTimeLimit}
                                onChange={e => handleChangeDirect("setTimeLimit")(!props.setTimeLimit)}
                                value="setBudget"
                                color="primary"
                            />
                        }
                        label={t("Set a time limit")}
                    />
                </Grid>
                {props.setTimeLimit ? (
                    <Grid item xs={12} sm={8}>
                        <DateTimePicker
                            helperText={t("Time limit")}
                            format="MMMM dd, yyyy HH:mm"
                            style={styles.textField}
                            value={props.timeLimit}
                            onChange={handleChangeDirect("timeLimit")}
                            onChange={date => {
                                // reset to current time if no date or in the past
                                if (!date || date > new Date()) {
                                    handleChangeDirect("timeLimit")(date);
                                } else {
                                    handleChangeDirect("timeLimit")(new Date());
                                }
                            }}
                            cancelLabel={t("Cancel")}
                            clearLabel={t("Clear")}
                            todayLabel={t("Today")}
                            okLabel={t("Ok")}
                            ampm={false}
                        />
                    </Grid>
                ) : null}
            </Grid>
        </Grid>
    );
};
