import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Divider from "material-ui/Divider";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import List from "material-ui/List";

import FileDownloadIcon from "material-ui-icons/FileDownload";
import AddIcon from "material-ui-icons/Add";
import PlayArrowIcon from "material-ui-icons/PlayArrow";

// import typed worker
const RuleCollectionCheckWorker = require("worker-loader!../../WebWorkers/rule_collection_check.worker.ts");

import RuleCollectionItem from "./RuleCollectionItem";
import NavLink from "../../Components/Routing/NavLink";
import ImportDialog from "../../Components/ImportDialog";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import RuleCollection from "../../Types/RuleCollection";
import { setCategoryRule } from "../../Actions/category_rules";
import { openSnackbar } from "../../Actions/snackbar";
import { setCategoryConnectionMultiple } from "../../Actions/categories";

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

        this.worker = new RuleCollectionCheckWorker();
        this.worker.onmessage = this.handleWorkerEvent;
    }

    componentWillUnmount() {
        this.worker.terminate();
    }

    handleWorkerEvent = eventResults => {
        const events = eventResults.data.result;
        const ruleCollectionId = eventResults.data.ruleCollectionId;
        const ruleCollection = this.props.categoryRules[ruleCollectionId];

        // go through all events
        const newCategoryConnections = [];
        events.map(event => {
            // check if this event matched
            if (event.matches) {
                ruleCollection.getCategories().forEach(categoryId => {
                    newCategoryConnections.push({
                        category_id: categoryId,
                        event_type: event.type,
                        event_id: event.item.id
                    });
                });
            }
        });

        if (newCategoryConnections.length > 0) {
            this.props.setCategoryConnectionMultiple(newCategoryConnections);
        }
    };
    triggerWorkerEvent = props => {
        if (!props) props = this.props;

        // use json format
        const payments = props.payments.map(item => item.toJSON());
        const requestInquiries = props.requestInquiries.map(item =>
            item.toJSON()
        );
        const requestResponses = props.requestResponses.map(item =>
            item.toJSON()
        );
        const masterCardActions = props.masterCardActions.map(item =>
            item.toJSON()
        );
        const bunqMeTabs = props.bunqMeTabs.map(item => item.toJSON());

        // get results for all our rule collections
        Object.keys(props.categoryRules).forEach(categoryRuleId => {
            const ruleCollection = props.categoryRules[categoryRuleId];
            if (ruleCollection.isEnabled()) {
                this.worker.postMessage({
                    ruleCollection: ruleCollection,
                    payments: payments,
                    masterCardActions: masterCardActions,
                    bunqMeTabs: bunqMeTabs,
                    requestInquiries: requestInquiries,
                    requestResponses: requestResponses
                });
            }
        });
    };

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
        const { categoryRules, categories, t } = this.props;

        const categoryRulesList = Object.keys(
            categoryRules
        ).map(categoryRuleId => (
            <RuleCollectionItem
                ruleCollection={categoryRules[categoryRuleId]}
                categories={categories}
                t={t}
            />
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

                <Grid item xs={12} sm={3}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
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
                                <Button
                                    variant="raised"
                                    style={styles.newRuleButton}
                                    onClick={() =>
                                        this.triggerWorkerEvent(this.props)}
                                >
                                    {t("Apply rules")}
                                    <PlayArrowIcon style={styles.buttonIcons} />
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="raised"
                                    style={styles.newRuleButton}
                                    onClick={this.openImportDialog}
                                >
                                    {t("Import")}
                                    <FileDownloadIcon
                                        style={styles.buttonIcons}
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={12} sm={3} md={6}>
                                <TranslateTypography variant={"headline"}>
                                    Rules
                                </TranslateTypography>
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
        categories: state.categories.categories,
        categoryRules: state.category_rules.category_rules,

        paymentsLoading: state.payments.loading,
        bunqMeTabsLoading: state.bunq_me_tabs.loading,
        masterCardActionsLoading: state.master_card_actions.loading,
        requestInquiriesLoading: state.request_inquiries.loading,
        requestResponsesLoading: state.request_responses.loading,

        requestResponses: state.request_responses.request_responses,
        payments: state.payments.payments,
        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        masterCardActions: state.master_card_actions.master_card_actions,
        requestInquiries: state.request_inquiries.request_inquiries
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        setCategoryConnectionMultiple: (...params) =>
            dispatch(setCategoryConnectionMultiple(...params)),
        setCategoryRule: rule_collection =>
            dispatch(setCategoryRule(rule_collection))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(RuleDashboard)
);
