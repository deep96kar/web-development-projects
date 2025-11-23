// Import React since we are creating a functional component
// import React from 'react'

// Define a functional component called Navbar
const Navbar = () => {
  return (
    // <nav> is used to create a navigation bar
    // TailwindCSS classes are applied for styling:
    // flex → makes the content align horizontally
    // justify-around → distributes items evenly with space around them
    // bg-indigo-900 → sets a dark indigo background color
    // text-white → makes all text white
    // items-baseline → aligns items along the text baseline
    // h-20 → sets the height of the navbar to 20 units
    // -mt-3 → applies a small negative margin-top (moves the nav up slightly)
    // rounded-[40px] → rounds the corners of the navbar with 40px radius
    <nav className='flex justify-around bg-indigo-900 text-white items-baseline h-20 -mt-3 rounded-[40px]'>

        {/* Left side: logo section */}
        <div className="logo">
            {/* The logo text "iTask"
                font-bold → makes the text bold
                text-xl → sets a large font size
                mx-8 → adds horizontal margin (left & right spacing) */}
            <span className='font-bold text-xl mx-8'>iTask</span>
        </div>

        {/* Right side: navigation menu items */}
        {/* ul = unordered list
            flex → makes items horizontal
            gap-8 → spacing between items
            mx-9 → adds horizontal margin around the list */}
        <ul className="flex gap-8 mx-9">
          
          {/* First menu item: Home
              cursor-pointer → cursor changes to pointer on hover
              hover:font-bold → text becomes bold when hovered
              transition-all → smooth transition effect */}
          <li className='cursor-pointer hover:font-bold transition-all'>Home</li>
          
          {/* Second menu item: Your Tasks
              Same hover and cursor styles as above */}
          <li className='cursor-pointer hover:font-bold transition-all'>Your Tasks</li>
        </ul>
    </nav>
  )
}

// Export the Navbar component so it can be used in other files (like App.js)
export default Navbar
