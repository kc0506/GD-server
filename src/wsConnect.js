import Message from './models/message.js';

const sendData = (data, ws) => {
	ws.send(JSON.stringify(data));
}

const sendStatus = (payload, ws) => {
	sendData(['status', payload], ws);
}

const broadcastMessage = (wss, data, status) => {
	wss.clients.forEach((client) => {
		sendData(data, client);
		sendStatus(status, client);
	});
};


export default {
	initData: (ws) => {
		Message.find().sort({ created_at: -1 }).limit(100)
			.exec((err, res) => {
				if (err) throw err;
				// initialize app with existing messages
				sendData(["init", res], ws);
			});
	},
	onMessage: (wss, ws) => (
		async (byteString) => {

			const [task, payload] = JSON.parse(byteString);

			switch (task) {
				case 'input': {
					const { name, body } = payload;
					const message = new Message({ name, body });
					try {
						await message.save();
					} catch (e) {
						throw new Error("Message DB save error: " + e);
					}

					// sendData(['output', [payload]], ws);
					// sendStatus({ type: 'success', msg: 'Message sent.' }, ws);

					const data = ['output', [payload]];
					const status = { type: 'success', msg: 'Message sent.' };
					broadcastMessage(wss, data, status);
					break;
				}
				case 'clear': {
					try {
						await Message.deleteMany({}, () => {
							// sendData(['cleared'], ws);
							// sendStatus({ type: 'info', msg: 'Message cache cleared.' }, ws);
							const data = ['cleared'];
							const status = { type: 'info', msg: 'Message cache cleared.' };
							broadcastMessage(wss, data, status);
						});
					} catch (e) {

					}
					break;
				}
				default:
			}
		}
	)

}