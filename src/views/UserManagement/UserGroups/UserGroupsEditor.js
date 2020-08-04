import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button
} from '@material-ui/core';

export default function UserGroupsEditor(props){

  const [ unchanged, setUnchanged ] = React.useState(true);
  const [ changing, setChanging ] = React.useState(false);
  const [ error, setError] = React.useState({
    group_name: false,
    group_users: false
  })
  const [ validForm, setValidForm] = React.useState(true);
  const [ group, setGroup ] = React.useState(props.row_data)
  const [ closed, setClosed] = React.useState(false);

  useEffect(() => {
    if(
         (group.group_name === '' && props.new_group !== true && props.row_data !== group) ||
         (changing !== true && props.row_data.group_name !== group.group_name) ||
         (changing !== true && props.new_group === true) ||
         (closed === true)
      ){
          setGroup(props.row_data)
          setClosed(false)
          setError({
            group_name: false,
            group_users: false
        })
      }
  }, [group, closed, group.email, props.row_data, props.new_group, changing])

  function validate(group){

    let errorTemp = {...error}

    for(let i=0; i<Object.keys(error).length; i++){
      let key = Object.keys(error)[i]
      if( errorTemp[key] === true ){
        setValidForm(true)
        break;
      } else {
        setValidForm(false)
      }
    }
  }

  const newGroupValues = (event) => {
    setChanging(true)
    let groupTemp = {...group}
    console.log(groupTemp)
    groupTemp[event.target.name] = event.target.value
    validate(groupTemp);
    setGroup(groupTemp);
    setUnchanged(false)
  }


  const resetForm = (event) => {
    setGroup(props.row_data)
    let groupTemp = {...group}
    validate(groupTemp);
    setValidForm(true)
    setUnchanged(true)
  }

  const handleClose = (e) => {
    e.preventDefault()
    setClosed(true)
    setUnchanged(true)
    setValidForm(true)
    props.onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(props)
    await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'okta_user_groups',
        data: JSON.stringify(group),
        new_group: props.new_group,
        customer_group: props.customer_group,
        update_switch: true
      }
    })
    .then((res) => {
      if(res.status === 200){
        setUnchanged(true)
        setValidForm(true)
        props.refresh_groups(props.customer_group, true)
        props.onClose()
      }
    })
  }

  return (
    <Dialog
      open={props.open}
      aria-labelledby="responsive-dialog-title"
    >
    <DialogTitle>
      { props.new_group ?
        <div><h2>Create Group</h2></div>
        :
        <div><h2>Edit Group</h2></div>
      }
      </DialogTitle>
      <DialogContent>
      <form
      autoComplete="true">
      <Grid container alignItems="flex-start" spacing={2}>

      <Grid item xs={4}>
        <TextField
          fullWidth
          required
          error={error.group_name}
          name="group_name"
          type="text"
          label="Group Name"
          value={group.group_name || ''}
          onChange={newGroupValues}
        />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="select-group_ids-label">Users</InputLabel>
            <Select
              multiple
              required
              name="group_ids"
              labelId="select-group_ids-label"
              value={group.group_ids || ''}
              onChange={newGroupValues}
            >
            { props.user_list.map((user) =>
              <MenuItem value={user.id}>{user.display_name}</MenuItem>
            )}
            </Select>
          </FormControl>
        </Grid>



      <Grid item style={{ marginTop: 16 }}>
        <Button
          type="button"
          variant="contained"
          disabled={unchanged}
          onClick={resetForm}
        >
          Reset
        </Button>
      </Grid>
      <Grid item style={{ marginTop: 16 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={validForm}
          onClick={handleSubmit}
        >event.target.value
          Submit
        </Button>
        </Grid>
        <Grid item style={{ marginTop: 16 }}>
          <Button
            variant="contained"
            color="primary"
            type="reset"
            onClick={handleClose}
          >
            Close
          </Button>
          </Grid>
          </Grid>
          </form>
          </DialogContent>
        </Dialog>
    )
}
