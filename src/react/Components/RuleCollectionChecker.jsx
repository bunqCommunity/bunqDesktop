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
        const events = [];
        this.props.events.map(event => {
            if (typeof event.object.toJSON !== "undefined") {
                events.push(event.toJSON());
            }
        });

        // get results for all our rule collections
        Object.keys(this.props.categoryRules).forEach(categoryRuleId => {
            const ruleCollection = this.props.categoryRules[categoryRuleId];
            if (ruleCollection && ruleCollection.isEnabled()) {
                this.worker.postMessage({
                    ruleCollection: ruleCollection,
                    events: events
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

        events: state.events.events
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCategoryConnectionMultiple: (...params) => dispatch(setCategoryConnectionMultiple(...params)),
        setCategoryRule: rule_collection => dispatch(setCategoryRule(rule_collection))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RuleCollectionChecker);
