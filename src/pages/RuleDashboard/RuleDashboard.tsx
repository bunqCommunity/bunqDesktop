import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import { AppWindow } from "~app";

import FileUploadIcon from "~components/CustomSVG/FileUpload";
import FileDownloadIcon from "~components/CustomSVG/FileDownload";
import AddIcon from "@material-ui/icons/Add";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import { AppDispatch, ReduxState } from "~store/index";

import RuleCollectionItem from "./RuleCollectionItem";
import NavLink from "~components/Routing/NavLink";
import ExportDialog from "~components/ExportDialog";
import ImportDialog from "~components/ImportDialog";
import TranslateTypography from "~components/TranslationHelpers/Typography";
import RuleCollection from "~models/RuleCollection";

import { actions as snackbarActions } from "~store/snackbar";
import { actions as categoryRulesActions } from "~store/categoryRules";

const styles = {
    paper: {
        padding: 16
    },
    button: {
        width: "100%"
    },
    buttonIcons: {
        marginLeft: 8
    }
};

interface IState {
    [key: string]: any;
}

interface IProps {
    t: AppWindow["t"];
}

class RuleDashboard extends React.Component<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    state: IState;

    constructor(props, context) {
        super(props, context);
        this.state = {
            openExportDialog: false,
            openImportDialog: false
        };
    }

    openImportDialog = () => this.setState({ openImportDialog: true });
    closeImportDialog = () => this.setState({ openImportDialog: false });
    openExportDialog = () => this.setState({ openExportDialog: true });
    closeExportDialog = () => this.setState({ openExportDialog: false });

    importData = ruleCollectionsReceived => {
        this.closeImportDialog();

        // check if ruleCollection info is an arrray
        if (
            ruleCollectionsReceived &&
            typeof ruleCollectionsReceived === "object" &&
            ruleCollectionsReceived.constructor === Array
        ) {
            // received object is an array so attempt to loop through them
            ruleCollectionsReceived.forEach(ruleCollectionObject => {
                // parse a single category rule
                this.importSingleRuleCollection(ruleCollectionObject);
            });
        } else if (ruleCollectionsReceived["category-rules"]) {
            // parse array inside category-rules key and loop through them
            ruleCollectionsReceived["category-rules"].forEach(ruleCollectionObject => {
                // parse a single category rule
                this.importSingleRuleCollection(ruleCollectionObject);
            });
        } else {
            // parse a single category rule
            this.importSingleRuleCollection(ruleCollectionsReceived);
        }
    };
    importSingleRuleCollection = ruleCollectionObject => {
        const isValid = RuleCollection.validateRuleCollection(ruleCollectionObject);

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

        const categoryRulesList = Object.keys(categoryRules).map((categoryRuleId, idx) => {
            const ruleCollection = new RuleCollection();
            ruleCollection.fromObject(categoryRules[categoryRuleId]);

            return <RuleCollectionItem key={idx} ruleCollection={ruleCollection} categories={categories} t={t}/>;
        });
        const categoryRulesArray = Object.values(categoryRules);

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Rule Dashboard")}`}</title>
                </Helmet>

                <ImportDialog
                    title={t("Import rule collection")}
                    showAsNewButton={true}
                    closeModal={this.closeImportDialog}
                    importData={this.importData}
                    open={this.state.openImportDialog}
                />

                <ExportDialog
                    closeModal={this.closeExportDialog}
                    title={t("Export rule collections")}
                    open={this.state.openExportDialog}
                    object={categoryRulesArray}
                />

                <Grid item xs={12} sm={3}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    // @ts-ignore
                                    component={NavLink}
                                    to={`/rule-page/null`}
                                    style={styles.button}
                                >
                                    {t("New")}
                                    <AddIcon style={styles.buttonIcons}/>
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    // @ts-ignore
                                    component={NavLink}
                                    to="/category-dashboard"
                                    style={styles.button}
                                >
                                    {t("Manage categories")}
                                    <BookmarkIcon style={styles.buttonIcons}/>
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Button variant="outlined" style={styles.button} onClick={this.openImportDialog}>
                                    {t("Import")}
                                    <FileDownloadIcon style={styles.buttonIcons}/>
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Button variant="outlined" style={styles.button} onClick={this.openExportDialog}>
                                    {t("Export")}
                                    <FileUploadIcon style={styles.buttonIcons}/>
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={12} sm={3} md={6}>
                                <TranslateTypography variant="h5">Rules</TranslateTypography>
                            </Grid>

                            <Grid item xs={12}>
                                <List>
                                    <Divider/>
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

const mapStateToProps = (state: ReduxState) => {
    return {
        categories: state.categories.categories,
        categoryRules: state.categoryRules.category_rules
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        openSnackbar: message => dispatch(snackbarActions.open({ message })),
        setCategoryRule: rule_collection => dispatch(categoryRulesActions.setRule(rule_collection))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(RuleDashboard));
