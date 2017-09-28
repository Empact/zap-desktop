import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force'
import LoadingBolt from '../../../components/LoadingBolt'
import styles from './Network.scss'

class Network extends Component {
  componentWillMount() {
    const { fetchPeers, fetchChannels, fetchDescribeNetwork } = this.props

    fetchPeers()
    fetchChannels()
    fetchDescribeNetwork()
  }

  render() {
    const {
      peers: { peers },
      info: { data: { identity_pubkey } }, 
      network: { nodes, edges, selectedNode, networkLoading },
      setCurrentRoute,
      queryRoutes,
      currentRouteHopChanIds,
      channelIds
    } = this.props

    if (!nodes.length || !edges.length) { return <span></span> }
    if (networkLoading) return <LoadingBolt />
    
    return (
      <div className={styles.container}>
        <section className={styles.network}>
          <InteractiveForceGraph
            simulationOptions={
              {
                height: 1000,
                width: 1000,
                strength: { 
                  charge: -750
                },
                animate: true 
              }
            }
            labelAttr='label'
            onSelectNode={node => queryRoutes(node.target.getAttribute('label'), 1)}
            opacityFactor={1}
            highlightDependencies
          >
            {
              nodes.map(node => {
                return (
                  <ForceGraphNode
                    r={15}
                    label={node.pub_key}
                    key={node.pub_key}
                    node={{ id: node.pub_key }}
                    fill={
                      identity_pubkey === node.pub_key || selectedNode.pubkey === node.pub_key ? '#00FF00' : 'black'
                    }
                  />
                )
              })
            }
            {
              edges.map(edge => {
                return (
                  <ForceGraphLink
                    className={selectedNode.pubkey.length && currentRouteHopChanIds.indexOf(edge.channel_id) > -1 ? styles.active : ''}
                    key={edge.channel_id}
                    link={{ source: edge.node1_pub, target: edge.node2_pub }}
                    stroke={currentRouteHopChanIds.indexOf(edge.channel_id) > -1 ? 'green' : 'silver'}
                    strokeWidth='5'
                  >
                  </ForceGraphLink>
                )
              })
            }
          </InteractiveForceGraph>
        </section>
        <section className={styles.data}>
          {
            networkLoading ?
              <h1>loading...</h1>
              :
              null
          }
          <header>
            {
              selectedNode.pubkey.length && !networkLoading ?
                <h1>
                  <span>
                    node public key:
                  </span>
                  <span>
                    {selectedNode.pubkey}
                  </span>
                </h1>
              :
                null
            }
          </header>

          <div className={styles.routes}>
            {
              selectedNode.routes.length && !networkLoading ?
                <ul className={styles.routes}>
                  {
                    selectedNode.routes.map((route, index) => {
                      return (
                        <li
                          key={index}
                          className={`${styles.route} ${selectedNode.currentRoute === route ? styles.active : ''}`}
                          onClick={() => setCurrentRoute(route)}
                        >
                          <h2>route #{index + 1}</h2>
                          <p>total amount: {route.total_amt} sats</p>
                          <p>total fees: {route.total_fees} sats</p>
                          <p>total timelock: {route.total_time_lock}</p>
                          <p>hops: {route.hops.length}</p>
                        </li>
                      )
                    })
                  }
                </ul>
              :
                null
            }
          </div>
        </section>
      </div>
    )
  }
}

Network.propTypes = {}


export default Network
