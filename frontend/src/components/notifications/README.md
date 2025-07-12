# Real-time Notification System

This directory contains components and utilities for the real-time notification system in StackIt.

## Components

### NotificationProvider

A provider component that initializes socket connections and handles real-time notifications. It should be placed near the root of your application to ensure notifications work throughout the app.

### NotificationList

Displays a list of notifications with proper styling and handling for read/unread status.

### NotificationItem

Individual notification item component with appropriate styling and icons based on notification type.

### NotificationBadge

A badge component that displays the count of unread notifications.

## Notification Types

The system supports several types of notifications:

- `answer`: When someone answers your question
- `accepted_answer`: When your answer is accepted as the solution
- `mention_question`: When someone mentions you in a question
- `mention_answer`: When someone mentions you in an answer

## Testing

A test page is available at `/test/notifications` to test the notification system. You must be logged in to use this page.

## Socket Events

The notification system listens for the following socket events:

- `notification`: Received when a new notification is created
- `test_notification`: Used for testing the notification system

## Browser Notifications

The system also supports browser notifications. Users will be prompted to allow notifications when they log in.
