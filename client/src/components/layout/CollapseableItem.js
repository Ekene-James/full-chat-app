import React from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

import { Link,useParams  } from "react-router-dom";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { AuthContext } from '../../store/auth/AuthStore';
import { setReceiverProfile } from '../../store/auth/AuthActions';
import Badge from '@mui/material/Badge';


export default function CollapseableItem({items}) {
  const authCtx = React.useContext(AuthContext);
    const {id} = useParams();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}
      sx={{
        flexGrow: { xs: '0.03', sm: '1' },
        '&:hover': { background:'rgba(255,255,255,0.5)'},
      }}
      >
        <ListItemIcon>
            <Badge badgeContent={items.subItem.length} color={items.txt === 'My Chats' ? 'primary':'secondary'} showZero>
            {items.icon}
          </Badge>
        
        </ListItemIcon>
        <ListItemText primary={items?.txt} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            {
                items?.subItem?.map((item,i) => (
                  <div  key={i} style={{margin:0,padding:0,width:'100%'}} onClick={() => authCtx.dispatch(setReceiverProfile(item))}>
                    <Link 
                       
                        to={item.link}
                        style={{textDecoration:'none',color:'inherit'}}
                        >
                        <ListItemButton  sx={{
                            pl:4,
                            fontSize: '15px',
                            '&.Mui-selected': { backgroundColor:'white',color:'rgb(126,118,254)'},
                            '&:hover': { background:'white'},
              
                          }}
                            selected={item.id == id}>
                            <ListItemIcon  sx={{color:'inherit' }}>
                           
                            {item.icon}
                              
                            </ListItemIcon>
                            <ListItemText primary={item.txt}/>
                        </ListItemButton>
                    </Link>
                    </div>

                ))
            }
        </List>
      </Collapse>
    </>
  );
}
