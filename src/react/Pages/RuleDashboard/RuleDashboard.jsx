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
import RuleCollection from "../../Types/RuleCollection";
import { setCategoryRule } from "../../Actions/category_rules";

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

        const ruleCollection = new RuleCollection();
        const isValid = ruleCollection.validateRuleCollection(
            ruleCollectionObject
        );

        if (isValid !== true) {
            // display error
            console.log(isValid);
            return;
        }

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
        const { categoryRules } = this.props;

        const categoryRulesList = Object.keys(
            categoryRules
        ).map(categoryRuleId => (
            <RuleItem rule={categoryRules[categoryRuleId]} />
        ));

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Rule Dashboard`}</title>
                </Helmet>

                <ImportDialog
                    title="Import rule collection"
                    closeModal={this.closeImportDialog}
                    importData={this.importData}
                    open={this.state.openImportDialog}
                />

                <Grid item xs={12}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={6} sm={6} md={8}>
                                <Typography variant={"headline"}>
                                    Rules
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={3} md={2}>
                                <Button
                                    variant="raised"
                                    color="primary"
                                    style={styles.newRuleButton}
                                    onClick={this.openImportDialog}
                                >
                                    Import
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
                                    New
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

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        setCategoryRule: rule_collection =>
            dispatch(setCategoryRule(BunqJSClient, rule_collection))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RuleDashboard);
