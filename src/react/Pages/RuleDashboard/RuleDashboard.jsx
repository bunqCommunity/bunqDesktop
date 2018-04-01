import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Divider from "material-ui/Divider";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import List from "material-ui/List";

import FileDownloadIcon from "material-ui-icons/FileDownload";
import AddIcon from "material-ui-icons/Add";

import RuleItem from "./RuleItem";
import NavLink from "../../Components/Routing/NavLink";
import ImportDialog from "../../Components/ImportDialog";
import TranslateButton from "../../Components/TranslationHelpers/Button";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import RuleCollection from "../../Types/RuleCollection";
import { setCategoryRule } from "../../Actions/category_rules";
import { openSnackbar } from "../../Actions/snackbar";
import { translate } from "react-i18next";

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

class RuleDashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            openImportDialog: false
        };
    }

    openImportDialog = event => {
        this.setState({ openImportDialog: true });
    };
    closeImportDialog = event => {
        this.setState({ openImportDialog: false });
    };
    importData = ruleCollectionObject => {
        this.closeImportDialog();

        const isValid = RuleCollection.validateRuleCollection(
            ruleCollectionObject
        );

        if (isValid !== true) {
            // display error
            this.props.openSnackbar(isValid.message);
            return;
        }
        const ruleCollection = new RuleCollection();

        // import the data
        ruleCollection.fromObject(ruleCollectionObject);

        // ensure we have a valid ID
        ruleCollection.ensureId();

        // save the item
        this.saveRuleCollection(ruleCollection);
    };

    saveRuleCollection = ruleCollection => {
        this.props.setCategoryRule(ruleCollection);
    };

    render() {
        const { categoryRules, t } = this.props;

        const categoryRulesList = Object.keys(
            categoryRules
        ).map(categoryRuleId => (
            <RuleItem rule={categoryRules[categoryRuleId]} t={t} />
        ));

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Rule Dashboard")}`}</title>
                </Helmet>

                <ImportDialog
                    title={t("Import rule collection")}
                    showAsNewButton={true}
                    closeModal={this.closeImportDialog}
                    importData={this.importData}
                    open={this.state.openImportDialog}
                />

                <Grid item xs={12}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={6} sm={6} md={8}>
                                <TranslateTypography variant={"headline"}>
                                    Rules
                                </TranslateTypography>
                            </Grid>

                            <Grid item xs={12} sm={3} md={2}>
                                <Button
                                    variant="raised"
                                    color="primary"
                                    style={styles.newRuleButton}
                                    onClick={this.openImportDialog}
                                >
                                    {t("Import")}
                                    <FileDownloadIcon
                                        style={styles.buttonIcons}
                                    />
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={3} md={2}>
                                <Button
                                    variant="raised"
                                    color="primary"
                                    component={NavLink}
                                    to={`/rule-page/null`}
                                    style={styles.newRuleButton}
                                >
                                    {t("New")}
                                    <AddIcon style={styles.buttonIcons} />
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <List>
                                    <Divider />
                                    {categoryRulesList}
                                </List>
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
        categoryRules: state.category_rules.category_rules
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        setCategoryRule: rule_collection =>
            dispatch(setCategoryRule(rule_collection))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(RuleDashboard)
);
