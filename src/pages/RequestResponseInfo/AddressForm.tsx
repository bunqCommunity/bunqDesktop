import React from "react";
import Grid from "@material-ui/core/Grid";
import { translate } from "react-i18next";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";

const styles = {
    paper: {
        padding: 24
    }
};

class AddressForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,

            street: "",
            house_number: "",
            po_box: "",
            postal_code: "",
            city: "",
            country: "",

            streetError: false,
            house_numberError: false,
            po_boxError: false,
            postal_codeError: false,
            cityError: false,
            countryError: false
        };
    }

    componentDidMount() {
        if (this.props.required) {
            this.setState({ open: true });
        }
    }

    handleChange = name => event => {
        this.setState(
            {
                [name]: event.target ? event.target.value : event
            },
            this.validateForm
        );
    };

    // validates inputs and returns an address object or false to the parent component
    validateForm = () => {
        const { city, country, street, house_number, postal_code, po_box } = this.state;

        let hasError = false;
        const errors = {
            cityError: false,
            countryError: false,
            streetError: false,
            house_numberError: false,
            postal_codeError: false
        };

        if (city.length <= 0) {
            errors.cityError = true;
            hasError = true;
        }
        if (country.length <= 0) {
            errors.countryError = true;
            hasError = true;
        }
        if (street.length <= 0) {
            errors.streetError = true;
            hasError = true;
        }
        if (house_number.length <= 0) {
            errors.house_numberError = true;
            hasError = true;
        }
        if (postal_code.length <= 0) {
            errors.postal_codeError = true;
            hasError = true;
        }

        if (hasError) {
            // not valid yet, return false
            this.onChange(false);
            this.setState(errors);
        } else {
            const address = {
                city,
                country,
                street,
                house_number,
                postal_code
            };
            if (po_box.length >= 1) {
                address.po_box = po_box;
            }
            this.onChange(address);
        }
    };

    render() {
        const t = this.props.t;
        if (this.props.visible === false) return null;

        const requiredStatus = this.props.required ? "(required)" : "(optional)";
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Typography variant="subtitle1">{`${this.props.labelValue} - ${requiredStatus}`}</Typography>
                </Grid>
                <Collapse in={this.state.open}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="street"
                            label={t("Street")}
                            error={this.state.streetError}
                            value={this.state.street}
                            onChange={this.handleChange("street")}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="house_number"
                            label={t("House number")}
                            error={this.state.house_numberError}
                            value={this.state.house_number}
                            onChange={this.handleChange("house_number")}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="postal_code"
                            label={t("Postal Code")}
                            error={this.state.postal_codeError}
                            value={this.state.postal_code}
                            onChange={this.handleChange("postal_code")}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="city"
                            label={t("City")}
                            error={this.state.cityError}
                            value={this.state.city}
                            onChange={this.handleChange("city")}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="country"
                            label={t("Country")}
                            error={this.state.countryError}
                            value={this.state.country}
                            onChange={this.handleChange("country")}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="po_box"
                            label={t("PO Box (optional)")}
                            error={this.state.po_boxError}
                            value={this.state.po_box}
                            onChange={this.handleChange("po_box")}
                            margin="normal"
                        />
                    </Grid>
                </Collapse>
            </Grid>
        );
    }
}

export default translate("translations")(AddressForm);
