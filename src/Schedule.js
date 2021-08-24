import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';
import { Container } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Menu } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BusinessIcon from '@material-ui/icons/Business';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import './App.css';
import './loader.js'
import { IconButton } from '@material-ui/core';
import firestore from './firestore.js';
import firebase from "firebase/app";
import "firebase/auth";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import FastfoodIcon from '@material-ui/icons/Fastfood';

var uid;


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (!user.emailVerified) {
            if (window.location.pathname !== "/signin" && window.location.pathname !== "/signup") {
                firebase.auth().currentUser.sendEmailVerification().then(() => {
                    console.log("Email Sent");
                    alert('An email was sent to you to verify your account. Please verify before logging in.');
                    signOut();
                })
            }

        }
        uid = user.uid;
        localStorage.setItem('uid', uid);
        if ((window.location.pathname === "/signin" || window.location.pathname === "/signup") && user.emailVerified) {
            window.location.href = "/";
        }
    } else {
        localStorage.setItem('uid', "");
        localStorage.setItem('createdClasses', "");
        localStorage.setItem('lunches', "");
        if (window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
            window.location.href = "/signin";
        }
    }
})

export function getUid() {
    return uid;
}

var now = new Date();
var allClasses = request();
var createdClasses = [];
var todayClass = filter(allClasses, now);
var todayDay;
var lunchData;

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        maxWidth: 500,
    },
    btnRoot: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(-1.5),
        },
    },
    round: {
        borderRadius: "5em",
        backgroundColor: "#b3b3b3",
    },
}));


function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

function request() {

    const $ = window.$;
    var classes;

    $.ajaxSetup({ // force getJSON to finish before continuing
        async: false
    });

    $.getJSON("https://clients6.google.com/calendar/v3/calendars/lexingtonma.org_qud45cvitftvgc317tsd2vqctg@group.calendar.google.com/events?calendarId=lexingtonma.org_qud45cvitftvgc317tsd2vqctg%40group.calendar.google.com&singleEvents=true&timeZone=America%2FNew_York&maxAttendees=1&maxResults=1000&sanitizeHtml=true&timeMin=2021-08-23T00%3A00%3A00-04%3A00&timeMax=2022-07-04T00%3A00%3A00-04%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs", function (data) {
        classes = data;
    });

    return classes;
}

function datesAreOnSameDay(first, second) {
    return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}



function filter(data, currDate) {

    // use date as the key, the variable is array of events in that day.
    let dates = new Map();

    for (var x = 0; x < data.items.length; x++) { // if the date isn't today, remove it
        if (data.items[x].start.dateTime === undefined) {
            var day = new Date(data.items[x].start.date);
            var tomorrow = new Date(day);
            tomorrow.setDate(day.getDate() + 1);
            day = new Date(tomorrow);
            if (datesAreOnSameDay(day, currDate)) {

                var todayDayString = data.items[x].summary;
                todayDay = parseInt(todayDayString.substr(4, 1));


            }
        }

        else {
            if (lunchData !== undefined) {
                var todayLunch = lunchData[todayDay - 1];
                if (data.items[x].summary.substr(0, 6) === "Lunch " && todayLunch !== undefined && data.items[x].summary.substr(6, 1) !== todayLunch.toString() && todayLunch.toString() !== "") {

                    continue;
                }
            }
            var date = data.items[x].start.dateTime.substring(0, 10);

            if (dates[date] === undefined) {
                dates[date] = [data.items[x]];
            }
            else {
                dates[date].push(data.items[x]);
            }

        }
    }

    var cls = undefined;
    try {
        cls = dates[formatDate(currDate)].sort(custom_sort); // sort today's classes by chronological order
    } catch (error) { // this means today's date isn't on the LHS calendar
        cls = undefined;
    }

    return cls;
}


