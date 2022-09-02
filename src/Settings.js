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
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        textAlign: "left",
        flexDirection: 'column',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        display: "flex",
        flexDirection: "column",
    }
}));




function Settings() {
    const classes = useStyles()
    const [use12HourClock, setUse12HourClock] = useState(localStorage.getItem("use12HourClock") === "true");
    const [returning, setReturning] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(localStorage.getItem("backgroundColor") === null || localStorage.getItem("backgroundColor") === "" ? "#ffffff" : localStorage.getItem("backgroundColor"));

    const handle12HourClockChange = (event) => {
        setUse12HourClock(event.target.checked);
    }

    function goBack() {
        setReturning(true);
        firestore.db.collection("users").doc(localStorage.getItem('uid')).set({use12HourClock: use12HourClock, backgroundColor: backgroundColor}, {merge: true}).then(() => {
            window.location.href = '/';
        })
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                localStorage.clear()
                window.location.href = "/signin";
            }
        })
        
    }, [])

    return (
        <div className="App" style={{backgroundColor: backgroundColor}}>
            <Backdrop className={classes.backdrop} open={returning}>
                <CircularProgress color="inherit" />
                <h1>Saving</h1>
            </Backdrop>
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
                        <Grid item align="right" xs={2}><Switch checked={use12HourClock} onChange={handle12HourClockChange}></Switch></Grid>
                    </Grid>
                    <Grid container direction="row" alignItems="center">
                        <Grid item align="left" xs={10}>App Background Color</Grid>
                        <Grid item align="right" xs={2}><input type="color" value={backgroundColor} onChange={e => {setBackgroundColor(e.target.value)}}/></Grid>
                    </Grid>
                </Paper>
            </Container>
        </div>
    );
}

export default Settings;