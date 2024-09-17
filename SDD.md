# 1.	Introduction and Overview
The Book Selector app is a mobile application designed to enhance book discovery through a swipe-based interface similar to dating apps like Tinder and Hinge. The app helps users efficiently find new books based on their interests while also providing a platform for authors and publishers to reach readers.
Users can swipe left to skip a book or swipe right to add it to their To-Be-Read (TBR) list. If they are unsure about a book, they can scroll down for more details, like key tropes, genre, and quotes.
This document outlines the app’s architecture and detailed design specifications, modifying the requirements from the SRS into a technical guide for developers. The intended audience includes the project manager, the design team, the development team, and the testing team. The overall design includes a frontend user interface, a backend server for managing data, and connections to third-party APIs for book info. The detailed design specifications are below.
# 2.	Design Considerations
For the Book Selector app to be finalized, there are key issues that need to be addressed, which include making sure there is compatibility across mobile devices and operating systems(OS), make sure the external book data APIs are manageable for us to implement, and for us to optimize performance for a medium to large datasets. 
## 2.1.	Assumptions and Dependencies
While developing the Book Selector app, it is assumed that the users will access the app through mobile devices running Apple iOS and Android platforms. The app will be optimized for these operating systems, and it is expected that users will be familiar with the swipe-based interface. 
It is assumed the external API that will be used will be reliable in retrieving book data and having a consistency of information presented to the users. This will mean our algorithm will provide the best way to sort our users to their preferences with our external API integrated in the app.
## 2.2.	General Constraints
●	API Limitations:
o	Google Books API has a daily cell cap, which restricts the number of book matches users can receive daily.
o	A cap on the number of swipes will be based on the available API quota. 
●	Mobile Device Limitations: 
o	Efficient coding practices required due to limited processing power and memory capacity
o	Having smooth performance and quick load times are important.
●	Security Considerations: 
o	User data will require us to be compliant with data protection regulations.
o	Secure authentication methods will be established to secure sensitive data as necessary. 
●	Network Communication: 
o	Dependent on external data sources for book information may limit the communication due to the API restrictions.
o	The app will need to remain responsive and able to work when there are large amounts of book data in the system.
●	User Experience(UX) design: 
o	The app must provide a user-friendly interface to make sure that there is a positive experience while using the app. 
o	The app should be designed to accommodate different screen sizes on phones to make the appearance not awkward. 
●	Verification and validation requirements:
o	The app will undergo testing to ensure it runs smoothly and meets performance and quality standards
o	A group of testers will use the app on various platforms and devices to ensure it works correctly for a wide range of users under different conditions.
●	Data management:
o	Data must be managed to ensure the app can handle large datasets without slowing the app down. 
## 2.3.	Development Methods
We will be using a hybrid approach that combines primarily waterfall and some agile methodology. Our methodology is influenced by the nature of the class which promotes the waterfall method through assignments (linear progression that matches the class progression). This gives our project more structure and forces us to work sequentially which is ideal for ensuring diligent planning and completion. However, the waterfall method does not allow for additional features to be added during a single iteration in the development process. This project may iteratively add more features or fix bugs as needed towards the end of the project which is representative of agile development.
# 3.	Architectural Strategies
We are using React Native to develop our application. This impacts our architectural strategies as we are only required to write the program once in JavaScript instead of having to write multiple programs in iOS or Android’s native language. The downside is that our application may not perform as efficiently, but performance is not a quality that needs to be optimized at this stage. 
Our program will utilize object-oriented programming styles. The data and functions regarding the data are closely related, and OOP will help manage the data. For instance, a book object would be optimal for storing data such as ID, title, author, synopsis, genre, and tropes. Since we are focused on data management, we are disinclined to use procedural and functional programming styles. 
# 4.	System Architecture
 
Diagram 1. Application Architecture
	
