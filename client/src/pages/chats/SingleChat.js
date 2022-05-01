import React from 'react'
import io from 'socket.io-client';
import {useParams} from 'react-router-dom';
import { Button,TextField} from '@mui/material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { AuthContext } from '../../store/auth/AuthStore';
import { ChatContext } from '../../store/chats/ChatStore';
import Paper from '@mui/material/Paper';
import classes from './SingleChat.module.css'
import CustomizedSnackbars from '../../components/snackBar/SnackBar';
import {  postChat,userFirstLoad,handleSnackBar, uploadNormalFile} from '../../store/chats/ChatActions';
import Messages from './Messages'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

function SingleChat({submit,socketDeleteMsg,emitStopTyping,emitIsTyping}) {
   
    const authCtx = React.useContext(AuthContext);
    const startedTyping = React.useRef(0);
    const setTimeOutId = React.useRef(null);
    const scrollRef = React.useRef();
    const chatArrRef = React.useRef(null);
    const chatCtx = React.useContext(ChatContext);
    const [message,setmessage]=React.useState('');
    const [inMsg,setInMsg]=React.useState([]);
    const [openEmoji, setopenEmoji] = React.useState(false);
    const [chatFile,setchatFile]=React.useState(null);
    const messageReceiver = useParams().id
    const loggedinUserId = authCtx.state.home.user._id;

React.useLayoutEffect(() => {
    if(!chatCtx?.state?.individualChats[messageReceiver] || chatCtx?.state?.individualChats[messageReceiver].getFirstLoad){
        chatCtx.dispatch(userFirstLoad(messageReceiver,chatCtx.dispatch))

    }
    
}, [messageReceiver])


     

      React.useEffect(() => {
        if(chatCtx.state.uploadFileSuccess) {
            submit(chatCtx.state.currentUploadedFile)
            setchatFile(null) 
         }
      }, [chatCtx.state.uploadFileSuccess]);

      React.useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [chatCtx?.state?.individualChats[messageReceiver]?.data]);

      const handleChange = e =>  setmessage(e.target.value)  
      const handleChatFileChange = e =>  setchatFile(e.target.files[0])  
      const handleRemoveFile = e =>  setchatFile(null)  
      const handleClickSmiley = () =>  setopenEmoji(true);

        const onEmojiClick = (emoji) => {
            setmessage(`${message}${emoji.native}`);
        };
    
      const handleFileUpload = e =>  {
          e.preventDefault()
          console.log(chatFile)
          if(chatFile.size/(1024 *1024).toFixed(4) > 16){
              return  chatCtx.dispatch(handleSnackBar({
                type:'error',
                open:true,
                msg:'Maximum file size to upload is 16MB'
            })) 
        }
            let msgType;
            if(chatFile.type.startsWith("image")){
                msgType='image'
            }else if(chatFile.type.startsWith("video")){
                msgType='video'
            }else if(chatFile.type.startsWith("audio")){
                msgType='audio'
            }else{
                msgType='file'
                
            }
         
          const formData = new FormData();
            formData.append('chat_file',chatFile)
            formData.append('senderId',loggedinUserId)
            formData.append('receiverId',messageReceiver)
            formData.append('receiverName',chatCtx?.state?.individualChats[messageReceiver]?.userProfile?.name )
            formData.append('isFirstMsg',chatCtx?.state?.individualChats[messageReceiver]?.chatStructure?.isFirstMsg )
            formData.append('senderName',authCtx.state.home.user.name)
            formData.append('msgType',msgType)
           chatCtx.dispatch(uploadNormalFile(formData,chatCtx.dispatch))
          

         
      }
      const handleSubmit = e => {
        e.preventDefault();
    
        const msg = {
            chatBetween:[authCtx.state.home.user._id,messageReceiver],
              whoShouldSee: [authCtx.state.home.user._id,messageReceiver],
              senderId:authCtx.state.home.user._id,
              receiverId:messageReceiver,
              msg:message,
              receiverName:authCtx.state.receiverProfile.txt,
              senderName:authCtx.state.home.user.name,
              msgType:'txt',
              isFirstMsg:chatCtx?.state?.individualChats[messageReceiver]?.chatStructure?.isFirstMsg
        };
   
        submit(msg)
        chatCtx.dispatch(postChat(msg,chatCtx.dispatch))

        setmessage('')
    }
    const handleKeyDown = (e) => {
    
        let lastTypingTime;
        const TYPING_TIMER_LENGTH=2000;
        if(e.key === 'Enter' || e.keyCode === 13){
            handleSubmit(e)
          emitStopTyping(messageReceiver)
          startedTyping.current=0
          
          return;
        }
          if(startedTyping.current === 0) emitIsTyping(messageReceiver)
          startedTyping.current=+ 1
        lastTypingTime= (new Date()).getTime();
        clearTimeout(setTimeOutId.current);
        setTimeOutId.current= setTimeout(() => {
          let typingTimer = (new Date()).getTime();
          let timeDiff = typingTimer -lastTypingTime;
          if(timeDiff >= TYPING_TIMER_LENGTH){
            emitStopTyping(messageReceiver)
            startedTyping.current=0
          }
          
          }, TYPING_TIMER_LENGTH);
    }
   
    if(chatCtx.state.isLoading){
        return <h4>Loading....</h4>
    }
    return (
        <Paper elevation={3} sx={{ p:2}}>
        <div className={classes.container}>
            <div className={classes.msgContainer} >
                {
                    chatCtx?.state?.individualChats[messageReceiver] &&
                    chatCtx?.state?.individualChats[messageReceiver].success &&
                    chatCtx?.state?.individualChats[messageReceiver].data.map((msg,i) => <div key={i} ref={scrollRef} ><Messages socketDeleteMsg={socketDeleteMsg} msg={msg}/></div>)

                }
                
            </div>
         
        
            {  
                chatCtx?.state?.individualChats[messageReceiver] &&
                chatCtx?.state?.individualChats[messageReceiver].success &&
                chatCtx?.state?.individualChats[messageReceiver].isTyping &&
                <div  className={classes.fileDispalyContainer} style={{background:'green',fontStyle:'italic'}} >
                  Is Typing...
                </div>
            }
            {
                chatFile &&
                <div  className={classes.fileDispalyContainer} >
                    {chatFile.name}
                    {
                        chatFile.size < (1024 * 1024) ? (` - ${(chatFile.size/1024).toFixed(2)}KB`):(` - ${(chatFile.size/(1024 * 1024)).toFixed(2)}MB`)
                    }
                    {
                        chatCtx.state.uploadFileProgress ? ` - ${chatCtx.state.uploadFileProgress}%` :''
                    }
                    <span onClick={handleRemoveFile} style={{cursor:'pointer'}}><CloseIcon/></span>
                </div>
            }
           {
            chatCtx?.state?.individualChats[messageReceiver] &&
            chatCtx?.state?.individualChats[messageReceiver].success &&
            <Stack sx={{ width: '100%' }} spacing={2}>
            {
                chatCtx?.state?.individualChats[messageReceiver].chatStructure.youBlocked &&
                <Alert severity="warning">You Blocked this user</Alert>
            }
            {
                chatCtx?.state?.individualChats[messageReceiver].chatStructure.receiverBlocked &&
                <Alert severity="warning">This user Blocked you</Alert>
            }
          </Stack>
           }

       {
        chatCtx?.state?.individualChats[messageReceiver] &&
        chatCtx?.state?.individualChats[messageReceiver].success &&
        !chatCtx?.state?.individualChats[messageReceiver].chatStructure.youBlocked &&
        !chatCtx?.state?.individualChats[messageReceiver].chatStructure.receiverBlocked &&
        <form onSubmit={handleSubmit} className={classes.form} >
         
                   <TextField
                       name='message'
                       fullWidth
                       onChange={handleChange}
                       label='Message'
                       variant="outlined"
                       type='text'
                        required
                       value={message}
                    onKeyDown={handleKeyDown}
                   />
                   <div className={classes.btnContainer}>

                   
                   <div className={classes.emojiCont} style={{display:openEmoji ? 'block' :'none'}}>
                      <CloseIcon className={classes.closeEmoji}  onClick={() => setopenEmoji(false)}/>
                      <Picker onSelect={onEmojiClick} showPreview={false} showSkinTones={false} style={{width:'100%'}} />
                   </div>
                   <SentimentVerySatisfiedIcon style={{marginLeft:'5px',cursor:'pointer'}} onClick={handleClickSmiley} />
                  
                

                        <input
                            style={{display:'none'}}
                            id='chatFile'
                            type="file"
                            onChange={handleChatFileChange}
                     
                        />
                        <label htmlFor={'chatFile'} >
                            <AttachFileIcon style={{cursor:'pointer',marginRight:'0.5vw'}}/>
                        </label>
                        {
                            chatFile ? (
                                <Button  variant="contained" onClick={handleFileUpload}  color="secondary" >
                                    Upload
                                </Button>
                            ) : (

                                <Button  variant="contained" type='submit' color="primary" >
                                    Send
                                </Button>
                            )
                        }

                   </div>
        </form>

       }
      
        </div>
      
    </Paper>
    )
}

export default SingleChat
