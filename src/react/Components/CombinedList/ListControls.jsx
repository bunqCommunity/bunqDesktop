import React from "react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import ListSubheader from "@material-ui/core/ListSubheader";

import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";

const styles = {
    button: {
        width: "100%",
        height: "100%"
    },
    pageField: {
        width: 60
    },
    centerPaginationDiv: {
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
};

export default props => {
    const { t, page, pageCount, pageSize, firstPage, previousPage, lastPage, setPage, setPageSize, nextPage } = props;

    return (
        <ListSubheader>
            <Grid container>
                <Grid item xs={1}>
                    <IconButton style={styles.button} onClick={firstPage} disabled={page === 0}>
                        <SkipPreviousIcon />
                    </IconButton>
                </Grid>

                <Grid item xs={1}>
                    <IconButton style={styles.button} onClick={previousPage} disabled={page === 0}>
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                </Grid>

                <Grid item xs={4} style={styles.centerPaginationDiv}>
                    <TextField
                        style={styles.pageField}
                        value={page + 1}
                        type={"number"}
                        inputProps={{
                            min: 1,
                            max: pageCount,
                            step: 1
                        }}
                        onChange={setPage(pageCount)}
                    />
                </Grid>

                <Grid item xs={4} style={styles.centerPaginationDiv}>
                    <TextField select style={styles.pageField} value={pageSize} onChange={setPageSize}>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={1}>
                    <IconButton style={styles.button} onClick={nextPage} disabled={page + 1 >= pageCount}>
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Grid>

                <Grid item xs={1}>
                    <IconButton
                        style={styles.button}
                        onClick={lastPage(pageCount - 1)}
                        disabled={page + 1 >= pageCount}
                    >
                        <SkipNextIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </ListSubheader>
    );
};
