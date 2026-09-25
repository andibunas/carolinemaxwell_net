<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [I want to send answers to google forms via an api call instead of the browser form](#i-want-to-send-answers-to-google-forms-via-an-api-call-instead-of-the-browser-form)
  - [🔍 How It Works: Finding the API URL and Field Names](#-how-it-works-finding-the-api-url-and-field-names)
  - [💻 Constructing the API Request](#-constructing-the-api-request)
  - [Code Example (cURL)](#code-example-curl)
  - [Code Example (Node.js Fetch)](#code-example-nodejs-fetch)
  - [⚠️ Important Rules & Limitations](#-important-rules--limitations)
- [FTP](#ftp)
  - [Method 1: Using curl (Pre-installed on your Mac)](#method-1-using-curl-pre-installed-on-your-mac)
  - [Method 2: Using lftp (Most Powerful & Easiest)](#method-2-using-lftp-most-powerful--easiest)
  - [other](#other)
  - [The Best No-Homebrew Solution: Native curl Loop](#the-best-no-homebrew-solution-native-curl-loop)
  - [How to fill out this command:](#how-to-fill-out-this-command)
  - [Why this works natively:](#why-this-works-natively)
- [GitHub Actions deploy](#github-actions-deploy)
  - [Step-by-Step Setup## 1. Add your FTP credentials to GitHub Secrets](#step-by-step-setup-1-add-your-ftp-credentials-to-github-secrets)
  - [2. Create your Workflow File](#2-create-your-workflow-file)
  - [Key Customizations for the Action:](#key-customizations-for-the-action)
  - [How it runs:](#how-it-runs)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



# I want to send answers to google forms via an api call instead of the browser form

Yes, you can absolutely submit answers to a Google Form programmatically via an API call without ever opening a web browser.
You can achieve this by sending a standard HTTP POST request to Google's public form-response endpoint. Google Forms natively accepts these submissions just like a regular web page would.

------------------------------
## 🔍 How It Works: Finding the API URL and Field Names
To send data via an API, you must find the Form ID and the Entry ID for each specific question.

   1. Get the Form ID: Open your Google Form in a browser. Look at the URL bar. It will look like this: https://google.com[FORM_ID]/viewform. Copy that long string of characters.
   2. Find the Entry IDs:
   * Open the live view of your form (the page people use to fill it out).
      * Right-click on the first question text box and select Inspect (or press F12 to open developer tools).
      * Look at the HTML code for an attribute named name="entry.123456789". The number after entry. is the unique ID for that specific question. Repeat this for all questions.
   
------------------------------

## 💻 Constructing the API Request
Once you have gathered those details, your API endpoint URL becomes:
https://google.com[FORM_ID]/formResponse
You must send your data as a POST request using application/x-www-form-urlencoded content type.
## Code Example (cURL)

```
curl -X POST "https://google.com" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "entry.123456789=John Doe" \
     -d "entry.987654321=john.doe@example.com"
```
## Code Example (Node.js Fetch)

```
const formId = "1FAIpQLSfD_YOUR_FORM_ID_HERE";
const url = `https://google.com{formId}/formResponse`;

const formData = new URLSearchParams();
formData.append('entry.123456789', 'John Doe');
formData.append('entry.987654321', 'john.doe@example.com');

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: formData
})
.then(response => console.log('Submitted successfully!'))
.catch(error => console.error('Error submitting form:', error));

```

------------------------------
## ⚠️ Important Rules & Limitations
Before relying on this approach, keep these technical details in mind:

* Authentication: This endpoint does not use an API key. It works completely anonymously. Because of this, it cannot bypass Google's anti-bot protections. If you send dozens of submissions in a few seconds from the same IP, Google will temporarily block the requests or demand a CAPTCHA.
* Form Settings: Your Google Form must be set to public. If you have toggled on "Restrict to users in [Your Organization]" or "Limit to 1 response", this API submission method will fail unless your script handles Google OAuth authentication first.
* Response Status: A successful API submission will return an HTTP status code 200 OK along with the HTML of Google's confirmation page. It will not return a clean JSON response.
--- 


# FTP 

Since you cannot use SSH or scp, you can use lftp or the built-in Unix curl command, both of which support uploading entire folders over standard FTP without needing SSH.
## Method 1: Using curl (Pre-installed on your Mac)
The built-in curl command doesn't have a simple "recursive" flag, but you can feed it a list of files using a short loop in your Terminal.
Open Terminal, navigate to the parent folder of the directory you want to upload, and run this command:

```
find myfolder -type f -exec curl --user username:password --ftp-create-dirs -T {} ftp://://example.com{} \;

```
* Change myfolder to your local folder name.
* Replace username:password and ftp://://example.com with your actual credentials and remote destination path.
* --ftp-create-dirs forces the FTP server to recreate your local folder structure automatically as it uploads.

------------------------------
## Method 2: Using lftp (Most Powerful & Easiest)
The absolute best tool for syncing whole folders over pure FTP is lftp using its mirror command. It is not pre-installed on macOS, but you can install it in seconds if you use Homebrew.

   1. Install lftp (if you have Homebrew):
   
    brew install lftp
    
   2. Upload the folder using the reverse mirror (-R) command:
   
    lftp -u username,password -e "mirror -R /path/to/local/folder /path/to/remote/destination; quit" ftp://example.com
   
   * mirror -R takes your entire local folder structure and mirrors (uploads) it directly to the FTP server.

------------------------------

## other

Got it, we will stick entirely to the built-in macOS tools.
Since you don't have Homebrew, the best and most reliable native option is using curl in a loop, as it handles nested subfolders perfectly without requiring any third-party software.
## The Best No-Homebrew Solution: Native curl Loop
Open your Mac Terminal, use cd to navigate to the parent directory where your folder sits, and run this single command:

``` 
find myfolder -type f -exec curl -v --user "username:password" --ftp-create-dirs -T {} "ftp://://example.com{}" \; 

find . -type f -exec curl -v --user "bunasoft_ftp:password" --ftp-create-dirs -T {} "ftp://://bunasoft.com{}" \;

```

## How to fill out this command:

* Replace myfolder with the actual name of your local folder.
* Replace username:password with your FTP login credentials.
* Replace ftp://://example.com with your actual server address and target path.

## Why this works natively:

   1. find myfolder -type f tracks down every single individual file inside your folder, no matter how deep the subfolders go.
   2. --ftp-create-dirs tells curl to automatically build matching subdirectories on your remote server as it finds them, resolving FTP's usual lack of folder support.

If you run into any connection timeouts or permission errors while running it, let me know. I can show you how to add a verbose flag to troubleshoot the connection.

# GitHub Actions deploy

To upload a folder to an FTP server inside a GitHub Action, you do not need to install Homebrew or write complex curl loops. Instead, you can use a pre-built, community-verified GitHub Action Marketplace workflow step.
The most popular and reliable option for this is the FTP-Deploy Action by SamKirkland. It automatically tracks changes and only uploads new or modified files.

------------------------------
## Step-by-Step Setup## 1. Add your FTP credentials to GitHub Secrets
Never paste your raw password directly into your GitHub code.

   1. Go to your repository on GitHub.com.
   2. Click Settings > Secrets and variables > Actions.
   3. Click New repository secret and add the following two secrets:
   * FTP_USERNAME (Your FTP login username)
      * FTP_PASSWORD (Your FTP login password)
   
## 2. Create your Workflow File
In your repository, create a folder structure named .github/workflows/ and create a file inside it named deploy.yml.
Paste the following YAML configuration into that file:

name: FTP Deploy
on:
  push:
    branches:
      - main  # Triggers the upload every time you push code to the main branch
jobs:
  web-deploy:
    name: 🎉 Deploy Folder via FTP
    runs-on: ubuntu-latest
    
    steps:
    - name: 🚚 Get latest code
      uses: actions/checkout@v4

    - name: 📂 Sync files to FTP Server
      uses: SamKirkland/FTP-Deploy-Action@v4.3.5
      with:
        server: ://example.com          # Replace with your FTP server address
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./my-folder/          # The local folder in your repo you want to upload (use ./ for root)
        server-dir: /remote/path/        # The destination folder path on your FTP server

## Key Customizations for the Action:

* local-dir: By default, it uploads your entire repository. If you only want to upload a specific folder, change ./ to ./your-folder-name/ (make sure to include the trailing slash).
* server-dir: Make sure this matches the absolute path on your web hosting or storage server where the files should land.

## How it runs:
The next time you push a change to your main branch, GitHub will automatically spin up a virtual machine, grab your folder, pull your hidden passwords from Secrets, and securely transfer the contents to your FTP server.
If your server requires SFTP (SSH FTP) or FTPS (implicit SSL) instead of basic FTP, or if your build requires a compilation step (like React or Next.js) before uploading, let me know! I can adjust the code to handle those environments.

