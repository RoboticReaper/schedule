import { Grid, IconButton, Paper, Typography, Container } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import firebase from "firebase/app";
import firestore from "./firestore.js";
import { Button } from "@mui/material";

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
                    <Grid item align="center"><IconButton onClick={goBack} style={{ color: "white" }} title="Go back"><ArrowBackIcon /></IconButton></Grid>

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }} align="center">
                        <h3>Announcements</h3>
                    </Grid>
                </Grid>
            </header>

            <Container maxWidth='md' style={{ paddingBottom: 100 }}>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2024, 7, 24, 23, 30) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2024, 7, 24, 23, 30)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>LHS Schedule will keep running</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>8/23/2024 11:30PM</div>
                    <div style={{ marginTop: 10 }}>
                        <p>Hi everyone,<br /><br />
                        Thank you so much for using my schedule app! It means so much to me that I was able to make real impacts with my project.<br /><br />
                        As I've graduated from high school and heading to college, this means I'll be paying less attention to fixes and any changes to schedules from the school, so please email me if there are any issues.

                        </p>
                        Thank you guys so much,<br />Baoren
                    </div>
                </Paper>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2023, 8, 12, 23, 38) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2023, 8, 12, 23, 38)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>Website Unblocked</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>9/12/2023 11:38PM</div>
                    <div style={{ marginTop: 10 }}>
                        <p>The school has unblocked this website and it's usable on Chromebooks now. Thanks for bearing with me.</p>
                        Best,<br />Baoren
                    </div>
                </Paper>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2023, 8, 6, 23, 59) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2023, 8, 6, 23, 59)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>Issue With Chromebooks</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>9/6/2023 11:59PM</div>
                    <div style={{ marginTop: 10 }}>
                        <p>Hi everone,<br /><br />
                            School has just blocked LHS Schedule on Chromebooks, so  it can't be accessed. <br /><br />Right now <b>only personal devices work</b>. I'm working with the tech department to see how I can make them unblock it.</p>

                        Best,<br />Baoren
                    </div>
                </Paper>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2023, 7, 25, 20, 12) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2023, 7, 25, 20, 12)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>Auto Calculate Lunch</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>8/25/2023 8:12PM</div>
                    <div style={{ marginTop: 10 }}>
                        <p>It seems like this is really needed, so I added this feature. </p>
                        <p>Now this app will auto calculate your lunch for the day that you're looking at. It's turned on by default but you can change it in settings. It will only calculate <b>if you haven't put any lunch in that day</b> </p>
                        Best,<br />Baoren
                    </div>
                </Paper>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2023, 7, 24, 22, 40) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2023, 7, 24, 22, 40)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>Bug fixes</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>8/24/2023 10:40PM</div>
                    <div style={{ marginTop: 10 }}>
                        <p>Hey guys, sorry for the bugs that affected displaying some of the classes. Now they should be fixed by refreshing the main page twice. </p>
                        <p>Also, if you used auto upload class feature, remember to double check just to make sure that everything is properly added. </p>
                        Best,<br />Baoren
                    </div>
                </Paper>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2023, 7, 24, 13, 30) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2023, 7, 24, 13, 30)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>New Feature Update</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>8/24/2023 1:30PM</div>
                    <div style={{ marginTop: 10 }}>
                        <ul>
                            <li>Add classes by uploading PDF</li>
                        </ul>
                        <p>As everyone is receiving their schedule, I have made a new feature in "classes" page. You can now upload the schedule pdf from Aspen and it'll automatically add the classes, instead of having to manually do it.</p>
                        Best,<br />Baoren
                    </div>
                </Paper>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2023, 0, 23, 14, 0) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2023, 0, 23, 14, 0)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>Quarter 3 Lunch Change</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>1/23/2023 2:00PM</div>
                    <div style={{ marginTop: 10 }}>
                        Hi everyone,<br />
                        <p>Since quarter 3 has begun, lunches are now back to how quarter 1 was.  </p>
                        <p>If you haven't done so, you can switch your 2nd and 3rd lunch by clicking this button: <Button variant="contained" style={{ textTransform: "none" }} onClick={() => {
                            var lunches = JSON.parse(localStorage.getItem("lunches"));
                            for (var i = 0; i < lunches.length; i++) {
                                if (lunches[i] === '2') {
                                    lunches[i] = '3';
                                } else if (lunches[i] === '3') {
                                    lunches[i] = '2';
                                }
                            }

                            // upload the lunches to firestore
                            firestore.db.collection('users').doc(localStorage.getItem('uid')).set({ "lunches": JSON.stringify(lunches) }, { merge: true }).then(() => {
                                localStorage.setItem('lunches', JSON.stringify(lunches));
                                alert("Lunches updated! Reload to show changes.");
                            }).catch((error) => {
                                alert(error);
                            })
                        }}>Switch Lunch</Button></p>
                        Best,<br />Baoren
                    </div>
                </Paper>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2022, 10, 8, 16, 50) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2022, 10, 8, 16, 50)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>Quarter 2 Lunch Change</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>11/8/2022 4:50PM</div>
                    <div style={{ marginTop: 10 }}>
                        Hi everyone,<br />
                        <p>According to the message from our principal, <b>2nd and 3rd lunch will be switched every quarter</b>. I have also updated the rule on lunch page. </p>
                        <p>If you haven't done so, you can switch your 2nd and 3rd lunch by clicking this button: <Button variant="contained" style={{ textTransform: "none" }} onClick={() => {
                            var lunches = JSON.parse(localStorage.getItem("lunches"));
                            for (var i = 0; i < lunches.length; i++) {
                                if (lunches[i] === '2') {
                                    lunches[i] = '3';
                                } else if (lunches[i] === '3') {
                                    lunches[i] = '2';
                                }
                            }

                            // upload the lunches to firestore
                            firestore.db.collection('users').doc(localStorage.getItem('uid')).set({ "lunches": JSON.stringify(lunches) }, { merge: true }).then(() => {
                                localStorage.setItem('lunches', JSON.stringify(lunches));
                                alert("Lunches updated!");
                            }).catch((error) => {
                                alert(error);
                            })
                        }}>Switch Lunch</Button></p>
                        Best,<br />Baoren
                    </div>
                </Paper>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2022, 8, 11, 21, 30) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2022, 8, 11, 21, 30)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>Offline Loading Available</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>9/11/2022 9:30PM</div>
                    <div style={{ marginTop: 10 }}>
                        Hi everyone,<br />
                        <p>I'm sending this message right before school on Monday to let you know that LHS Schedule can work offline now! We've all tried to load this app while having poor data signal in school which takes forever. Here is what you can do to not wait forever: </p>
                        <p>Refresh the home page after reading this, then <b>turn off wifi and data.</b></p>
                        <p>Then, the offline version will load and you can see your schedule again (your friends' too if you've looked at their schedules before).</p>

                        So next time when it's very slow to load, you can use this method and it'll make life a lot easier.<br />
                        <br />Best,<br />Baoren
                    </div>
                </Paper>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={((new Date(2022, 8, 3, 21, 40) > lastReadAnnouncementDate || localStorage.getItem('lastReadAnnouncementDate') === "") && userCreationDate < new Date(2022, 8, 3, 21, 40)) ? { backgroundColor: "#fdf7e2" } : {}}>
                    <h2>New Feature: Adding Friends</h2>
                    <div style={{ width: "100%", backgroundColor: "#f0f9ff", padding: 5 }}>9/3/2022 9:40PM</div>
                    <div style={{ marginTop: 10 }}>
                        Hi everyone,<br />
                        <p>Friend system is now available, and you can add friends to view their schedule on any day. Here are the steps:</p>
                        <ul>
                            <li>In <span onClick={() => { history.push("/friends") }} style={{ color: "blue", cursor: "pointer" }}>friends page</span>, your UID will be shown in order to copy and share it with your friends.</li>
                            <li>Click the + button at the top to fill your friends' UID and their names. </li>
                            <li>After <b>both</b> people have added each other as friends, you can look at each other's schedule.</li>
                        </ul>

                        Hope you find this useful! <br />
                        <br />Best,<br />Baoren
                    </div>
                </Paper>
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
                            <li>On days ending at 12PM, there will be a <b>half-day reminder</b> (for example 9/23/2022).</li>
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