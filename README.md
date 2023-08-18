
# SocialEcho
https://socialecho.onrender.com/swagger/

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User](#user)
  - [Post](#post)
  - [Message](#message)
  - [My Network](#my-network)
  - [Notifications](#notifications)
  - [Authentication](#authentication)

## Introduction

A brief overview of your social media project and its purpose. Explain what makes your project unique and how it addresses the needs of users.

## Prerequisites

List any prerequisites or requirements that need to be installed or set up before using your project. This could include software, tools, or dependencies.

## Installation

A step-by-step guide on how to install and set up your social media project. Include any commands that need to be run to get your project up and running.

```bash
# Example installation steps
git clone https://github.com/MahmoudAliKhider/SocialEcho
cd your-project
npm install
```

## Usage

User Management
Description: Users can manage their profiles, including retrieving their own profile information and updating it.
# Get user profile
GET /api/user

Post Creation and Retrieval
Description: Users can create posts and retrieve posts from their feed.

# Create a new post
POST /api/post
Request Body:
{
  "content": "This is my new post!",
  "postImageUrl": form-data
}

# Retrieve posts
GET /api/post

Messaging
Description: Users can send and receive messages to/from other users

# Send a message
POST /api/message
Request Body:
{
  "recipient": "recipientUsername",
  "content": "Hello, how are you?"
}

# Retrieve messages
GET /api/message

Connection Management
Description: Users can manage their network connections (friends, followers, etc.).

# Send a connection request
## to make follow 
POST /api/myNetwork/userId

# Get user's connections
GET /api/myNetwork

# Notification Handling
Description: Users receive notifications for various activities, such as new messages, connection requests, etc.

## Use Socket.io

Authentication
Description: Users need to authenticate to access their account and perform actions.

# Register a new user
POST /api/account/register
Request Body:
{
  "userName":"",
    "email":"",
    "phone":"",
    "password":"",
    "address":"",
    "graduationYear":"",
    "dateOfBirth":""
}

# Login
POST /api/account/login
Request Body:
{
  "email": "mail",
  "password": "secretpassword"
}



```bash
# Example usage
npm start
```


## API Endpoints

### User

- **Endpoint:** `/api/user`
- **Description:** This endpoint allows users to manage their profiles.
- **Methods:** GET, PUT

### Post

- **Endpoint:** `/api/post`
- **Description:** This endpoint enables users to create and retrieve posts.
- **Methods:** POST, GET

### Message

- **Endpoint:** `/api/message`
- **Description:** This endpoint facilitates sending and receiving messages.
- **Methods:** POST, GET


### My Network

- **Endpoint:** `/api/myNetwork`
- **Description:** This endpoint allows users to manage their connections.
- **Methods:** POST, GET


### Notifications

- **Endpoint:** `/api/notifications`
- **Description:** This endpoint handles user notifications.
- **Methods:** GET

### Authentication

- **Endpoint:** `/api/account`
- **Description:** This endpoint handles user authentication.
- **Methods:** POST


