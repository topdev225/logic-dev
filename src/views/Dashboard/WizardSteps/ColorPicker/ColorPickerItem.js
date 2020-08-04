import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { SketchPicker } from 'react-color';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import {useSelector, useDispatch} from 'react-redux'
import allActions from '../../../../redux/actions';




export default function ColorPickerItem(props) {

  const seriesColors = useSelector(state => state.seriesColors)

  const [open, setOpen] = React.useState(false)

  const [rgb, setRgb] = React.useState(() => {
    if(!seriesColors[props.service][props.series]){
      let r = Math.floor(Math.random()*256);
      let g = Math.floor(Math.random()*256);
      let b = Math.floor(Math.random()*256);
      let rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
      return rgb
    } else {
      return seriesColors[props.service][props.series]
    }
  });

  const dispatch = useDispatch()


  React.useEffect(() => {
    if(rgb !== seriesColors[props.service][props.series]){
      dispatch(allActions.dashboardActions.setSeriesColor(props.service, props.series, rgb))
    }
  }, [dispatch, props.series, props.service, rgb, seriesColors]);

  const handleClickOpen = (service, series) => {
    setOpen(true)
  };
  const handleClose = () => {
    setOpen(false)
    dispatch(allActions.dashboardActions.setSeriesColor(props.service, props.series, rgb))
  };



  //color picker controls
  const handleChangeComplete = (color) => {
    let rgb = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
    setRgb(rgb)
  };



  const useStyles = makeStyles(theme => ({
    colorSelector: {
      width: '40px',
      height: '40px',
      margin: '10px',
      background: rgb,
    },
    tooltip: {
      fontSize: '4em'
    },
    dialog: {
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
    },
    dialogContent: {
      display: 'flex',
      justifyContent: 'center'
    }
  }));


  const classes = useStyles();

  return (

        <div>
          <Paper elevation={2} className={classes.colorSelector} onClick={() => handleClickOpen(props.service, props.series)}/>
            <Dialog
              maxWidth={'xs'}
              open={ open }
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">{`${props.service} - ${props.series}`}</DialogTitle>
              <DialogContent className={classes.dialogContent}>
                <SketchPicker
                  color={ rgb }
                  onChangeComplete={ handleChangeComplete }
                />
              </DialogContent>
            </Dialog>
        </div>

  );
}
