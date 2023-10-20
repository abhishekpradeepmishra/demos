import Graph from 'react-graph-vis';
import { Container, Row, Col, Card, Button, Modal, Spinner, Alert } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import PubSub from 'pubsub-js';

function Network({ view, param }) {
  const [dsnodes, setdsNodes] = useState([]);
  const [dsedges, setdsEdges] = useState([]);
  const [visnetwork, setVisnetwork] = useState(null);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [players, setPlayers] = useState(null);

  const [showMatchMaking, setShowMatchMaking] = useState(false);
  const handleMatchMakingClose = () => setShowMatchMaking(false);
  const handleMatchMakingShow = () => setShowMatchMaking(true);
  //example:  const APIPath = 'https://122312.execute-api.us-east-1.amazonaws.com/Prod/';
  const APIPath = "<BACKEND API ENDPOINT>"

  const handleMessageClose = () => {
    setMessage('');
    setVarient('success');
  };

  const [message, setMessage] = useState('');
  const [varient, setVarient] = useState('danger');

  const graph = {
    nodes: dsnodes,
    edges: dsedges,
  };

  const options = {
    edges: {
      smooth: {
        type: 'continuous',
        roundness: 0.3,
      }
    },
    nodes: {
      shape: 'box',
      size: 50,
    },
    physics: {
      enabled: physicsEnabled,
      forceAtlas2Based: {
        gravitationalConstant: -250,
        centralGravity: 0.01,
        springLength: 150,
        springConstant: 0.1,
      },
      maxVelocity: 2,
      solver: 'forceAtlas2Based',
      timestep: 1,
      stabilization: { iterations: 1 },
    },
    height: '800'
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
    zoom: function (event) {
      var zoomEvent = event;

      // if (zoomEvent.scale <= 0.6) {
      //   visnetwork.moveTo({
      //     scale: 0.6
      //   })
      // }
    },
    stabilized: function (event) {
      // visnetwork.setOptions({
      //   physics: { enabled: false }
      // });

      if (dsnodes.length !== 0) {
        setPhysicsEnabled(false);
      }
    }
    //,
    // initRedraw: function(){
    //   visnetwork.setOptions({
    //     physics: {enabled:true}
    //   });
    // }
  };

  function getNetwork(network) {
    setVisnetwork(network);
    network.moveTo({
      scale: 0.9
    })

  }

  function getNetworkOutside() {
    return visnetwork;
  }

  function fetchGraphs(view, param) {
    var url = '';

    if (view === 'all')
      url = `${APIPath}?player=${param.player}`;

    callAPI(url).then(function (data) {
      setdsNodes(data.nodes);
      setdsEdges(data.edges);


      toggleNetworkLoadIndicator(false);
    });
  }

  useEffect(() => {
    //load first player data by default
    fetchGraphs(view, { player: '3e0f2626-153a-4a52-be34-fd3e1c04de0a' });

    PubSub.subscribe("newgameactivated", function (topic, data) {
      setMessage('');
      setdsNodes([])
      setdsEdges([])
      setPhysicsEnabled(true);
    });

    PubSub.subscribe("checkforfraudrings", function (topic, data) {

      setPhysicsEnabled(true);

      handleLoadFraudRingsClick();
    });


    PubSub.subscribe("playersaddedinlobby", function (topic, data) {
      // visnetwork.setOptions({
      //   physics: {enabled:false}
      // });

      toggleNetworkLoadIndicator(true);
      setMessage('');
      setPhysicsEnabled(true);


      let playersinGame = data.playersinGame;
      let url = `${APIPath}/connection/?player1=${playersinGame.player1.id}&player2=${playersinGame.player2.id}`;



      callAPI(url).then(function (data1) {
        PubSub.publish('matchmakingcomplete', data1);

        setdsNodes(data1.nodes);
        setdsEdges(data1.edges);


        if (data1.matchmakingfailed) {
          setMessage(`Matchmaking for players failed. Player ${data.playersinGame.player2.title} will not be allowed to join the table.`)
          setVarient('danger')
        }
        else {
          setMessage(`Matching making is successful. Players ${data.playersinGame.player1.title} and ${data.playersinGame.player2.title} will be allowed to join the table `)
          setVarient('success');

          var nodes = null;
          var edges = null;

          [data.playersinGame.player1, data.playersinGame.player2].forEach(player => {
            callAPI(`${APIPath}?player=${player.id}`).then(function (playerresponse) {
              if (nodes === null) {
                nodes = playerresponse.nodes;
              }
              else {
                playerresponse.nodes.forEach(item => {
                  var found = nodes.find(element => element.id === item.id);
                  if (found === undefined || found === null) {
                    nodes.push(item);
                  }
                });

                setdsNodes(nodes)
              }

              if (edges === null) {
                edges = playerresponse.edges;
              }
              else {

                playerresponse.edges.forEach(item => {
                  var found = edges.find(element => element.id === item.id);
                  if (found === undefined || found === null) {
                    edges.push(item);
                  }
                })

                setdsEdges(edges)
              }
            });
          })
        }

        toggleNetworkLoadIndicator(false);
      });
    });

  }, []);

  return (

    <>
      <Row>
        <Col md="10">
          <b>Network View</b><span> This view shows connected representation of a player's game data</span>
        </Col>
        {/* <Col md="2" >
          <Button className='float-right' variant="primary" size="sm" onClick={handleLoadFraudRingsClick}>Show Fraud Rings</Button>
        </Col> */}
      </Row >
      <Row>
        <Col>
          <Spinner animation="border" id="networkloadspinner" size="sm" />
          {
            message !== '' &&
            <Alert variant={varient} onClose={() => handleMessageClose()} dismissible>
              {message}
            </Alert>
          }
        </Col>
      </Row>

      <Row>
        <Col>
          <Graph
            identifier="network"
            graph={graph}
            options={options}
            events={events}
            // style={style}
            getNetwork={getNetwork}
          // getEdges={this.getEdges}
          // getNodes={this.getNodes}
          // vis={vis => (this.vis = vis)}
          />
        </Col>
      </Row>
    </>
  );


  function loadFraudRings() {
    toggleNetworkLoadIndicator(true);
    setMessage('');

    let url = `${APIPath}fraudrings`;

    callAPI(url).then(function (responseData) {

      // visnetwork.setOptions({
      //   physics: {enabled:true}
      // });
      setdsNodes(responseData.nodes)
      setdsEdges(responseData.edges)

      toggleNetworkLoadIndicator(false);
      setMessage('Below network view shows fraud ring player is part of');
      setVarient('success');

      visnetwork.moveTo({
        scale: 0.7
      });
    });
  }

  function toggleNetworkLoadIndicator(display) {
    if (display) {
      document.getElementById("networkloadspinner").style.display = "block";
    }
    else {
      document.getElementById("networkloadspinner").style.display = "none";
    }
  }

  function handleLoadFraudRingsClick() {
    setdsNodes([]);
    setdsEdges([]);
    loadFraudRings();
  }

  function callAPI(url) {
    const promise = new Promise((resolve, reject) => {
      axios.get(url)
        .then(res => {
          //console.log(res);
          //console.log(res.data);
          //'{'customer':'customer_name','opportunity':'opportunity_name','product':'sfdc_product_name','taskcategory':'task_bd_type','owner':'sfdc_owner_alias'}'
          processAPIResponse(res, resolve);
        });
    });

    return promise;
  }

  function processAPIResponse(res, resolve) {
    let nodestemp = res.data.nodes;
    nodestemp.forEach((node, index) => {
      //  nodestemp[index].title = " My Desc";
      switch (node.label) {
        case 'ipaddress':
          //nodestemp[index].title = node.customer_name;
          nodestemp[index].group = 'ipaddress';
          nodestemp[index].label = `ip: ${nodestemp[index].ip_address}`;
          break;
        case 'device':
          // nodestemp[index].title = "Plain text with no chance of <script>alert('XSS')</scr" + "ipt>!";
          nodestemp[index].group = 'device';
          nodestemp[index].label = `device: ${nodestemp[index].id.substring(1, 10).padEnd(13, ".")}`;
          nodestemp[index].title = nodestemp[index].id;

          break;
        case 'email':
          //nodestemp[index].title = node.sfdc_product_name;
          nodestemp[index].group = 'email';
          nodestemp[index].label = `email: ${nodestemp[index].email}`;
          //nodestemp[index].title = " My Desc";
          break;
        case 'player':
          //nodestemp[index].title = node.task_bd_type;
          nodestemp[index].group = 'player';
          nodestemp[index].label = `player: ${nodestemp[index].first_name},${nodestemp[index].last_name}`;
          break;
        case 'gameplay':
          //nodestemp[index].title = node.sfdc_owner_alias;
          nodestemp[index].group = 'gameplay';
          nodestemp[index].label = `game play: ${nodestemp[index].id.substring(1, 10).padEnd(13, ".")}`;
          break;
      }


    });

    if (nodestemp.length > 0) {
      resolve({
        matchmakingfailed: true,
        nodes: nodestemp,
        edges: res.data.edges
      });
    } else {
      resolve({
        matchmakingfailed: false,
        nodes: nodestemp,
        edges: res.data.edges
      });
    }
  }
}

export default Network;