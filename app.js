const { App } = require('@slack/bolt')

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

// Listens to incoming messages that contain "hello"
app.message(/hello/i, async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered

  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey there <@${message.user}>!`
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Crash Slack (but only on Android)'
          },
          action_id: 'button_click'
        }
      }
    ],
    text: `Hey there <@${message.user}>!`
  })
})

app.action('button_click', async ({ body, ack, say, client }) => {
  // Acknowledge the action
  await ack()
  await say('Showing dialog…')

  try {
    // Call views.open with the built-in client
    client.dialog.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      dialog: {
        callback_id: 'message-14158517185-436508805030',
        title: 'Choose a game to play',
        submit_label: 'Send',
        elements: [
          {
            label: 'Game',
            type: 'select',
            name: 'game',
            option_groups: [
              {
                label: 'Last Played Game',
                options: [
                  { label: 'Global Thermonuclear War', value: 'war' }
                ]
              },
              {
                label: 'All Games',
                options: [
                  { label: 'Hearts', value: 'hearts' },
                  { label: 'Bridge', value: 'bridge' },
                  { label: 'Checkers', value: 'checkers' },
                  { label: 'Chess', value: 'chess' },
                  { label: 'Poker', value: 'poker' },
                  { label: "Falken's Maze", value: 'maze' },
                  { label: 'Global Thermonuclear War', value: 'war' }
                ]
              }
            ],
            // value: 'war' // <<- uncomment the line, and the dialog will crash the Android Slack app
          }
        ]
      }
    })
  } catch (error) {
    console.error(error)
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
})()
