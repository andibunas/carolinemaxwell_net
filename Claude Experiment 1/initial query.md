


I want to create a bespoke artist portfolio website. First, for all of this generate a plan before any implementation is approved and done.
Add notes to a claude.md file for this project.

The website should be responsive to web, mobile, and tablet viewports. Use tailwind css for the layout.
Look at some examples in https://www.trangtle.com/ and https://www.lisaknoop.com/  They have interesting home pages and gallery views.

Main top navigation should have the artist name "Caroline Maxwell" on the left.  In the future this may be a custom logo.  On the righ justified side there should be a responsive menu that uses a hamburger menu model for smaller viewports. The menu should have the following:

  - home
  - artworks
  - writings
  - about.  This has a sub menu in the page  (CV, Bio, and contact)

Use simple React Router for the navigation and have it do a page navigate load for each so SEO can easily traverse it.   For sub pages, use mapped ID Routes that will reference the category and specific artwork name.  That will dynamically load the component so page is not refreshed to be faster.   Bookmarking the link will load everything as if it was the dynamic navigation.

The Artworks and Writtings will all come from a JSON manifest file that lists out everything by major group [artworks, writtings], then inside of that an array of categories.  
This is the Artwork schema
- Each category is an object with name , layout_type, write_up, a list of artworks and/or child_categories that are treated the same as a category.
- Each artwork has the following info: title, medium, size, and list of images that apply. 
- One of the images should be designed as the primary image.
- One of the artwork should be marked as the primary artwork for the category
This is the writtings schema
- The objects can be multiple types:  category, writting, artwork
- the category has a name, write up and list of child objects that can be a category or writting
- the writting has a name, write up, writting
- the artwork is similar to the other artwork data style

Home page holds a smal bio paragraph with a link to the bio page.  Below that should be a latest work section that will show the names, image and date of the most recent artwork categories.  There will be only 2 shown. The manifest JSON will have that info

Artworks list out each category name and primary image.  Each of those are clickable links to load the individual category info (name, write up, and artworks).  The layout will determine which styling to use.   The layout is pulled from the json and it goes directly to the desired layout mapped component.

Each category layout takes a category id to load the info as that layout is organized.  That loads the whole array of arworks.  Some layouts are designed to show the name, writeup and a list of child categories.   design different components for each of these types.
The categories should show a breadcrumb as part of the name.  As an example, when a "January Jones" category is shown, the title section should have "Artworks: January Jones", where Artworks is a link back to the main artworks section and the name is not a link but a nicely formated H2 level string.

Writtings behaves similarly to the Artworks section but there are not always images but large text to display.   

About has a simple sub menu for CV, Bio, and contact.
- each is a link to that info.  
- the pages use same breadcrumb style heading like Artworks
- CV and BIO loads content from specific file. That may just be directly embedded content.
- Contact will be a form that is TBD since an embedded Google form may be used for that to fill out.   At the tope it will also show a clickable email address for direct conact via email.
