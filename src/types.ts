export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  color: string;
  online?: boolean;
};

export type Message = {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  body: string;
  createdAt: string;
};
