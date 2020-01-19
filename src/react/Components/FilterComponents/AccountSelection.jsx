import React from "react";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
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

import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";

import { addAccountIdFilter, removeAccountIdFilter, toggleAccountIdFilter } from "../../Actions/filters";

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

class AccountSelection extends React.Component {
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

    addAccountId = accountId => event => {
        this.props.addAccountIdFilter(accountId);
        if (this.props.accounts.length === this.props.selectedAccountIds.length) {
            this.handleClose(event);
        }
    };
    removeAccountId = accountId => event => {
        this.props.removeAccountIdFilter(accountId);
    };

    render() {
        const { anchorEl } = this.state;
        const { t, accounts, selectedAccountIds, toggleAccountIds } = this.props;

        const selectedAccountChipItems = selectedAccountIds.map((accountId, key) => {
            const account = accounts.find(account => account.id === accountId);

            // ensure account exists
            if (!account) return null;

            // display big chip or smaller icon
            return (
                <IconButton onClick={this.removeAccountId(account.id)}>
                    <Avatar>
                        <LazyAttachmentImage
                            BunqJSClient={this.props.BunqJSClient}
                            imageUUID={account.avatar.image[0].attachment_public_uuid}
                            style={{ width: 40, height: 40 }}
                        />
                    </Avatar>
                </IconButton>
            );
        });

        const accountMenuItems = Object.keys(accounts)
            .filter(accountIndex => {
                const account = accounts[accountIndex];
                if (account && account.status !== "ACTIVE") {
                    return false;
                }
                return true;
            })
            .map((accountIndex, key) => {
                const account = accounts[accountIndex];

                // don't display already selected items
                if (selectedAccountIds.includes(account.id)) {
                    return null;
                }

                return (
                    <MenuItem key={key} onClick={this.addAccountId(account.id)}>
                        <ListItemIcon>
                            <Avatar style={styles.bigAvatar}>
                                <LazyAttachmentImage
                                    height={40}
                                    BunqJSClient={this.props.BunqJSClient}
                                    imageUUID={account.avatar.image[0].attachment_public_uuid}
                                />
                            </Avatar>
                        </ListItemIcon>
                        {account.description}
                    </MenuItem>
                );
            });

        return (
            <React.Fragment>
                <ListSubheader style={styles.subheaderTitle}>
                    {t("Account filter")}

                    <ListItemSecondaryAction>
                        <Tooltip
                            placement="left"
                            title={t(`Click to ${toggleAccountIds ? "include" : "exclude"} the selected accounts`)}
                        >
                            <IconButton aria-haspopup="true" onClick={this.props.toggleAccountIdFilter}>
                                {toggleAccountIds ? <FilterListIcon className="icon-rotate-180" /> : <FilterListIcon />}
                            </IconButton>
                        </Tooltip>

                        <IconButton aria-haspopup="true" onClick={this.handleClick}>
                            <AddIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                    <Menu anchorEl={this.state.anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                        {accountMenuItems}
                    </Menu>
                </ListSubheader>
                <ListItem style={styles.listItem}>{selectedAccountChipItems}</ListItem>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,

        selectedAccountIds: state.account_id_filter.selected_account_ids,
        toggleAccountIds: state.account_id_filter.toggle
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addAccountIdFilter: accountId => dispatch(addAccountIdFilter(accountId)),
        removeAccountIdFilter: index => dispatch(removeAccountIdFilter(index)),
        toggleAccountIdFilter: () => dispatch(toggleAccountIdFilter())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelection);
