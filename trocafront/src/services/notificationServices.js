import { BACK_URLS } from '../config'

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const sendSubscription = (subscription) => {
  return fetch(`${BACK_URLS[process.env.NODE_ENV]}/notifications/subscribe`, {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const subscribeUser = () => {
    const convertedVapidKey = urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(registration) {
            if (!registration.pushManager) {
            console.info('Push manager unavailable.')
            return
            }

            registration.pushManager.getSubscription().then(function(existedSubscription) {
            if (existedSubscription === null) {
                console.info('No subscription detected, make a request.')
                registration.pushManager.subscribe({
                applicationServerKey: convertedVapidKey,
                userVisibleOnly: true,
                }).then(function(newSubscription) {
                console.info('New subscription added.')
                sendSubscription(newSubscription)
                }).catch(function(e) {
                if (Notification.permission !== 'granted') {
                    console.info('Permission was not granted.')
                } else {
                    console.error('An error ocurred during the subscription process.', e)
                }
                })
            } else {
                console.info('Existed subscription detected.')
                sendSubscription(existedSubscription)
            }
            })
        })
        .catch(function(e) {
        console.error('An error ocurred during Service Worker registration.', e)
        })
    }
}
