
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  MessageSquare, 
  ExternalLink,
  Check,
  Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
};

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Load messages from localStorage
    const storedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    setMessages(storedMessages.sort((a: ContactMessage, b: ContactMessage) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }, []);

  const markAsRead = (id: number) => {
    const updatedMessages = messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
  };

  const openInWhatsApp = (message: ContactMessage) => {
    const whatsappMessage = `
*Regarding:* ${message.subject}
*From:* ${message.name}
*Message:* ${message.message}
*Contact:* ${message.email} / ${message.phone}
`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/254740133382?text=${encodedMessage}`, '_blank');
  };

  const viewMessageDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <CardTitle>Contact Messages</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No messages yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id} className={!message.read ? "bg-blue-50" : ""}>
                  <TableCell>{formatDate(message.timestamp)}</TableCell>
                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell>
                    {message.read ? (
                      <Badge variant="outline" className="bg-gray-100">Read</Badge>
                    ) : (
                      <Badge>New</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => viewMessageDetails(message)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openInWhatsApp(message)}
                        title="Reply on WhatsApp"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {!message.read && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => markAsRead(message.id)}
                          title="Mark as Read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedMessage && (
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  From {selectedMessage.name} • {formatDate(selectedMessage.timestamp)}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">Email:</span>
                  <span className="col-span-3">{selectedMessage.email}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">Phone:</span>
                  <span className="col-span-3">{selectedMessage.phone}</span>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="text-right text-sm font-medium">Message:</span>
                  <div className="col-span-3 whitespace-pre-wrap">{selectedMessage.message}</div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={() => openInWhatsApp(selectedMessage)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Reply on WhatsApp
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ContactMessages;
