import { Grid, IconButton, Paper, Typography, Container } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import firebase from "firebase/app";
import firestore from "./firestore.js";
import { Button, Switch } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        textAlign: "left",
        flexDirection: 'column',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
    }
}));




function Settings() {
    const classes = useStyles()

    function goBack() {
        window.location.href = "/";
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = "/signin";
            }
        })
        
    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <Grid container direction="row" alignItems="center" justify="center">
                    <Grid item align="center"><IconButton onClick={goBack} title="Save and go back"><ArrowBackIcon style={{ color: "white" }} /></IconButton></Grid>

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }} align="center">

                        <h3 style={{}}>Settings</h3>
                    </Grid>
                </Grid>
            </header>

            <Container maxWidth='sm'>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={{backgroundColor: "#f0f9ff"}}>
                    <Grid container direction="row" alignItems="center">
                        <Grid item align="left" xs={10}>Use 12-hour time format</Grid>
                        <Grid item align="right" xs={2}><Switch>YES</Switch></Grid>
                    </Grid>
                </Paper>
            </Container>
        </div>
    );
}

export default Settings;