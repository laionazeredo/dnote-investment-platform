## About
Simulates a simple web api tha allows users makes withdrawals and deposits in a investmet platform and calculates the interest accrued on the end of the month.

## Getting Started

### Local environmemt

To run this project in your local environment, you need to follow this:

- Install [Deno](https://deno.land/manual@v1.32.5/getting_started/installation).
  Preferably the version 1.32.5.
- Then you go to the root project folder and opens a terminal window
- Then run `deno task dev`. It will start the project in development mode. The
  API will be available on `http://localhost:3000`.
- Any changes you make to the code will be reflected in the application
  immediately.
- You can check other tasks [here](deno.json)

### Docker

- [Install docker](https://docs.docker.com/engine/install/)
- Go to the root project folder
- Open a terminal
- Run `docker build -t dnote-web-api .` It will build an image of the project.
- So, you just need to run `docker run -p 3000:3000 dnote-web-api` to run the
  project. The API will be available on `http://localhost:3000`
- You can check the docker file [here](Dockerfile)

### Deno Deploy

If you wanna to use the application in production environment, you go to
[here](https://dnote-web-api.deno.dev/)

## Challenge test cases

Here we can explore how to run all the test cases defined in the challenge.

### Test case 1

#### Scenario

**Investor creates their first investment for $10.000 on January 1st. Expected
result: Accrues $16.99 of interest on January, 31st. (31 days * 2% / 365 days in
a year * $10.000 balance)**

---

To test this scenario, you need to follow this steps:

- Run the project
- Go to you preferred API client
- First, create a new user. You can do this by sending a POST request to
  `http://localhost:3000/users` with a body like this:

```
{
  "name": {the name of the user},
  "password": {the password of the user},
  "email":  {the email of the user}
}
```

- You need to register, after the response, the `id` and `account_id` of the
  created user. You will need it soon.
- Then you need to got to `localhost:3000/transactions/investment` and run a
  POST request with a the following body:

```
{
  "amountInDollar": 10000, 
  "transactionDate": "2023-01-01T00:00:00.000Z",
  "account": {account id of the user},
}
```

- Now, you need to simulate the end of the month. To do this, you need to go to
  `localhost:3000/operatioons/close-month` and run a POST request with a the
  following body:

```
{
  "month": 1, 
  "year": 2023,
  "users": [{user id of the user}]
}
```

- This will simulate the end of the month and will calculate the interest
  accrued for your user. You can run the same reques withou the `users` property
  to simulate the end of the month for all users.
- Finnaly, you can check the interest accrued for your user by running a GET
  request to `localhost:3000/transactions/interests` with a the following URL
  parameters:

```
userid={user id of the user}
month=1
year=2023
```

- On the response, you will see the property `totalInterestEarned` with the
  value of the interest accrued for your user on the month (**$ 16.99**).
- Below you can see the list of `transactions` executed by the user during the
  month.

### Test case 2

#### Scenario

**Investor creates their first investment for $10.000 on January 1st. On January
5, they add $5.000. Expected result: Accrues $24.38 of interest on
January,31st.**

---

To test this scenario, you need to follow this steps:

- Run the project
- Go to you preferred API client
- First, create a new user. You can do this by sending a POST request to
  `http://localhost:3000/users` with a body like this:

```
{
  "name": {the name of the user},
  "password": {the password of the user},
  "email":  {the email of the user}
}
```

- You need to register, after the response, the `id` and `account_id` of the
  created user. You will need it soon.
- Then you need to got to `localhost:3000/transactions/investment` and run a
  POST request with a the following body:

```
{
  "amountInDollar": 10000, 
  "transactionDate": "2023-01-01T00:00:00.000Z",
  "account": {account id of the user},
}
```

- Then you need to got to `localhost:3000/transactions/investment` again and run
  a POST request with a the following body to make a new deposit:

```
{
  "amountInDollar": 5000, 
  "transactionDate": "2023-01-05T00:00:00.000Z",
  "account": {account id of the user},
}
```

- Now, you need to simulate the end of the month. To do this, you need to go to
  `localhost:3000/operatioons/close-month` and run a POST request with a the
  following body:

```
{
  "month": 1, 
  "year": 2023,
  "users": [{user id of the user}]
}
```

- This will simulate the end of the month and will calculate the interest
  accrued for your user. You can run the same reques withou the `users` property
  to simulate the end of the month for all users.
- Finnaly, you can check the interest accrued for your user by running a GET
  request to `localhost:3000/transactions/interests` with a the following URL
  parameters:

```
userid={user id of the user}
month=1
year=2023
```

- On the response, you will see the property `totalInterestEarned` with the
  value of the interest accrued for your user on the month (**$ 24.38**).
- Below you can see the list of `transactions` executed by the user during the
  month.

### Test case 3

#### Scenario

**Investor creates their first investment for $10.000 on January 1st. On January
5, they withdraw $5.000. Expected result: Accrues $9.59 of interest on January,
31st.**

---

To test this scenario, you need to follow this steps:

- Run the project
- Go to you preferred API client
- First, create a new user. You can do this by sending a POST request to
  `http://localhost:3000/users` with a body like this:

```
{
  "name": {the name of the user},
  "password": {the password of the user},
  "email":  {the email of the user}
}
```

- You need to register, after the response, the `id` and `account_id` of the
  created user. You will need it soon.
- Then you need to got to `localhost:3000/transactions/investment` and run a
  POST request with a the following body:

```
{
  "amountInDollar": 10000, 
  "transactionDate": "2023-01-01T00:00:00.000Z",
  "account": {account id of the user},
}
```

- Then you need to got to `localhost:3000/transactions/withdraw` and run a
  POST request with a the following body to make a withdraw:

```
{
  "amountInDollar": 5000, 
  "transactionDate": "2023-01-05T00:00:00.000Z",
  "account": {account id of the user},
}
```

- Now, you need to simulate the end of the month. To do this, you need to go to
  `localhost:3000/operatioons/close-month` and run a POST request with a the
  following body:

```
{
  "month": 1, 
  "year": 2023,
  "users": [{user id of the user}]
}
```

- This will simulate the end of the month and will calculate the interest
  accrued for your user. You can run the same reques withou the `users` property
  to simulate the end of the month for all users.
- Finnaly, you can check the interest accrued for your user by running a GET
  request to `localhost:3000/transactions/interests` with a the following URL
  parameters:

```
userid={user id of the user}
month=1
year=2023
```

- On the response, you will see the property `totalInterestEarned` with the
  value of the interest accrued for your user on the month (**$ 9.59**).
- Below you can see the list of `transactions` executed by the user during the
  month.

### Test case 4

#### Scenario

**Investor creates their first investment for $10.000 on January 1st. On January 15, they add $5.000. On January 27, they withdraw $5.000. Expected result: Accrues $20.27 of interest on January, 31st.**

***
To test this scenario, you need to follow this steps:

- Run the project
- Go to you preferred API client
- First, create a new user. You can do this by sending a POST request to
  `http://localhost:3000/users` with a body like this:

```
{
  "name": {the name of the user},
  "password": {the password of the user},
  "email":  {the email of the user}
}
```

- You need to register, after the response, the `id` and `account_id` of the
  created user. You will need it soon.
- Then you need to got to `localhost:3000/transactions/investment` and run a
  POST request with a the following body:

```
{
  "amountInDollar": 10000, 
  "transactionDate": "2023-01-01T00:00:00.000Z",
  "account": {account id of the user},
}
```

- Then you need to got to `localhost:3000/transactions/investment` again and run a
  POST request with a the following body to make a investment:

```
{
  "amountInDollar": 5000, 
  "transactionDate": "2023-01-15T00:00:00.000Z",
  "account": {account id of the user},
}
```

- Then you need to got to `localhost:3000/transactions/withdraw`  and run a
  POST request with a the following body to make a withdraw:

```
{
  "amountInDollar": 5000, 
  "transactionDate": "2023-01-27T00:00:00.000Z",
  "account": {account id of the user},
}
```

- Now, you need to simulate the end of the month. To do this, you need to go to
  `localhost:3000/operatioons/close-month` and run a POST request with a the
  following body:

```
{
  "month": 1, 
  "year": 2023,
  "users": [{user id of the user}]
}
```

- This will simulate the end of the month and will calculate the interest
  accrued for your user. You can run the same reques withou the `users` property
  to simulate the end of the month for all users.
- Finnaly, you can check the interest accrued for your user by running a GET
  request to `localhost:3000/transactions/interests` with a the following URL
  parameters:

```
userid={user id of the user}
month=1
year=2023
```

- On the response, you will see the property `totalInterestEarned` with the
  value of the interest accrued for your user on the month (**$ 20.27**).
- Below you can see the list of `transactions` executed by the user during the
  month.
## Diagrams

You can find the diagrams requested in the challenge
[here](cnote-challenge-docs). There you will find:

- [ER Diagram](cnote-challenge-docs/DNote-ER-Diagram.pdf)
- [Architecture Diagram](cnote-challenge-docs/dnote-investment-platform-C4.pdf)
- Bonus:
  [PostMan Collection with all API routes](cnote-challenge-docs/collection_dnote-api_postman.json)

## Tech Stack

- Deno 1.32.5 - modern, secure and easy to use JS/TS runtime.
  [Check it out](https://deno.land/)
- AlephJS 1.0.0-beta.43 - A NextJS-like framework for Deno.
  [Check it out](https://alephjs.org/)
- Supabase - A Firebase-like backend, but open source. Used here to DBMS and
  auth service. [Check it out](https://supabase.io/)

## General comments

### Calculate Interests function

This function contains a important parte of business logic applied. It takes
user data, interest rate dara, chronological data and transactions data, filters
off only the transactions thar took place on the month defined and applies a
rule to calculates the total interest accrued on the month for each one and,
after that, sums up everything and returns the total interest accrued on the
month. You can check the function
[here](core/use-cases/calculateInterests.usecase.ts).

### Improvements opportunities

- Add automated tests
- Decouple the API from the DBMS
- Define better the use cases layer
- Define better Entities
- Improve type definitions
- Implements a better error handling
- Implements a better logging
- Implements a better validation
- Implements a better authentication
- Implements a better authorization, on route level
- Implements a better documentation
- Implements caching for user and transactions data

## Production Deployment

You can check a production deployment of this project
[here](https://dnote-web-api.deno.dev/)
