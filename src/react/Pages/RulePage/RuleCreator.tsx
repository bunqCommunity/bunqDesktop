import * as React from "react";
import { translate } from "react-i18next";
import Redirect from "react-router-dom/Redirect";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Divider from "@material-ui/core/Divider";
import MenuItemObj from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import CategoryChip from "../../Components/Categories/CategoryChip";
import ExportDialog2 from "../../Components/ExportDialog";
const ExportDialog: any = ExportDialog2;
import ImportDialog from "../../Components/ImportDialog";
import NewRuleItemMenu from "./NewRuleItemMenu";
import RuleCollectionMenu2 from "./RuleCollectionMenu";
const RuleCollectionMenu: any = RuleCollectionMenu2;
const MenuItem: any = MenuItemObj;

import AccountRuleItem from "./RuleTypeItems/AccountRuleItem";
import ValueRuleItem from "./RuleTypeItems/ValueRuleItem";
import TransactionAmountRuleItem from "./RuleTypeItems/TransactionAmountRuleItem";
import ItemTypeRuleItem from "./RuleTypeItems/ItemTypeRuleItem";

import Rule from "../../Types/Rules/Rule";
import { RuleTypes } from "../../Types/Types";
import { default as RuleCollection, RuleCollectionMatchType } from "../../Types/RuleCollection";

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
        marginBottom: 8
    }
};

