import React from "react";
import {connect} from "react-redux";
import Grid from "material-ui/Grid";
import Divider from "material-ui/Divider";
import Button from "material-ui/Button";
import Collapse from "material-ui/transitions/Collapse";

import CategoryChips from "./CategoryChips";
import {
    removeCategoryConnection,
    setCategoryConnection
} from "../../Actions/categories";

const styles = {
    title: {textAlign: "center"},
    newCategoryContainer: {
        padding: 5
    }
};

class CategorySelector extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    handleDisconnect = event => {
        const {item, type} = this.props;
        if (item[type]) {
            const itemInfo = item[type];
            this.props.removeCategoryConnection(
                event.category.id,
                type,
                itemInfo.id
            );
        }
    };

    handleConnect = event => {
        const {item, type} = this.props;
        if (item[type]) {
            const itemInfo = item[type];
            this.props.setCategoryConnection(
                event.category.id,
                type,
                itemInfo.id
            );
        }
    };

    render() {
        const {item, type} = this.props;
        if (!item[type]) return null;
        const itemInfo = item[type];

        // don't allow the delete button by default
        const categoryChipProps = {
            type: type,
            id: itemInfo.id
        };
        if (this.state.open) {
            categoryChipProps.onDelete = this.handleDisconnect;
        }

        return (
            <Grid container spacing={16} style={styles.newCategoryContainer}>
                <Grid item xs={12}>
                    <CategoryChips {...categoryChipProps} />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        onClick={_ => this.setState({open: !this.state.open})}
                    >
                        {this.state.open ? "Cancel" : "Manage categories"}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={this.state.open}>
                        <Divider/>
                        <CategoryChips
                            type={type}
                            id={itemInfo.id}
                            onClick={this.handleConnect}
                            reverseChips={true}
                        />
                    </Collapse>
                </Grid>
            </Grid>
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
    return {
        setCategoryConnection: (...params) =>
            dispatch(setCategoryConnection(...params)),
        removeCategoryConnection: (...params) =>
            dispatch(removeCategoryConnection(...params))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategorySelector);
