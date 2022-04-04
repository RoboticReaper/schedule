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
import Button from '@material-ui/core/Button';
import { Paper } from "@material-ui/core";
import { useHistory } from "react-router";

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
        margin: theme.spacing(2),
        maxWidth: 500,
    },
}));

function Lunches() {

    const classes = useStyles();
    let history = useHistory();
    firebase.auth().onAuthStateChanged((user) => {
        if(!user){
            window.location.href = "/";
        }
    })
    var lunches = JSON.parse(localStorage.getItem('lunches'));

    function goBack() {
        var lunches = [day1, day2, day3, day4, day5, day6];
        console.log(lunches)

        // upload the classes to firestore
        firestore.db.collection('users').doc(localStorage.getItem('uid')).update("lunches", JSON.stringify(lunches)).then(() => {
            localStorage.setItem('lunches', JSON.stringify(lunches));
            window.location.href = "/";
        });

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
        <div className="App">
            <header className='App-header'>
            </header>
            <Container maxWidth='sm'>
                <div className={classes.root}>
                    <div className={classes.paper}>
                        <Grid container direction="row" spacing={2} alignItems="center" justify="center">
                            <Grid item align="center"><IconButton onClick={goBack}><ArrowBackIcon /></IconButton></Grid>

                            <Grid item style={{ marginLeft: 10, marginRight: 10 }} align="center">

                                <Typography variant="h5" gutterBottom>
                                    Lunches
                                </Typography>
                            </Grid>

                            <Button variant="contained" disableElevation color="primary" onClick={() => {setDay1(""); setDay2(""); setDay3(""); setDay4(""); setDay5(""); setDay6("")}}>Clear All</Button>

                        </Grid>
                        <Paper className={classes.paper} elevation={3} variant="outlined">
                            <span>Here's how to figure out what lunch you have:</span>
                            <p><b>First lunch</b>: Classes in the Performing Arts, Physical Education/Health, Science, Special Education, and Visual Arts Departments + all Spanish classes.</p>
                            <p><b>Second lunch</b>: All remaining classes in <b>EVEN</b> classrooms</p>
                            <p><b>Third lunch</b>: All remaining classes in <b>ODD</b> classrooms </p>
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