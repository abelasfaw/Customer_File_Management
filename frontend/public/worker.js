self.addEventListener("push", (e) => {
  const data = e.data.json();
  self.clients.matchAll().then(function(clients) {
    console.log(clients)
    clients.forEach(function(client) {
      client.postMessage(data);
    });
  });

});

