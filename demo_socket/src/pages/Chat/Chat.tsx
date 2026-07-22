import type { ChatMessage } from '@/constants/chat-type';
import axios from 'axios';
import classNames from 'classnames/bind';
import React from 'react';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const AVATAR_COLORS = [
  ['#f472b6', '#a78bfa'],
  ['#38bdf8', '#4f8ef7'],
  ['#4ade80', '#22d3ee'],
  ['#fbbf24', '#fb7185'],
  ['#a78bfa', '#7c6cf3'],
  ['#f97316', '#f43f5e'],
];

const avatarGradient = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [from, to] = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
};

const Chat: React.FC = (): JSX.Element => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [sender, setSender] = React.useState('');
  const [draftName, setDraftName] = React.useState('');
  const [content, setContent] = React.useState('');
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    axios
      .get<ChatMessage[]>(`${API_BASE_URL}/chat/history`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error('Error fetching history:', error));
  }, []);

  React.useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/chat/stream`);

    eventSource.addEventListener('message', (event) => {
      const message: ChatMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    });

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (draftName.trim()) {
      setSender(draftName.trim());
    }
  };

  const handleSend = () => {
    if (!sender.trim() || !content.trim()) {
      return;
    }

    axios
      .post(`${API_BASE_URL}/chat/send`, { sender, content })
      .catch((error) => console.error('Error sending message:', error));

    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!sender) {
    return (
      <div className={cx('wrapper')}>
        <div className={cx('joinCard')}>
          <div className={cx('joinIcon')}>💬</div>
          <h1 className={cx('joinTitle')}>Realtime Chat</h1>
          <p className={cx('joinSub')}>Nhập tên để bắt đầu trò chuyện</p>
          <input
            className={cx('joinInput')}
            placeholder="Tên của bạn"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            autoFocus
          />
          <button className={cx('joinBtn')} onClick={handleJoin}>
            Tham gia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('chat-box')}>
        <div className={cx('header')}>
          <div className={cx('headerIcon')}>💬</div>
          <div className={cx('headerMain')}>
            <div className={cx('headerTitle')}>Realtime Chat</div>
            <div className={cx('headerSub')}>
              <span className={cx('dot')} />
              Powered by SSE
            </div>
          </div>
          <div className={cx('me')}>
            <div
              className={cx('meAvatar')}
              style={{ background: avatarGradient(sender) }}
            >
              {sender.charAt(0).toUpperCase()}
            </div>
            <span className={cx('meName')}>{sender}</span>
          </div>
        </div>

        <div className={cx('messages')}>
          {messages.length === 0 ? (
            <div className={cx('empty')}>
              <span className={cx('emptyIcon')}>🗨️</span>
              <p>Chưa có tin nhắn. Bắt đầu trò chuyện!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const own = msg.sender === sender;
              return (
                <div key={index} className={cx('row', { own })}>
                  <div
                    className={cx('avatar')}
                    style={{ background: avatarGradient(msg.sender) }}
                  >
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>
                  <div className={cx('message', { own })}>
                    <div className={cx('meta')}>
                      <span className={cx('sender')}>{msg.sender}</span>
                      <span className={cx('time')}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className={cx('content')}>{msg.content}</div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className={cx('composer')}>
          <input
            className={cx('text-input')}
            placeholder="Nhập tin nhắn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={cx('send-btn')} onClick={handleSend}>
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
