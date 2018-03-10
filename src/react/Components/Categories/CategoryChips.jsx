import React from "react";
import { connect } from "react-redux";
import CategoryChip from "./CategoryChip";
import CategoryHelper from "../../Helpers/CategoryHelper";
import PrioritySorter from "./PrioritySorter";

const style = {
    // marginTop: 6,
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "center"
};

class CategoryChips extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState, _) {
        if (
            this.props.categories_last_udate !== nextProps.categories_last_udate
        ) {
            return true;
        }

        if (this.props.id !== nextProps.id) {
            return true;
        }

        return false;
    }

    render() {
        const categories = CategoryHelper(
            this.props.customCategories
                ? this.props.customCategories
                : this.props.categories,
            this.props.category_connections,
            this.props.type,
            this.props.id
        );

        // sort by priority
        const sortedCategories = PrioritySorter(categories);

        // limit to 5 categories
        sortedCategories.slice(0, 5);

        // create a list of chips
        const chips = sortedCategories.map(category => {
            return (
                <CategoryChip
                    category={category}
                    onClick={this.props.onClick}
                    onDelete={this.props.onClick}
                    style={this.props.chipStyle}
                />
            );
        });

        return <div style={{ ...style, ...this.props.style }}>{chips}</div>;
    }
}

CategoryChips.defaultProps = {
    chipStyle: {
        margin: 5
    },
    onClick: false,
    onDelete: false,
    customCategories: false,
    style: style
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryChips);
