import React from 'react';
import MaterialTable from 'material-table';
import {
  Dialog,
  DialogContent,
} from '@material-ui/core';
import fileToBeDownloaded from './Warranty.pdf'

export default function DocumentLibrary(props) {

  function downloadDocument(){
    window.open(fileToBeDownloaded)
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'75%'}
      fullScreen={props.fullScreen}
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
      <MaterialTable
        title='Documents'
        columns={[
          { title: 'Name' , field: 'name' },
          { title: 'Upload Date' , field: 'date' },
          { title: 'Uploaded by' , field: 'user' },
        ]}
        data={[
          { name: 'Warranty.pdf', date: 'January 12, 2020 12:45 PST', user: 'Casey Flinspach' }
        ]}
        actions={[
          {
            icon: 'save',
            tooltip: 'Download',
            onClick: () => { downloadDocument() }
          }
        ]}
         />
      </DialogContent>
    </Dialog>
  )
}
