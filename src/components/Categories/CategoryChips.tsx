import React from "react";
import { connect } from "react-redux";
import { AppDispatch, ReduxState } from "~store/index";
import CategoryChip from "./CategoryChip";
import CategoryHelper from "./CategoryHelper";
import PrioritySorter from "./PrioritySorter";

const style = {
    // marginTop: 6,
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "center"
};

interface IState {
}

interface IProps {
}

class CategoryChips extends React.PureComponent<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    static defaultProps = {
        chipStyle: {
            margin: 5
        },
        // when true this list will show all categories which do NOT match the item id
        reverseChips: false,
        onClick: false,
        onDelete: false,
        // overwrite the categories set in redux with a custom set
        customCategories: false,
        style: style
    };

    state: IState;

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const categories = CategoryHelper(
            this.props.customCategories ? this.props.customCategories : this.props.categories,
            this.props.category_connections,
            this.props.type,
            this.props.id,
            this.props.reverseChips
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
                    onDelete={this.props.onDelete}
                    style={this.props.chipStyle}
                />
            );
        });

        return <div style={{ ...style, ...this.props.style }}>{chips}</div>;
    }
}

const mapStateToProps = (state: ReduxState) => {
    return {
        categories: state.categories.categories,
        categories_last_udate: state.categories.last_update,
        category_connections: state.categories.category_connections
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryChips);
