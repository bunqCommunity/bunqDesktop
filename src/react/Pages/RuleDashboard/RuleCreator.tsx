import * as React from "react";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import Table, { TableCell, TableHead, TableRow } from "material-ui/Table";

import AddButton from "material-ui-icons/Add";

import { Rule } from "./Types/Types";
import ValueRuleItem from "./RuleTypeItems/ValueRuleItem";
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

class RuleCreator extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);

        const rules: Rule[] = [
            {
                id: null,
                ruleType: "VALUE",
                field: "IBAN",
                matchType: "EXACT",
                value: "NL06BUNQ2290608785"
            },
            {
                id: null,
                ruleType: "VALUE",
                field: "DESCRIPTION",
                matchType: "CONTAINS",
                value: "WINDESHEIM"
            },
            {
                id: null,
                ruleType: "VALUE",
                field: "DESCRIPTION",
                matchType: "REGEX",
                value: "/a/g"
            }
        ];

        this.state = {
            title: "Rule 1",
            categoryIds: [],
            rules: rules
        };
    }

    addCategory = categoryInfo => event => {
        const categoryIds: string[] = [...this.state.categoryIds];
        if (!categoryIds.includes(categoryInfo.id)) {
            categoryIds.push(categoryInfo.id);

            this.setState({ categoryIds: categoryIds });
        }
    };

    removeCategory = categoryInfo => event => {
        const categories: string[] = [...this.state.categoryIds];
        const index = categories.indexOf(categoryInfo.id);

        if (index !== -1) {
            categories.splice(index, 1);
            this.setState({ categoryIds: categories });
        }
    };

    removeRule = ruleKey => event => {
        const rules: Rule[] = [...this.state.rules];
        console.log(rules, ruleKey);

        rules.splice(ruleKey, 1);

        console.log(rules, ruleKey);

        this.setState({ rules: rules });
    };

    addRule = event => {
        const rules = [...this.state.rules];
        const newRule: Rule = {
            id: null,
            ruleType: "VALUE",
            field: "DESCRIPTION",
            matchType: "EXACT",
            value: ""
        };
        rules.push(newRule);
        this.setState({ rules: rules });
    };

    render() {
        const { categoryIds, title, rules } = this.state;

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
                    <TableHead key={"tableHead"}>
                        <TableRow>
                            <TableCell>{null}</TableCell>
                            <TableCell>{null}</TableCell>
                            <TableCell>{null}</TableCell>
                            <TableCell>
                                <Button onClick={this.addRule}>
                                    <AddButton /> New
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {rules.map((rule, ruleKey) => {
                        switch (rule.ruleType) {
                            case "VALUE":
                                return (
                                    <ValueRuleItem
                                        removeRule={this.removeRule(ruleKey)}
                                        rule={rule}
                                        key={ruleKey}
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

export default RuleCreator;
