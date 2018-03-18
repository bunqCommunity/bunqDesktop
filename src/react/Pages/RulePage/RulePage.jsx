import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";

import RuleCreator from "./RuleCreator.tsx";
import RuleCollection from "./Types/RuleCollection";

const styles = {};

class RulesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { categoryRules, match } = this.props;
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

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Rule Editor`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <RuleCreator
                        categories={this.props.categories}
                        ruleCollection={ruleCollection}
                    />
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RulesPage);
