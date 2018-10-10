import React from "react";
import { translate } from "react-i18next";
import withTheme from "@material-ui/core/styles/withTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import Badge from "@material-ui/core/Badge";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";

import ArrowDownwardIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowUpwardIcon from "@material-ui/icons/KeyboardArrowUp";
import Share from "@material-ui/icons/Share";

import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import RequestInquiryListItem from "./RequestInquiryListItem";

import { formatMoney, humanReadableDate } from "../../Helpers/Utils";

const styles = {
    listItemText: {
        marginRight: 40
    },
    smallAvatar: {
        width: 50,
        height: 50
    },
    moneyAmountLabel: {
        marginRight: 20,
        fontSize: "1rem"
    }
};

const classStyles = theme => ({
    badge: {
        top: -8,
        right: -8,
        border: `2px solid ${theme.palette.type === "light" ? theme.palette.grey[200] : theme.palette.grey[900]}`
    }
});

class RequestInquiryBatchListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            extraInfoOpen: false,
            paymentsOpen: false
        };
    }

    toggleExtraInfo = () => {
        this.setState({ extraInfoOpen: !this.state.extraInfoOpen });
    };

    togglePayments = () => {
        this.setState({ paymentsOpen: !this.state.paymentsOpen });
    };

    render() {
        const { requestInquiryBatch, accounts, theme, t } = this.props;
        const requestItemCounts = {
            accepted: 0,
            pending: 0,
            rejected: 0,
            revoked: 0,
            expired: 0
        };
        let primaryText = "";
        let secondaryText = false;
        let targetTexts = [];
        let monetaryAccountId = false;
        let monetaryAccountInfo = false;

        const createdDate = humanReadableDate(requestInquiryBatch.created);
        const updatedDate = humanReadableDate(requestInquiryBatch.updated);
        const requestInquiries = requestInquiryBatch.request_inquiries;
        const numberOfPayments = requestInquiries.length;

        // calculate how much was paid to this inquiry
        const totalPaidAmount = requestInquiries.reduce((accumulator, requestInquiry) => {
            if (requestInquiry.status !== "ACCEPTED") return accumulator;

            const paidAmount = parseFloat(requestInquiry.amount_responded.value);
            return accumulator + paidAmount;
        }, 0);

        // count how many of each type
        requestInquiries.forEach(requestInquiry => {
            // store account id
            monetaryAccountId = requestInquiry.monetary_account_id;

            // add display name to target list
            targetTexts.push(requestInquiry.counterparty_alias.display_name);

            // count the status
            switch (requestInquiry.status) {
                case "REJECTED":
                    requestItemCounts.rejected += 1;
                    break;
                case "REVOKED":
                    requestItemCounts.revoked += 1;
                    break;
                case "ACCEPTED":
                    requestItemCounts.accepted += 1;
                    break;
                case "PENDING":
                case "WAITING_FOR_PAYMENT":
                    requestItemCounts.pending += 1;
                    break;
                case "EXPIRED":
                    requestItemCounts.expired += 1;
                    break;
            }
        });

        // get event color and font style based on status counter
        let strikeThrough = false;
        let eventColor =
            requestItemCounts.pending > 0
                ? // pick between pending or finished color
                  theme.palette.requestInquiry.pending
                : requestItemCounts.accepted > 0
                    ? // pick between accepted or expired if atleast 1 got accepted
                      theme.palette.requestInquiry.accepted
                    : theme.palette.requestInquiry.expired;
        if (requestItemCounts.pending === 0) {
            if (requestItemCounts.rejected > 0 || requestItemCounts.revoked > 0) {
                strikeThrough = true;
            }
        }

        // human readable money amounts
        const formattedInquiredAmount = formatMoney(requestInquiryBatch.getTotalAmountInquired());
        const formattedTotalPaidAmount = formatMoney(totalPaidAmount);

        // get imageUUId if monetary details are set
        let imageUUID = false;
        if (monetaryAccountId) {
            // get monetary details for this batch
            monetaryAccountInfo = accounts.find(account => account.id === monetaryAccountId);
            if (monetaryAccountInfo && monetaryAccountInfo.avatar) {
                imageUUID = monetaryAccountInfo.avatar.image[0].attachment_public_uuid;
            }
        }

        // avatar object on its own
        const shareIcon = <Share color={"inherit"} style={{ color: eventColor }} />;
        const avatarStandalone = (
            <Avatar style={styles.smallAvatar}>
                {imageUUID ? (
                    <LazyAttachmentImage height={50} BunqJSClient={this.props.BunqJSClient} imageUUID={imageUUID} />
                ) : (
                    shareIcon
                )}
            </Avatar>
        );

        // wrap avatar in a badge if required
        const itemAvatar =
            numberOfPayments <= 0 ? (
                avatarStandalone
            ) : (
                <Badge badgeContent={numberOfPayments} color="primary" classes={{ badge: this.props.classes.badge }}>
                    {avatarStandalone}
                </Badge>
            );

        // format the target names into a primary text
        let andMoreText = "";
        if (targetTexts.length > 3) {
            // max 3 names and add the `and more` text to the end
            andMoreText = t("and more");
            targetTexts = targetTexts.slice(0, 3);
        }
        primaryText = `${targetTexts.join(", ")} ${andMoreText}`;

        // format the different outstanding status counts into a secondary text
        Object.keys(requestItemCounts).map(requestCounterType => {
            const requestItemCount = requestItemCounts[requestCounterType];

            if (requestItemCount > 0) {
                const partString = `${requestItemCount} ${t(requestCounterType)}`;

                // create a new string
                secondaryText = secondaryText === false ? partString : `${secondaryText}, ${partString}`;
            }
        });

        return [
            <ListItem button onClick={this.toggleExtraInfo}>
                {itemAvatar}
                <ListItemText primary={primaryText} secondary={secondaryText} />
                <ListItemSecondaryAction style={{ marginTop: -16 }}>
                    <Typography
                        style={{
                            ...styles.moneyAmountLabel,
                            color: eventColor,
                            textDecoration: strikeThrough ? "line-through" : "none"
                        }}
                        variant="body2"
                    >
                        {formattedInquiredAmount}
                    </Typography>
                </ListItemSecondaryAction>
            </ListItem>,
            <Collapse in={this.state.extraInfoOpen} unmountOnExit>
                <ListItem dense>
                    <ListItemText primary={t("Created")} secondary={createdDate} />
                </ListItem>

                <ListItem dense>
                    <ListItemText primary={t("Total requested amount")} secondary={formattedInquiredAmount} />
                </ListItem>

                <ListItem dense>
                    <ListItemText primary={t("Total received amount")} secondary={formattedTotalPaidAmount} />
                </ListItem>

                {updatedDate !== createdDate ? (
                    <ListItem dense>
                        <ListItemText primary={t("Updated")} secondary={updatedDate} />
                    </ListItem>
                ) : null}

                <ListItem button dense onClick={this.togglePayments}>
                    <ListItemText primary={t("Number of requests")} secondary={"" + numberOfPayments} />
                    <ListItemSecondaryAction>
                        <Icon color="action">
                            {this.state.paymentsOpen ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                        </Icon>
                    </ListItemSecondaryAction>
                </ListItem>

                <Collapse in={this.state.paymentsOpen} unmountOnExit>
                    {requestInquiries.map(requestInquiry => {
                        return (
                            <RequestInquiryListItem
                                requestInquiry={requestInquiry}
                                BunqJSClient={this.props.BunqJSClient}
                            />
                        );
                    })}
                </Collapse>
            </Collapse>,
            <Divider style={{ marginBottom: this.state.paymentsOpen ? 12 : 0 }} />
        ];
    }
}

RequestInquiryBatchListItem.defaultProps = {
    displayAcceptedRequests: true,
    minimalDisplay: false
};

export default withTheme()(translate("translations")(withStyles(classStyles)(RequestInquiryBatchListItem)));
