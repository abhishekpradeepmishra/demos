import logo from './logo.svg';
import './App.css';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar'
import { Container, Row, Col, Card, Button, Modal, ButtonGroup, Tooltip, OverlayTrigger, Image, Tabs, Tab } from 'react-bootstrap'
import Network from './Network';
import GamePanel from './GamePanel'
import React, { useState, useEffect } from 'react';

function App() {
  const [showRefArchitecture, setShowRefArchitecture] = useState(false);
  const handleCloseRefArchitecture = () => setShowRefArchitecture(false);
  const handleShowRefArchitecture = () => setShowRefArchitecture(true);
  const [fullscreen, setFullscreen] = useState(true);
  const [key, setKey] = useState('aws');

  // function handleShowRefArchitecture(e) {
  //   e.preventDefault();
  //   showRefArchitecture();
  // }

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/"><h2>Fraud Graph (online gaming fraud) </h2></Navbar.Brand>
          <Nav className="me-auto">
            {/* <Nav.Link href="/">Home</Nav.Link> */}
            {/* <Nav.Link href="#features">Connected Entities</Nav.Link> */}
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            {/* <Navbar.Text>
              Signed in as: <a href="#login">Mark Otto</a>
            </Navbar.Text> */}
            <Nav.Link href="https://www.demos.neptune.aws.dev/" target="_blank">Neptune Demos Hub</Nav.Link>
            <Nav.Link onClick={(e) => handleShowRefArchitecture(e)}>Reference Architecture</Nav.Link>
            <Nav.Link onClick={(e) => window.open("https://graphexplorer.demos.neptune.aws.dev/explorer/#/graph-explorer/?ds=fraud", "_blank")}>View in Graph Explorer</Nav.Link>
            <Nav.Link href="https://aws.amazon.com/solutions/case-studies/?customer-references-cards.sort-by=item.additionalFields.sortDate&customer-references-cards.sort-order=desc&awsf.content-type=*all&awsf.customer-references-location=*all&awsf.customer-references-segment=*all&awsf.customer-references-industry=*all&awsf.customer-references-use-case=*all&awsf.customer-references-tech-category=*all&awsf.customer-references-product=*all&customer-references-cards.q=Neptune&customer-references-cards.q_operator=AND&awsm.page-customer-references-cards=1" target="_blank">Case studies</Nav.Link>
            <Nav.Link href="https://aws.amazon.com/neptune/" target="_blank">Amazon Neptune</Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col>
            A fraud graph stores the relationships between the transactions, actors, and other relevant information to
            enable customers to find common patterns in the data and build applications that can detect fraudulent activities.
            Amazon Neptune graph database can be used to prevent <b>Fraud and Collusion</b> by detecting if
            two players in a game are colluding to beat other players.
            <br /> The demo shows a game panel simulating a rummy game. When players join the game, for each pair of players
            a Matchmaking process is done. Matchmaking verifies whether players are sharing metadata like device, email or phone numbers. Matchmaking fails if
            players are found to be sharing any metadata in the network and are not allowed to join the game.
          </Col>
        </Row>
        <Row>
          <Modal show={showRefArchitecture} onHide={handleCloseRefArchitecture}
            // size="xl"
            fullscreen={true}
            centered>
            <Modal.Header closeButton>
              <Modal.Title>Reference Architecture</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Tabs
                id="tab-refArchitecture"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                <Tab eventKey="aws" title="End to end architecture">
                  <div>
                    {/* <h5>End to end architecture</h5> */}
                    <div>
                      <Image src='./Fraud.png'></Image>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="graphmodel" title="Graph Model">
                  <div>
                    {/* <h5>Graph Model</h5> */}
                    <div>
                      <Image src='./Fraud-Graph-Model.png'></Image>
                    </div>
                  </div>
                </Tab>
              </Tabs>


            </Modal.Body>
            {/* <Modal.Footer>
              <Button variant="primary" onClick={handleCloseRefArchitecture}>
                Close
              </Button>
            </Modal.Footer> */}
          </Modal>

        </Row>
        <br />
        {/* <Row>
          <Col md="4">
            <h3>Game Panel</h3>
          </Col>
          <Col md="8">
            <h3>Network View</h3>
          </Col>
        </Row> */}
        <Row>
          <Col md="4">
            <GamePanel></GamePanel>
          </Col>
          <Col>
            <Network view="all"></Network>
          </Col>
        </Row>
      </Container>
      <footer class="text-center text-lg-start bg-none text-muted">
        <div class="text-center p-4" >
          contact <strong> wwso-neptune-ssa&#64;amazon.com</strong> for any feedback or questions
        </div>
      </footer>
    </>
  );
}

export default App;
