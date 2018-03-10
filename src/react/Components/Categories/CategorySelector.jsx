import React from "react";
import { connect } from "react-redux";

import Chip from "material-ui/Chip";
import Icon from "material-ui/Icon";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Avatar from "material-ui/Avatar";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import Collapse from "material-ui/transitions/Collapse";

import CategoryChips from "./CategoryChips";
import IconPicker from "../FormFields/IconPicker";
import ColorPicker from "../FormFields/ColorPicker";

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

class CategorySelector extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            newVisible: false,
            categories: {},
            category_connections: {},

            // false or an existing id for updates
            categoryId: false,
            label: "",
            color: "#06D72C",
            icon: "card_giftcard"
        };
    }

    componentDidMount() {
        // set the current categories in the state so we can work outside the app
        this.setState({
            categories: this.props.categories,
            current_categories: this.props.category_connections
        });
    }

    colorChange = color => {
        this.setState({ color: color.hex });
    };

    labelChange = event => {
        this.setState({ label: event.target.value });
    };

    iconChange = icon => {
        this.setState({ icon: icon });
    };

    cancelEditing = event => {
        this.setState({ categoryId: false });
    };

    selectChipEvent = event => {
        this.setState({
            icon: event.category.icon,
            color: event.category.color,
            label: event.category.label,
            categoryId: event.category.id
        });
    };

    render() {
        const { item, type } = this.props;
        if (!item[type]) return null;
        const itemInfo = item[type];

        return (
            <Paper>
                <Grid container justify="center">
                    <Grid item xs={12} md={12}>
                        <CategoryChips
                            type={"Payment"}
                            id={itemInfo.id}
                            onClick={this.selectChipEvent}
                            onDelete={event => {
                                console.log(event);
                            }}
                            customCategories={this.state.categories}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {this.state.newVisible ? null : (
                            <Button
                                style={{ width: "100%" }}
                                onClick={() =>
                                    this.setState({
                                        newVisible: !this.state.newVisible
                                    })}
                            >
                                Add more
                            </Button>
                        )}
                    </Grid>
                </Grid>

                <Collapse in={this.state.newVisible} unmountOnExit>
                    <Grid container style={styles.newCategoryContainer}>
                        <Grid item xs={12}>
                            <Typography type={"title"} style={styles.titles}>
                                Add a new category
                            </Typography>
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
                                        <Icon
                                            style={{
                                                height: 24,
                                                width: 24
                                            }}
                                        >
                                            {this.state.icon}
                                        </Icon>
                                    </Avatar>
                                }
                            />

                            <Icon style={{ color: this.state.color }}>
                                {this.state.icon}
                            </Icon>
                        </Grid>

                        <Grid item xs={12} sm={12} md={1} lg={2} />

                        <Grid item xs={12} sm={6} md={5} lg={4}>
                            <TextField
                                label="Category label"
                                value={this.state.label}
                                onChange={this.labelChange}
                                margin="normal"
                                style={styles.categoryLabelInput}
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
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={5}
                            lg={4}
                            style={{
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <div style={{ flex: "1 1 100%" }} />

                            {this.state.categoryId ? (
                                <Button
                                    raised
                                    color="secondary"
                                    style={styles.button}
                                    onClick={this.cancelEditing}
                                >
                                    Cancel editing
                                </Button>
                            ) : null}

                            <Button
                                raised
                                disabled={
                                    this.state.label.length == 0 ||
                                    this.state.label.length >= 26
                                }
                                color="primary"
                                style={styles.button}
                            >
                                {this.state.categoryId ? (
                                    "Update category"
                                ) : (
                                    "Add new category"
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Collapse>
            </Paper>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CategorySelector);
