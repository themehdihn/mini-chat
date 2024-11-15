# Mini Chat App

A simple chat application built using **Socket.IO**, **Node.js**, **React.js**, and **MySQL** to enable real-time messaging. It is designed for learning and practicing Full Stack development.

---

## Features

- **Username Login**: Users must enter a username to join the chat.
- **Real-Time Messaging**: Messages are instantly shared between all connected users.
- **Message History**: Newly connected users can view previous messages.
- **Username Validation**: Only alphanumeric usernames with underscores are allowed (no non-English characters).
- **Scroll to Latest Message**: A button allows users to quickly scroll to the latest chat message.
- **Active User Display**: The current user's username is displayed at the top of the chat.

---

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js and Express.js
- **Database**: MySQL
- **Real-Time Communication**: Socket.IO
- **Styling**: CSS

---

## Prerequisites

- **Node.js** (version 16 or higher)
- **MySQL**
- **NPM** or **Yarn**

---

## Setup Instructions

### 1. Database Configuration

1. Install MySQL and create a database for the app:
   ```sql
   CREATE DATABASE your_database_name;
