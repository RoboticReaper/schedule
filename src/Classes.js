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
import InfoIcon from '@mui/icons-material/Info';
import firebase from "firebase/app";
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/legacy/build/pdf.worker.entry';
import "firebase/auth";
import demo from "./schedule pdf demo.png";

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

    const [infoOpen, setInfoOpen] = React.useState(false);


    function goBack() {
        setReturning(true);
        // upload the classes to firestore
        firestore.db.collection('users').doc(localStorage.getItem('uid')).set({ "classes": JSON.stringify(createdClasses), "hr": hr }, { merge: true }).then(result => {
            localStorage.setItem("hr", hr);
            localStorage.setItem("createdClasses", JSON.stringify(createdClasses));
            history.push("/");
            window.location.reload();
        }).catch(err => {
            setReturning(false);
            alert("Failed to save");
            console.log(err);
        })

    }

    function handleUpload(){
        // read uploaded pdf and auto create classes for user
        if(document.getElementById("upload").value == ""){
            return;
        }
        const doc = document.getElementById("upload").files[0];
        //console.log(doc)
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(doc);
        fileReader.onload = function () {
            var typedarray = new Uint8Array(this.result);
            PDFJS.GlobalWorkerOptions.workerSrc = 'pdf.worker.entry';
            PDFJS.getDocument(typedarray).promise.then(function (pdf) {
                pdf.getPage(1).then(function (page) {
                    page.getTextContent().then(function (textContent) {
                        const courses = textContent.items;
                        //console.log(courses);
                        // search through the array from end to beginning,
                        // and find the y position of each class's credit (credit is always in decimal)
                        // because all other information about the same class have the same y position as the class credit.

                        // course names' x location
                        var nameX = courses.find(element => element.str == "Description").transform[4];
                        //console.log("Classes's x location: " + nameX);

                        // course rooms' x location
                        var roomX = courses.find(element => element.str == "Room").transform[4];
                        //console.log("Rooms's x location: " + roomX);

                        // block's x locations
                        var blockX = courses.find(element => element.str == "Schedule").transform[4];
                        //console.log("Block's x location: " + blockX);

                        // credit's x location
                        var creditX = courses.find(element => element.str == "Credit").transform[4];
                        //console.log("Credit's x location: " + creditX);

                        // term's x location
                        var termX = courses.find(element => element.str == "Term").transform[4];
                        //console.log("Term's x location: " + termX);

                        var newClass = [];
                        var newHr = "";

                        for(var i = courses.length - 1; i >= 0; i--){
                            if(courses[i].str === "Adv" && courses[i].transform[4] == blockX){
                                newHr = courses.find(element => element.transform[5] == courses[i].transform[5] && element.transform[4] == roomX).str;
                            }
                            var creditValue = parseInt(courses[i].str)
                            if(courses[i].str.includes(".") && creditValue != 0 && creditValue < 10){
                                var creditY = courses[i].transform[5];
                                var term = courses.find(element => element.transform[5] == creditY && element.transform[4] == termX);
                                if(term !== undefined){
                                    term = term.str;
                                } else {
                                    continue;
                                }
                                var className = courses.find(element => element.transform[5] == creditY && element.transform[4] == nameX);
                                if(className !== undefined){
                                    className = className.str;
                                } else {
                                    continue;
                                }
                                var roomName = courses.find(element => element.transform[5] == creditY && element.transform[4] == roomX);
                                if(roomName !== undefined){
                                    roomName = roomName.str;
                                } else {
                                    continue;
                                }
                                var blockName = courses.find(element => element.transform[5] == creditY && element.transform[4] == blockX);
                                if(blockName !== undefined){
                                    blockName = blockName.str;
                                } else {
                                    continue;
                                }
                                
                                if(term == "S 1"){
                                    continue;
                                }
                                //console.log(className + " is in " + roomName + " during block " + blockName + " and is worth " + creditValue + " credits" + " in " + term);

                                // convert blocks to array format

                                var blocks = [];
                                var money = false;

                                if(blockName.length == 1){
                                    blocks.push(blockName + "1");
                                    blocks.push(blockName + "2");
                                    blocks.push(blockName + "3");
                                    blocks.push(blockName + "4");
                                } else if (blockName.length == 2 && blockName.includes("$")) {
                                    blocks.push(blockName + "1");
                                    blocks.push(blockName + "2");
                                    blocks.push(blockName + "3");
                                    blocks.push(blockName + "4");
                                }
                                else {
                                    var lastFoundLetterIndex = 0;
                                    for(var j = 1; j < blockName.length; j++){
                                        if(blockName[j] === "$") {
                                            money = true;
                                        }
                                        else if(blockName[j].match(/[A-Z]/)){
                                            if(j - lastFoundLetterIndex == 1){
                                                if(!money){
                                                blocks.push(blockName[j - 1] + "1");
                                                blocks.push(blockName[j - 1] + "2");
                                                blocks.push(blockName[j - 1] + "3");
                                                blocks.push(blockName[j - 1] + "4");
                                                } else {
                                                    blocks.push(blockName[j - 1] + "$1");
                                                blocks.push(blockName[j - 1] + "$2");
                                                blocks.push(blockName[j - 1] + "$3");
                                                blocks.push(blockName[j - 1] + "$4");
                                                }
                                            }

                                            lastFoundLetterIndex = j;
                                        } else {
                                            if(money){
                                                blocks.push(blockName[lastFoundLetterIndex] + "$" + blockName[j]);
                                            }
                                            else {
                                                blocks.push(blockName[lastFoundLetterIndex] + blockName[j]);
                                            }
                                        }
                                    }
                                }

                                newClass.push([className, roomName, blocks])
                                
                            }
                        }
                        setHr(newHr);
                        setClasses(newClass);
                    })
                })
            })
        }
    }

    function DisplayClasses() {
        return (createdClasses.map((item, index) =>
            <>
                <Paper className={classes.paper} elevation={3} variant="outlined" style={{ backgroundColor: item[3] === undefined ? localStorage.getItem("backgroundColor") : item[3] }}>
                    <Grid container spacing={2} direction="column">
                        <Grid item align="left" >
                            <Box display="flex">
                                <Typography gutterBottom variant="h6" style={{overflowWrap: "anywhere"}}>
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
                <div style={{ color: "gray" }}>Note: Advisory and I-blocks are already in the schedule, there is no need to add them here.<br></br><br></br>
                You can also upload the PDF of your schedule from Aspen to automatically add your classes.<div style={{color:"red"}}>Only all-year and second semester classes with credits will be added.</div>
                <IconButton onClick={()=>{setInfoOpen(true)}} >
                    <InfoIcon />
                </IconButton> &nbsp;
                <Dialog open={infoOpen} onClose={()=>{setInfoOpen(false)}} aria-labelledby="form-dialog-title">
                    <DialogTitle>PDF Requirements</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To add your schedule by uploading a PDF, you must first download the schedule PDF from Aspen.<br /><br />
                            The file is usually titled "Student_Schedule_HS.pdf", and it looks like this:
                        </DialogContentText>
                        <img src={demo} style={{width:"100%"}}></img>
                        <DialogContentText>After that, upload the file here. Only all-year and second semester classes with credits will be automatically added.<br /><br />
                            If there are any issues, please send me an email from the main page menu.<br />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{setInfoOpen(false)}} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
                <input id="upload" type="file" name="Upload PDF" accept="application/pdf" onChange={handleUpload}/>
                </div>
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