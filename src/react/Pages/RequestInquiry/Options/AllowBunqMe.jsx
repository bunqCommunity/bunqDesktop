import React from "react";
import { FormControlLabel } from "material-ui/Form";
import Switch from "material-ui/Switch";

class AllowBunqMe extends React.Component {
    render() {
        const { targetType, allowBunqMe, handleToggle } = this.props;

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
                label="Allow bunq.me? If the user doesn't own a Bunq account a bunq.me request will be sent instead"
            />
        );
    }
}

export default AllowBunqMe;
