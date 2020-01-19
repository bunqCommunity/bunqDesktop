import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { getFormValues } from "redux-form";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import SavingsGoalForm from "./SavingsGoalForm";
import ExportDialog from "../../Components/ExportDialog";
import ImportDialog from "../../Components/ImportDialog";
import TranslateButton from "../../Components/TranslationHelpers/Button";
import SavingsGoalListItemWrapper from "../../Components/SavingsGoals/SavingsGoalListItemWrapper";

import { openSnackbar } from "../../Actions/snackbar";
import { setSavingsGoal, removeSavingsGoal } from "../../Actions/savings_goals";

import SavingsGoal from "../../Models/SavingsGoal";

const styles = {
    paper: {
        padding: 16,
        marginBottom: 16
    },
    newRuleButton: {
        width: "100%"
    },
    buttonIcons: {
        marginLeft: 8
    }
};

class SavingsGoalPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            openExportDialog: false,
            openImportDialog: false
        };
    }

    static contextTypes = {
        store: PropTypes.object
    };

    get formValues() {
        return getFormValues("savingsGoal")(this.context.store.getState());
    }

    saveSavingsGoal = data => {
        const savingsGoal = new SavingsGoal(data);

        if (savingsGoal.isEnded) {
            savingsGoal.getStatistics(this.props.accounts);
            if (savingsGoal.getStatistic("percentage") < 100) {
                savingsGoal.setEnded(false);
            }
        }

        this.props.setSavingsGoal(savingsGoal);
        this.props.history.push("/savings-goals");
    };

    removeSavingsGoal = () => {
        const savingsGoalId = this.props.match.params.savingsGoalId;

        this.props.removeSavingsGoal(savingsGoalId);
        this.props.history.push("/savings-goals");
    };

    render() {
        const { t, match, savingsGoals } = this.props;
        const savingsGoalId = match.params.savingsGoalId;

        let savingsGoal;
        const isExisting = savingsGoalId !== "null" && savingsGoalId !== null;
        if (isExisting && savingsGoals[savingsGoalId]) {
            // take over without references
            savingsGoal = new SavingsGoal({ ...savingsGoals[savingsGoalId].toJSON() });
        } else {
            savingsGoal = new SavingsGoal();
            savingsGoal.ensureId();
        }

        // create a preview savingsgoal with the updated values
        const previewSavingsGoal = new SavingsGoal(this.formValues);

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Savings goal")}`}</title>
                </Helmet>

                <ImportDialog
                    title={t("Import savings goal")}
                    showAsNewButton={true}
                    closeModal={this.closeImportDialog}
                    importData={this.importData}
                    open={this.state.openImportDialog}
                />

                <ExportDialog
                    closeModal={this.closeExportDialog}
                    title={t("Export savings goal")}
                    open={this.state.openExportDialog}
                    object={savingsGoal.toJSON()}
                />

                <Grid item xs={12} sm={2} md={3}>
                    <Button onClick={this.props.history.goBack}>
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8} md={6}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item style={{ flexGrow: 1 }}>
                                <Typography variant="h6" style={styles.subTitle}>
                                    {t("Savings goal")}
                                </Typography>
                            </Grid>
                            <Grid item>
                                {isExisting && (
                                    <Grid item xs={12} sm={2} md={3}>
                                        <TranslateButton
                                            variant="outlined"
                                            color="secondary"
                                            onClick={this.removeSavingsGoal}
                                        >
                                            Remove
                                        </TranslateButton>
                                    </Grid>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <SavingsGoalForm
                                    t={t}
                                    onSubmit={this.saveSavingsGoal}
                                    initialValues={savingsGoal.toJSON()}
                                    savingsGoal={savingsGoal}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Typography variant="h5">Previews</Typography>

                    <SavingsGoalListItemWrapper t={t} clickDisabled={true} savingsGoal={previewSavingsGoal} />

                    <Paper style={{ marginTop: 16, padding: 8 }}>
                        <SavingsGoalListItemWrapper
                            t={t}
                            clickDisabled={true}
                            type="small"
                            savingsGoal={previewSavingsGoal}
                        />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        savingsGoals: state.savings_goals.savings_goals,

        accounts: state.accounts.accounts,
        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses,

        form: state.form.savingsGoal
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        setSavingsGoal: savingsGoal => dispatch(setSavingsGoal(savingsGoal)),
        removeSavingsGoal: savingsGoalId => dispatch(removeSavingsGoal(savingsGoalId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(SavingsGoalPage));
