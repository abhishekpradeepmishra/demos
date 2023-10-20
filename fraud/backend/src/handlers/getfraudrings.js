'use strict';

const gremlin = require('gremlin');
const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const NEPTUNE_ENDPOINT = process.env.NEPTUNE_ENDPOINT;
const NEPTUNE_PORT = process.env.NEPTUNE_PORT;
const { t: { id, label },P } = gremlin.process;
const { cardinality: { single } } = gremlin.process;
const __ = gremlin.process.statics;

exports.handler = async (event) => {
  console.info('received:', event);
  // let player1 = event.queryStringParameters.player1;
  // let player2 = event.queryStringParameters.player2;

  //if (player1 != undefined && player2 != undefined) {
    let g = traversal().withRemote(new DriverRemoteConnection(`wss://${NEPTUNE_ENDPOINT}:${NEPTUNE_PORT}/gremlin`, {
      connectOnStartup: true
    }));
    
    // const result = await g.V().hasLabel('player').has('first_name', 'Whit').repeat(__.outE().inV()).emit().times(3).path().by(__.valueMap(true)).by(__.elementMap()).toList();

    const result = await g.V()
      .hasLabel('device')
      .filter(__.inE().count().is(P.gt(1))).limit(1)
      .repeat(__.inE().outV()).times(2)
      .outE().inV()
      .simplePath()
      .path()
      .by(__.valueMap(true))
      .by(__.elementMap())
      .toList()

    let maps = [];
    let flattenedMap = {
      nodes: [],
      edges: []
    };

    result.forEach(item => {

      item.objects.forEach(mapitem => {
        maps.push(mapitem)
      })
    })

    maps.forEach(mapitem => {
      let flattenedMapItem = {};

      mapitem.forEach((value, key, map) => {
        if (key.toString() === "label") {
          if (value.startsWith("ipaddress") || value.startsWith("device") ||
            value.startsWith("email") || value.startsWith("player") ||
            value.startsWith("gameplay")) {

            flattenedMapItem["is_vertex"] = true;
          }
          else {
            flattenedMapItem["is_edge"] = true;
          }
        }

        if (key.toString() === "IN" || key.toString() === "OUT") {
          value.forEach((value1, key1, map1) => {
            if (key1.elementName === "id") {
              if (key.toString() === "IN") {
                flattenedMapItem["to"] = value1;
              }
              else {
                flattenedMapItem["from"] = value1;
              }
            }
          });
        }
        else {
          if ((typeof value) === "string") {
            flattenedMapItem[key] = value;
          }
          else {
            flattenedMapItem[key] = value[0];
          }
        }

        console.log(flattenedMapItem);
      })

      if (flattenedMapItem["is_vertex"]) {

        let node = flattenedMap.nodes.find(noderef => noderef.id === flattenedMapItem.id)
        if (node === null || node === undefined) {
          // flattenedMapItem.nodelabel = flattenedMapItem.label;
          // flattenedMapItem.label = flattenedMapItem.id;

          flattenedMap.nodes.push(flattenedMapItem);
        }
      }
      else {
        let edge = flattenedMap.edges.find(edgeref => edgeref.id === flattenedMapItem.id)
        if (edge === null || edge === undefined) {
          // flattenedMapItem.nodelabel = flattenedMapItem.label;
          // flattenedMapItem.label = flattenedMapItem.id;
          flattenedMap.edges.push(flattenedMapItem);
        }

      }
    })

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify(flattenedMap)
    };


    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
  // }
  // else {

  //   const response = {
  //     statusCode: 200,
  //     headers: {
  //       "Access-Control-Allow-Headers": "Content-Type",
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  //     },
  //     body: JSON.stringify({ "message": "missing customer id" })
  //   };

  //   // All log statements are written to CloudWatch
  //   console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  //   return response;

  // }
}
