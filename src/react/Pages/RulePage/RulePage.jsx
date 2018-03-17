import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";

import RuleCreator from "./RuleCreator.tsx";

const styles = {};

class RulesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Rule Editor`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <RuleCreator categories={this.props.categories} />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        categories: state.categories.categories
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RulesPage);
