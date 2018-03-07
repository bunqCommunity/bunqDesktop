import React from "react";
import { connect } from "react-redux";
import CategoryChip from "./CategoryChip";
import CategoryHelper from "../../Helpers/CategoryHelper";

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
            console.log(1);
            return true;
        }

        if (this.props.payment.id !== nextProps.payment.id) {
            console.log(2);
            return true;
        }

        console.log(3);
        return false;
    }

    render() {
        const categories = CategoryHelper(
            this.props.categories,
            this.props.category_connections,
            this.props.type,
            this.props.payment.id
        );

        const chips = categories.map(category => {
            return (
                <CategoryChip
                    category={category}
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
