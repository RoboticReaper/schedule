import { Grid, IconButton, Paper, Typography, Container } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import firebase from "firebase/app";
import firestore from "./firestore.js";

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        textAlign: "left",
        flexDirection: 'column',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        backgroundColor: () => { return localStorage.getItem("backgroundColor") === null || localStorage.getItem("backgroundColor") === "" ? "#ffffff" : localStorage.getItem("backgroundColor") },
    }
}));




function Announcements() {
    const history = useHistory();
    const classes = useStyles();
    let lastReadAnnouncementDate = new Date(localStorage.getItem("lastReadAnnouncementDate"));
    const [userCreationDate, setUserCreationDate] = useState(new Date());


    function goBack() {
        history.push("/");
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = "/signin";
            } else {
                setUserCreationDate(new Date(user.metadata.creationTime));
                firestore.db.collection("users").doc(localStorage.getItem('uid')).set({ lastReadAnnouncementDate: new Date() }, { merge: true });
            }
        })

    }, [])
    

    return (
        <div className="App" style={{ backgroundColor: localStorage.getItem("backgroundColor") === null || localStorage.getItem("backgroundColor") === "" ? "#ffffff" : localStorage.getItem("backgroundColor") }}>
            <header className="App-header">
                <Grid container direction="row" alignItems="center" justify="center">
                    <Grid item align="center"><IconButton onClick={goBack} title="Go back"><ArrowBackIcon style={{ color: "white" }} /></IconButton></Grid>

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }} align="center">

                        <h3 style={{}}>Announcements</h3>
                    </Grid>
                </Grid>
            </header>

            <Container maxWidth='md'>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2022, 8, 1, 22, 32) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2022, 8, 1, 22, 32)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>Customization Update</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>9/1/2022 10:32PM</div>
                    <div style={{ marginTop: 10 }}>
                        Hi everyone,<br />
                        <p>I can't believe we're almost at 800 users right now! This is so exciting and it means a lot to me. Thanks to those who have made good suggestions for the app over these days, here is a list of new features I've worked on:</p>
                        <ul>
                            <li>You can now customize the <b>app's color</b>! Just go to <span onClick={() => { history.push("/settings") }} style={{ color: "blue", cursor: "pointer" }}>settings page</span> and you can choose your own background color for the app. It will apply to all your devices.</li>
                            <li>In settings page, you can switch to <b>12-hour clock</b> if you prefer.</li>
                            <li>There is also an option to choose a <b>color for your classes</b> to help you identify the class faster. In <span onClick={() => { history.push("/classes") }} style={{ color: "blue", cursor: "pointer" }}>class edit page</span>, edit one of the classes and scroll to the bottom. You can choose a color for that class or keep it transparent to match with the background color.</li>
                            <li>On days ending at 12PM, there will be a <b>half-day reminder</b> (for example 9/23).</li>
                        </ul>
                        
                        That's all for now, but I will keep working on it to improve it further! <br />
                        <br />Best,<br />Baoren
                    </div>
                </Paper>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2022, 7, 20, 22, 37) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2022, 7, 20, 22, 37)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>Lunch Rules Update</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>8/20/2022 10:37PM</div>
                    <div style={{ marginTop: 10 }}>
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