class RuleCreator extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);

        const matchType: RuleCollectionMatchType = "AND";
        this.state = {
            id: null,
            title: "",
            matchType: matchType,
            categories: [],
            rules: [],
            enabled: false,

            titleError: false,
            openImportDialog: false,
            openExportDialog: false,
            exportData: null,

            goToDashboard: false
        };
    }

    componentDidMount() {
        const ruleCollection: RuleCollection = this.props.ruleCollection;
        const ruleCollectionId = ruleCollection.getId();
        if (ruleCollectionId !== null) {
            // we should have a valid rule collection so extract the data
            this.setState(
                {
                    id: ruleCollectionId,
                    title: ruleCollection.getTitle(),
                    matchType: ruleCollection.getMatchType(),
                    categories: ruleCollection.getCategories(),
                    rules: ruleCollection.getRules(),
                    enabled: ruleCollection.isEnabled()
                },
                this.updatePreview
            );
        } else {
            this.setState({ titleError: true }, this.updatePreview);
        }
    }

    // sends an update event to the parent class to update the preview list
    updatePreview = () => {
        const ruleCollection = new RuleCollection();
        ruleCollection.fromObject(this.state);
        this.props.updatePreview(ruleCollection);
    };

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
        this.setState({ rules: rules }, this.updatePreview);
    };
    updateRule = ruleKey => (rule: Rule) => {
        const rules: Rule[] = [...this.state.rules];
        rules[ruleKey] = rule;
        this.setState({ rules: rules });
    };
    addRule = (ruleType: RuleTypes) => {
        let rules = [...this.state.rules];
        let newRule: Rule;

        switch (ruleType) {
            case "VALUE":
                newRule = {
                    ruleType: "VALUE",
                    field: "DESCRIPTION",
                    matchType: "CONTAINS",
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
            case "ITEM_TYPE":
                newRule = {
                    ruleType: "ITEM_TYPE",
                    matchType: "PAYMENT"
                };
                break;
            case "ACCOUNT_TYPE":
                newRule = {
                    ruleType: "ACCOUNT_TYPE",
                    paymentType: "ALL",
                    accountId: 0
                };
                break;
            default:
                return false;
        }

        // add the new rule to the list
        rules.push(newRule);

        // put the item_type first because these are checked the fastest
        rules = rules.sort((ruleA: Rule, ruleB: Rule) => {
            if (ruleA.ruleType === "ITEM_TYPE" && ruleB.ruleType === "ITEM_TYPE") {
                return 0;
            } else if (ruleA.ruleType !== "ITEM_TYPE" && ruleB.ruleType === "ITEM_TYPE") {
                return 1;
            } else if (ruleA.ruleType === "ITEM_TYPE" && ruleB.ruleType !== "ITEM_TYPE") {
                return -1;
            }
        });

        this.setState({ rules: rules }, this.updatePreview);
    };

    handleMatchTypeChange = (event: any) => {
        this.setState({ matchType: event.target.value }, this.updatePreview);
    };
    handleTitleChange = (event: any) => {
        const title = event.target.value;
        const titleError = title.length <= 0 || title.length > 32;
        this.setState({ title: title, titleError: titleError });
    };
    handleEnabledToggle = (event: any) => {
        this.setState({ enabled: !this.state.enabled });
    };

    saveRuleCollection = (event: any) => {
        if (this.state.titleError) {
            return;
        }
        const ruleCollection = this.createRuleCollection();
        // get the new ID so we can update instead of creating infinite clones
        this.setState({ id: ruleCollection.getId() }, this.updatePreview);

        // send the updated class to the parent
        this.props.saveRuleCollection(ruleCollection);

        // display a confirmation message
        this.props.openSnackbar(this.props.t("Changes were saved!"));
    };
    createRuleCollection = (): RuleCollection => {
        const ruleCollection = new RuleCollection();
        // parse the current state
        ruleCollection.fromObject(this.state);
        // make sure this collection has a valid ID
        ruleCollection.ensureId();

        return ruleCollection;
    };
    deleteRuleCollection = () => {
        this.props.removeCategoryCollection(this.state.id);
        this.setState({ goToDashboard: true });
    };

    openExportDialog = (data = false) => {
        this.setState({
            openExportDialog: true,
            exportData: data === false ? this.createRuleCollection() : data
        });
    };
    closeExportDialog = (event: any) => {
        this.setState({ openExportDialog: false, exportData: null });
    };

    openImportDialog = (event: any) => {
        this.setState({ openImportDialog: true });
    };
    closeImportDialog = (event: any) => {
        this.setState({ openImportDialog: false });
    };
    importRule = (rule: Rule) => {
        this.closeImportDialog(null);

        const isValid = RuleCollection.validateRule(rule);

        if (isValid !== true) {
            // display error
            this.props.openSnackbar(isValid.message);
            return;
        }

        // add the rule to the ruleset
        const rules: Rule[] = [...this.state.rules];
        rules.push(rule);
        this.setState({ rules: rules }, this.updatePreview);
    };

    render() {
        const { categories, title, rules, titleError, goToDashboard } = this.state;
        const t = this.props.t;

        if (goToDashboard) {
            return <Redirect to="/rules-dashboard" />;
        }

        const categoriesIncluded = [];
        const categoriesExcluded = [];
        Object.keys(this.props.categories).map(categoryId => {
            if (categories.includes(categoryId)) {
                categoriesIncluded.push(this.props.categories[categoryId]);
            } else {
                categoriesExcluded.push(this.props.categories[categoryId]);
            }
        });

        const includedChips = Object.keys(categoriesIncluded).map(categoryId => {
            const categoryInfo = categoriesIncluded[categoryId];
            return (
                <CategoryChip key={categoryId} category={categoryInfo} onDelete={this.removeCategory(categoryInfo)} />
            );
        });

        const excludedChips = Object.keys(categoriesExcluded).map(categoryId => {
            const categoryInfo = categoriesExcluded[categoryId];
            return <CategoryChip key={categoryId} category={categoryInfo} onClick={this.addCategory(categoryInfo)} />;
        });

        const ruleItems = rules.map((rule: Rule, ruleKey: string) => {
            switch (rule.ruleType) {
                case "VALUE":
                    return (
                        <ValueRuleItem
                            openExportDialog={this.openExportDialog}
                            removeRule={this.removeRule(ruleKey)}
                            updateRule={this.updateRule(ruleKey)}
                            rule={rule}
                            key={ruleKey}
                        />
                    );
                case "TRANSACTION_AMOUNT":
                    return (
                        <TransactionAmountRuleItem
                            openExportDialog={this.openExportDialog}
                            removeRule={this.removeRule(ruleKey)}
                            updateRule={this.updateRule(ruleKey)}
                            rule={rule}
                            key={ruleKey}
                        />
                    );
                case "ITEM_TYPE":
                    return (
                        <ItemTypeRuleItem
                            openExportDialog={this.openExportDialog}
                            removeRule={this.removeRule(ruleKey)}
                            updateRule={this.updateRule(ruleKey)}
                            rule={rule}
                            key={ruleKey}
                        />
                    );
                case "ACCOUNT_TYPE":
                    return (
                        <AccountRuleItem
                            BunqJSClient={this.props.BunqJSClient}
                            openExportDialog={this.openExportDialog}
                            removeRule={this.removeRule(ruleKey)}
                            updateRule={this.updateRule(ruleKey)}
                            accounts={this.props.accounts}
                            rule={rule}
                            key={ruleKey}
                        />
                    );
            }
        });

        return (
            <React.Fragment>
                <Paper style={styles.wrapper}>
                    <Grid container spacing={16}>
                        <Grid item xs={11}>
                            <Typography variant="h6" style={styles.subTitle}>
                                {t("Settings")}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <RuleCollectionMenu
                                canBeDeleted={this.state.id !== null}
                                deleteRuleCollection={this.deleteRuleCollection}
                                openExportDialog={this.openExportDialog}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label={t("Ruleset title")}
                                value={title}
                                style={styles.inputField}
                                onChange={this.handleTitleChange}
                                error={titleError}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} style={styles.checkboxGridWrapper}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="primary"
                                        checked={this.state.enabled}
                                        onChange={this.handleEnabledToggle}
                                    />
                                }
                                label={t("Enable or disable this ruleset")}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl style={styles.inputField}>
                                <InputLabel>{t("Match requirements")}</InputLabel>
                                <Select value={this.state.matchType} onChange={this.handleMatchTypeChange}>
                                    <MenuItem value={"AND"}>{t("Require all rules to match")}</MenuItem>
                                    <MenuItem value={"OR"}>{t("Only require 1 rule to match")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} style={styles.saveButtonGridWrapper}>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ width: "100%" }}
                                onClick={this.saveRuleCollection}
                                disabled={titleError}
                            >
                                {t("Save")}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper style={styles.wrapper} key={"rulesWrapper"}>
                    <Table>
                        <TableHead key={"tableHead"}>
                            <TableRow>
                                <TableCell style={{ paddingLeft: 0 }}>
                                    <Typography variant="h6" style={styles.subTitle}>
                                        {t("Rules")}
                                    </Typography>
                                </TableCell>
                                <TableCell>{null}</TableCell>
                                <TableCell>{null}</TableCell>
                                <TableCell>
                                    <NewRuleItemMenu addRule={this.addRule} openImportDialog={this.openImportDialog} />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{ruleItems}</TableBody>
                    </Table>
                </Paper>

                <Paper style={styles.wrapper} key={"categoryChipsWrapper"}>
                    <Typography variant="h6" style={styles.subTitle}>
                        {t("Categories")}
                    </Typography>
                    <div>
                        <Typography variant="subtitle1" style={styles.subTitle}>
                            {t("Categories that will be added")}
                        </Typography>
                        {includedChips}
                    </div>
                    <Divider />
                    <div>{excludedChips}</div>
                </Paper>

                <ExportDialog
                    closeModal={this.closeExportDialog}
                    title={t("Export data")}
                    open={this.state.openExportDialog}
                    object={this.state.exportData}
                />
                <ImportDialog
                    closeModal={this.closeImportDialog}
                    importData={this.importRule}
                    title={t("Import rule")}
                    open={this.state.openImportDialog}
                />
            </React.Fragment>
        );
    }
}

export default translate("translations")(RuleCreator);
