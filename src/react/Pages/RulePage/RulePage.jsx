import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";

import RuleCreator from "./RuleCreator.tsx";
import RuleCollection from "../../Types/RuleCollection";
import {
    setCategoryRule,
    removeCategoryRule
} from "../../Actions/category_rules";
import { openSnackbar } from "../../Actions/snackbar";
import RuleCollectionPreview from "./RuleCollectionPreview";

const styles = {};

class RulesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            previewRuleCollection: null,
            previewUpdated: new Date()
        };
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

        let ruleCollection;
        if (
            ruleCollectionId !== "null" &&
            ruleCollectionId !== null &&
            categoryRules[ruleCollectionId]
        ) {
            ruleCollection = categoryRules[ruleCollectionId];
        } else {
            ruleCollection = new RuleCollection();
        }

        const payments = this.props.payments.map(item => item.toJSON());
        const requestInquiries = this.props.requestInquiries.map(item =>
            item.toJSON()
        );
        const requestResponses = this.props.requestResponses.map(item =>
            item.toJSON()
        );
        const masterCardActions = this.props.masterCardActions.map(item =>
            item.toJSON()
        );

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Rule Editor")}`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <RuleCreator
                        t={t}
                        categories={this.props.categories}
                        ruleCollection={ruleCollection}
                        updatePreview={this.updatePreview}
                        openSnackbar={this.props.openSnackbar}
                        saveRuleCollection={this.props.setCategoryRule}
                        removeCategoryCollection={this.props.removeCategoryRule}
                    />
                </Grid>
                <Grid item xs={12}>
                    <RuleCollectionPreview
                        t={t}
                        ruleCollection={this.state.previewRuleCollection}
                        ruleCollectionUpdated={this.state.previewUpdated}
                        payments={payments}
                        requestInquiries={requestInquiries}
                        masterCardActions={masterCardActions}
                        bunqMeTabs={this.props.bunqMeTabs}
                        requestResponses={requestResponses}
                    />
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
        setCategoryRule: rule_collection =>
            dispatch(setCategoryRule(rule_collection)),
        removeCategoryRule: category_rule_id =>
            dispatch(removeCategoryRule(category_rule_id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(RulesPage)
);
