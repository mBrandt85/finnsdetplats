# Boka Plats

The app formerly known as "_Finns det plats?_"

## Project start

Run `pnpm install` followed by `pnpm dev` after a successful installation.

## Database

This project uses Firebase and Firestore to store data. If the project has not been moved to Cygni when used, the owner Magnus Brandt hosts the database. He can add permissions to the project (via private mail) and can be reached on Slack.

The database console is located [here](https://console.firebase.google.com/u/1/project/finnsdetplats/overview).

Users are logged in with a separate user auth object, which means information like default location is stored in a separate collection with the user id connecting the data.

Since the free Spark plan is used for the project, keep an eye on the amount of reads generated when testing the code. The limits for the free plan is:

Document reads: 50k per day
Document writes: 20k per day
Document deletes: 20k per day

## Project overview

The primary use for the app is for Cygni employees ('users') to be able to book seats amd/or parking spaces for the day at the local offices. Users can book seats and parking spots in the morning and/or afternoon by clicking the assigned button, and remove their bookings by clicking the button again.

To see which other users has booked seats/parkings on a specific day, the text displaying the weekday and date is clicked to show a modal with all other users and their bookings.

A user logging in without a default location set will be prompted by a modal to set it. This is the primary office the user is assigned to, and will be the city the user starts at when opening the app. Via a dropdown on the main page, the user can change city to book spots in a differenct office. The user can change their default location by pressing their user badge on the main page and make a new selection in the modal opened.

In this user badge modal, the user can also see if they have any future bookings in an office different from their default one. Since the main use of the page is to book spots in the users default office, future bookings in other offices could easily be forgotten about.
