import './App.css'
import { Button, Input, message, Tag } from 'antd'
import useChat from './hooks/useChat';
import { useEffect, useRef, useState } from 'react';

function App() {

	const { messages, status, sendMessage, clearMessage } = useChat();
	const [username, setUsername] = useState('');
	const [body, setBody] = useState('');

	const bodyRef = useRef();

	const handleChange = (func) => (e) => {
		func(e.target.value);
	}

	const displayStatus = (status) => {
		if (!status.msg) return;
		const { type, msg } = status;
		const content = { content: msg, duration: 0.5 };
		switch (type) {
			case 'success':
				message.success(content);
				break;
			case 'info':
				message.info(content);
				break;
			case 'error':
			default:
				message.error(content);
		}
	}
	useEffect(() => { if (status) displayStatus(status) }, [status]);

	return (
		<div className="App">
			<div className="App-title">
				<h1>Simple Chat</h1>
				<Button type="primary" danger onClick={clearMessage} >
					Clear
				</Button>
			</div>
			<div className="App-messages">
				{messages.length
					? (messages.map(({ name, body }, i) => {
						return (
							<p className='App-message' key={i}>
								<Tag color='blue'>{name}</Tag> {body}
							</p>
						)
					})
					)
					: <p style={{ color: '#ccc' }}>No messages...</p>
				}
			</div>
			<Input
				placeholder="Username"
				style={{ marginBottom: 10 }}
				value={username}
				onChange={handleChange(setUsername)}
				onKeyDown={(e) => {
					if (e.key === 'Enter')
						bodyRef.current.focus();
				}}
			></Input>
			<Input.Search
				ref={bodyRef}

				enterButton="Send"
				placeholder="Type a message here..."
				value={body}
				onChange={handleChange(setBody)}

				onSearch={(msg) => {
					if (!msg || !username) {
						displayStatus({
							type: 'error',
							msg: 'Please enter a username and a message body.'
						});
						return;
					}

					sendMessage({ name: username, body: msg });
					setBody('');
				}}
			></Input.Search>
		</div>
	)
}

export default App
