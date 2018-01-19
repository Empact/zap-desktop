import log from 'electron-log'

export default function subscribeToInvoices(mainWindow, lnd, meta) {
  const call = lnd.subscribeInvoices({}, meta)

  call.on('data', invoice => mainWindow.send('invoiceUpdate', { invoice }))
  call.on('end', () => log.info('end'))
  call.on('error', error => log.error('error: ', error))
  call.on('status', status => log.info('status: ', status))
}
