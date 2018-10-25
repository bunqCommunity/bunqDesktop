import React from "react";
import DateTimePicker from "material-ui-pickers/DateTimePicker";

import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import Collapse from "@material-ui/core/Collapse";
import FormControl from "@material-ui/core/FormControl";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import TranslateMenuItem from "../TranslationHelpers/MenuItem";
import scheduleTexts from "../../Helpers/ScheduleTexts";
import { getUTCDate, UTCDateToLocalDate } from "../../Helpers/Utils";

const styles = {
    textField: {
        width: "100%"
    },
    formControl: {
        width: "100%"
    }
};

export default props => {
    let {
        t,
        schedulePayment,
        recurrenceUnit,
        recurrenceSize,
        scheduleEndDate,
        scheduleStartDate,

        handleChangeDirect,
        handleChange
    } = props;

    scheduleEndDate = scheduleEndDate !== null ? UTCDateToLocalDate(scheduleEndDate) : scheduleEndDate;
    scheduleStartDate = scheduleStartDate !== null ? UTCDateToLocalDate(scheduleStartDate) : scheduleStartDate;

    const wrapDateChange = name => value => {
        handleChangeDirect(name)(getUTCDate(value));
    };

    let scheduledPaymentText = null;
    if (schedulePayment) {
        const scheduleTextResult = scheduleTexts(t, scheduleStartDate, scheduleEndDate, recurrenceSize, recurrenceUnit);

        scheduledPaymentText = (
            <ListItem>
                <ListItemText primary={scheduleTextResult.primary} secondary={scheduleTextResult.secondary} />
            </ListItem>
        );
    }

    return (
        <Grid item xs={12}>
            <Collapse in={schedulePayment}>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <DateTimePicker
                            helperText={t("Start date")}
                            format="MMMM dd, YYYY HH:mm"
                            style={styles.textField}
                            value={scheduleStartDate}
                            onChange={wrapDateChange("scheduleStartDate")}
                            onChange={date => {
                                // reset to current time if
                                if (!date || date > new Date()) {
                                    wrapDateChange("scheduleStartDate")(date);

                                    // if start date further than the end date, we reset the end date to start date
                                    if (date > scheduleEndDate) {
                                        wrapDateChange("scheduleEndDate")(date);
                                    }
                                } else {
                                    wrapDateChange("scheduleStartDate")(new Date());
                                }
                            }}
                            ampm={false}
                            cancelLabel={t("Cancel")}
                            clearLabel={t("Clear")}
                            okLabel={t("Ok")}
                            todayLabel={t("Today")}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <DateTimePicker
                            helperText={t("End date")}
                            emptyLabel={t("No end date")}
                            format="MMMM dd, YYYY HH:mm"
                            style={styles.textField}
                            value={scheduleEndDate}
                            onChange={date => {
                                // reset to current time if
                                if (!date || date > scheduleStartDate) {
                                    wrapDateChange("scheduleEndDate")(date);
                                } else {
                                    wrapDateChange("scheduleEndDate")(scheduleStartDate);
                                }
                            }}
                            clearable={true}
                            ampm={false}
                            cancelLabel={t("Cancel")}
                            clearLabel={t("Clear")}
                            okLabel={t("Ok")}
                            todayLabel={t("Today")}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            style={styles.textField}
                            value={recurrenceSize}
                            disabled={recurrenceUnit === "ONCE"}
                            onChange={handleChange("recurrenceSize")}
                            helperText={"Repeat every"}
                            type={"number"}
                            inputProps={{
                                min: 0,
                                step: 1
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl style={styles.formControl}>
                            <Select
                                style={styles.textField}
                                value={recurrenceUnit}
                                input={<Input name="field" id="field-helper" />}
                                onChange={handleChange("recurrenceUnit")}
                            >
                                <TranslateMenuItem value={"ONCE"}>Once</TranslateMenuItem>
                                <TranslateMenuItem value={"HOURLY"}>Hours</TranslateMenuItem>
                                <TranslateMenuItem value={"DAILY"}>Days</TranslateMenuItem>
                                <TranslateMenuItem value={"WEEKLY"}>Weeks</TranslateMenuItem>
                                <TranslateMenuItem value={"MONTHLY"}>Months</TranslateMenuItem>
                                <TranslateMenuItem value={"YEARLY"}>Years</TranslateMenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        {scheduledPaymentText}
                    </Grid>
                </Grid>
            </Collapse>
        </Grid>
    );
};
