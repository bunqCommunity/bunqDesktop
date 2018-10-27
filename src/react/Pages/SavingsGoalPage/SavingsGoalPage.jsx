import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import ExportDialog from "../../Components/ExportDialog";
import ImportDialog from "../../Components/ImportDialog";
import SavingsGoalForm from "./SavingsGoalForm";

import { openSnackbar } from "../../Actions/snackbar";
import { setSavingsGoal } from "../../Actions/savings_goals";

import SavingsGoal from "../../Models/SavingsGoal";

const styles = {
    paper: {
        padding: 16
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

    saveSavingsGoal = data => {
        console.log("saveSavingsGoal()", data);
    };

    render() {
        const { t, match, savingsGoals } = this.props;
        const savingsGoalId = match.params.savingsGoalId;

        let savingsGoal;
        if (savingsGoalId !== "null" && savingsGoalId !== null && savingsGoals[savingsGoalId]) {
            savingsGoal = savingsGoals[savingsGoalId];
        } else {
            savingsGoal = new SavingsGoal();
            savingsGoal.setTitle("My goal!");
            savingsGoal.ensureId();
        }

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
                            <Grid item xs={11}>
                                <Typography variant="h6" style={styles.subTitle}>
                                    {t("Savings goal")}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                {/* menu */}
                            </Grid>

                            <Grid item xs={12}>
                                <SavingsGoalForm
                                    t={t}
                                    onSubmit={this.saveSavingsGoal}
                                    initialValues={savingsGoal.toJSON()}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        savingsGoals: state.savings_goals.savings_goals
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        setSavingsGoal: savingsGoal => dispatch(setSavingsGoal(savingsGoal))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(SavingsGoalPage));
