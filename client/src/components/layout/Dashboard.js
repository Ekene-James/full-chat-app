import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import DrawerItems from './DrawerItems';
import {Outlet} from 'react-router-dom';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AuthContext } from '../../store/auth/AuthStore';
import { logout } from '../../store/auth/AuthActions';
import CollapseableItem from './CollapseableItem';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import CustomizedSnackbars from '../snackBar/SnackBar';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CustomModal from '../modals/CustomModal';
import ContentsContainer from '../modals/ContentsContainer';
import { ChatContext } from '../../store/chats/ChatStore';
import { modal,blockContact,unBlockContact,clearState, handleSnackBar } from '../../store/chats/ChatActions';
import {useParams,Link,useLocation,useNavigate} from 'react-router-dom';


import PersonIcon from '@mui/icons-material/Person';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SingleModal from '../modals/SingleModal';
import DeleteProfile from '../modals/modalContents/DeleteProfile';
const drawerWidth = 240;

const formatData = (datas,icon,linkParam,loggedinUserId,idToUse) => {
  const theData =[]
  const formatted =datas?.forEach(data => {
    if(data[idToUse] === loggedinUserId)return
      theData.push({
        txt:data.name,
        icon,
        id:data[idToUse],
        link:`/${linkParam}/${data[idToUse]}`
      })
    })
return theData
}

