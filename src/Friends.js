import { Grid, IconButton, Paper, Typography, Container } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import React from "react";
import firebase from "firebase/app";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import firestore from "./firestore.js";
import { Button, Switch, TextField } from "@mui/material";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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



function Friends() {
    const history = useHistory();
    const classes = useStyles()
    const [open, setOpen] = useState(false);
    const [friendID, setFriendID] = useState("");
    const [friendName, setFriendName] = useState("");
    const [IDError, setIDError] = useState(false)
    const [nameError, setNameError] = useState(false)
    const [returning, setReturning] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState(false);
    const [failedMsg, setFailedMsg] = useState(false);
    const [pasteMsg, setPasteMsg] = useState(false);
    const [friendList, setFriendList] = useState(localStorage.getItem("friendList") ? JSON.parse(localStorage.getItem("friendList")) : []);
    const [friendNames, setFriendNames] = useState(localStorage.getItem("friendName") ? JSON.parse(localStorage.getItem("friendName")) : []);
    const [deleteWarning, setDeleteWarning] = useState([false]);


    var backgroundColor = localStorage.getItem("backgroundColor") ? localStorage.getItem("backgroundColor") : "#ffffff";

    function goBack() {
        window.location.href = '/'

    }

    function submitData() {
        if (friendID.trim() === "") {
            setIDError(true)
        } else {
            setIDError(false)
        }
        if (friendName.trim() === "") {
            setNameError(true)
            return;
        } else {
            setNameError(false)
        }

        if (friendID.trim() === localStorage.getItem("uid")) {
            alert("You can't add yourself as a friend!")
            setIDError(true)
            return;
        }

        for (var i = 0; i < friendList.length; i++) {
            if (friendList[i] === friendID) {
                alert("Friend already exists")
                setIDError(true)
                return;
            }
        }

        localStorage.setItem("friendList", JSON.stringify([...friendList, friendID]));
        localStorage.setItem("friendName", JSON.stringify([...friendNames, friendName]));


        firestore.db.collection("users").doc(localStorage.getItem("uid")).set({
            friendList: firebase.firestore.FieldValue.arrayUnion(friendID),
            friendName: firebase.firestore.FieldValue.arrayUnion(friendName),
        }, { merge: true }).then(() => {
            setFriendList([...friendList, friendID]);
            setFriendNames([...friendNames, friendName]);
        })
        setFriendName("")
        setFriendID("")
        setOpen(false);


    }

    function viewFriend(uid) {
        window.location.href = '/friend/' + uid;
    }

    function deleteFriend(index) {
        var friend = friendList[index];
        var name = friendNames[index];

        localStorage.setItem("friendList", JSON.stringify(friendList.filter((item, i) => i !== index)));
        localStorage.setItem("friendName", JSON.stringify(friendNames.filter((item, i) => i !== index)));

        firestore.db.collection("users").doc(localStorage.getItem("uid")).set({
            friendList: firebase.firestore.FieldValue.arrayRemove(friend),
            friendName: firebase.firestore.FieldValue.arrayRemove(name),
        }, { merge: true }).then(() => {
            setFriendList(friendList.filter((item, i) => i !== index));
            setFriendNames(friendNames.filter((item, i) => i !== index));
        })




    }

    const handleClickOpen = (index) => {
        var newArr = deleteWarning;
        deleteWarning[index] = true;
        setDeleteWarning(newArr.slice());
    };

    const handleClose = (index) => {
        var newArr = deleteWarning;
        deleteWarning[index] = false;
        setDeleteWarning(newArr.slice());
    };

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                localStorage.clear()
                window.location.href = "/signin";
            }
        })

    }, [])

    return (
        <div className="App" style={{ backgroundColor: localStorage.getItem("backgroundColor") === null || localStorage.getItem("backgroundColor") === "" ? "#ffffff" : localStorage.getItem("backgroundColor") }}>
            <Backdrop className={classes.backdrop} open={returning}>
                <CircularProgress color="inherit" />
                <h1>Saving</h1>
            </Backdrop>
            <header className="App-header">
                <Grid container direction="row" alignItems="center" justify="center">
                    <Grid item align="center"><IconButton onClick={goBack} title="Go back"><ArrowBackIcon style={{ color: "white" }} /></IconButton></Grid>

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }} align="center">

                        <h3 style={{}}>Friends</h3>
                    </Grid>

                    <Grid item align="center">
                        <IconButton onClick={() => { setOpen(true) }} title="Add friend">
                            <AddIcon style={{ color: "white" }} />
                        </IconButton>
                        <Dialog disableBackdropClick open={open} onClose={() => { setOpen(false) }} aria-labelledby="form-dialog-title">
                            <DialogTitle>Add friend</DialogTitle>
                            <DialogContent>
                                <Snackbar open={pasteMsg} autoHideDuration={4000} onClose={() => { setPasteMsg(false) }} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                                    <Alert onClose={() => { setPasteMsg(false) }} severity="error" sx={{ width: "100%" }}>
                                        Failed to paste UID
                                    </Alert>
                                </Snackbar>
                                <DialogContentText>
                                    Received an ID from your friend? Enter it here.
                                </DialogContentText>
                                <TextField
                                    variant="outlined"
                                    required
                                    helperText="Required"
                                    value={friendID}
                                    onChange={e => setFriendID(e.target.value)}
                                    label="Friend's ID"
                                    type="text"
                                    error={IDError}
                                    margin="normal"
                                    autoFocus
                                    fullWidth
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton onClick={() => { if (navigator.clipboard) { navigator.clipboard.readText().then(text => { setFriendID(text) }).catch(()=>{setPasteMsg(true)}) } else {setPasteMsg(true) } }} title="Paste from clipboard">
                                                <ContentPasteIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }}
                                />
                                <TextField
                                    variant="outlined"
                                    label="Friend's name"
                                    type="text"
                                    helperText="Required"
                                    required
                                    margin="normal"
                                    fullWidth
                                    error={nameError}
                                    value={friendName}
                                    onChange={e => setFriendName(e.target.value)}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => { setFriendID(""); setFriendName(""); setNameError(false); setIDError(false); setOpen(false) }} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={submitData} color="primary">
                                    Add
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                </Grid>
            </header>

            <Container maxWidth='sm'>
                <Snackbar open={snackbarMsg} autoHideDuration={4000} onClose={() => { setSnackbarMsg(false) }} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                    <Alert onClose={() => { setSnackbarMsg(false) }} severity="success" sx={{ width: "100%" }}>
                        UID copied to clipboard
                    </Alert>
                </Snackbar>
                <Snackbar open={failedMsg} autoHideDuration={4000} onClose={() => { setFailedMsg(false) }} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                    <Alert onClose={() => { setFailedMsg(false) }} severity="error" sx={{ width: "100%" }}>
                        Failed to copy UID
                    </Alert>
                </Snackbar>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={{ backgroundColor }}>
                    <span>Below is your UID to share with your friends. You will <b>only</b> be able to see each other's schedule if you <b>both</b> added each other.</span>
                    <TextField variant="outlined" label="Your UID:" type="text" margin="normal" fullWidth value={localStorage.getItem("uid")} InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <IconButton onClick={() => { if (navigator.clipboard) { navigator.clipboard.writeText(localStorage.getItem("uid")); setSnackbarMsg(true) } else { setFailedMsg(true) } }} title="Copy to clipboard">
                                <ContentCopyIcon />
                            </IconButton>
                        </InputAdornment>
                    }} />
                    <h2>Friend list: {friendList.length === 0 ? "Empty" : null}</h2>
                    {friendList.map((friend, index) => {
                        return <Paper className={classes.paper} elevation={3} variant="outlined" style={{ backgroundColor, padding: 5, paddingLeft: 10, marginTop: 0, marginBottom: 5 }}>
                            <Grid container direction="row" alignItems="center">
                                <Grid item align="left" xs>{friendNames[index]}</Grid>
                                <Grid container direction="row" alignItems="center" xs style={{ justifyContent: "right" }}>
                                    <Grid item>
                                        <IconButton onClick={() => { viewFriend(friend) }} title={"View " + friendNames[index] + "'s schedule"}><VisibilityIcon /></IconButton>
                                        <IconButton onClick={() => { if (navigator.clipboard) { navigator.clipboard.writeText(friendList[index]); setSnackbarMsg(true) } else { setFailedMsg(true) } }} title={"Copy " + friendNames[index] + "'s UID"}><ContentCopyIcon /></IconButton>
                                        <IconButton title="Delete friend" onClick={() => { handleClickOpen(index) }}>
                                            <DeleteIcon style={{ color: "#d9534f" }} />
                                        </IconButton>
                                    </Grid>
                                    <Dialog open={deleteWarning[index]} onClose={() => { handleClose(index) }}>
                                        <DialogTitle>Delete {friendNames[index]}?</DialogTitle>
                                        <DialogContent>You will no longer be able to view each other's schedule.</DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => { handleClose(index) }} color="primary">Cancel</Button>
                                            <Button onClick={() => { deleteFriend(index); handleClose(index) }} style={{ color: "#d9534f" }}>Delete</Button>
                                        </DialogActions>
                                    </Dialog>
                                </Grid>
                            </Grid>
                        </Paper>
                    })}
                </Paper>
            </Container>
        </div>
    );
}

export default Friends;