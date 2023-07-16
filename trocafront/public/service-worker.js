function receivePushNotification(event) {    
    const { url, title, text } = event.data.json();
    const options = {
        data: url,
        body: text,
        icon: '/logo.png',
        badge: '/favicon.ico',        
    };
    event.waitUntil(self.registration.showNotification(title, options));
}

function openPushNotification(event) {       
    event.notification.close();
    const targetURL = new URL(event.notification.data)

    event.waitUntil(
        (async () => {

            const allClients = await clients.matchAll({
                includeUncontrolled: true,
            });

            let clientFounded = false
            
            for (const client of allClients) {
                const url = new URL(client.url);
                
                if(url.host === targetURL.host) {
                    client.navigate(event.notification.data)
                    client.focus()
                    clientFounded = true
                    break
                }                
            }
            
            if (!clientFounded) {
                event.waitUntil(clients.openWindow(event.notification.data));
            }
        })(),
    );    
}

self.addEventListener("push", receivePushNotification);  
self.addEventListener("notificationclick", openPushNotification);
