import * as React from "react";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Input from "material-ui/Input";
import Select from "material-ui/Select";
import Button from "material-ui/Button";
import Switch from "material-ui/Switch";
import Divider from "material-ui/Divider";
import { MenuItem } from "material-ui/Menu";
import TextField from "material-ui/TextField";
import { InputLabel } from "material-ui/Input";
import Typography from "material-ui/Typography";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Table, { TableCell, TableHead, TableRow } from "material-ui/Table";

import { Rule, RuleTypes } from "./Types/Types";
import {
    default as RuleCollection,
    RuleCollectionMatchType
} from "./Types/RuleCollection";

import NewRuleItemMenu from "./NewRuleItemMenu";
import ValueRuleItem from "./RuleTypeItems/ValueRuleItem";
import TransactionAmountRuleItem from "./RuleTypeItems/TransactionAmountRuleItem";
import CategoryChip from "../../Components/Categories/CategoryChip";

const styles = {
    title: {
        textAlign: "center",
        marginBottom: 16
    },
    subTitle: {
        margin: 12
    },
    saveButtonGridWrapper: {
        paddingTop: 18
    },
    checkboxGridWrapper: {
        paddingTop: 12,
        paddingBottom: 0,
        paddingLeft: 16
    },
    chipsWrapper: {
        display: "flex",
        justifyContent: "center"
    },
    matchTypeCell: {
        padding: 4
    },
    inputField: {
        width: "100%"
    },
    wrapper: {
        padding: 16,
        marginTop: 8
    }
};

