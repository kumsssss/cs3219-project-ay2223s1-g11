# Chat Service

## Development
1. Clone the repository to local machine.
2. Install npm packages using `npm i`.
3. Run Chat Service using `npm run dev`.


## Frontend Request Guide

### Request Events

* #### Join a room:

Event: <pre><code>join</code></pre>

Body:
<pre><code>
{
    "user": "user's name",
    "room": "room name"
}
</code></pre>

* #### Send a message:

Event: <pre><code>message</code></pre>

Body:
<pre><code>
{
    "user": "user's name",
    "room": "room name",
    "message": "message"
}
</code></pre>

* #### Quit a chat session:

Event: <pre><code>quit</code></pre>

Body:
<pre><code>
{
    "user": "user's name",
    "room": "room name"
}
</code></pre>


