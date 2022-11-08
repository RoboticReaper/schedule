import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';
import { Container } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './loader.js'
import { IconButton } from '@material-ui/core';
import firestore from './firestore.js';
import firebase from "firebase/app";
import { useHistory, useParams } from 'react-router-dom';
import "firebase/auth";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Snackbar from '@material-ui/core/Snackbar';
import { Dialog, Tooltip, Badge } from '@mui/material';
import IosShareIcon from '@mui/icons-material/IosShare';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Divider from '@mui/material/Divider';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

var uid;

export function getUid() {
    return uid;
}

var now = new Date();
var allClasses;
var createdClasses = [];
var todayClass = [];
var todayDay;
var lunchData;
var hr;
var lastReadAnnouncementDate = "";
var lastCacheClear = localStorage.getItem("lastCacheClear") ? new Date(localStorage.getItem("lastCacheClear")) : "";
var userCreationDate = "";
var hasUnreadAnnouncements = false;
var halfDay = false;
var use12HourClock = false;
var friendList = [];
var friendName = [];
var backgroundColor = localStorage.getItem("backgroundColor") === null ? "#ffffff" : localStorage.getItem("backgroundColor");

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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    badge: {
        fontSize: 5
    }
}));


function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
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
                if (datesAreOnSameDay(now, new Date())) {
                    localStorage.setItem('todayDay', todayDay);
                }

            }
        }
        else {
            // add rules to remove certain events from the day
            if (lunchData !== undefined) {
                var todayLunch = lunchData[todayDay - 1];
                if (data.items[x].summary.substr(0, 6) === "Lunch " && todayLunch !== undefined && data.items[x].summary.substr(6, 1) !== todayLunch.toString() && todayLunch.toString() !== "") {

                    continue;
                }
            }
            if (data.items[x].summary.includes("Training on FM systems and best practices for Hearing Impairments")) {
                continue;
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
        cls = dates[formatDate(currDate)].slice().sort(custom_sort); // sort today's classes by chronological order


        // detect if today is half day
        // by looking if the last class is lunch

        if (cls[cls.length - 1].summary.includes("Lunch")) {
            if (cls[cls.length - 1].end.dateTime.substring(11, 16) === "12:00" || cls[cls.length - 1].end.dateTime.substring(11, 16) === "11:30") {
                halfDay = true;
                cls.pop();
                if(lunchData[todayDay - 1] === ""){
                    cls.pop();
                }
            }

        } else if (cls[cls.length - 1].end.dateTime.substring(11, 16) === "12:00") {
            halfDay = true;
        } else {
            halfDay = false;
        }

        // decide whether to convert 24 hour clock to 12 hour clock
        if (use12HourClock) {
            for (var i = 0; i < cls.length; i++) {
                var time = cls[i].start.dateTime.substring(11, 16);
                var hour = parseInt(time.substring(0, 2));
                var minute = parseInt(time.substring(3, 5));
                var ampm = "AM";

                if (hour == 12) {
                    ampm = "PM";
                }
                if (hour > 12) {
                    hour -= 12;
                    ampm = "PM";
                }
                time = hour + ":" + (minute < 10 ? "0" + minute : minute) + " " + ampm;

                cls[i].start.hour12 = time;


                time = cls[i].end.dateTime.substr(11, 5);
                hour = parseInt(time.substr(0, 2));
                minute = parseInt(time.substr(3, 2));
                ampm = "AM";
                if (hour == 12) {
                    ampm = "PM";
                }
                if (hour > 12) {
                    hour -= 12;
                    ampm = "PM";
                }
                time = hour + ":" + (minute < 10 ? "0" + minute : minute) + " " + ampm;
                cls[i].end.hour12 = time;

            }
        }

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
    if (todayClass === undefined) { return }
    return (
        todayClass.map((item) =>
            <>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={{ backgroundColor: item.color }}>
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
                                {!use12HourClock ? <span>{item.start.dateTime.substring(11, 16)} - {item.end.dateTime.substring(11, 16)}</span> : <span>{item.start.hour12} - {item.end.hour12}</span>}
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
    todayDay = undefined;
    return (
        <Paper className={classes.paper} elevation={3} variant="outlined" style={{ backgroundColor: backgroundColor }}>
            <Typography gutterBottom variant="subtitle1">
                No class today
            </Typography>
        </Paper>
    )
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
    todayDay = undefined;
    now = new Date();
    todayClass = filter(allClasses, now);
}

var gotten = false;
var userDismissed = false;


function Schedule() {

    const classes = useStyles();
    let history = useHistory();

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var day = days[now.getDay()];
    var month = months[now.getMonth()];
    const [deferredPrompt, setDeferredPrompt] = useState();

    const [iosInstallPrompt, setIosInstallPrompt] = useState(false);
    const [online, setOnline] = useState(navigator.onLine);

    const [showHalfDayLunchRule, setShowHalfDayLunchRule] = useState(false);


    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userCreationDate = new Date(user.metadata.creationTime);
            uid = user.uid;
            localStorage.setItem('uid', uid);
            if ((window.location.pathname === "/signin" || window.location.pathname === "/signup")) {
                history.replace('/');
            }

        } else {
            localStorage.clear();
            if (window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
                history.replace('/signin');
            }
        }
    })

    useEffect(() => {

        var calendarFetch = fetch("https://clients6.google.com/calendar/v3/calendars/lexingtonma.org_qud45cvitftvgc317tsd2vqctg@group.calendar.google.com/events?calendarId=lexingtonma.org_qud45cvitftvgc317tsd2vqctg%40group.calendar.google.com&singleEvents=true&timeZone=America%2FNew_York&maxAttendees=1&maxResults=1000&sanitizeHtml=true&timeMin=2022-11-01T00%3A00%3A00-04%3A00&timeMax=2023-03-31T00%3A00%3A00-04%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs")
        var firestoreFetch = getClassesFromFirestore()

        Promise.all([calendarFetch, firestoreFetch]).then(response => {
            response[0].json().then(data => {
                allClasses = data;
                updateClass();
                hasUnreadAnnouncements = false;
            })
        });


        window.addEventListener('online', () => setOnline(true));
        window.addEventListener('offline', () => { setOnline(false); window.location.href = '/'; });


        var installPrompt = document.getElementById('installPrompt');

        if (navigator.userAgent.match(/(iPhone|iPad)/) && !navigator.standalone && !userDismissed) {
            if (!userDismissed && localStorage.getItem("installed") === null) {
                installPrompt.style.display = 'block';
            }

        }
        if (navigator.userAgent.match(/(iPhone|iPad)/) && navigator.standalone) {
            installPrompt.style.display = 'none';
            localStorage.setItem("installed", "true");
        }

    }, [])




    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();

        var installPrompt = document.getElementById('installPrompt');

        if (!userDismissed && localStorage.getItem("installed") === null) {
            installPrompt.style.display = 'block';
        }

        setDeferredPrompt(e);
    })

    function install() {
        var installPrompt = document.getElementById('installPrompt');

        if (navigator.userAgent.match(/(iPhone|iPad)/) && !navigator.standalone) {
            installPrompt.style.display = 'none';
            userDismissed = true;
            localStorage.setItem("installed", false);
            setIosInstallPrompt(true);
        } else {
            installPrompt.style.display = 'none';
            userDismissed = true;

            deferredPrompt.prompt().catch((error) => { });

            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    firestore.db.collection("AppInstalled").doc(uid).set({ installed: true });
                    localStorage.setItem("installed", "true");
                } else if (choiceResult.outcome === 'dismissed') {
                    localStorage.setItem("installed", "false");
                }
                setDeferredPrompt(null);
            });
        }

        handleClose()
    }


    async function getClassesFromFirestore() {

        if (gotten === true) {
            return;
        }

        var getID = localStorage.getItem('uid');

        var docRef = firestore.db.collection("users").doc(getID).get();
        var announcementRef = firestore.db.collection("announcement").doc("info").get();

        return Promise.all([docRef, announcementRef]).then((values) => {
            var data = values[0].data();

            createdClasses = [];
            lunchData = ["", "", "", "", "", ""];
            hr = "";

            if (data !== undefined) {
                if (data.lunches !== undefined) {
                    lunchData = JSON.parse(data.lunches);
                }
                if (data.classes !== undefined) {
                    createdClasses = JSON.parse(data.classes);
                }
                if (data.hr !== undefined) {
                    hr = data.hr;
                }
                if (data.lastReadAnnouncementDate !== undefined) {
                    lastReadAnnouncementDate = data.lastReadAnnouncementDate.toDate();

                }
                if (data.use12HourClock !== undefined) {
                    use12HourClock = data.use12HourClock;
                }
                if (data.backgroundColor !== undefined) {
                    backgroundColor = data.backgroundColor;
                } else {
                    backgroundColor = "#ffffff";
                }
                if (data.friendList !== undefined) {
                    friendList = data.friendList;
                }
                if (data.friendName !== undefined) {
                    friendName = data.friendName;
                }

            }

            localStorage.setItem('createdClasses', JSON.stringify(createdClasses));
            localStorage.setItem('lunches', JSON.stringify(lunchData));
            localStorage.setItem('hr', hr);
            localStorage.setItem('lastReadAnnouncementDate', lastReadAnnouncementDate);
            localStorage.setItem('use12HourClock', use12HourClock);
            localStorage.setItem('backgroundColor', backgroundColor);
            localStorage.setItem('friendList', JSON.stringify(friendList));
            localStorage.setItem('friendName', JSON.stringify(friendName));


            var latestAnnouncementDate = values[1].data().time.toDate();

            if ((lastReadAnnouncementDate === "" || latestAnnouncementDate > lastReadAnnouncementDate) && userCreationDate < latestAnnouncementDate) {
                hasUnreadAnnouncements = true;
            }

            localStorage.setItem('latestAnnouncementDate', latestAnnouncementDate);

            var cacheClearDate = values[1].data().cacheClear.toDate();

            if ((lastCacheClear === "" || cacheClearDate > lastCacheClear) && userCreationDate < cacheClearDate) {
                localStorage.setItem('lastCacheClear', new Date());
                localStorage.removeItem("cachedFriends")
                caches.open('cache').then(cache => {
                    cache.keys().then(keys => {
                        var deletions = []
                        for (var i = 0; i < keys.length; i++) {
                            deletions.push(cache.delete(keys[i]));
                        }
                        Promise.all(deletions).then(() => {
                            window.location.reload();
                        })
                    })
                })

            }


        }).catch((error) => {
            console.log(error)
        })



    }



    const forceUpdate = useForceUpdate();

    function updateClass() {

        createdClasses.map((thisClass) => {
            allClasses.items.map((today) => {
                if (thisClass[2].includes(today.summary)) {
                    today.summary = thisClass[0] + " (" + today.summary + ")";

                    // setting room number
                    if (thisClass[1] !== '') {
                        today.room = thisClass[1];
                    } else {
                        today.room = "N/A";
                    }

                    // setting class color
                    if (thisClass[3] !== undefined) {
                        today.color = thisClass[3];
                    } else {
                        today.color = backgroundColor;
                    }
                }
                // make a special case for advisory
                else if (today.summary.includes("Advisory")) {
                    today.room = hr;
                    today.color = backgroundColor
                } else if (today.color === undefined) {
                    today.color = backgroundColor
                }
            })
        })

        allClasses.items.map((today) => {
            if (["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4", "E1", "E2", "E3", "E4", "F1", "F2", "F3", "F4", "G1", "G2", "G3", "G4", "H1", "H2", "H3", "H4"].includes(today.summary)) {
                today.summary = "Free (" + today.summary + ")";
            }
        })

        if (createdClasses.length === 0 && !online) {
            setTimeout(() => {
                window.location.reload();
            }, 1000)
        }

        gotten = true;
        todayClass = filter(allClasses, now);



        if (hasUnreadAnnouncements) {
            history.push("/announcements");
        }

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
        history.push("/classes")
    };


    const signOut = () => {
        firebase.auth().signOut().then(() => {

            localStorage.clear();
            history.push("/signin");
        }).catch((error) => {
            console.log(error);
        })
    }

    const gotoLunches = () => {
        history.push("/lunches")
    }

    const openInNewTab = (url) => {
        if (navigator.userAgent.match(/(iPhone|iPad)/)) {
            window.location.href = url;
        }
        else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
        handleClose();
    }

    function OfflineReminder() {
        if (!online) {
            return <div style={{ backgroundColor: "lightgrey", padding: 3 }}>You are offline.</div>
        }
        return null;
    }

    function ClassReminder() {
        if (createdClasses.length === 0) {
            return <div style={{ backgroundColor: "lightgrey", padding: 3 }}>You haven't created any class yet. <a href="/classes">Tap here to do so</a></div>
        }
        return null;
    }

    function LunchReminder() {
        if (lunchData !== undefined && lunchData[todayDay - 1] === "") {
            return <div style={{ backgroundColor: "lightgrey", padding: 3 }}>You haven't specified your lunch for this day yet. <a href="/lunches">Tap here to do so</a></div>
        }
        return null;
    }




    function DatePicker() {
        const [selectedDate, setSelectedDate] = React.useState(now);

        const handleDateChange = (date) => {
            if (date instanceof Date && !isNaN(date.valueOf())) {
                todayDay = undefined;
                now = date;
                todayClass = filter(allClasses, now);
                setSelectedDate(date);
                forceUpdate();
            }
        };

        const handleDataChangeRaw = (e) => {
            e.preventDefault();
        }

        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
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

        <div style={{ backgroundColor: backgroundColor }}>
            <Backdrop className={classes.backdrop} open={!gotten}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="App">
                <header className='App-header'>LHS Schedule
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
                                    title='More options'
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
                                    <MenuItem onClick={gotoClasses} disabled={!online}>
                                        <ListItemIcon>
                                            <BusinessIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit">Edit Classes</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={gotoLunches} disabled={!online}>
                                        <ListItemIcon>
                                            <FastfoodIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit">Edit Lunches</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => { history.push("/friends") }}>
                                        <ListItemIcon>
                                            <PeopleAltIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit">Friends</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => { history.push("/announcements"); }}>
                                        <ListItemIcon>
                                            <AnnouncementIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit">Announcements</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => { history.push("/settings"); }} disabled={!online}>
                                        <ListItemIcon>
                                            <SettingsIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit">Settings</Typography>
                                    </MenuItem>

                                    {
                                        (deferredPrompt !== null && (localStorage.getItem("installed") === null || localStorage.getItem("installed") === "false") && !(window.matchMedia('(display-mode: standalone)').matches || navigator.standalone)) ? <MenuItem onClick={install} >
                                            <ListItemIcon>
                                                <AddToHomeScreenIcon />
                                            </ListItemIcon>
                                            <Typography variant="inherit">Install App</Typography>
                                        </MenuItem> : null
                                    }

                                    <MenuItem onClick={() => { openInNewTab('mailto:liubaoren2006@gmail.com') }}>
                                        <ListItemIcon>
                                            <MailOutlineOutlinedIcon />
                                        </ListItemIcon>
                                        <Typography variant="inherit">Feedback</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={signOut} disabled={!online}>
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

                        <OfflineReminder />
                        <ClassReminder />
                        <LunchReminder />
                        {todayDay !== undefined ? <Paper className={classes.paper} style={{ backgroundColor: backgroundColor }} elevation={3} variant="outlined">Today is day {todayDay} of 6{halfDay ? (<><span>, also a <b>half</b> day.</span>
                            <ListItemButton onClick={() => { setShowHalfDayLunchRule(!showHalfDayLunchRule) }} style={{ textAlign: "center", justifyContent: "center", padding: 5, marginTop: 5 }}>
                                {showHalfDayLunchRule ? "Hide" : "Show"} lunch rules for half days {showHalfDayLunchRule ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={showHalfDayLunchRule} unmountOnExit>
                                <div style={{ backgroundColor: "lightgrey", padding: 5 }}>
                                    If your lunch block {todayClass !== undefined ? <b>{todayClass[todayClass.length - 1].summary} </b> : null}is in World Language or Math Buildings, go to first lunch <b>11:00-11:30AM</b>.
                                    <br /><br />
                                    If it's in the Main Building or Science Building, go to second lunch <b>11:30-12:00PM</b>.
                                </div>
                            </Collapse>
                        </>) : "."}</Paper> : null}

                        {(todayClass === undefined || todayClass.length === 0) ? (<NoClasses />) : <DisplayClasses />}


                        <Typography variant="body1" align="left" style={{ marginTop: 50, color: "#808080" }}>Made by Baoren Liu</Typography>
                        <p style={{ height: 200 }}></p>

                        <Snackbar open id="installPrompt" style={{ display: "none" }} message="Add shortcut to Home screen" action={
                            <Button size="small" id="accept" color="secondary" onClick={install}>Accept</Button>
                        } />

                        <Dialog onClose={() => { setIosInstallPrompt(false); }} open={iosInstallPrompt}>
                            <div style={{ margin: 20, textAlign: "center" }}>
                                <h3>Install the app to home screen</h3><Divider light />
                                <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>Using Safari, click the share button <IosShareIcon /> at the bottom.</p><br /><br /><Divider light />
                                <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>Then click "Add to Home Screen" <AddBoxIcon />.</p>
                            </div>
                        </Dialog>
                    </div>
                </Container>

            </div>
        </div>
    );
}


export default Schedule;