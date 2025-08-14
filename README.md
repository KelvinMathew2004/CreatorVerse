# WEB103 Prework - *CreatorVerse*

Submitted by: **Kelvin Mathew**

About this web app: **CreatorVerse is a React web app that showcases curated content creators across platforms. Users can browse profiles, view details, and manage creators through an intuitive, PicoCSS-styled interface with pseudo-authentication, a custom color picker, search, and smooth navigation.**

Time spent: **12** hours

## Required Features

The following **required** functionality is completed:

- [x] **A logical component structure in React is used to create the frontend of the app**
- [x] **At least five content creators are displayed on the homepage of the app**
- [x] **Each content creator item includes their name, a link to their channel/page, and a short description of their content**
- [x] **API calls use the async/await design pattern via Axios or fetch()**
- [x] **Clicking on a content creator item takes the user to their details page, which includes their name, url, and description**
- [x] **Each content creator has their own unique URL**
- [x] **The user can edit a content creator to change their name, url, or description**
- [x] **The user can delete a content creator**
- [x] **The user can add a new content creator by entering a name, url, or description and then it is displayed on the homepage**

The following **optional** features are implemented:

- [x] Picocss is used to style HTML elements
- [x] The content creator items are displayed in a creative format, like cards instead of a list
- [x] An image of each content creator is shown on their content creator card

The following **additional** features are implemented:

* [x] Used mapping to break the names into lines for the creators' faces to be highlighted
* [x] Added browser favicon and site name
* [x] Added a color picker bar that matches the hero image and adjusts the site's Pico CSS styling accordingly
* [x] Implemented scrollIntoView for easier navigation
* [x] Added pseudo-authentication for the ability to edit and delete creators
* [x] Added basic search functionality to filter through creators using their names

## Video Walkthrough

Here's a walkthrough of implemented required features:

👉🏿<img src='./Walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with [Kap](https://getkap.co/) for macOS

## Notes

The Edit and Delete buttons were scattered across pages so passing the right data as props for the authentication modal was bit confusing.

## License

Copyright [2025] [Kelvin Mathew]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.