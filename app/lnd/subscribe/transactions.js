import log from 'electron-log'

export default function subscribeToTransactions(mainWindow, lnd, meta) {
  const call = lnd.subscribeTransactions({}, meta)
  call.on('data', (transaction) => {
    log.info('TRANSACTION: ', transaction)
    mainWindow.send('newTransaction', { transaction })
  })
  call.on('end', () => log.debug('end'))
  call.on('error', error => log.error('error: ', error))
  call.on('status', status => log.info('TRANSACTION STATUS: ', status))
}
