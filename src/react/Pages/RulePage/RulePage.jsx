import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import RuleCreator from "./RuleCreator.tsx";
import RuleCollection from "../../Types/RuleCollection";
import RuleCollectionPreview from "./RuleCollectionPreview";
import { setCategoryRule, removeCategoryRule } from "../../Actions/category_rules";
import { openSnackbar } from "../../Actions/snackbar";

class RulesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            previewRuleCollection: null,
            previewUpdated: new Date(),

            checkedInitial: false,

            initialRules: false
        };
    }

    componentWillMount() {
        const searchParams = new URLSearchParams(this.props.location.search);
        if (searchParams.has("value")) {
            const value = searchParams.get("value");
            const field = searchParams.get("field") || "DESCRIPTION";

            this.setState({
                checkedInitial: true,
                initialRules: [
                    {
                        ruleType: "VALUE",
                        field: field,
                        matchType: "CONTAINS",
                        value: value
                    }
                ]
            });
        } else if (searchParams.has("amount")) {
            const amount = searchParams.get("amount");
            const match_type = searchParams.get("match_type") || "EXACTLY";

            this.setState({
                checkedInitial: true,
                initialRules: [
                    {
                        ruleType: "TRANSACTION_AMOUNT",
                        matchType: match_type,
                        amount: amount
                    }
                ]
            });
        } else {
            this.setState({
                checkedInitial: true
            });
        }
    }

    updatePreview = ruleCollection => {
        this.setState({
            previewRuleCollection: ruleCollection,
            previewUpdated: new Date()
        });
    };

    render() {
        const { categoryRules, match, t } = this.props;
        const ruleCollectionId = match.params.ruleId;

        // don't render before initial parameters are checked
        if (!this.state.checkedInitial) return null;

        let ruleCollection;
        if (ruleCollectionId !== "null" && ruleCollectionId !== null && categoryRules[ruleCollectionId]) {
            ruleCollection = categoryRules[ruleCollectionId];
        } else {
            ruleCollection = new RuleCollection(this.state.initialRules);
            if (this.state.initialRules) {
                ruleCollection.setTitle("New category rule");
                // if we have rules, set an id
                ruleCollection.ensureId();
            }
        }

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Rule Editor")}`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <Button onClick={this.props.history.goBack}>
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <RuleCreator
                        t={t}
                        BunqJSClient={this.props.BunqJSClient}
                        categories={this.props.categories}
                        accounts={this.props.accounts}
                        ruleCollection={ruleCollection}
                        updatePreview={this.updatePreview}
                        openSnackbar={this.props.openSnackbar}
                        saveRuleCollection={this.props.setCategoryRule}
                        removeCategoryCollection={this.props.removeCategoryRule}
                    />
                </Grid>

                <Grid item xs={12} md={2} />

                <Grid item xs={12} md={8}>
                    <RuleCollectionPreview
                        t={t}
                        ruleCollection={this.state.previewRuleCollection}
                        ruleCollectionUpdated={this.state.previewUpdated}
                        events={this.props.events}
                        openSnackbar={this.props.openSnackbar}
                    />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,

        categories: state.categories.categories,
        categoryRules: state.category_rules.category_rules,

        eventsLoading: state.events.loading,
        events: state.events.events
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        setCategoryRule: rule_collection => dispatch(setCategoryRule(rule_collection)),
        removeCategoryRule: category_rule_id => dispatch(removeCategoryRule(category_rule_id))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(RulesPage));
