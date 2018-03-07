import React from "react";
import { connect } from "react-redux";
import Icon from "material-ui/Icon";
import CategoryHelper from "../../Helpers/CategoryHelper";

const style = {
    marginTop: -10,
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "flex-end"
};

class CategoryIcons extends React.Component {
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
            this.props.categories,
            this.props.category_connections,
            this.props.type,
            this.props.id
        );

        const chips = categories.map(category => {
            return (
                <div style={{width: 32}}>
                    <Icon style={{color: category.color}}>{category.icon}</Icon>
                </div>
            );
        });

        return <div style={{ ...style, ...this.props.style }}>{chips}</div>;
    }
}

CategoryIcons.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryIcons);
