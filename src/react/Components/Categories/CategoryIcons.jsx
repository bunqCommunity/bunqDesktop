import React from "react";
import { connect } from "react-redux";
import CategoryHelper from "./CategoryHelper";
import PrioritySorter from "./PrioritySorter";
import CategoryIcon from "./CategoryIcon";

const style = {
    marginTop: -20,
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "flex-end",
    minWidth: 160
};

class CategoryIcons extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState, _) {
        if (this.props.categories_last_udate !== nextProps.categories_last_udate) {
            return true;
        }

        if (this.props.id !== nextProps.id) {
            return true;
        }

        return false;
    }

    render() {
        const categories = CategoryHelper(
            this.props.categories,
            this.props.category_connections,
            this.props.type,
            this.props.id
        );

        if (categories.length === 0) return null;

        // sort by priority
        let sortedCategories = PrioritySorter(categories);

        // limit the amount of icons visible
        sortedCategories = sortedCategories.slice(0, this.props.iconCount);

        // create a list of chips
        const chips = sortedCategories.map(category => {
            return <CategoryIcon category={category} />;
        });

        return <div style={{ ...style, ...this.props.style }}>{chips}</div>;
    }
}

CategoryIcons.defaultProps = {
    chipStyle: {
        margin: 5
    },
    iconCount: 5,
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryIcons);
