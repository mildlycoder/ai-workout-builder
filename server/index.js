const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()
const app = express();
const port = 3000;
app.use(cors({
  origin: '*', 
  methods: 'POST',
  allowedHeaders: ['Content-Type', 'x-auth-token'],
}))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
})


app.post('/generate-workout', async (req, res) => {
  try {
    const apiUrl = 'https://api.getknit.ai/v1/router/run';
    const authToken = process.env.AUTH_TOKEN;

    const requestBody = {
      messages: [
        {
          "role": "system",
          "content": "you're the best personal trainer generate an awesome workout based on number of available days, height, weight, age, gender, main goal(whether they want to lose weight, gain muscle, increase endurance etc.), and current fitness level"
        },
        {
          "role": "user",
          "content": "I want an awesome workout based on {{number_of_days}}, {{height}}, {{weight}}, {{age}},{{gender}},{{main goal}}(whether they want to lose weight, gain muscle, increase endurance etc.), {{body_type}} (example skinny, skinny fat, obese, lean, etc.), and {{fitness_level}}, also give comments on how is my current health by calculating my bmi and my fitness level, and also suggest what kind of diet is best suited for them"
        }
      ],
      model: { name: 'anthropic/claude-instant-1' },
      variables: req.body.variables,
    };
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'x-auth-token': authToken,
        'Content-Type': 'application/json',
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
