import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { Container } from "@material-ui/core";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { IconButton } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Grid } from "@material-ui/core";
import firestore from "./firestore.js"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import React from 'react';
import "firebase/auth";
import firebase from "firebase/app";
import { useState } from "react";
import Button from '@material-ui/core/Button';
import { Paper } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        flexGrow: 1,
        justifyContent: "space-between",
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
        marginTop: theme.spacing(1),
        maxWidth: 500,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        display: "flex",
        flexDirection: "column",
    }
}));

function Lunches() {

    const classes = useStyles();
    let history = useHistory();
    const [returning, setReturning] = useState(false);

    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "/";
        }
    })
    var lunches = JSON.parse(localStorage.getItem('lunches'));

    function goBack() {
        setReturning(true);
        var lunches = [day1, day2, day3, day4, day5, day6];
        console.log(lunches)

        // upload the lunches to firestore
        firestore.db.collection('users').doc(localStorage.getItem('uid')).set({ "lunches": JSON.stringify(lunches) }, {merge: true}).then(() => {
            localStorage.setItem('lunches', JSON.stringify(lunches));
            history.push("/")
            window.location.reload();
        })

    }

    const [day1, setDay1] = React.useState(lunches[0]);
    const [day2, setDay2] = React.useState(lunches[1]);
    const [day3, setDay3] = React.useState(lunches[2]);
    const [day4, setDay4] = React.useState(lunches[3]);
    const [day5, setDay5] = React.useState(lunches[4]);
    const [day6, setDay6] = React.useState(lunches[5]);

    const handled1Change = (event) => {
        setDay1(event.target.value);
    };
    const handled2Change = (event) => {
        setDay2(event.target.value);
    };
    const handled3Change = (event) => {
        setDay3(event.target.value);
    };
    const handled4Change = (event) => {
        setDay4(event.target.value);
    };
    const handled5Change = (event) => {
        setDay5(event.target.value);
    };
    const handled6Change = (event) => {
        setDay6(event.target.value);
    };

    return (
        <div className="App" style={{ backgroundColor: localStorage.getItem("backgroundColor") === null || localStorage.getItem("backgroundColor") === "" ? "#ffffff" : localStorage.getItem("backgroundColor") }}>
            <Backdrop className={classes.backdrop} open={returning}>
                <CircularProgress color="inherit" />
                <h1>Saving</h1>
            </Backdrop>
            <header className="App-header">
                <Grid container direction="row" alignItems="center" justify="center">
                    <Grid item align="center"><IconButton onClick={goBack} style={{ color: "white" }} title="Go back"><ArrowBackIcon /></IconButton></Grid>

                    <Grid item xs={0} style={{ marginLeft: 10, marginRight: 10 }} align="center">

                        <h3>Lunches</h3>
                    </Grid>

                    <Grid item align="center"><Button style={{marginLeft:10}} variant="contained" disableElevation color="primary" onClick={() => { setDay1(""); setDay2(""); setDay3(""); setDay4(""); setDay5(""); setDay6("") }}>Clear All</Button>
                    </Grid>
                </Grid>
            </header>
            <Container maxWidth='sm'>
                <div className={classes.root}>
                    <div className={classes.paper}>
                        <Paper className={classes.paper} elevation={3} variant="outlined" style={{ backgroundColor: localStorage.getItem("backgroundColor") === null || localStorage.getItem("backgroundColor") === "" ? "#ffffff" : localStorage.getItem("backgroundColor") }}>
                            <span>Here's how to figure out what lunch you have:</span>
                            <p><b>First lunch</b>: Classes in the ESL, Performing Arts, Visual Arts, Science, PE (excluding Health) and Special Education departments.</p>
                            <p><b>Second lunch</b>: All remaining classes in <b>ODD</b> classrooms</p>
                            <p><b>Third lunch</b>: All remaining classes in <b>EVEN</b> classrooms </p>
                            <p>The lunch block is usually the 4th block of the day.</p>
                        </Paper>
                    </div>
                    <Typography variant="h5" gutterBottom>Day 1{localStorage.getItem("todayDay") === "1" ? " (today)" : null}</Typography>
                    <FormControl component="fieldset">
                        <RadioGroup row value={day1} onChange={handled1Change}>
                            <FormControlLabel value="1" control={<Radio />} label="Lunch 1" />
                            <FormControlLabel value="2" control={<Radio />} label="Lunch 2" />
                            <FormControlLabel value="3" control={<Radio />} label="Lunch 3" />
                        </RadioGroup>
                    </FormControl>
                    <Typography variant="h5" gutterBottom>Day 2{localStorage.getItem("todayDay") === "2" ? " (today)" : null}</Typography>
                    <FormControl component="fieldset">
                        <RadioGroup row value={day2} onChange={handled2Change}>
                            <FormControlLabel value="1" control={<Radio />} label="Lunch 1" />
                            <FormControlLabel value="2" control={<Radio />} label="Lunch 2" />
                            <FormControlLabel value="3" control={<Radio />} label="Lunch 3" />
                        </RadioGroup>
                    </FormControl>
                    <Typography variant="h5" gutterBottom>Day 3{localStorage.getItem("todayDay") === "3" ? " (today)" : null}</Typography>
                    <FormControl component="fieldset">
                        <RadioGroup row value={day3} onChange={handled3Change}>
                            <FormControlLabel value="1" control={<Radio />} label="Lunch 1" />
                            <FormControlLabel value="2" control={<Radio />} label="Lunch 2" />
                            <FormControlLabel value="3" control={<Radio />} label="Lunch 3" />
                        </RadioGroup>
                    </FormControl>
                    <Typography variant="h5" gutterBottom>Day 4{localStorage.getItem("todayDay") === "4" ? " (today)" : null}</Typography>
                    <FormControl component="fieldset">
                        <RadioGroup row value={day4} onChange={handled4Change}>
                            <FormControlLabel value="1" control={<Radio />} label="Lunch 1" />
                            <FormControlLabel value="2" control={<Radio />} label="Lunch 2" />
                            <FormControlLabel value="3" control={<Radio />} label="Lunch 3" />
                        </RadioGroup>
                    </FormControl>
                    <Typography variant="h5" gutterBottom>Day 5{localStorage.getItem("todayDay") === "5" ? " (today)" : null}</Typography>
                    <FormControl component="fieldset">
                        <RadioGroup row value={day5} onChange={handled5Change}>
                            <FormControlLabel value="1" control={<Radio />} label="Lunch 1" />
                            <FormControlLabel value="2" control={<Radio />} label="Lunch 2" />
                            <FormControlLabel value="3" control={<Radio />} label="Lunch 3" />
                        </RadioGroup>
                    </FormControl>
                    <Typography variant="h5" gutterBottom>Day 6{localStorage.getItem("todayDay") === "6" ? " (today)" : null}</Typography>
                    <FormControl component="fieldset">
                        <RadioGroup row value={day6} onChange={handled6Change}>
                            <FormControlLabel value="1" control={<Radio />} label="Lunch 1" />
                            <FormControlLabel value="2" control={<Radio />} label="Lunch 2" />
                            <FormControlLabel value="3" control={<Radio />} label="Lunch 3" />
                        </RadioGroup>
                    </FormControl>
                </div>
            </Container>
        </div>)
}

export default Lunches;