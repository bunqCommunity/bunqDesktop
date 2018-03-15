import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";

import CategoryChip from "../../Components/Categories/CategoryChip";
import RuleCreator from "./RuleCreator.tsx";

const styles = {};

class RuleDashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedCategoryId: false
        };
    }

    componentDidUpdate() {
        if (
            this.props.userType !== false &&
            this.props.userLoading === false &&
            this.props.usersLoading === false &&
            this.props.user === false
        ) {
            this.props.userLogin(this.props.userType, false);
        }
    }

    deleteCategory = categoryId => event => {
        this.props.removeCategory(categoryId);
    };

    selectChip = categoryId => event => {
        this.setState({ selectedCategoryId: categoryId });
    };

    deselectChip = event => {
        this.setState({ selectedCategoryId: false });
    };

    render() {
        const chips = Object.keys(this.props.categories).map(categoryId => {
            return (
                <CategoryChip
                    category={this.props.categories[categoryId]}
                    onClick={this.selectChip(categoryId)}
                    onDelete={this.deleteCategory(categoryId)}
                    style={this.props.chipStyle}
                />
            );
        });

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
        categories: state.categories.categories,
        categories_last_udate: state.categories.last_update,
        category_connections: state.categories.category_connections
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RuleDashboard);
