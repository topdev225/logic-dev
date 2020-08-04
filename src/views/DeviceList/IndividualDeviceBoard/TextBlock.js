import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';


export default function textBlock(props) {

    return (
      <Grid item xs={12} sm={9} md={6} lg={3}>
        <Card style={{height: '100%'}} elevation={2}>
          <CardHeader title={props.static_display_name}/>
            <CardContent stlye={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              {props.static_output}
            </CardContent>
        </Card>
      </Grid>
    );
}
