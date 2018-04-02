import React from "react";
import { FormControlLabel } from "material-ui/Form";
import Switch from "material-ui/Switch";

class AllowBunqMe extends React.Component {
    render() {
        const { targetType, allowBunqMe, handleToggle, t } = this.props;

        if (targetType === "BUNQME") {
            return null;
        }

        return (
            <FormControlLabel
                control={
                    <Switch
                        color="primary"
                        checked={allowBunqMe}
                        onChange={handleToggle}
                    />
                }
                label={t("Allow bunq.me? If the user doesn't own a bunq account a bunq.me request will be sent instead")}
            />
        );
    }
}

export default AllowBunqMe;
