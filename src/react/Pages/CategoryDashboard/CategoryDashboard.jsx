import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";

import CategoryEditor from "../../Components/Categories/CategoryEditor";
import CategoryChip from "../../Components/Categories/CategoryChip";
import ImportDialog from "../../Components/ImportDialog";
import ExportDialog from "../../Components/ExportDialog";
import TypographyTranslate from "../../Components/TranslationHelpers/Typography";
import ButtonTranslate from "../../Components/TranslationHelpers/Button";

import {
    removeCategory,
    removeCategoryConnection,
    setCategory
} from "../../Actions/categories";
import { translate } from "react-i18next";

const styles = {
    chipWrapper: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap"
    }
};

class CategoryDashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedCategoryId: false,
            openExportDialog: false,
            openImportDialog: false
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
            this.props.setCategory(
                category.id,
                category.label,
                category.color,
                category.icon,
                category.priority
            );
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

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Category Editor")}`}</title>
                </Helmet>

                <Grid item xs={12} md={8}>
                    <TypographyTranslate variant="title" gutterBottom>
                        Categories
                    </TypographyTranslate>
                </Grid>

                <ExportDialog
                    title={t("Export categories")}
                    closeModal={() =>
                        this.setState({ openExportDialog: false })}
                    open={this.state.openExportDialog}
                    object={this.props.categories}
                />

                <ImportDialog
                    title={t("Import categories")}
                    closeModal={() =>
                        this.setState({ openImportDialog: false })}
                    importData={this.importCategories}
                    open={this.state.openImportDialog}
                />

                <Grid item xs={6} md={2}>
                    <ButtonTranslate
                        variant="raised"
                        color="primary"
                        style={{ width: "100%" }}
                        onClick={() =>
                            this.setState({ openExportDialog: true })}
                    >
                        Export
                    </ButtonTranslate>
                </Grid>
                <Grid item xs={6} md={2}>
                    <ButtonTranslate
                        variant="raised"
                        color="primary"
                        style={{ width: "100%" }}
                        onClick={() =>
                            this.setState({ openImportDialog: true })}
                    >
                        Import
                    </ButtonTranslate>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={16}>
                        <Grid item xs={12} md={4}>
                            <Paper>
                                <CategoryEditor
                                    selectedCategoryId={
                                        this.state.selectedCategoryId
                                    }
                                    deselectChip={this.deselectChip}
                                />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={8} style={{ marginTop: -8 }}>
                            <Paper style={styles.chipWrapper}>{chips}</Paper>
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
        removeCategory: (...params) => dispatch(removeCategory(...params)),
        removeCategoryConnection: (...params) =>
            dispatch(removeCategoryConnection(...params)),
        setCategory: (...params) => dispatch(setCategory(...params))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(CategoryDashboard)
);
