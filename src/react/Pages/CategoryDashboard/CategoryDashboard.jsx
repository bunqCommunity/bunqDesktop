import React from "react";
import axios from "axios";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import CategoryEditor from "../../Components/Categories/CategoryEditor";
import CategoryChip from "../../Components/Categories/CategoryChip";
import ImportDialog from "../../Components/ImportDialog";
import ExportDialog from "../../Components/ExportDialog";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";

import { removeCategory, removeCategoryConnection, setCategory } from "../../Actions/categories";
import { openSnackbar } from "../../Actions/snackbar";

const styles = {
    chipWrapper: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap"
    },
    buttons: {
        width: "100%",
        marginBottom: 8
    }
};

class CategoryDashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedCategoryId: false,
            openExportDialog: false,
            openImportDialog: false,

            defaultCategories: false
        };
    }

    componentDidUpdate() {
        if (
            this.props.userType !== false &&
            this.props.userLoading === false &&
            this.props.usersLoading === false &&
            this.props.user === false
        ) {
            this.props.userLogin(this.props.userType, false);
        }
    }

    deleteCategory = categoryId => event => {
        this.props.removeCategory(categoryId);
    };

    selectChip = categoryId => event => {
        this.setState({ selectedCategoryId: categoryId });
    };

    deselectChip = event => {
        this.setState({ selectedCategoryId: false });
    };

    importCategories = data => {
        if (typeof data !== "object") return false;

        Object.keys(data).forEach(categoryKey => {
            const category = data[categoryKey];
            if (typeof category !== "object") return false;

            if (!category.id) {
                category.id = null;
            }
            if (!category.label) return false;
            if (!category.color) return false;
            if (!category.icon) return false;
            if (!category.priority) return false;

            // add this category
            this.props.setCategory(category.id, category.label, category.color, category.icon, category.priority);
        });
    };

    loadDefaultCategories = () => {
        axios
            .get("https://raw.githubusercontent.com/bunqCommunity/bunqDesktopTemplates/master/categories.json")
            .then(response => {
                this.setState({ defaultCategories: response.data });
            })
            .catch(error => {
                this.props.openSnackbar("Failed to load default categories");
            });
    };

    render() {
        const t = this.props.t;
        const chips = Object.keys(this.props.categories).map(categoryId => {
            return (
                <CategoryChip
                    category={this.props.categories[categoryId]}
                    onClick={this.selectChip(categoryId)}
                    onDelete={this.deleteCategory(categoryId)}
                    style={this.props.chipStyle}
                />
            );
        });

        const defaultCategoryChips = this.state.defaultCategories ? (
            <Paper style={{ padding: 8 }}>
                {Object.keys(this.state.defaultCategories).map(categoryId => {
                    return (
                        <CategoryChip
                            category={this.state.defaultCategories[categoryId]}
                            style={this.props.chipStyle}
                        />
                    );
                })}
            </Paper>
        ) : null;

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Category Editor")}`}</title>
                </Helmet>

                <Grid item xs={12} md={8}>
                    <TranslateTypography variant="h6" gutterBottom>
                        Categories
                    </TranslateTypography>
                </Grid>

                <ExportDialog
                    title={t("Export categories")}
                    closeModal={() => this.setState({ openExportDialog: false })}
                    open={this.state.openExportDialog}
                    object={this.props.categories}
                />

                <ImportDialog
                    title={t("Import categories")}
                    closeModal={() => this.setState({ openImportDialog: false })}
                    importData={this.importCategories}
                    open={this.state.openImportDialog}
                />

                <Grid item xs={6} md={2}>
                    <TranslateButton
                        variant="outlined"
                        color="primary"
                        style={{ width: "100%" }}
                        onClick={() => this.setState({ openExportDialog: true })}
                    >
                        Export
                    </TranslateButton>
                </Grid>
                <Grid item xs={6} md={2}>
                    <TranslateButton
                        variant="outlined"
                        color="primary"
                        style={{ width: "100%" }}
                        onClick={() => this.setState({ openImportDialog: true })}
                    >
                        Import
                    </TranslateButton>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={16}>
                        <Grid item xs={12} md={4}>
                            <Paper>
                                <CategoryEditor
                                    selectedCategoryId={this.state.selectedCategoryId}
                                    deselectChip={this.deselectChip}
                                />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={8} style={{ marginTop: -8 }}>
                            <Paper style={styles.chipWrapper}>{chips}</Paper>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={16}>
                        <Grid item xs={12} md={4}>
                            <Paper style={{ padding: 8 }}>
                                <TranslateButton
                                    variant="outlined"
                                    color="primary"
                                    style={styles.buttons}
                                    onClick={this.loadDefaultCategories}
                                >
                                    Load default categories
                                </TranslateButton>

                                <TranslateButton
                                    variant="outlined"
                                    style={styles.buttons}
                                    onClick={e => this.importCategories(this.state.defaultCategories)}
                                    disabled={!this.state.defaultCategories}
                                >
                                    Import default categories
                                </TranslateButton>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            {defaultCategoryChips}
                        </Grid>
                    </Grid>
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
        openSnackbar: message => dispatch(openSnackbar(message)),
        removeCategory: (...params) => dispatch(removeCategory(...params)),
        removeCategoryConnection: (...params) => dispatch(removeCategoryConnection(...params)),
        setCategory: (...params) => dispatch(setCategory(...params))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(CategoryDashboard));
