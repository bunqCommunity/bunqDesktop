import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Divider from "material-ui/Divider";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import List from "material-ui/List";

import RuleItem from "./RuleItem";

import { setCategoryRule } from "../../Actions/category_rules";
import NavLink from "../../Components/Routing/NavLink";

const styles = {
    paper: {
        padding: 16
    },
    newRuleButton: {
        width: "100%"
    }
};

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
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={6} sm={8} md={9}>
                                <Typography variant={"headline"}>
                                    Rules
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4} md={3}>
                                <Button
                                    variant="raised"
                                    color="primary"
                                    component={NavLink}
                                    to={`/rule-page/null`}
                                    style={styles.newRuleButton}
                                >
                                    New rule set
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RuleDashboard);
