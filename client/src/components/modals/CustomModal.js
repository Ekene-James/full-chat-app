import React from 'react'

import classes from './CustomModal.module.css';
import CloseIcon from '@mui/icons-material/Close';

function CustomModal({show,children,handleClose,title}) {

  const [shouldRender, setRender] = React.useState(show);

  const handleAnimationEnd = () => {
    if (!show) setRender(false);
  };


  
  React.useEffect(() => {
    if (show) setRender(true);
  }, [show]);


    return (
      <>
        {
          shouldRender && (
          <div
            className={show ? classes.popIn : classes.popOut}
            onAnimationEnd={handleAnimationEnd}
           
            >
            <div className={classes.container}>
            <span className={classes.close} onClick={handleClose}><CloseIcon/></span>
            <p className={classes.h6}>{ title}</p>
               
                {children}
            </div>
              
          </div>
          )
        }
      </>
           
    )

    }
export default CustomModal
