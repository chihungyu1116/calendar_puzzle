Calendar_puzzle
========================

Calendar Puzzle


Included below are the details for the challenge, along with one attachment.  Please complete and send back at your earliest convenience, noting the length of time it took to complete.  Note that on average, it takes 8 -10 hrs to successfully complete this puzzle, so please do not rush to turn this in.  Your solution will be run through a suite of test cases and evaluated on correctness, elegance, and readability.  You can start and stop the puzzle at anytime.  There is not an official time limit for turning in the puzzle since we realize and respect the fact that engineers are currently working and have busy lives.  But we hope to receive the puzzle back within 7-14 days if possible.  If you need more time, just let me know.  Please put a lot into it and test your work and show us your best work. Please do not post your solution in a public accessible location on the internet.
  
Puzzle
 
Given a set of events, render the events on a single day calendar (similar to Outlook, Calendar.app, and Google Calendar). There are several properties of the layout:
 
1) No events may visually overlap.
2) If two events collide in time, they must have the same width.
3) An event should utilize the maximum width available, but constraint 2) takes precedence over this constraint.
 
Each event is represented by a JS object with a start and end attribute. The value of these attributes is the number of minutes since 9am. So {start:30, end:90) represents an event from 9:30am to 10:30am. The events should be rendered in a container that is 620px wide (600px + 10px padding on the left/right) and 720px (the day will end at 9pm). The styling of the events should match the attached screenshot.
 
You may structure your code however you like, but you must implement the following function in the global namespace. The function takes in an array of events and will lay out the events according to the above description.
 
function layOutDay(events) {
}
 
This function will be invoked from the browser’s JavaScript console for testing purposes. If it cannot be invoked, the submission will be rejected. In your submission, please implement the calendar with the following input and style the calendar accordingly.
 
[ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ]
 
A screenshot of the expected output is attached.
 
FAQ
 
1) Are frameworks such as JQuery, MooTools, etc. allowed?  Yes, but please include the file with your source code.
 
2) Is there a maximum bound on the number of events?  You can assume a maximum of 100 events for rendering reasons, but your solution should be generalized.
 
3) What browsers need to be supported? Your solution should work on all modern standards-compliant browsers.
 
4) Does my solution need to match the image pixel for pixel? No, we will not be testing for pixel matching.
 
