import { connect } from 'react-redux'
import { fetchChannels, channelsSelectors } from '../../../reducers/channels'
import { fetchDescribeNetwork, queryRoutes, setCurrentRoute, networkSelectors } from '../../../reducers/network'
import Network from '../components/Network'

const mapDispatchToProps = {
  fetchChannels,
  queryRoutes,
  setCurrentRoute,
  fetchDescribeNetwork
}

const mapStateToProps = state => ({
  network: state.network,
  info: state.info,

  channelIds: channelsSelectors.channelIds(state),
  currentRouteHopChanIds: networkSelectors.currentRouteHopChanIds(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Network)
