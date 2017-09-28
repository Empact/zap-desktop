import { connect } from 'react-redux'
import { fetchPeers } from '../../../reducers/peers'
import { fetchChannels, channelsSelectors } from '../../../reducers/channels'
import { fetchDescribeNetwork, queryRoutes, setCurrentRoute, networkSelectors } from '../../../reducers/network'
import Network from '../components/Network'

const mapDispatchToProps = {
  fetchPeers,
  fetchChannels,
  queryRoutes,
  setCurrentRoute,
  fetchDescribeNetwork
}

const mapStateToProps = state => ({
  peers: state.peers,
  network: state.network,
  info: state.info,

  channelIds: channelsSelectors.channelIds(state),
  currentRouteHopChanIds: networkSelectors.currentRouteHopChanIds(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Network)
