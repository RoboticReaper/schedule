import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { Container } from "@material-ui/core";
import { useState } from "react";
import { IconButton } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Grid } from "@material-ui/core";
import ClassDialog from './ClassDialog.js';
import { Paper } from "@material-ui/core";
import firestore from "./firestore.js"
import { Box } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import React from 'react';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import { useHistory } from 'react-router-dom';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import firebase from "firebase/app";
import "firebase/auth";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        flexGrow: 1,
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        maxWidth: 500,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        display: "flex",
        flexDirection: "column",
    },
}));



function Classes() {

    const classes = useStyles();
    const history = useHistory();
    const [returning, setReturning] = useState(false);

    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "/";
        }
    })

    const [createdClasses, setClasses] = useState(JSON.parse(localStorage.getItem('createdClasses')));

    const [open, setOpen] = React.useState([false]);

    const [hr, setHr] = useState(localStorage.getItem('hr'));

    const handleClickOpen = (index) => {
        var newArr = open;
        open[index] = true;
        setOpen(newArr.slice());
    };

    const handleClose = (index) => {
        var newArr = open;
        open[index] = false;
        setOpen(newArr.slice());
    };

    const addClass = (newClass) => {
        setClasses([...createdClasses, newClass]);
    }

    const saveClass = (currClass, currIndex) => {
        let newClass = [...createdClasses];
        newClass[currIndex] = currClass;

        setClasses(newClass);
    }

    const deleteClass = (index) => {
        createdClasses.splice(index, 1);
        handleClose(index);
    }


    function goBack() {
        setReturning(true);
        // upload the classes to firestore
        firestore.db.collection('users').doc(localStorage.getItem('uid')).set({ "classes": JSON.stringify(createdClasses), "hr": hr }, { merge: true }).then(result => {
            localStorage.setItem("hr", hr);
            localStorage.setItem("createdClasses", JSON.stringify(createdClasses));
            history.push("/");
            window.location.reload();
        }).catch(err => {
            setReturning(false)
            alert("Failed to save");
            console.log(err);
        })

    }

    function DisplayClasses() {
        return (createdClasses.map((item, index) =>
            <>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={{ backgroundColor: item[3] === undefined ? localStorage.getItem("backgroundColor") : item[3] }}>
                    <Grid container spacing={2} direction="column">
                        <Grid item align="left" >
                            <Box display="flex">
                                <Typography gutterBottom variant="h6">
                                    <b>{item[0]}</b>
                                </Typography>
                                <div>
                                    <IconButton onClick={() => { handleClickOpen(index) }} title="Delete class">
                                        <DeleteIcon />
                                    </IconButton>
                                    <Dialog disableBackdropClick open={open[index]} onClose={() => { handleClose(index) }} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">Delete Class</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Are you sure you want to delete {item[0]}?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => { handleClose(index) }} color="primary">
                                                Cancel
                                            </Button>
                                            <Button onClick={() => { deleteClass(index) }} color="primary">
                                                Yes
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                                <ClassDialog currClass={item} currIndex={index} saveClass={saveClass} msg={"Edit class"} />
                            </Box>
                        </Grid>
                        <Grid item align="left">
                            <Typography variant="body1" gutterBottom>
                                Room: {item[1]}
                            </Typography>
                        </Grid>
                        <Grid item style={{ flexShrink: 1 }} align="left">
                            <Typography variant="body1" gutterBottom>
                                {item[2].map((block) =>
                                    <>
                                        {block}&nbsp;
                                    </>)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </>
        ));
    }

    return <div className="App" style={{ backgroundColor: localStorage.getItem("backgroundColor") === null || localStorage.getItem("backgroundColor") === "" ? "#ffffff" : localStorage.getItem("backgroundColor") }}>
        <Backdrop className={classes.backdrop} open={returning}>
            <CircularProgress color="inherit" />
            <h1>Saving</h1>
        </Backdrop>

        <header className="App-header">
            <Grid container direction="row" alignItems="center" justify="center">
                <Grid item align="center"><IconButton style={{ color: "white" }} onClick={goBack} title="Save and go back"><ArrowBackIcon /></IconButton></Grid>

                <Grid item style={{ marginLeft: 10, marginRight: 10 }} align="center">

                    <h3>Classes</h3>
                </Grid>

                <Grid item align="center"><ClassDialog addClass={addClass} msg={"Add class"} /></Grid>
            </Grid>
        </header>

        <Container maxWidth='sm'>
            <div className={classes.root}>
                <div style={{ color: "gray" }}>Note: Advisory and I-blocks are already in the schedule, there is no need to add them here.</div>
                <TextField
                    variant="outlined"
                    value={hr}
                    onChange={e => setHr(e.target.value)}
                    label="Homeroom number"
                    type="text"
                    margin="normal"
                    fullWidth
                />
                <DisplayClasses />
                <p style={{ height: 200 }}></p>
            </div>
        </Container>

    </div>

}

export default Classes;