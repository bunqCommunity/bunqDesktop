import React from "react";

import { FormControlLabel } from "material-ui/Form";
import TextField from "material-ui/TextField";
import Switch from "material-ui/Switch";

export default class RedirectUrl extends React.Component {
    render() {
        const {
            setMinimumAge,
            minimumAgeError,
            minimumAge,
            handleChange,
            handleToggle
        } = this.props;

        return (
            <div>
                <FormControlLabel
                    control={
                        <Switch
                            color="primary"
                            checked={setMinimumAge}
                            onChange={handleToggle("setMinimumAge")}
                        />
                    }
                    label="Set a minimum age"
                />

                {setMinimumAge ? (
                    <TextField
                        fullWidth
                        error={minimumAgeError}
                        id="minimumAge"
                        label="Minimum Age"
                        type="number"
                        inputProps={{
                            min: 12,
                            max: 100,
                            step: 1
                        }}
                        value={minimumAge}
                        onChange={handleChange("minimumAge")}
                        margin="normal"
                    />
                ) : null}
            </div>
        );
    }
}
