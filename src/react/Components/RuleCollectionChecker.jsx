import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setCategoryConnectionMultiple } from "../Actions/categories";
import { setCategoryRule } from "../Actions/category_rules";

// import typed worker
const RuleCollectionCheckWorker = require("worker-loader!../WebWorkers/rule_collection_check.worker.js");

class RuleCollectionChecker extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};

        this.worker = new RuleCollectionCheckWorker();
        this.worker.onmessage = this.handleWorkerEvent;
    }

    componentWillUnmount() {
        this.worker.terminate();
    }

    componentDidUpdate(oldProps) {
        const updatedToggle = oldProps.updateToggle === true && this.props.updateToggle == false;

        // check if update state changed or queue finished
        if (updatedToggle || this.props.queueFinishedSync !== oldProps.queueFinishedSync) {
            // updateToggle went from true to false, update worker
            this.triggerWorkerEvent();
        }
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

    triggerWorkerEvent = () => {
        // use json format
        const payments = this.props.payments.map(item => item.toJSON());
        const requestInquiries = this.props.requestInquiries.map(item => item.toJSON());
        const requestResponses = this.props.requestResponses.map(item => item.toJSON());
        const masterCardActions = this.props.masterCardActions.map(item => item.toJSON());
        const bunqMeTabs = this.props.bunqMeTabs.map(item => item.toJSON());

        // get results for all our rule collections
        Object.keys(this.props.categoryRules).forEach(categoryRuleId => {
            const ruleCollection = this.props.categoryRules[categoryRuleId];
            if (ruleCollection && ruleCollection.isEnabled()) {
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

    render() {
        return null;
    }
}

RuleCollectionChecker.propTypes = {
    updateToggle: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
    return {
        categories: state.categories.categories,
        categoryRules: state.category_rules.category_rules,

        queueFinishedSync: state.queue.finished_queue,

        requestResponses: state.request_responses.request_responses,
        payments: state.payments.payments,
        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        masterCardActions: state.master_card_actions.master_card_actions,
        requestInquiries: state.request_inquiries.request_inquiries
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCategoryConnectionMultiple: (...params) => dispatch(setCategoryConnectionMultiple(...params)),
        setCategoryRule: rule_collection => dispatch(setCategoryRule(rule_collection))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RuleCollectionChecker);
