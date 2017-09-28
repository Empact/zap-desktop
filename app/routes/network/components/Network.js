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

  componentDidUpdate() {
    const { currentRouteHopChanIds } = this.props

    const paths = currentRouteHopChanIds.map(chanId => {
      console.log('chanId: ', chanId)
      const line = this[`${chanId}`]
      console.log('line: ', line)
      console.log('props: ', line.props)
      console.log('x1: ', line.props.x1)
      console.log('x1: ', line.props['x1'])
      // return (
      //   <path d={`M${line.props['x1']} ${line.props['y1']} L${line.props['x2']} ${line.props['y2']}`} />
      // )      
    })

    console.log('paths: ', paths)
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
    
    const paths = []
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
            <path d="M534.7054286266647, 460.3260926684966" fill="red" stroke="blue" />
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
                    ref={line => this[edge.channel_id] = line}
                  />
                )
              })
            }
          </InteractiveForceGraph>
        </section>
        <section className={styles.data}>
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
