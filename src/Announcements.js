import { Grid, IconButton, Paper, Typography, Container } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

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

    function goBack() {
        history.push("/");
    }

    return (
        <div className="App">
            <header className="App-header">
                <Grid container direction="row" spacing={2} alignItems="center" justify="center">
                    <Grid item align="center"><IconButton onClick={goBack} title="Save and go back"><ArrowBackIcon style={{color: "white"}}/></IconButton></Grid>

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }} align="center">

                        <h1>Announcements</h1>
                    </Grid>
                </Grid>
            </header>

            <Container maxWidth='md'>
                <Paper className={classes.paper} elevation={3} variant="outlined">
                    <h2>Lunch Rules Update</h2>
                    <div style={{width: "100%", backgroundColor: "#f0f9ff", padding: 5}}>8/20/2022 8:20PM</div>
                    <div style={{marginTop: 10, fontWeight: 500}}>
                        Hi everyone,<br />
                        <p>The school has changed the instructions to find out what lunch you have over the summer, and I wasn't aware of that.
                            As a result, the instructions on the lunch page is outdated.</p>
                        <p>I have updated the instructions according to <a href="https://docs.google.com/document/d/1G9FqJ9gKURwwiy-qzcHfqRnbzowMF4W0/edit?usp=sharing&ouid=100109913602878663196&rtpof=true&sd=true" target="_blank">our school's doc</a>,
                            and you may <span onClick={()=>{history.push("/lunches")}} style={{color: "blue", cursor: "pointer"}}>update your lunch info</span> using the new rules.</p>
                            
                            Sorry for the inconvenience.<br /><br />Best,<br />Baoren
                    </div>
                </Paper>
            </Container>
        </div>
    );
}

export default Announcements;