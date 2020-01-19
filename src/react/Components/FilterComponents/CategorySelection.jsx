import React from "react";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";

import AddIcon from "@material-ui/icons/Add";
import FilterListIcon from "@material-ui/icons/FilterList";

import CustomIcon from "../CustomIcon";
import CategoryIcon from "../Categories/CategoryIcon";
import CategoryChip from "../Categories/CategoryChip";

import { addCategoryIdFilter, removeCategoryIdFilter, toggleCategoryIdFilter } from "../../Actions/filters";

const styles = {
    listItem: {
        display: "flex",
        flexWrap: "wrap",
        padding: "0 0 0 8px"
    },
    subheaderTitle: {
        height: 40
    }
};

class CategorySelection extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            anchorEl: null
        };
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    handleClose = event => {
        this.setState({ anchorEl: null });
    };

    addCategory = categoryId => event => {
        this.props.addCategoryId(categoryId);
    };
    removeCategory = index => event => {
        this.props.removeCategoryId(index);
    };

    render() {
        const { anchorEl } = this.state;
        const { categories, selectedCategories, t } = this.props;

        // limit size if a lot of categories are selected
        const bigChips = selectedCategories.length <= 4;

        const categoryItems = selectedCategories.map((categoryId, key) => {
            const category = categories[categoryId];

            // ensure category exists
            if (!category) return null;

            // display big chip or smaller icon
            return bigChips ? (
                <CategoryChip key={key} category={category} onDelete={this.removeCategory(key)} />
            ) : (
                <IconButton>
                    <CategoryIcon key={key} category={category} />
                </IconButton>
            );
        });

        const categoryMenuItems = Object.keys(categories).map((categoryId, key) => {
            const category = categories[categoryId];

            // don't display already selected items
            if (selectedCategories.includes(categoryId)) {
                return null;
            }

            return (
                <MenuItem key={key} onClick={this.addCategory(categoryId)}>
                    <ListItemIcon>
                        <CustomIcon
                            style={{
                                height: 24,
                                color: category.color,
                                marginRight: 16
                            }}
                        >
                            {category.icon}
                        </CustomIcon>
                    </ListItemIcon>
                    {category.label}
                </MenuItem>
            );
        });

        return (
            <React.Fragment>
                <ListSubheader style={styles.subheaderTitle}>
                    {t("Category filter")}

                    <ListItemSecondaryAction>
                        <Tooltip
                            placement="left"
                            title={t(
                                `Click to ${
                                    this.props.toggleCategoryFilter ? "include" : "exclude"
                                } the selected categories`
                            )}
                        >
                            <IconButton aria-haspopup="true" onClick={this.props.toggleCategoryIdFilter}>
                                {this.props.toggleCategoryFilter ? (
                                    <FilterListIcon className="icon-rotate-180" />
                                ) : (
                                    <FilterListIcon />
                                )}
                            </IconButton>
                        </Tooltip>

                        <IconButton aria-haspopup="true" onClick={this.handleClick}>
                            <AddIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                    <Menu anchorEl={this.state.anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                        {categoryMenuItems}
                    </Menu>
                </ListSubheader>
                <ListItem style={styles.listItem}>{categoryItems}</ListItem>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        categories: state.categories.categories,

        toggleCategoryFilter: state.category_filter.toggle,
        selectedCategories: state.category_filter.selected_categories
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleCategoryIdFilter: () => dispatch(toggleCategoryIdFilter()),
        addCategoryId: categoryId => dispatch(addCategoryIdFilter(categoryId)),
        removeCategoryId: index => dispatch(removeCategoryIdFilter(index))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategorySelection);
