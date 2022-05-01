import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import classes from './SingleModal.module.css'

const SingleModal = ({ show, children }) => {

    
  const [shouldRender, setRender] = useState(show);

  const handleAnimationEnd = () => {
    if (!show) setRender(false);
  };


  
  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  // className={clsx({
  //   [classes.popIn]: show,
  //   [classes.popOut]: !show,
  //     })}
// className={show ? classes.popIn : classes.popOut}
  return (
    <>
    {
      shouldRender && (
        <div
        className={show ? classes.popIn : classes.popOut}
        onAnimationEnd={handleAnimationEnd}
        >
          {children}
        </div>

        )
    }
    </>
  );
};

export default SingleModal;