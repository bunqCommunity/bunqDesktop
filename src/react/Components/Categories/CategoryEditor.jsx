import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";

import CustomIcon from "../CustomIcon";
import IconPicker from "../FormFields/IconPicker";
import ColorPicker from "../FormFields/ColorPicker";
import TranslateButton from "../TranslationHelpers/Button";
import TranslateTypography from "../TranslationHelpers/Typography";

import { setCategory } from "../../Actions/categories";

const styles = {
    titles: { textAlign: "center" },
    iconPicker: {
        width: "100%"
    },
    categoryLabelInput: {
        width: "100%",
        marginTop: 0
    },
    colorPicker: {
        margin: 5,
        width: null
    },
    previewChip: {
        margin: 5
    },
    newCategoryContainer: {
        padding: 5
    },
    button: {
        width: "100%",
        marginTop: 12
    }
};

class CategoryEditor extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            categories: {},
            category_connections: {},

            // false or an existing id for updates
            categoryId: false,
            label: "",
            labelError: false,
            priority: 5,
            color: "#06D72C",
            icon: "card_giftcard"
        };
    }

    componentDidUpdate() {
        if (this.state.categoryId !== this.props.selectedCategoryId) {
            const stateChanges = {
                categoryId: this.props.selectedCategoryId
            };
            if (this.props.selectedCategoryId && this.props.categories[this.props.selectedCategoryId]) {
                const categoryInfo = this.props.categories[this.props.selectedCategoryId];
                stateChanges.label = categoryInfo.label;
                stateChanges.icon = categoryInfo.icon;
                stateChanges.color = categoryInfo.color;
                stateChanges.priority = categoryInfo.priority;
            }

            this.setState(stateChanges);
        }
    }

    colorChange = color => {
        this.setState({ color: color.hex });
    };

    priorityChange = event => {
        this.setState({ priority: event.target.value });
    };

    labelChange = event => {
        const labelValue = event.target.value;

        const stateChanges = {
            labelError: false
        };
        if (labelValue.length <= 24) {
            stateChanges.label = labelValue;
        } else {
            stateChanges.labelError = true;
        }

        this.setState(stateChanges);
    };

    iconChange = icon => {
        this.setState({ icon: icon });
    };

    saveCategory = () => {
        // deselect the chip
        this.props.deselectChip();
        // save the data
        this.props.setCategory(
            this.state.categoryId,
            this.state.label,
            this.state.color,
            this.state.icon,
            this.state.priority
        );
    };

    render() {
        const t = this.props.t;
        return (
            <Grid container spacing={16} style={styles.newCategoryContainer}>
                <Grid item xs={12}>
                    <TranslateTypography type={"title"} style={styles.titles}>
                        Add a new category
                    </TranslateTypography>
                </Grid>

                <Grid item xs={12} style={{ textAlign: "center" }}>
                    <Chip
                        style={styles.previewChip}
                        label={this.state.label}
                        onDelete={() => {}}
                        avatar={
                            <Avatar
                                style={{
                                    backgroundColor: this.state.color
                                }}
                            >
                                <CustomIcon
                                    style={{
                                        height: 24
                                    }}
                                >
                                    {this.state.icon}
                                </CustomIcon>
                            </Avatar>
                        }
                    />

                    <CustomIcon style={{ color: this.state.color }}>{this.state.icon}</CustomIcon>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        label={t("Category label")}
                        error={this.state.labelError}
                        value={this.state.label}
                        onChange={this.labelChange}
                        margin="normal"
                        style={styles.categoryLabelInput}
                    />

                    <TextField
                        type="number"
                        margin="normal"
                        label={t("Category priority")}
                        value={this.state.priority}
                        onChange={this.priorityChange}
                        style={styles.categoryLabelInput}
                        InputProps={{ inputProps: { min: 0, max: 10 } }}
                    />

                    <ColorPicker
                        buttonStyle={styles.button}
                        pickerProps={{
                            style: styles.colorPicker,
                            color: this.state.color,
                            onChangeComplete: this.colorChange
                        }}
                    />

                    <IconPicker
                        style={styles.button}
                        onClick={this.iconChange}
                        buttonStyle={{
                            width: "100%"
                        }}
                    />

                    {this.props.selectedCategoryId ? (
                        <TranslateButton
                            variant="raised"
                            color="secondary"
                            style={styles.button}
                            onClick={this.props.deselectChip}
                        >
                            Cancel editing
                        </TranslateButton>
                    ) : null}

                    <TranslateButton
                        variant="raised"
                        disabled={this.state.labelError || this.state.label.length === 0}
                        color="primary"
                        style={styles.button}
                        onClick={this.saveCategory}
                    >
                        {this.props.selectedCategoryId ? t("Update category") : t("Add new category")}
                    </TranslateButton>
                </Grid>
            </Grid>
        );
    }
}

CategoryEditor.defaultProps = {
    style: {}
};

CategoryEditor.propTypes = {
    style: PropTypes.object,
    deselectChip: PropTypes.func,
    selectedCategoryId: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
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
        setCategory: (...params) => dispatch(setCategory(...params))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(CategoryEditor));
