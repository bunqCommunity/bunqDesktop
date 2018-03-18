import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import List from "material-ui/List";

import RuleItem from "./RuleItem";

import { setCategoryRule } from "../../Actions/category_rules";
import NavLink from "../../Components/Routing/NavLink";

const styles = {};

class RuleDashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

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

                <Grid item xs={12}>
                    <Paper>
                        <Typography variant={"title"}>Rules</Typography>
                        <Button
                            variant="raised"
                            color="primary"
                            component={NavLink}
                            to={`/rule-page/null`}
                        >
                            New rule set
                        </Button>
                        <List>{categoryRulesList}</List>
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
