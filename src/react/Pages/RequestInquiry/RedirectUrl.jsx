import React from "react";

import { FormControlLabel } from "material-ui/Form";
import TextField from "material-ui/TextField";
import Switch from "material-ui/Switch";

export default class MinimumAge extends React.Component {
    render() {
        const {
            setRedirectUrl,
            redirectUrlError,
            redirectUrl,
            handleChange,
            handleToggle
        } = this.props;

        return (
            <div>
                <FormControlLabel
                    control={
                        <Switch
                            color="primary"
                            checked={setRedirectUrl}
                            onChange={handleToggle("setRedirectUrl")}
                        />
                    }
                    label="Set a redirect url"
                />

                {setRedirectUrl ? (
                    <TextField
                        fullWidth
                        error={redirectUrlError}
                        id="redirectUrl"
                        label="Redirect Url"
                        value={redirectUrl}
                        onChange={handleChange("redirectUrl")}
                        margin="normal"
                    />
                ) : null}
            </div>
        );
    }
}
