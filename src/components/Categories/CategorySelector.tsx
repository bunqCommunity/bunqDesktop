import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";

import TranslateButton from "../TranslationHelpers/Button";

import CategoryChips from "./CategoryChips";
import { actions as categoriesActions } from "~store/categories";

const styles = {
    title: { textAlign: "center" },
    newCategoryContainer: {
        padding: 5
    }
};

class CategorySelector extends React.Component<any> {
    static defaultProps = {
        style: {},
        displayToggleButton: true
    };

    state: any;

    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    componentDidMount() {
        if (!this.props.displayToggleButton) {
            this.setState({ open: true });
        }
    }

    handleDisconnect = event => {
        const { item, type } = this.props;
        if (item[type]) {
            const itemInfo = item[type];
            this.props.removeCategoryConnection(event.category.id, type, itemInfo.id);
        }
    };

    handleConnect = event => {
        const { item, type } = this.props;
        if (item[type]) {
            const itemInfo = item[type];
            this.props.setCategoryConnection(event.category.id, type, itemInfo.id);
        }
    };

    render() {
        const { item, type, displayToggleButton } = this.props;
        if (!item[type]) return null;
        const itemInfo = item[type];

        // don't allow the delete button by default
        const categoryChipProps: any = {
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
                    {displayToggleButton ? (
                        <TranslateButton onClick={_ => this.setState({ open: !this.state.open })}>
                            {this.state.open ? "Cancel" : "Manage categories"}
                        </TranslateButton>
                    ) : null}
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid item xs={12}>
                    <Collapse in={this.state.open}>
                        <CategoryChips type={type} id={itemInfo.id} onClick={this.handleConnect} reverseChips={true} />
                    </Collapse>
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
    return {
        setCategoryConnection: (id, type, itemInfo) => dispatch(categoriesActions.setCategoryConnection({ category_id: id, item_type: type, item_id: itemInfo })),
        removeCategoryConnection: (id, type, itemInfo) => dispatch(categoriesActions.removeCategoryConnection({ category_id: id, item_type: type, item_id: itemInfo }))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(CategorySelector));