function Dashboard(props) {
  const { window,children,disconnect } = props;
  const authCtx = React.useContext(AuthContext);
  const chatCtx = React.useContext(ChatContext);
  const messageReceiver = useParams().id
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [chatWith, setchatWith] = React.useState({});

  const [onlineUsers, setonlineUsers] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);




    React.useMemo(() => {
      setchatWith({
        txt:'My Chats',
        icon:<CircleNotificationsIcon/>,
        subItem:formatData(authCtx?.state?.home?.user?.chatStructure?.chatsWith,<AccountCircleIcon/>,'chat',authCtx?.state?.user.id,'userId')
    
       })

    }, [authCtx?.state?.home])

    React.useMemo(() => {
    
       setonlineUsers({
        txt:'Online Users',
        icon:<CircleNotificationsIcon/>,
        subItem:formatData(chatCtx.state.onlineUsers,<PersonIcon/>,'chat',authCtx?.state?.user.id,'id'),
        
       })
    }, [chatCtx.state.onlineUsers])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleLogout = () => {
    disconnect()
    authCtx.dispatch(logout(navigate))
    chatCtx.dispatch(clearState())
  };

  React.useEffect(() => {
    
 if(authCtx.state.deleteProfileSucess)handleLogout()
 }, [authCtx.state.deleteProfileSucess])

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const openModal = (modalActive) => {
    setAnchorEl(null);
    chatCtx.dispatch(modal({open:true,active:modalActive})) 
  


  };
  const handleBlockUser = () => {
    setAnchorEl(null);
    const data ={
        receiverId:messageReceiver,
        youBlocked: true,
    }
    chatCtx.dispatch(blockContact(data,chatCtx.dispatch)) 


  };
  const handleUnBlockUser = () => {
    setAnchorEl(null);
    const data ={
      receiverId:messageReceiver,
      youBlocked: false,
  }
  chatCtx.dispatch(unBlockContact(data,chatCtx.dispatch)) 

  };
  const handleClose = (modal) => {
    setAnchorEl(null);


  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ display: 'flex',justifyContent:'space-between !important',alignItems:'center',width:'100%' }}>
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {
              messageReceiver &&
              chatCtx?.state?.individualChats[messageReceiver] &&
              chatCtx?.state?.individualChats[messageReceiver].success ? chatCtx?.state?.individualChats[messageReceiver].userProfile.name: 'Welcome'
            }
          </Typography>
          </>
          {
            messageReceiver &&
            chatCtx?.state?.individualChats[messageReceiver] &&
            chatCtx?.state?.individualChats[messageReceiver].success &&
            <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
            <img 
              src={ chatCtx?.state?.individualChats[messageReceiver]?.userProfile?.dp || '/img/no-user.jpg'}
              alt='profile_img' 
              style={{
                width:'30px',
                height:'30px',
                borderRadius: '50%',
                objectFit: 'contain',
                objectPosition: 'center',
                margin: '5px 0px',
                border:'1px solid whitesmoke'
              }}
               />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => openModal('Profile')}>Profile</MenuItem>
              {
              
                chatCtx?.state?.individualChats[messageReceiver].chatStructure.youBlocked ? (
                  <MenuItem onClick={handleUnBlockUser}>Unblock User</MenuItem>
                ) : (
                  <MenuItem onClick={handleBlockUser}>Block User</MenuItem>
                )
              }
              <MenuItem onClick={() => openModal('Clear Chats')}>Clear Chats</MenuItem>
             {
               // <MenuItem onClick={() => openModal('Delete Chats')}>Delete Chats</MenuItem>
              }
            </Menu>
          </div>

          }
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,backgroundColor : 'rgb(234,234,234)'},
          }}
        >
          <Toolbar />
          <CollapseableItem items={chatWith}/>
          
          <Divider />
          <CollapseableItem items={onlineUsers}/>
          <Divider />
      
          <List>
          <Link         
            to={'/chat/profile'}
            style={{textDecoration:'none',color:'inherit'}}
            >
            <ListItem sx={{cursor:'pointer','&:hover': { background:'rgba(231, 109, 137,0.6)'} }}   selected={location.pathname === '/chat/profile'}> 
              <ListItemIcon  sx={{color:'inherit' }}><PersonOutlineIcon/></ListItemIcon>
              <ListItemText primary={'Profile'} />
            </ListItem>
            </Link>
          </List>

          <List>
            <ListItem onClick={handleLogout} sx={{cursor:'pointer','&:hover': { background:'rgba(231, 109, 137,0.6)'} }}> 
              <ListItemIcon  sx={{color:'inherit' }}><LogoutIcon/></ListItemIcon>
              <ListItemText primary={'Logout'} />
            </ListItem>
          </List>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor : 'rgb(234,234,234)' },
          }}
          open
        >
        <List>
          <Toolbar />
          <CollapseableItem items={chatWith}/>
          
          <Divider />
          <CollapseableItem items={onlineUsers}/>
          <Divider />
        </List>

            <List>
              <Link         
                to={'/chat/profile'}
                style={{textDecoration:'none',color:'inherit'}}
                >
                <ListItem sx={{cursor:'pointer','&:hover': { background:'rgba(231, 109, 137,0.6)'} }}   selected={location.pathname === '/chat/profile'}> 
                  <ListItemIcon  sx={{color:'inherit' }}><PersonOutlineIcon/></ListItemIcon>
                  <ListItemText primary={'Profile'} />
                </ListItem>
                </Link>
            </List>

            <List>
            <ListItem onClick={handleLogout} sx={{cursor:'pointer','&:hover': { background:'rgba(231, 109, 137,0.6)'} }}> 
              <ListItemIcon  sx={{color:'inherit' }}><LogoutIcon/></ListItemIcon>
              <ListItemText primary={'Logout'} />
            </ListItem>
          </List>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
      {
         // children
      }
      <Outlet />
      </Box>
 
      <CustomizedSnackbars 
      type={chatCtx.state.snackBarObj.type} 
      msg={chatCtx.state.snackBarObj.msg} 
      open={chatCtx.state.snackBarObj.open} 
      setOpen={() => chatCtx.dispatch(handleSnackBar({...chatCtx.state.snackBarObj,open:false}))} 
      />
      <CustomModal show={chatCtx.state.modal.open} handleClose={() => { chatCtx.dispatch(modal({open:false,active:''})) }} 
      title={chatCtx.state.modal.active}
      >
      <ContentsContainer/>
    </CustomModal>
    
    <SingleModal show={authCtx.state.singleModals.deleteProfileModal}
    >
    <DeleteProfile/>
   </SingleModal>
    </Box>
  );
}

Dashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Dashboard;
