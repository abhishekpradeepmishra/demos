import { Container, Row, Col, Card, Button, Modal, ButtonGroup, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { FcBusinessman, FcBusinesswoman } from "react-icons/fc";
import React, { useState, useEffect } from 'react';
import Timer from './Timer'
import { useStopwatch } from 'react-timer-hook';
import PubSub from 'pubsub-js';

function GamePanel() {

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

    const [playersinGame, setPlayersinGame] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [gamepanelstatus, setgamepanelstatus] = useState("Activate New Game");

    if (isRunning) {
        if (seconds == 20) {
            pause();
        }
    }

    function onGamePanelDropHandler(e) {
        e.preventDefault();

        if (!isRunning) {
            handleShow();
        } else {
            var player = JSON.parse(e.dataTransfer.getData("player"));
            var newPlayersinGame = JSON.parse(JSON.stringify(playersinGame));
            newPlayersinGame.push(player);
            setPlayersinGame(newPlayersinGame);
            document.getElementById(player.id).draggable = false;

            if (playersinGame.length === 1) {
                pause();

                PubSub.publish('playersaddedinlobby', {
                    playersinGame: {
                        "player1": newPlayersinGame[0],
                        "player2": newPlayersinGame[1]
                    }
                });
            }
        }
    }

    useEffect(() => {
        PubSub.subscribe("matchmakingcomplete", function (topic, data) { });
    }, []);

    function onGameStartHandler(e) {
        start();
        reset();

        playersinGame.forEach(player => {
            document.getElementById(player.id).draggable = true;
        })

        setPlayersinGame([]);

        PubSub.publish('newgameactivated', {
        });
    }

    function onDragHandler(e) {
        let titleAttribute = e.target.getAttribute('title');
        e.dataTransfer.setData("player", JSON.stringify({
            id: e.target.id,
            title: titleAttribute
        }));

        console.log("dragging");
    }

    function onDragOverHandler(e) {
        e.preventDefault();
        console.log("reached destination")
    }

    function renderTooltip(props) {
        return (
            <Tooltip id="button-tooltip" {...props}>
                click to activate new game instance, add players in 10 secs
                {props.tooltiptext}
            </Tooltip>
        );
    }

    function onCheckFraudRingHandler(e) {
        e.preventDefault();
        let playerid = e.target.getAttribute('player');

        PubSub.publish('checkforfraudrings', {
            player: playerid
        });
    }

    return (
        <>
            <Row>
                <Col>
                    <b>Game Panel View</b><span> This view shows simulation of a online Rummy game</span>
                    <br />
                </Col>
            </Row>
            <Row>
                <Col className="d-grid gap-2">
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >
                        <Button variant="primary" size="lg" onClick={e => onGameStartHandler(e)}>
                            <label>{gamepanelstatus}</label>
                            <label className="timer">{20 - seconds} sec</label>
                        </Button>
                    </OverlayTrigger>
                    <br />
                </Col>
            </Row>

            <Row>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Game not active</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>The game is not active, click on activate game and then add players</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Row>
            <Row>
                <Col>
                    <div id="gamepaneloverlay" className='overlay'>

                    </div>
                    <Row>
                        <Col>
                            <div draggable="true" onDragStart={(e) => onDragHandler(e)} title="Jeune1,Orazio" id="3e0f2626-153a-4a52-be34-fd3e1c04de0a">
                                <Card className="text-center" draggable="false">
                                    <Card.Header draggable="false">
                                        Jeune1,Orazio
                                    </Card.Header>
                                    <Card.Body draggable="false">
                                        <FcBusinessman draggable="false" size={80}></FcBusinessman>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                        <Col>
                            <div draggable="true" onDragStart={(e) => onDragHandler(e)} title="Pfeiffer,Delbert" id="aad84f79-2557-41d1-bbd8-18aa7a045549">
                                <Card className="text-center">
                                    <Card.Header>
                                        Pfeiffer,Delbert
                                    </Card.Header>
                                    <Card.Body>
                                        <FcBusinessman size={80}></FcBusinessman>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                        <Col>
                            <div draggable="true" onDragStart={(e) => onDragHandler(e)} title="Burkitt, Bryanty" id="6a79a587-4754-426e-a0c5-f97eac48c39e">
                                <Card className="text-center" >
                                    <Card.Header>
                                        Burkitt, Bryanty
                                    </Card.Header>
                                    <Card.Body>
                                        <FcBusinesswoman size={80}></FcBusinesswoman>
                                    </Card.Body>

                                </Card>
                            </div>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col className="text-center">
                            Drag-drop 2 players within <b>10</b> sec to join the game, players wait in the Lobby before they can join the game.
                        </Col>
                    </Row>
                    <Row>

                        <Col>

                            <Card >
                                {/* <Card.Header>
                        </Card.Header> */}
                                <Card.Body className="text-center gamepanel">
                                    {/* <Card.Text> */}
                                    <div onDrop={e => onGamePanelDropHandler(e)} onDragOver={e => onDragOverHandler(e)} >
                                        <div>
                                            <h2>{playersinGame.length}</h2> &nbsp; players waiting in lobby

                                            <br />

                                            {playersinGame.map(function (object, i) {
                                                return <><label><b>player{i + 1}</b>: {object.title}</label>&nbsp;</>;
                                            })}

                                        </div>
                                    </div>
                                    {/* </Card.Text> */}

                                </Card.Body>
                            </Card>


                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <div draggable="true" onDragStart={(e) => onDragHandler(e)} title="McCaughey,Woodie" id="ca812413-2419-4da4-a743-1442e03694f4">
                                <Card className="text-center" >
                                    <Card.Body>
                                        <FcBusinessman size={80}></FcBusinessman>
                                    </Card.Body>
                                    <Card.Footer>
                                        McCaughey,Woodie
                                    </Card.Footer>
                                </Card>
                                <br />
                                {/* <Button variant="secondary" size="sm" playerid="ca812413-2419-4da4-a743-1442e03694f4" onClick={e => onCheckFraudRingHandler(e)}>
                                    check for fraud ring
                                </Button> */}
                            </div>
                        </Col>
                        <Col>
                            <div draggable="true" onDragStart={(e) => onDragHandler(e)} title="Sandcroft,Maddie" id="a873d4b5-6ebd-46ff-ad98-6a78148987d7">
                                <Card className="text-center" >
                                    <Card.Body>
                                        <FcBusinesswoman size={80}></FcBusinesswoman>
                                    </Card.Body>
                                    <Card.Footer>
                                        Sandcroft,Maddie
                                    </Card.Footer>
                                </Card>
                                <br />
                                {/* <Button variant="secondary" size="sm" playerid="a873d4b5-6ebd-46ff-ad98-6a78148987d7" onClick={e => onCheckFraudRingHandler(e)}>
                                    check for fraud ring
                                </Button> */}
                            </div>
                        </Col>
                        <Col>
                            <div draggable="true" onDragStart={(e) => onDragHandler(e)} title="Hablet,Durand" id="9e4f413e-1192-4ae8-9fd8-fd38ee81fe3c">
                                <Card className="text-center" >

                                    <Card.Body>
                                        <FcBusinessman size={80}></FcBusinessman>
                                    </Card.Body>
                                    <Card.Footer>
                                        Hablet,Durand
                                    </Card.Footer>
                                </Card>
                                <br />
                                <Button variant="primary" size="md" playerid="9e4f413e-1192-4ae8-9fd8-fd38ee81fe3c" onClick={e => onCheckFraudRingHandler(e)}>
                                    Show Fraud Ring
                                </Button>
                            </div>
                        </Col>
                    </Row>

                </Col>
            </Row>
        </>
    )
}

export default GamePanel;
