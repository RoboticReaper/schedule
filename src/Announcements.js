import { Grid, IconButton, Paper, Typography, Container } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import "firebase/auth";
import { useEffect } from "react";
import firebase from "firebase/app";
import firestore from "./firestore.js";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        textAlign: "left",
        flexDirection: 'column',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
    }
}));




function Announcements() {
    const history = useHistory();
    const classes = useStyles();
    let lastReadAnnouncementDate = new Date(localStorage.getItem("lastReadAnnouncementDate"));
    let latestAnnouncementDate = new Date(localStorage.getItem("latestAnnouncementDate"));

    function goBack() {
        history.push("/");
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = "/signin";
            } else {
                firestore.db.collection("users").doc(localStorage.getItem('uid')).update({ lastReadAnnouncementDate: new Date() })
            }
        })
        
    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <Grid container direction="row" spacing={2} alignItems="center" justify="center">
                    <Grid item align="center"><IconButton onClick={goBack} title="Save and go back"><ArrowBackIcon style={{ color: "white" }} /></IconButton></Grid>

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }} align="center">

                        <h3 style={{}}>Announcements</h3>
                    </Grid>
                </Grid>
            </header>

            <Container maxWidth='md'>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={(latestAnnouncementDate > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") ? {backgroundColor: "#fdf7e2"} : {}}>
                    <h2>Lunch Rules Update</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>8/20/2022 10:37PM</div>
                    <div style={{ marginTop: 10, fontWeight: 500 }}>
                        To people who have put in their lunch <b>before 8/20</b>:<br />
                        <p>The school has changed the instructions to find out what lunch you have over the summer, and I wasn't aware of that.
                            As a result, the instructions on the lunch page is outdated.</p>
                        <p>I have updated the instructions according to <a href="https://docs.google.com/document/d/1G9FqJ9gKURwwiy-qzcHfqRnbzowMF4W0/edit?usp=sharing&ouid=100109913602878663196&rtpof=true&sd=true" target="_blank">our school's doc</a>,
                            and you may <span onClick={() => { history.push("/lunches") }} style={{ color: "blue", cursor: "pointer" }}>update your lunch info</span> using the new rules.</p>
                        
                        If you just registered or didn't put in your lunch before 8/20, you can ignore this message.<br />
                        Sorry for the inconvenience.
                        <br /><br />Best,<br />Baoren
                    </div>
                </Paper>
            </Container>
        </div>
    );
}

export default Announcements;