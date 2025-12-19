import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const joinEvent = (eventId) => {
  if (socket) {
    socket.emit('join_event', eventId);
  }
};

export const leaveEvent = (eventId) => {
  if (socket) {
    socket.emit('leave_event', eventId);
  }
};

export const onScoreUpdate = (callback) => {
  if (socket) {
    socket.on('score_update', callback);
  }
};

export const onEventHistoryUpdate = (callback) => {
  if (socket) {
    socket.on('event_history_update', callback);
  }
};

export const onEventStatusUpdate = (callback) => {
  if (socket) {
    socket.on('event_status_update', callback);
  }
};

export const onFollowersUpdate = (callback) => {
  if (socket) {
    socket.on('followers_update', callback);
  }
};

export const onNewEvent = (callback) => {
  if (socket) {
    socket.on('new_event', callback);
  }
};

export const removeScoreUpdateListener = () => {
  if (socket) {
    socket.off('score_update');
  }
};

export const removeEventHistoryListener = () => {
  if (socket) {
    socket.off('event_history_update');
  }
};

export const removeEventStatusListener = () => {
  if (socket) {
    socket.off('event_status_update');
  }
};

export const removeFollowersListener = () => {
  if (socket) {
    socket.off('followers_update');
  }
};

export const removeNewEventListener = () => {
  if (socket) {
    socket.off('new_event');
  }
};
