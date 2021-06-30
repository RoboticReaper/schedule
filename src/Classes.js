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
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import firebase from "firebase/app";
import "firebase/auth";
import { getUid } from "./Schedule.js";

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
}));



function Classes() {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const classes = useStyles();

    const [createdClasses, setClasses] = useState(JSON.parse(localStorage.getItem('createdClasses')));

    const addClass = (newClass) => {
        setClasses([...createdClasses, newClass]);
    }

    const deleteClass = (index) => {
        createdClasses.splice(index - 1, 1);
        handleClose();
    }


    function goBack() {
        // upload the classes to firestore
        firestore.db.collection('users').doc(getUid()).set({ "classes": JSON.stringify(createdClasses) }).then(result => {
            window.location.href = "/";
        });

    }

    function DisplayClasses() {
        return (createdClasses.map((item, index) =>
            <>
                <Paper className={classes.paper} elevation={3} variant="outlined">
                    <Grid container spacing={2} direction="column">
                        <Grid item align="left" >
                            <Box display="flex">
                                <Typography gutterBottom variant="h6">
                                    <b>{item[0]}</b>
                                </Typography>
                                <div>
                                    <IconButton onClick={handleClickOpen}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <Dialog disableBackdropClick open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">Delete Class</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Are you sure you want to delete this class?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose} color="primary">
                                                Cancel
                                            </Button>
                                            <Button onClick={() => { deleteClass(index) }} color="primary">
                                                Yes
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
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

    return <div>
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
                                    Classes
                                </Typography>
                            </Grid>

                            <Grid item align="center"><ClassDialog addClass={addClass} /></Grid>
                        </Grid>
                    </div>
                    <DisplayClasses />
                </div>
            </Container>

        </div>
    </div>
}

export default Classes;