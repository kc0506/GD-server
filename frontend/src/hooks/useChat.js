import { useEffect, useState } from "react"


export default () => {
    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState({});

    useEffect(() => {
        // Connect ws
        setClient(new WebSocket('ws://localhost:4000'));
        return () => { if (client) client.close() };
    }, []);

    const clientInit = () => {
        client.onmessage = (byteString) => {
            const { data } = byteString;
            const [task, payload] = JSON.parse(data);
            switch (task) {
                case 'output': {
                    setMessages(msgs => [...msgs, ...payload]);
                    break;
                }
                case 'status': {
                    setStatus(() => payload);
                    break;
                }
                case 'init': {
                    setMessages(() => payload);
                    break;
                }
                case 'cleared': {
                    setMessages(() => []);
                    break;
                }
                default:
            }
        };
    }
    useEffect(() => {
        if (client) {
            clientInit();
        }
    }, [client]);

    const sendData = async (data) => {
        await client.send(JSON.stringify(data));
    }

    const sendMessage = (payload) => {
        sendData(["input", payload]);
    };

    const clearMessage = () => {
        sendData(["clear"]);
    };

    return {
        messages,
        status,
        sendMessage,
        clearMessage
    };
};