import React from "react";
import { connect } from "react-redux";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import List, { ListItem, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import Typography from "material-ui/Typography";
import Collapse from "material-ui/transitions/Collapse";

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
            country: ""
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
        const {
            city,
            country,
            street,
            house_number,
            postal_code,
            po_box
        } = this.state;
    };

    render() {
        if (this.props.visible === false) return null;

        const requiredStatus = this.props.required
            ? "(required)"
            : "(optional)";
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Typography variant="subheading">
                        {`${this.props.labelValue} - ${requiredStatus}`}
                    </Typography>
                </Grid>
                <Collapse in={this.state.open}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="street"
                            label="Street"
                            value={this.state.street}
                            onChange={this.handleChange("street")}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="house_number"
                            label="House number"
                            value={this.state.house_number}
                            onChange={this.handleChange("house_number")}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="postal_code"
                            label="Street"
                            value={this.state.street}
                            onChange={this.handleChange("street")}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="city"
                            label="City"
                            value={this.state.city}
                            onChange={this.handleChange("city")}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="country"
                            label="Country"
                            value={this.state.country}
                            onChange={this.handleChange("country")}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            id="po_box"
                            label="PO Box (optional)"
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

export default AddressForm;
