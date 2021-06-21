import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { Container } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Grid } from "@material-ui/core";
import ClassDialog from './ClassDialog.js'

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

function goBack(){
    window.location.href = "/";
}

let classes = new Map();

function Classes(){
    const classes = useStyles();

    return <div>
        <div className = "App">
            <header className='App-header'>
            </header>
        </div>
        <Container maxWidth='sm'>
            <div className={classes.root}>
                <div className={classes.btnRoot} >
                    <Grid container direction="row" alignItems="center" >
                        <Grid item ><IconButton onClick={goBack}><ArrowBackIcon /></IconButton></Grid>

                        <Grid item style={{marginLeft:30, marginRight:30}}><Typography variant="h4" gutterBottom align="center">
                            Classes
                        </Typography>
                        </Grid>

                        <Grid item ><ClassDialog /></Grid>
                    </Grid>
                </div>
            </div>
        </Container>
    </div>
}

export default Classes;