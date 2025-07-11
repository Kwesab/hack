import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  CreditCard,
  X,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "request_update" | "payment" | "verification" | "system";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        type: "request_update",
        title: "Document Request Updated",
        message: "Your transcript request is now ready for collection",
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        isRead: false,
      },
      {
        id: "2",
        type: "payment",
        title: "Payment Confirmed",
        message: "Payment of GHS 50 for certificate request confirmed",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isRead: false,
      },
      {
        id: "3",
        type: "verification",
        title: "Ghana Card Verified",
        message: "Your Ghana Card has been successfully verified",
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        isRead: true,
      },
      {
        id: "4",
        type: "system",
        title: "System Maintenance",
        message: "Scheduled maintenance completed. All services restored",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isRead: true,
      },
    ];

    setNotifications(sampleNotifications);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: "request_update" as const,
          titles: [
            "Request Status Changed",
            "Document Ready",
            "Processing Started",
          ],
          messages: [
            "Your document request status has been updated",
            "Your requested document is ready for download",
            "We've started processing your request",
          ],
        },
        {
          type: "payment" as const,
          titles: ["Payment Received", "Payment Confirmed"],
          messages: [
            "Your payment has been successfully processed",
            "Payment confirmation received for your request",
          ],
        },
      ];

      // 20% chance to add a new notification every 30 seconds
      if (Math.random() < 0.2) {
        const category =
          randomNotifications[
            Math.floor(Math.random() * randomNotifications.length)
          ];
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: category.type,
          title:
            category.titles[Math.floor(Math.random() * category.titles.length)],
          message:
            category.messages[
              Math.floor(Math.random() * category.messages.length)
            ],
          timestamp: new Date(),
          isRead: false,
        };

        setNotifications((prev) => [newNotification, ...prev.slice(0, 19)]); // Keep only 20 notifications

        // Show toast for new notifications
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [toast]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "request_update":
        return FileText;
      case "payment":
        return CreditCard;
      case "verification":
        return Shield;
      case "system":
        return Bell;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "request_update":
        return "text-blue-600";
      case "payment":
        return "text-green-600";
      case "verification":
        return "text-purple-600";
      case "system":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <MarkAsRead className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <CardDescription>
                You have {unreadCount} unread notification
                {unreadCount > 1 ? "s" : ""}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const iconColor = getNotificationColor(notification.type);

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b hover:bg-muted/50 transition-colors ${
                          !notification.isRead ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${iconColor}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <h4
                                className={`text-sm font-medium ${
                                  !notification.isRead
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1">
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeNotification(notification.id)
                                  }
                                  className="h-6 w-6 p-0 hover:bg-destructive/10"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>

                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs h-6 px-2"
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
