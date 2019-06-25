# Mobile Web Specialist Certification Course

---

#### _Three Stage Course Project - Restaurant Reviews_

This project was completed on Septmber 18, 2018. The fallowing is the criteria I had to meet in all 3 stages of the project.

## Project Overview: Stage 1

#### Responsive Design

- UI compatible with a range of display sizes
- Responsive images using gulp

#### Accessibility

- Accessible images
- Focus used appropriately to allow easy navigation of the site
- Site elements defined semantically

#### Offline Availability

- Visited pages are rendered when there is no network access

## Project Overview: Stage 2

#### Application Data and Offline Use

- Application Data Source: The client application should pull restaurant data from the development server, parse the JSON response, and use the information to render the appropriate sections of the application UI.

- Offline Use: The client application works offline. JSON responses are cached using the IndexedDB API. Any data previously accessed while connected is reachable while offline.

#### Responsive Design and Accessibility

- Responsive Design: The application maintains a responsive design on mobile, tablet and desktop viewports.

- Accessibility: The application retains accessibility features from the Stage 1 project. Images have alternate text, the application uses appropriate focus management for navigation, and semantic elements and ARIA attributes are used correctly.

#### Performance

Lighthouse targets for each category exceed:

- Progressive Web App: > 90
- Performance: > 70
- Accessibility: > 90

## Project Overview: Stage 3

#### Functionality

- User Interface: Users are able to mark a restaurant as a favorite, this toggle is visible in the application. A form is added to allow users to add their own reviews for a restaurant. Form submission works properly and adds a new review to the database.

- Offline Use: The client application works offline. JSON responses are cached using the IndexedDB API. Any data previously accessed while connected is reachable while offline. User is able to add a review to a restaurant while offline and the review is sent to the server when connectivity is re-established.

![offline functionality](https://udacity-reviews-uploads.s3.us-west-2.amazonaws.com/_attachments/271623/1537399494/st3offlnereviewsareworking0920.gif "offline functionality")

#### Responsive Design and Accessibility

- Responsive Design: The application maintains a responsive design on mobile, tablet and desktop viewports. All new features are responsive, including the form to add a review and the control for marking a restaurant as a favorite.

- Accessibility: The application retains accessibility features from the previous projects. Images have alternate text, the application uses appropriate focus management for navigation, and semantic elements and ARIA attributes are used correctly. Roles are correctly defined for all elements of the review form.

#### Site Performance

Lighthouse targets for each category exceed:

- Progressive Web App: >v90
- Performance: > 90
- Accessibility: > 90

![lighthouse performance](https://udacity-reviews-uploads.s3.us-west-2.amazonaws.com/_attachments/271623/1537399855/awesomescorest3.png "lighthouse performance")
