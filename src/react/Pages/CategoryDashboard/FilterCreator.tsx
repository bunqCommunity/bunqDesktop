import * as React from "react";
import Divider from "material-ui/Divider";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import Table from "material-ui/Table";

import ValueFilterItem from "./FilterTypeItems/ValueFilterItem";
import CategoryChip from "../../Components/Categories/CategoryChip";

const styles = {
    title: {
        textAlign: "center",
        marginBottom: 16
    },
    subTitle: {
        margin: 12
    },
    chipsWrapper: {
        display: "flex",
        justifyContent: "center"
    },
    wrapper: {
        padding: 16,
        marginTop: 8
    }
};

export class FilterCreator extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            title: "Filter name 1",
            categoryIds: ["randomId"],
            filters: [
                {
                    filterType: "VALUE",
                    field: "IBAN",
                    matchType: "EXACT",
                    value: "NL06BUNQ2290608785"
                },
                {
                    filterType: "VALUE",
                    field: "DESCRIPTION",
                    matchType: "CONTAINS",
                    value: "WINDESHEIM"
                },
                {
                    filterType: "VALUE",
                    field: "DESCRIPTION",
                    matchType: "REGEX",
                    value: "/a/g"
                }
            ]
        };
    }

    addCategory = categoryInfo => event => {
        const categories = [...this.state.categoryIds];
        if (!categories.includes(categoryInfo.id)) {
            categories.push(categoryInfo.id);

            this.setState({ categories: categories });
        }
    };

    removeCategory = categoryInfo => event => {
        const categories = [...this.state.categoryIds];
        const index = categories.indexOf(categoryInfo.id);
        if (index !== -1) {
            const categoriesUpdated = categories.splice(index, 1);

            this.setState({ categories: categoriesUpdated });
        }
    };

    render() {
        const { categoryIds, title, filters } = this.state;

        console.log(categoryIds);

        const categoriesIncluded = [];
        const categoriesExcluded = [];
        Object.keys(this.props.categories).map(categoryId => {
            if (categoryIds.includes(categoryId)) {
                categoriesIncluded.push(this.props.categories[categoryId]);
            } else {
                categoriesExcluded.push(this.props.categories[categoryId]);
            }
        });

        const includedChips = Object.keys(
            categoriesIncluded
        ).map(categoryId => {
            const categoryInfo = categoriesIncluded[categoryId];
            return (
                <CategoryChip
                    key={categoryId}
                    category={categoryInfo}
                    onDelete={this.removeCategory(categoryInfo)}
                />
            );
        });

        const excludedChips = Object.keys(
            categoriesExcluded
        ).map(categoryId => {
            const categoryInfo = categoriesExcluded[categoryId];
            return (
                <CategoryChip
                    key={categoryId}
                    category={categoryInfo}
                    onClick={this.addCategory(categoryInfo)}
                />
            );
        });

        return [
            <Paper style={styles.wrapper} key={"rulesWrapper"}>
                <Typography variant="headline" style={styles.title}>
                    {title}
                </Typography>
                <Typography variant="title" style={styles.subTitle}>
                    Rules
                </Typography>
                <Table>
                    {filters.map((filter, filterKey) => {
                        switch (filter.filterType) {
                            case "VALUE":
                                return (
                                    <ValueFilterItem
                                        filter={filter}
                                        key={filterKey}
                                    />
                                );
                            case "ITEM_TYPE":
                                return null;
                        }
                    })}
                </Table>
            </Paper>,

            <Paper style={styles.wrapper} key={"categoryChipsWrapper"}>
                <Typography variant="title" style={styles.subTitle}>
                    Categories
                </Typography>
                <div>{includedChips}</div>
                <Divider />
                <div>{excludedChips}</div>
            </Paper>
        ];
    }
}
