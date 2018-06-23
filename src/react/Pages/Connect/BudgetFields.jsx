import React from "react";

import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import MoneyFormatInputDefault from "../../Components/FormFields/MoneyFormatInputDefault";
import TranslateMenuItem from "../../Components/TranslationHelpers/MenuItem";

const styles = {};

export default props => {
    const {
        t,
        handleChange,
        handleChangeDirect,
        handleChangeFormatted
    } = props;

    return (
        <Grid item xs={12}>
            <FormControlLabel
                control={
                    <Switch
                        checked={props.setBudget}
                        onChange={e =>
                            handleChangeDirect("setBudget")(!props.setBudget)}
                        value="setBudget"
                        color="primary"
                    />
                }
                label={t("Set a budget")}
            />
            {props.setBudget ? (
                <React.Fragment>
                    <FormControl error={props.budgetError}>
                        <MoneyFormatInputDefault
                            id="budget"
                            onChange={handleChangeFormatted("budget")}
                            value={props.budget}
                        />
                    </FormControl>
                    <FormControl>
                        <Select
                            value={props.budgetFrequency}
                            input={<Input name="field" id="field-helper" />}
                            onChange={handleChange("budgetFrequency")}
                        >
                            <TranslateMenuItem value={"ONCE"}>
                                Once
                            </TranslateMenuItem>
                            <TranslateMenuItem value={"DAILY"}>
                                Daily
                            </TranslateMenuItem>
                            <TranslateMenuItem value={"WEEKLY"}>
                                Weekly
                            </TranslateMenuItem>
                            <TranslateMenuItem value={"MONTHLY"}>
                                Monthly
                            </TranslateMenuItem>
                            <TranslateMenuItem value={"YEARLY"}>
                                Yearly
                            </TranslateMenuItem>
                        </Select>
                    </FormControl>
                </React.Fragment>
            ) : null}
        </Grid>
    );
};
