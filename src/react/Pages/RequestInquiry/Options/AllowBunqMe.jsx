import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

class AllowBunqMe extends React.Component {
    render() {
        const { targetType, allowBunqMe, handleToggle, t } = this.props;

        if (targetType === "BUNQME") {
            return null;
        }

        return (
            <FormControlLabel
                control={<Switch color="primary" checked={allowBunqMe} onChange={handleToggle} />}
                label={t("Allow bunqme? If the user doesn't own a bunq account a bunqme request will be sent instead")}
            />
        );
    }
}

export default AllowBunqMe;
