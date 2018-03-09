import React from "react";
import { connect } from "react-redux";
import Paper from "material-ui/Paper";
import Collapse from "material-ui/transitions/Collapse";

import CategoryHelper from "../../Helpers/CategoryHelper";
import CategoryChips from "./CategoryChips";

class CategorySelector extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            newVisible: false,
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

        return (
            <Paper>
                <CategoryChips
                    type={"Payment"}
                    id={itemInfo.id}
                    customCategories={this.state.categories}
                />
                <Collapse in={this.state.newVisible} unmountOnExit>

                </Collapse>
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
