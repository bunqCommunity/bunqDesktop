import React from "react";
import CategoryChip from "./CategoryChip";
import CategoryHelper from "../../Helpers/CategoryHelper";

class CategoryChips extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentShouldUpdate() {
        return true;
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

        return <div style={this.props.style}>{chips}</div>;
    }
}

CategoryChips.defaultProps = {
    chipStyle: {
        margin: 6
    },
    style: {
        display: "flex",
        justifyContent: "center"
    }
};

export default CategoryChips;
