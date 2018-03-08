import React from "react";
import { connect } from "react-redux";
import Paper from "material-ui/Paper";

import CategoryHelper from "../../Helpers/CategoryHelper";
import CategoryChips from "./CategoryChips";

class CategorySelector extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            categories: {},
            category_connections: {}
        };
    }

    componentDidMount() {
        // set the current categories in the state so we can work outside the app
        this.setState({
            categories: this.props.categories,
            current_categories: this.props.category_connections
        });
    }

    render() {
        const { item, type } = this.props;
        if (!item[type]) return null;
        const itemInfo = item[type];

        // const categories = CategoryHelper(
        //     this.state.categories,
        //     this.state.category_connections,
        //     type,
        //     itemInfo.id
        // );

        return (
            <Paper>
                <CategoryChips
                    type={"Payment"}
                    id={itemInfo.id}
                    customCategories={this.state.categories}
                />
            </Paper>
        );
    }
}

CategorySelector.defaultProps = {
    style: {}
};

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

export default connect(mapStateToProps, mapDispatchToProps)(CategorySelector);
