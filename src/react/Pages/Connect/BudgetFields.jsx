import React from "react";

import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";
import TranslateMenuItem from "../../Components/TranslationHelpers/MenuItem";

const styles = {
    formControl: {
        width: "100%"
    }
};

export default props => {
    const { t, handleChange, handleChangeDirect, handleChangeFormatted } = props;

    return (
        <Grid item xs={12}>
            <Grid container spacing={8}>
                <Grid item xs={12} sm={4}>
                    <FormControlLabel
                        style={styles.formControl}
                        control={
                            <Switch
                                checked={props.setBudget}
                                onChange={e => handleChangeDirect("setBudget")(!props.setBudget)}
                                value="setBudget"
                                color="primary"
                            />
                        }
                        label={t("Set a budget")}
                    />
                </Grid>

                {props.setBudget ? (
                    <React.Fragment>
                        <Grid item xs={12} sm={8}>
                            <FormControl style={styles.formControl}>
                                <Select
                                    value={props.budgetFrequency}
                                    input={<Input name="field" id="field-helper" />}
                                    onChange={handleChange("budgetFrequency")}
                                >
                                    <TranslateMenuItem value={"ONCE"}>Once</TranslateMenuItem>
                                    <TranslateMenuItem value={"DAILY"}>Daily</TranslateMenuItem>
                                    <TranslateMenuItem value={"WEEKLY"}>Weekly</TranslateMenuItem>
                                    <TranslateMenuItem value={"MONTHLY"}>Monthly</TranslateMenuItem>
                                    <TranslateMenuItem value={"YEARLY"}>Yearly</TranslateMenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl style={styles.formControl} error={props.budgetError}>
                                <MoneyFormatInput
                                    id="budget"
                                    value={props.budget}
                                    onValueChange={handleChangeFormatted("budget")}
                                />
                            </FormControl>
                        </Grid>
                    </React.Fragment>
                ) : null}
            </Grid>
        </Grid>
    );
};