function formatDate(date) {
    // converts date into yyyy-mm-dd format
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function custom_sort(a, b) { // this sort json objects by date.
    return new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime();
}



function DisplayClasses() {


    const classes = useStyles();
    return (
        todayClass.map((item) =>
            <>
                <Paper className={classes.paper} elevation={3} variant="outlined">
                    <Grid container alignItems='center' justify='center' spacing={2} direction="column">
                        <Grid item>
                            <Typography gutterBottom variant="subtitle1">
                                <b>{item.summary}</b>
                            </Typography>
                        </Grid>
                        {item.summary.substring(0, 4) === "Free" || item.summary.substring(0, 5) === "Lunch" || item.summary === "I-block" ? null :
                            <Grid item xs={4} className={classes.round}>
                                <Typography variant="body2" display="inline" style={{ marginLeft: 5, marginRight: 5 }}>
                                    Room:&nbsp;{item.room}
                                </Typography>
                            </Grid>
                        }
                        <Grid item>
                            <Typography variant="body2" gutterBottom>
                                {item.start.dateTime.substring(11, 16)} - {item.end.dateTime.substring(11, 16)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </>
        )
    )
}

function NoClasses() {
    const classes = useStyles();
    return (
        <Paper className={classes.paper} elevation={3} variant="outlined">
            <Typography gutterBottom variant="subtitle1">
                No class today
            </Typography>
        </Paper>
    )
}
const signOut = () => {
    firebase.auth().signOut().then(() => {
        localStorage.setItem('uid', "");
        localStorage.setItem('createdClasses', "");
        localStorage.setItem('lunches', "['', '','','','','']");
        window.location.href = "/signin";
    }).catch((error) => {
        console.log(error);
    })
}


function yesterday() {
    todayDay = undefined;
    now.setDate(now.getDate() - 1);
    todayClass = filter(allClasses, now);
}

function tomorrow() {
    todayDay = undefined;
    var tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    now = new Date(tomorrow);
    todayClass = filter(allClasses, now);
}



function today() {
    now = new Date();
    todayClass = filter(allClasses, now);
}

var gotten = false;

function Schedule() {

    const classes = useStyles();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var day = days[now.getDay()];
    var month = months[now.getMonth()];

    getClassesFromFirestore();

    function getClassesFromFirestore() {
        if (gotten === true) {
            return;
        }
        gotten = true;
        firestore.db.collection('users').doc(localStorage.getItem('uid')).get().then((value) => {
            var data = value.data();

            createdClasses = [];
            lunchData = ["", "", "","","",""];
            if (data !== undefined) {
                if(data.lunches !== undefined){
                    lunchData = JSON.parse(data.lunches);
                }
                if(data.classes !== undefined){
                    createdClasses = JSON.parse(data.classes);
                }
            }

            localStorage.setItem('createdClasses', JSON.stringify(createdClasses));
            localStorage.setItem('lunches', JSON.stringify(lunchData));
            updateClass();
        })

    }

    const forceUpdate = useForceUpdate();

    function updateClass() {
        createdClasses.map((thisClass) => {
            allClasses.items.map((today) => {
                if (thisClass[2].includes(today.summary)) {
                    today.summary = thisClass[0];

                    // setting room number
                    if (thisClass[1] !== '') {
                        today.room = thisClass[1];
                    } else {
                        today.room = "no room";
                    }
                }
            })
        })

        allClasses.items.map((today) => {
            if (["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4", "E1", "E2", "E3", "E4", "F1", "F2", "F3", "F4", "G1", "G2", "G3", "G4", "H1", "H2", "H3", "H4"].includes(today.summary)) {
                today.summary = "Free (" + today.summary + ")";
            }
        })




        localStorage.setItem('createdClasses', JSON.stringify(createdClasses));
        document.getElementById('yesterday').click();
        document.getElementById('tomorrow').click();
        forceUpdate();
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const gotoClasses = () => {

        window.location.href = "/classes";
    };

    const gotoLunches = () => {
        window.location.href = "/lunches";
    }

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
        handleClose();
    }

    const settings = () => {
        window.location.href = "/settings";
    }

    function DatePicker() {
        const [selectedDate, setSelectedDate] = React.useState(now);

        const handleDateChange = (date) => {
            setSelectedDate(date);
            now = date;
            todayClass = filter(allClasses, now);
            forceUpdate();
        };

        const handleDataChangeRaw = (e) => {
            e.preventDefault();
        }

        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    onChangeRaw={handleDataChangeRaw}
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Select a day to view"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
        )
    }


    return (

        <div>
            <div className="App">
                <header className='App-header'>
                </header>

                <Container maxWidth='sm'>
                    <div className={classes.root} >
                        <Grid container justify="center" alignItems="center">
                            <Grid item>
                                <Typography variant="h5" gutterBottom align="center">
                                    {day}, {month} {now.getDate()}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={gotoClasses}>
                                        <ListItemIcon>
                                            <BusinessIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit">Edit Classes</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={gotoLunches}>
                                        <ListItemIcon>
                                            <FastfoodIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit">Edit Lunches</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => { openInNewTab('mailto:liubaoren2006@gmail.com') }}>
                                        <ListItemIcon>
                                            <MailOutlineOutlinedIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit">Feedback</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={signOut}>
                                        <ListItemIcon>
                                            <ExitToAppIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit">Sign Out</Typography>
                                    </MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>

                        
                            <div className={classes.btnRoot}>
                                <Box color="primary">
                                    <Button variant="contained" disableElevation id="yesterday" color="primary" style={{ textTransform: "none", margin: 10 }} onClick={() => { yesterday(); forceUpdate(); }}>Previous</Button>
                                    {(new Date(now).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0)) ? (<Button variant="outlined" disableElevation color="secondary" style={{ textTransform: "none" }} onClick={() => { today(); forceUpdate() }}>Today</Button>) : <Button variant="outlined" disableElevation color="secondary" style={{ textTransform: "none" }} disabled>Today</Button>}
                                    <Button variant="contained" disableElevation color="primary" id="tomorrow" style={{ textTransform: "none", margin: 10 }} onClick={() => { tomorrow(); forceUpdate(); }}>Next</Button>

                                </Box>
                            </div>
                            <DatePicker />
                            {(todayClass === undefined || todayClass.length === 0) ? (<NoClasses />) : <DisplayClasses />}



                        <Typography variant="body1" align="left" style={{ marginTop: 50, color: "#808080" }}>Made by Baoren Liu</Typography>
                    </div>
                </Container>

            </div>
        </div>
    );
}


export default Schedule;