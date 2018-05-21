import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";

import FileDownloadIcon from "@material-ui/icons/FileDownload";
import AddIcon from "@material-ui/icons/Add";

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
        categoryRules: state.category_rules.category_rules
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
