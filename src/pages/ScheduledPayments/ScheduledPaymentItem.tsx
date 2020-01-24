import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import DeleteIcon from "@material-ui/icons/Delete";

import LazyAttachmentImage from "~components/AttachmentImage/LazyAttachmentImage";
import MoneyAmountLabel from "~components/MoneyAmountLabel";

import scheduleTexts from "~functions/ScheduleTexts";
import { formatMoney, humanReadableDate } from "~functions/Utils";

const styles = {
    paper: {
        padding: 24,
        marginBottom: 16
    },
    smallAvatar: {
        width: 50,
        height: 50
    },
    moneyAmountLabel: {
        marginRight: 20
    }
};

interface IState {
    [key: string]: any;
}

interface IProps {
    [key: string]: any;
}

class ScheduledPaymentItem extends React.Component<IProps> {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { scheduledPayment, key, t } = this.props;
        const nextPaymentTextTranslate = t("Next payment");
        const scheduleExpiredTranslate = t("Schedule expired");

        const scheduledPaymentInfo = scheduledPayment.ScheduledPayment;
        const schedule = scheduledPaymentInfo.schedule;

        if (scheduledPaymentInfo.status !== "ACTIVE") {
            return null;
        }

        const description = scheduledPaymentInfo.payment.description;

        const scheduleTextResult = scheduleTexts(
            t,
            schedule.time_start,
            schedule.time_end,
            schedule.recurrence_size,
            schedule.recurrence_unit
        );

        const formattedPaymentAmount = formatMoney(scheduledPaymentInfo.payment.amount.value);

        let imageUUID = false;
        if (scheduledPaymentInfo.payment.counterparty_alias.avatar) {
            imageUUID = scheduledPaymentInfo.payment.counterparty_alias.avatar.image[0].attachment_public_uuid;
        }

        const nextPaymentText = scheduledPaymentInfo.schedule.time_next
            ? `${nextPaymentTextTranslate}: ${humanReadableDate(scheduledPaymentInfo.schedule.time_next)}`
            : scheduleExpiredTranslate;

        return (
            <>
                <ListItem key={key} button onClick={this.props.selectScheduledPayment}>
                    <Avatar style={styles.smallAvatar}>
                        <LazyAttachmentImage height={50} imageUUID={imageUUID} />
                    </Avatar>

                    <ListItemText primary={scheduleTextResult.primary} secondary={scheduleTextResult.secondary} />

                    <ListItemSecondaryAction>
                        <MoneyAmountLabel
                            style={styles.moneyAmountLabel}
                            info={scheduledPaymentInfo.payment}
                            type="payment"
                        >
                            {formattedPaymentAmount}
                        </MoneyAmountLabel>
                    </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                    <ListItemText inset primary={nextPaymentText} secondary={description} />

                    <ListItemSecondaryAction>
                        <IconButton
                            disabled={this.props.deleteLoading}
                            onClick={this.props.deleteScheduledPayment(scheduledPaymentInfo)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>

                <Divider />
            </>
        );
    }
}

export default ScheduledPaymentItem;