The user interface (UI) is designed to handle user input and manage information exchanges with the Book Selection, Local Data, and Database components. The Local Data component manages details about the TBR (To Be Read) and DNF (Did Not Finish) lists, which should be directly accessible to the user. The Book Selection component requires access to Local Data to generate recommendations and connect to an external API. This API, such as Google Books, will provide the actual book information. Lastly, user login details and profile settings will be stored in the Database component.
# 5.	Detailed System Design	
## 5.1.	Classification
Our project is a mobile application that provides data discovery services. It is composed of higher-level classes (e.g. UI) and lower-level functions. Since we do not know all of the details for each system and how they will interact with each other, we grouped all of the systems for this section and gave general details. After our early, initial prototype phase, we will be able to update this section and provide the granular details, a classification, definition, constraints, resources, and interface/exports, for each system.
## 5.2.	Definition
Despite being classified as a data discovery service, our app is not intended to provide experiences such as business-driven performance enhancement. Instead, it engages with users similar to social networking services such as Hinge. The application does provide insight in the form of book recommendations. For example, the app may recommend books by genre or author because the user interacts with similar genres or authors. 
## 5.3.	Internal Structure
 
Diagram 2. Information Flow

The internal structure is illustrated by Diagram 2. Each class is an individual component that has its own functions. This structure is listed below:
-   User Interface Class
-	Login Page
-	User Page
-	Discovery Page
-	Library Page
-	Archive Page
-   Book Selecting Algorithm Class
-   Local Data Manager Class
-   Database Class
-   External API Class
## 5.4.	Constraints
The software may be limited by the user’s bandwidth. Since book information is downloaded from the external API, the app may slow down while downloading data. Additionally, there may be a limit to the number of queries the external API will accept. This means that if the user reaches this limit, the app may cease functionality until the API limit resets.
The backend and database handle login requests, account management, and other user data. This could pose a limitation if too many requests are sent within a given time. 
## 5.5.	Resources
This application requires local memory, processing power, and a strong internet connection. There are no race/deadlock conditions since all data is tied to an individual user and individual user actions are sequential. Another resource will be the external API which is responsible for returning book information. Lastly, the mobile app will utilize a backend server/database for user login, account management (reset password/change email), and other user data.
## 5.6.	Interface/Exports
## 5.7.	User Interface Class 
Login Page
●	function displayLogin().  
●	function displayCreateAccount().
●	function displayResetPassword().
User Page
●	function displayUserProfile().
●	function displayUserPreferences().
●	function displayNotificationPreference().
Discovery Page
●	function displayCurrentBook(). This function pops a book from the global object “queue” and displays the book.
●	function displayBookInfo(object currentBook). This function displays the extra information stored in the object currentBook.
Library Page
●	function displayTBRList().
●	function displayBook(var bookID).
Archive Page
●	function displayDNFList().
●	function displayBook(var bookID).

## 5.8.	Book Selection Class
●	function generateBookRating(object book).
●	function sortRecommendations(object queue).

## 5.9.	Local Data Manager Class
●	function addBook(var listID, object book).
●	function removeBook(var listID, var bookID).
●	function getTBRList(). Returns TBR list.
●	function getDNFList(). Returns DNF list.
●	function storePreferences(var preferences).

## 5.10.	External Database Class
●	function login(var username, var password).
●	function createAccount(var username, var password, var email).
●	function resetPassword(var email).
●	function changeName(var username, var email).
●	function changeEmail(var username, var email).
●	function changeNotification(object settings).

## 5.11.	External API Class
●	function getBooks().
## 5.7. Design Mockups
  
 
# 6.	Software Deployment
Our application will be developed using the React Native framework which generates native code for Android, iOS, and web-based platforms. We will use the Google Books API to extract book data for our recommendation algorithm. 
# 7.	Glossary
1.	TBR: “To be read;” the list of books a user wants to read
2.	DNF: “Did not finish;” label for when a user does not finish a book
3.	UX: User Experience 
4.	OS: Operating Systems
5.	UI: User Interface
# 8.	Bibliography
McGuire, M. (2024, March 24). Top 4 software development methodologies. Synopsys. Retrieved August 30, 2024, from https://www.synopsys.com/blogs/software-security/top-4-software-development-methodologies.html
# 9.	Appendix 
Proof of completion - Thomas Roberts:
 
Proof of completion - Tristan Sanford:
 
 

Proof of completion - Francesca Del Aguila: 
 
 
