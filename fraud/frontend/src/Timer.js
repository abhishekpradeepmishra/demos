import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useStopwatch } from 'react-timer-hook';

function Timer() {

    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        reset,
      } = useStopwatch({ autoStart: false });
    
    
      return (
          <div style={{fontSize: '12'}}>
            <span>{seconds}</span>
          </div>
      );
}

export default Timer;