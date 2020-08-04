import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
  } from '@material-ui/core';

  export default function UserGroupsRemove(props){

    const [vaildDelete, setVaildDelete] = React.useState(true);

    const handleChange = (event) => {
      if(event.target.value === 'DELETE'){
        setVaildDelete(false)
      } else {
        setVaildDelete(true)
      }
    }

    async function handleSubmit(event) {
      event.preventDefault();
      await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
        headers: {
          function: 'okta_user_group_remove',
          data: JSON.stringify(props.row_data),
          customer_group: props.customer_group
        }
      })
      .then((res) => {
        if(res.status === 200){
          props.refresh_groups(props.customer_group, true)
          props.onClose()
        }
      })

    }

    return (
      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
      <DialogTitle id="simple-dialog-title">If you are sure, type DELETE below.</DialogTitle>
        <DialogContent >
        <Grid container alignItems="flex-start" spacing={2}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              required
              name="delete"
              type="text"
              label="DELETE"
              onChange={handleChange}
            />
          </Grid>
          <Grid item style={{ marginTop: 16 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={vaildDelete}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        </DialogContent>
      </Dialog>
    )
  }
