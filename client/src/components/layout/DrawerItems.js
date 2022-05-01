import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';

import { useMatch ,Link,useParams  } from "react-router-dom";
import CollapseableItem from './CollapseableItem';


function DrawerItems({showToolbar=true,topDivider=true,bottomDivider=false,items}) {
    const [currentLink, setcurrentLink] = React.useState('')
    const {id} = useParams();
    //const params = useMatch (currentLink);
  
    const handleSelected = (name) => {
     //   setcurrentLink(name);
       
       
    }
  return (
      <>
    
      {showToolbar && <Toolbar />}
      {topDivider && <Divider />}
      <List>
      {items.map((item, index) => (
        item.isCollapseMenu ? (
          <CollapseableItem items={item} key={index}/>
        ) :
        (
        <Link 
            key={index} 
            to={item.link}
            style={{textDecoration:'none',color:'inherit'}}
          
        >
          <ListItem 
            button 
            selected={item.id == id}
            onClick={() => handleSelected(item.link)}
            sx={{
              fontSize: '15px',
              '&.Mui-selected': { backgroundColor:'white',color:'rgb(126,118,254)'},
              '&:hover': { background:'white'},

            }}
            >
            <ListItemIcon   sx={{color:'inherit' }}>
              {item.icon}
              </ListItemIcon>
            <ListItemText primary={item.txt} />
          </ListItem>
        </Link>
        )
      )
        )}
      </List>
      { bottomDivider && <Divider />}
    </>
  )
}

export default DrawerItems