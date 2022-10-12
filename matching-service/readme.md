# Matching Service

## Development

1. Clone the repository to local machine.
2. Install npm packages using `npm i`.
3. Run Matching Service using `npm run dev`.

## Frontend Request Guide

### Request Events

-   #### Find a match:

Event: <pre><code>findMatch</code></pre>

Body:

<pre><code>
{
    "username": "client's username",
    "difficultyLevel": "desired difficulty level"
}
</code></pre>

-   #### Notify successful match:

Event: <pre><code>matchSuccess</code></pre>

Body:

<pre><code>
{
    "partnerUsername": "username of the partner matched with",
    "roomId": "ID for room consisting the matched users"
}
</code></pre>

-   #### Notify failed match:

Event: <pre><code>matchFail</code></pre>

Body:

<pre><code>
{
    "error": "Reasoning behind the match failure"
}
</code></pre>
