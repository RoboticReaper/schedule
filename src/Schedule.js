
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
import SettingsIcon from '@material-ui/icons/Settings';
import './App.css';
import './loader.js'
import { IconButton } from '@material-ui/core';

var calendarLink = 'https://clients6.google.com/calendar/v3/calendars/lexingtonma.org_qud45cvitftvgc317tsd2vqctg@group.calendar.google.com/events?calendarId=lexingtonma.org_qud45cvitftvgc317tsd2vqctg%40group.calendar.google.com&singleEvents=true&timeZone=America%2FNew_York&maxAttendees=1&maxResults=1000&sanitizeHtml=true&timeMin=2021-05-30T00%3A00%3A00-04%3A00&timeMax=2021-10-04T00%3A00%3A00-04%3A00&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs';

var now = new Date("2021-06-17");
var todayClass = request();
console.log(todayClass);
var allClasses;

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
      margin: theme.spacing(1),
    },
  },
}));

function request(url = calendarLink){
  const $ = window.$;
  var classes;

  $.ajaxSetup({ // VERY IMPORTANT: force getJSON to finish before continuing
    async: false
  });

  $.getJSON(url, function(data){
    allClasses = data;
    // this is an example. Later the date variable will just be: new Date()
    classes = filter(allClasses,  now); // to enter the date in integer form, remember to minus the month by 1
  });


  return classes;
}

function filter(data, currDate){
  // use date as the key, the variable is array of events in that day.
  let dates = new Map();

  // filter out summary with "Week 1" or "Week 2"...
  for(var x = 0; x < data.items.length; x++){ // if the summary isn't length two ('D3'), and it's not equal to lunch, remove it
    if(data.items[x].summary.substring(0,5) !== "Lunch" && data.items[x].summary.length !== 2){
      data.items.splice(x, 1);
      x--;
    }
    else{
      var date = data.items[x].start.dateTime.substring(0, 10);
      
      if(dates[date] === undefined){
        dates[date] = [data.items[x]];
      }
      else{
        dates[date].push(data.items[x]);
      }
      
    }
  }
  
  var cls = undefined;
  try{
    cls = dates[formatDate(currDate)].sort(custom_sort); // sort today's classes by chronological order
  } catch (error){ // this means today's date isn't on the LHS calendar
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

function custom_sort(a, b){ // this sort json objects by date.
  return new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime();
}

function updateSummary(original){
  // replace class blocks to class names
}

function DisplayClasses(){
  const classes = useStyles();
  return(
    todayClass.map((item) => 
      <>
      <Paper className={classes.paper} elevation={3} variant="outlined">
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography gutterBottom variant="subtitle1">
              {item.summary}
            </Typography>
          </Grid>
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

function NoClasses(){
  const classes = useStyles();
  return (
    <Paper className={classes.paper} elevation={3} variant="outlined">
      <Typography gutterBottom variant="subtitle1">
        No class today
      </Typography>
    </Paper>
  )
}



function yesterday(){
  now.setDate(now.getDate()-1);
  todayClass = filter(allClasses, now);
}

function tomorrow(){
  var tomorrow = new Date(now);
  tomorrow.setDate(now.getDate()+1);
  now = new Date(tomorrow);
  todayClass = filter(allClasses, now);
}

function useForceUpdate(){
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

function today(){
    now = new Date();
    todayClass = filter(allClasses, now);
}


function Schedule() {
  const classes = useStyles();
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  var day = days[ now.getDay() ];
  var month = months[ now.getMonth() ];

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

  const settings = () => {
      window.location.href = "/settings";
  }

  const forceUpdate = useForceUpdate();

  return (
    <div>
      <div className = "App">
        <header className='App-header'>
        </header>
      </div>


      <Container maxWidth='sm'>
        <div className={classes.root} >
          <Typography variant="h4" gutterBottom align="center">
            {day}, {month} {now.getDate()}
          </Typography>

          <div className={classes.btnRoot}>
            <Box color="primary">
              <Button variant="contained" disableElevation color="primary" style={{textTransform:"none", margin:10}} onClick={() => {yesterday(); forceUpdate();}}>Yesterday</Button>
              {(new Date(now).setHours(0,0,0,0) !== new Date().setHours(0,0,0,0)) ? (<Button variant="outlined" disableElevation color="secondary" style={{textTransform:"none"}} onClick={() => {today(); forceUpdate()}}>Today</Button>) : <Button variant="outlined" disableElevation style={{textTransform:"none"}} disabled>Today</Button>}
              <Button variant="contained" disableElevation color="primary" style={{textTransform:"none", margin:10}} onClick={() => {tomorrow(); forceUpdate();}}>Tomorrow</Button>
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
                    <Typography variant="inherit">Classes</Typography>
                </MenuItem>
                <MenuItem onClick={settings}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <Typography variant="inherit">Settings</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </div>

          {todayClass===undefined ? (<NoClasses />) : <DisplayClasses />}
        </div>
        </Container>
      
    </div>
  );
}

export default Schedule;