class RuleCreator extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);

        const matchType: RuleCollectionMatchType = "AND";
        this.state = {
            id: "",
            title: "",
            matchType: matchType,
            categories: [],
            rules: [],
            enabled: false,

            titleError: false
        };
    }

    componentDidMount() {
        const ruleCollection: RuleCollection = this.props.ruleCollection;
        const ruleCollectionId = ruleCollection.getId();
        if (ruleCollectionId !== null) {
            // we should have a valid rule collection so extract the data
            this.setState({
                id: ruleCollectionId,
                title: ruleCollection.getTitle(),
                matchType: ruleCollection.getMatchType(),
                categories: ruleCollection.getCategories(),
                rules: ruleCollection.getRules(),
                enabled: ruleCollection.isEnabled()
            });
        } else {
            this.setState({ titleError: true });
        }
    }

    addCategory = categoryInfo => event => {
        const categories: string[] = [...this.state.categories];
        if (!categories.includes(categoryInfo.id)) {
            categories.push(categoryInfo.id);

            this.setState({ categories: categories });
        }
    };
    removeCategory = categoryInfo => event => {
        const categories: string[] = [...this.state.categories];
        const index = categories.indexOf(categoryInfo.id);

        if (index !== -1) {
            categories.splice(index, 1);
            this.setState({ categories: categories });
        }
    };

    removeRule = ruleKey => event => {
        const rules: Rule[] = [...this.state.rules];
        rules.splice(ruleKey, 1);
        this.setState({ rules: rules });
    };
    updateRule = ruleKey => (rule: Rule) => {
        const rules: Rule[] = [...this.state.rules];
        rules[ruleKey] = rule;
        this.setState({ rules: rules });
    };
    addRule = (ruleType: RuleTypes) => {
        const rules = [...this.state.rules];
        let newRule: Rule;

        switch (ruleType) {
            case "VALUE":
                newRule = {
                    ruleType: "VALUE",
                    field: "DESCRIPTION",
                    matchType: "EXACT",
                    value: ""
                };
                break;
            case "TRANSACTION_AMOUNT":
                newRule = {
                    ruleType: "TRANSACTION_AMOUNT",
                    matchType: "MORE",
                    amount: 5
                };
                break;
            // case "ITEM_TYPE":
            //     newRule = {
            //         id: null,
            //         ruleType: "ITEM_TYPE",
            //         matchType: "PAYMENT"
            //     };
            //     break;
            default:
                return false;
        }

        rules.push(newRule);
        this.setState({ rules: rules });
    };

    handleMatchTypeChange = event => {
        this.setState({ matchType: event.target.value });
    };

    handleTitleChange = event => {
        const title = event.target.value;
        const titleError = title.length <= 0 || title.length > 32;
        this.setState({ title: title, titleError: titleError });
    };

    handleEnabledToggle = event => {
        this.setState({ enabled: !this.state.enabled });
    };

    saveRuleCollection = event => {
        if (this.state.titleError) {
            return;
        }

        const ruleCollection = new RuleCollection();

        // parse the current state
        ruleCollection.fromObject(this.state);

        // make sure this collection has a valid ID
        ruleCollection.ensureId();

        // get the new ID so we can update instead of creating infinite clones
        this.setState({ id: ruleCollection.getId() });

        // send the updated class to the parent
        this.props.saveRuleCollection(ruleCollection);
    };

    render() {
        const { categories, title, rules, titleError } = this.state;

        const categoriesIncluded = [];
        const categoriesExcluded = [];
        Object.keys(this.props.categories).map(categoryId => {
            if (categories.includes(categoryId)) {
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

        return (
            <React.Fragment>
                <Typography variant="headline" style={styles.title}>
                    {title}
                </Typography>

                <Paper style={styles.wrapper} key={"settingsWrapper"}>
                    <Typography variant="title" style={styles.subTitle}>
                        Settings
                    </Typography>

                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label={"Filter title"}
                                value={this.state.title}
                                style={styles.inputField}
                                onChange={this.handleTitleChange}
                                error={titleError}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            style={styles.checkboxGridWrapper}
                        >
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="primary"
                                        checked={this.state.enabled}
                                        onChange={this.handleEnabledToggle}
                                    />
                                }
                                label="Enable or disable this rule set"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl style={styles.inputField}>
                                <InputLabel>Match requirements</InputLabel>
                                <Select
                                    value={this.state.matchType}
                                    onChange={this.handleMatchTypeChange}
                                    input={
                                        <Input name="field" id="field-helper" />
                                    }
                                >
                                    <MenuItem value={"AND"}>
                                        Require all rules to match
                                    </MenuItem>
                                    <MenuItem value={"OR"}>
                                        Only require 1 rule to match
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            style={styles.saveButtonGridWrapper}
                        >
                            <Button
                                variant="raised"
                                color="primary"
                                style={{ width: "100%" }}
                                onClick={this.saveRuleCollection}
                                disabled={titleError}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper style={styles.wrapper} key={"rulesWrapper"}>
                    <Table>
                        <TableHead key={"tableHead"}>
                            <TableRow>
                                <TableCell style={{ paddingLeft: 0 }}>
                                    <Typography
                                        variant="title"
                                        style={styles.subTitle}
                                    >
                                        Rules
                                    </Typography>
                                </TableCell>
                                <TableCell>{null}</TableCell>
                                <TableCell>{null}</TableCell>
                                <TableCell>
                                    <NewRuleItemMenu addRule={this.addRule} />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {rules.map((rule: Rule, ruleKey: string) => {
                            switch (rule.ruleType) {
                                case "VALUE":
                                    return (
                                        <ValueRuleItem
                                            removeRule={this.removeRule(
                                                ruleKey
                                            )}
                                            updateRule={this.updateRule(
                                                ruleKey
                                            )}
                                            rule={rule}
                                            key={ruleKey}
                                        />
                                    );
                                case "TRANSACTION_AMOUNT":
                                    return (
                                        <TransactionAmountRuleItem
                                            removeRule={this.removeRule(
                                                ruleKey
                                            )}
                                            updateRule={this.updateRule(
                                                ruleKey
                                            )}
                                            rule={rule}
                                            key={ruleKey}
                                        />
                                    );
                            }
                        })}
                    </Table>
                </Paper>

                <Paper style={styles.wrapper} key={"categoryChipsWrapper"}>
                    <Typography variant="title" style={styles.subTitle}>
                        Categories
                    </Typography>
                    <div>
                        <Typography
                            variant="subheading"
                            style={styles.subTitle}
                        >
                            Categories that will be added
                        </Typography>
                        {includedChips}
                    </div>
                    <Divider />
                    <div>
                        <Typography
                            variant="subheading"
                            style={styles.subTitle}
                        >
                            Categories
                        </Typography>
                        {excludedChips}
                    </div>
                </Paper>
            </React.Fragment>
        );
    }
}

export default RuleCreator;
